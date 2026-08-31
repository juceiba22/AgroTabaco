"use client";

import { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ChatMessage = { role: "user" | "assistant"; text: string };

export function MarketChatWidget() {
  const [open, setOpen] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hola, soy el asistente de referencia de precios del Mercado Argentino de Tabaco. Puedo responder sobre precios de acopio, FET, clases comerciales y mercado internacional. No puedo crear ni gestionar ofertas por vos.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend(event: React.FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user" as const, text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/mercado/asistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: text,
          history: nextMessages.slice(0, -1),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessages([...nextMessages, { role: "assistant", text: data.error || "Ocurrió un error." }]);
        return;
      }

      setMessages([...nextMessages, { role: "assistant", text: data.reply }]);
    } catch {
      setMessages([
        ...nextMessages,
        { role: "assistant", text: "No se pudo conectar con el asistente. Probá de nuevo." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 flex h-96 w-80 flex-col overflow-hidden rounded-xl border bg-card shadow-xl sm:w-96">
          <div className="flex items-center justify-between bg-brand-green-dark px-4 py-3 text-white">
            <span className="text-sm font-semibold">Asistente de precios</span>
            <button onClick={() => setOpen(false)} aria-label="Cerrar chat">
              <X className="size-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                  msg.role === "user"
                    ? "ml-auto bg-brand-green-dark text-white"
                    : "bg-muted text-foreground"
                )}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="max-w-[85%] rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                Pensando...
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="flex gap-2 border-t p-3">
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Preguntá por precios, clases, HS..."
              disabled={loading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={loading}
              className="shrink-0 bg-brand-green-dark text-white hover:bg-brand-green-darker"
              aria-label="Enviar"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      )}

      <Button
        type="button"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        className="size-12 rounded-full bg-brand-green-dark text-white shadow-lg hover:bg-brand-green-darker"
        aria-label="Abrir asistente"
      >
        <MessageCircle className="size-5" />
      </Button>
    </div>
  );
}
