export function authTokenFromHash(hash: string): string | null {
  const token = new URLSearchParams(hash.slice(1)).get("token");
  return token && token.length <= 128 ? token : null;
}
