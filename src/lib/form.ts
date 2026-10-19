import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import type { ZodType } from 'zod'

// ============================================================================
// Puente Zod ↔ react-hook-form.
// WHY: en lugar de añadir @hookform/resolvers, validamos con safeParse y
// publicamos los errores en RHF. Una dependencia menos y el mismo resultado,
// reutilizando los esquemas compartidos de lib/schemas.ts.
// ============================================================================

export function applyZodErrors<T extends FieldValues>(
  schema: ZodType,
  values: T,
  setError: UseFormSetError<T>,
): boolean {
  const result = schema.safeParse(values)

  if (result.success) return true

  for (const issue of result.error.issues) {
    const path = issue.path.join('.') as Path<T>
    if (path) {
      setError(path, { type: 'validate', message: issue.message })
    }
  }

  return false
}
