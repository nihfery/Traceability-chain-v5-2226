const DEFAULT_DEV_JWT_SECRET = "super-secret-key";
const DEFAULT_DEV_API_DOCS_PASSWORD = "api-docs-admin";
export const MIN_JWT_SECRET_LENGTH = 32;
export const MIN_API_DOCS_PASSWORD_LENGTH = 12;

const WEAK_JWT_SECRETS = new Set([
  DEFAULT_DEV_JWT_SECRET,
  "secret",
  "jwt-secret",
  "change-me",
  "ubah_dengan_secret_panjang_untuk_production",
]);

const WEAK_API_DOCS_PASSWORDS = new Set([
  DEFAULT_DEV_API_DOCS_PASSWORD,
  "admin",
  "password",
  "change-me",
]);

export function isProductionRuntime() {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production" ||
    process.argv.includes("--production")
  );
}

export function createConfigError(message) {
  const error = new Error(message);
  error.code = "CONFIG_ERROR";
  return error;
}

export function isConfigError(error) {
  return error?.code === "CONFIG_ERROR";
}

function isStrongProductionValue(value, weakValues, minLength) {
  return value && !weakValues.has(value) && value.length >= minLength;
}

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET?.trim() || "";

  if (isProductionRuntime() && !isStrongProductionValue(secret, WEAK_JWT_SECRETS, MIN_JWT_SECRET_LENGTH)) {
    throw createConfigError(`JWT_SECRET wajib diisi dengan secret production minimal ${MIN_JWT_SECRET_LENGTH} karakter.`);
  }

  return secret || DEFAULT_DEV_JWT_SECRET;
}

export function getApiDocsFallbackPassword() {
  const password = process.env.API_DOCS_PASSWORD?.trim() || "";

  if (
    isProductionRuntime() &&
    !isStrongProductionValue(password, WEAK_API_DOCS_PASSWORDS, MIN_API_DOCS_PASSWORD_LENGTH)
  ) {
    throw createConfigError(
      `API_DOCS_PASSWORD wajib diisi dengan password production minimal ${MIN_API_DOCS_PASSWORD_LENGTH} karakter.`
    );
  }

  return password || DEFAULT_DEV_API_DOCS_PASSWORD;
}

export function isWeakApiDocsPassword(password) {
  return WEAK_API_DOCS_PASSWORDS.has(String(password || "").trim());
}
