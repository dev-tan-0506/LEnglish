# LEnglish Coding Rules

These rules capture the current project conventions for future coding work.

## Backend Layering

- Controllers should only call the matching service method and return that service output.
- Controllers should not contain business logic, database logic, cookie handling, token handling, or response shaping beyond passing required framework objects to the service.
- Service dependencies should use explicit names, for example `authService`, `usersService`, `authRepository`, and `tokenService`.
- Avoid ambiguous dependency names such as `this.auth`, `this.user`, `this.users`, or `this.tokens`.

## Repositories

- Database interactions should live in repository providers.
- Services should depend on repositories for persistence and query operations.
- Repositories should be registered as Nest providers in the owning module.
- Keep Prisma-specific calls inside repository classes.

## Types And Interfaces

- Module-specific types and interfaces should live in a dedicated file inside that module.
- Use the `*.types.ts` naming pattern, for example `auth.types.ts` and `users.types.ts`.
- Avoid defining exported types or interfaces directly inside controllers, services, or repositories.

## Messages

- Error and success message strings should be defined as constants in a separate module file.
- Use the `*.messages.ts` naming pattern, for example `auth.messages.ts` and `users.messages.ts`.
- Exception messages, DTO validation messages, and response message strings should reference those constants.
- Keep stable response contract values, such as `{ ok: true }`, unchanged unless the API contract is intentionally changing.

## Comments

- Add a short comment for each function or method.
- Comments should describe the method responsibility, not restate every line of implementation.

## Auth Module Examples

- `AuthController` should delegate to `AuthService`.
- `AuthService` should coordinate authentication flow, token issuing, cookie writes, and repository calls.
- `AuthRepository` should handle refresh-token and auth-related database access.
- `TokenService` should handle access-token signing/verifying and refresh-token generation/hashing.
- `AuthCookieService` should own auth cookie names and cookie options.
