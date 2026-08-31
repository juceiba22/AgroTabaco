"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sprout } from "lucide-react";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Email o contraseña incorrectos.");
      return;
    }

    const redirectTo = searchParams.get("redirectTo") ?? "/admin";
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-gray px-4">
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-serif text-xl font-bold text-brand-green-dark">
          <span className="flex size-9 items-center justify-center rounded-full bg-brand-green-dark text-white">
            <Sprout className="size-5" />
          </span>
          Agro<span className="text-brand-olive">Tabaco</span>
        </Link>

        <h1 className="text-center text-lg font-semibold text-foreground">
          Ingreso a la redacción
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Accedé con tu email y contraseña para gestionar las noticias.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nombre@agrotabaco.com.ar"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="mt-2 bg-brand-green-dark text-white hover:bg-brand-green-darker"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
