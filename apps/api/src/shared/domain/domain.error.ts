export type DomainErrorKind =
  "VALIDATION" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT";

export class DomainError extends Error {
  constructor(
    message: string,
    public readonly kind: DomainErrorKind,
  ) {
    super(message);
    this.name = "DomainError";
  }
}
