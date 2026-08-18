/**
 * Carga de las claves RS256 del JWT desde variables de entorno.
 *
 * Las claves viven en el `.env` (JWT_PRIVATE_KEY / JWT_PUBLIC_KEY) como PEM en
 * una sola línea con `\n` escapados. Ya NO se leen de la carpeta `keys/`.
 * `normalizePem` reconvierte los `\n` literales en saltos reales; si dotenv ya
 * los expandió (valores entre comillas dobles), es un no-op.
 */

function normalizePem(value: string): string {
  return value.replace(/\\n/g, '\n');
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(
      `Falta la variable de entorno ${name}. Define la clave PEM en el .env.`,
    );
  }
  return normalizePem(value);
}

/** Clave privada RS256 para firmar tokens (auth). */
export function getJwtPrivateKey(): string {
  return requireEnv('JWT_PRIVATE_KEY');
}

/** Clave pública RS256 para verificar tokens (guardas/estrategia). */
export function getJwtPublicKey(): string {
  return requireEnv('JWT_PUBLIC_KEY');
}
