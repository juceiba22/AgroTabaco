"use client";

type Props = {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
};

export function ClasesMultiselect({ options, selected, onChange }: Props) {
  function toggle(clase: string) {
    onChange(selected.includes(clase) ? selected.filter((c) => c !== clase) : [...selected, clase]);
  }

  return (
    <details className="group relative">
      <summary className="flex h-9 cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 text-sm">
        <span className="text-muted-foreground">
          {selected.length === 0 ? "Todas las Clases" : `${selected.length} clase(s) seleccionada(s)`}
        </span>
      </summary>
      <div className="absolute z-10 mt-1 max-h-56 w-full min-w-48 overflow-auto rounded-md border border-border bg-card p-2 shadow-lg">
        {options.map((clase) => (
          <label key={clase} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-muted">
            <input
              type="checkbox"
              checked={selected.includes(clase)}
              onChange={() => toggle(clase)}
              className="size-3.5"
            />
            {clase}
          </label>
        ))}
      </div>
    </details>
  );
}
