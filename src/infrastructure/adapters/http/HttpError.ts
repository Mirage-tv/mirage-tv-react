/**
 * HTTP Errors
 * Classes d'erreurs pour la gestion des erreurs HTTP
 */

// Type pour les issues Zod
type ZodIssue = {
  code: string;
  path: (string | number)[];
  message: string;
};

export class HttpError extends Error {
  readonly status: number;
  readonly originalError?: unknown;

  constructor(status: number, message: string, originalError?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.originalError = originalError;
  }
}

export class ValidationError extends Error {
  readonly issues: ZodIssue[];

  constructor(message: string, issues: ZodIssue[]) {
    super(message);
    this.name = "ValidationError";
    this.issues = issues;
  }
}

// Type guard
export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}
