import { createHash, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getPostsByCategory } from "@/lib/data";
import { getMarketplaceStats } from "@/lib/marketplace/data";
import { buildMarketContextSummary } from "@/lib/marketplace/market-context";
import { createClient } from "@/lib/supabase/server";

type ChatTurn = { role: "user" | "assistant"; text: string };

function hashIp(ip: string): string {
  const salt = process.env.GEMINI_API_KEY ?? "agrotabaco";
  return createHash("sha256").update(`${ip}:${salt}`).digest("hex");
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

const SYSTEM_INSTRUCTION_HEADER = `
Sos el asistente de referencia de precios del "Mercado Argentino de Tabaco",
la sección de compra/venta de AgroTabaco.

Tu único rol es informar: respondé preguntas sobre precios de referencia,
clases comerciales de tabaco verde, posiciones arancelarias de tabaco
procesado (Virginia/Burley), y el estado actual de las ofertas publicadas,
usando ÚNICAMENTE el contexto provisto abajo.

Reglas estrictas:
- NO podés crear, editar, pausar ni cerrar ninguna oferta — ni aunque el
  usuario te lo pida explícitamente. Si te lo piden, explicá que podés
  ayudarlos a completar el formulario en /mercado/publicar pero que la
  acción la tienen que hacer ellos ahí.
- NO inventes cifras que no estén en el contexto. Si no tenés el dato,
  decilo con honestidad y sugerí ver la sección Estadísticas o Mercado
  Internacional del sitio.
- Los valores de comercio exterior de EE.UU. son VALOR FOB en USD, no
  volumen ni precio en $/kg — nunca los presentes como "precio".
- Respondé en español, tono profesional y directo, respuestas breves.
`.trim();

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Falta configurar GEMINI_API_KEY en el servidor." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de la petición inválido" }, { status: 400 });
  }

  const { sessionId, message, history } = body as {
    sessionId?: string;
    message?: string;
    history?: ChatTurn[];
  };

  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ipHash = hashIp(getClientIp(request));
  const effectiveSessionId =
    sessionId && /^[0-9a-f-]{36}$/i.test(sessionId) ? sessionId : randomUUID();

  const { data: withinLimit, error: limitError } = await supabase.rpc("check_chat_rate_limit", {
    p_ip_hash: ipHash,
    p_daily_limit: 40,
  });

  if (limitError) {
    return NextResponse.json({ error: "No se pudo validar el límite de uso." }, { status: 500 });
  }
  if (!withinLimit) {
    return NextResponse.json(
      { error: "Alcanzaste el límite diario de consultas al asistente. Probá de nuevo mañana." },
      { status: 429 }
    );
  }

  const [stats, recentPosts] = await Promise.all([
    getMarketplaceStats(),
    getPostsByCategory("tabaco").then((posts) => posts.slice(0, 5)),
  ]);

  const statsSummary = `
Ofertas activas ahora mismo en el Mercado Argentino de Tabaco: ${stats.activeCount} en total
(${stats.byProductType.verde} de tabaco verde, ${stats.byProductType.procesado} de tabaco procesado).
Por variedad: ${Object.entries(stats.byVariety)
    .map(([variety, count]) => `${variety}: ${count}`)
    .join(", ") || "sin datos"}.
`.trim();

  const newsSummary =
    recentPosts.length > 0
      ? `Últimas noticias publicadas en la sección Tabaco de AgroTabaco:\n${recentPosts
          .map((post) => `- "${post.title}" (${post.publishedAt.slice(0, 10)})`)
          .join("\n")}`
      : "No hay noticias recientes publicadas en la sección Tabaco.";

  const systemInstruction = `${SYSTEM_INSTRUCTION_HEADER}\n\n${buildMarketContextSummary()}\n\n${statsSummary}\n\n${newsSummary}`;

  const priorTurns = Array.isArray(history) ? history.slice(-10) : [];
  const contents = [
    ...priorTurns.map((turn) => ({
      role: turn.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: turn.text }],
    })),
    { role: "user" as const, parts: [{ text: message }] },
  ];

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: { systemInstruction },
    });

    const replyText = response.text ?? "No pude generar una respuesta. Probá reformular la pregunta.";

    await Promise.all([
      supabase.rpc("log_chat_message", {
        p_session_id: effectiveSessionId,
        p_ip_hash: ipHash,
        p_role: "user",
        p_content: message,
      }),
      supabase.rpc("log_chat_message", {
        p_session_id: effectiveSessionId,
        p_ip_hash: ipHash,
        p_role: "assistant",
        p_content: replyText,
      }),
    ]);

    return NextResponse.json({ sessionId: effectiveSessionId, reply: replyText, authenticated: !!user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
