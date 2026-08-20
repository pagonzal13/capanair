"use client";

import { useRef } from "react";

// Envoltorio de <form> para los formularios de "añadir nuevo" del admin:
// tras un submit correcto, vacía los campos (vuelve a sus defaultValue)
// para que quede claro que se ha creado y no se puedan enviar duplicados
// sin querer. No usar para formularios de edición de un elemento existente.
export function ResettableForm({
  action,
  children,
  className,
}: {
  action: (formData: FormData) => Promise<void>;
  children: React.ReactNode;
  className?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      className={className}
      action={async (formData) => {
        await action(formData);
        formRef.current?.reset();
      }}
    >
      {children}
    </form>
  );
}
