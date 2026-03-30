/** URLs for files in `/public` (correct with Vite `base`, e.g. GitHub Pages `/project/`). */
export function publicAsset(relativePath: string): string {
  const base = import.meta.env.BASE_URL;
  const segments = relativePath
    .replace(/^\/+/, '')
    .split('/')
    .map((segment) => encodeURIComponent(segment));
  return `${base}${segments.join('/')}`;
}
