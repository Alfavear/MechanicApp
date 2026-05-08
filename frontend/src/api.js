export const apiBase = 'http://localhost:4000/api';

export async function fetchJson(path, options) {
  const response = await fetch(`${apiBase}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Error en la petición');
  }
  return response.json();
}
