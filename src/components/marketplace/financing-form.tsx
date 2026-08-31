"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

export function FinancingForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [interestAmount, setInterestAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      toast.error("Nombre y email son obligatorios.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("financing_interests").insert({
      user_id: user?.id ?? null,
      full_name: fullName.trim(),
      email: email.trim(),
      company_name: companyName || null,
      phone: phone || null,
      interest_amount: interestAmount ? Number(interestAmount) : null,
      message: message || null,
    });

    setLoading(false);

    if (error) {
      toast.error("No se pudo enviar tu consulta. Probá de nuevo.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <p className="text-sm font-medium text-foreground">
        ¡Gracias! Guardamos tu interés y te vamos a contactar cuando abramos la ronda.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="fullName">Nombre y apellido</Label>
          <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="companyName">Empresa / cooperativa (opcional)</Label>
          <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Teléfono (opcional)</Label>
          <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="interestAmount">Monto de interés en USD (opcional)</Label>
        <Input
          id="interestAmount"
          type="number"
          min="0"
          value={interestAmount}
          onChange={(e) => setInterestAmount(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Contanos más (opcional)</Label>
        <Textarea id="message" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-fit bg-brand-green-dark text-white hover:bg-brand-green-darker"
      >
        {loading ? "Enviando..." : "Quiero que me avisen"}
      </Button>
    </form>
  );
}
