export type FieldValidator<T, K extends keyof T = keyof T> = (
  value: T[K],
  values: T,
) => string | undefined;

export type ValidationRules<T> = {
  [K in keyof T]?: FieldValidator<T, K>;
};

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export function validateForm<T extends object>(
  values: T,
  rules: ValidationRules<T>,
): FormErrors<T> {
  const errors: FormErrors<T> = {};

  for (const key of Object.keys(rules) as Array<keyof T>) {
    const validator = rules[key] as FieldValidator<T> | undefined;
    const message = validator?.(values[key], values);

    if (message) errors[key] = message;
  }

  return errors;
}

export const required = (message: string) => (value: unknown) =>
  value === undefined || value === null ||
  (typeof value === "string" && value.trim() === "") || value === false
    ? message
    : undefined;

export const email = (message: string) => (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? undefined : message;

export const minLength = (length: number, message: string) => (value: string) =>
  value.length >= length ? undefined : message;

export const matchesField = <T extends Record<string, unknown>, K extends keyof T>(
  field: K,
  message: string,
) => (value: unknown, values: T) => value === values[field] ? undefined : message;
