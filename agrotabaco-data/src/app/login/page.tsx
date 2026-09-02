import { Landmark } from "lucide-react";
import { Suspense } from "react";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 rounded-2xl border border-border bg-card p-10 text-center">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-brand-green-dark text-white">
        <Landmark className="size-6" />
      </span>
      <div>
        <h1 className="font-serif text-xl font-bold text-brand-green-dark">Iniciar sesión</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Entrá con tu cuenta de Google para acceder a AgroTabaco Data.
        </p>
      </div>
      <Suspense fallback={null}>
        <GoogleSignInButton />
      </Suspense>
    </div>
  );
}
