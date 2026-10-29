const API_ORIGIN = (process.env.NEXT_PUBLIC_API_ORIGIN ?? "").replace(
  /\/$/,
  "",
);

// - رابط كامل (Cloudinary أو غيره) أو data: يتعرض زي ما هو
// - مسار نسبي زي /uploads/xxx.jpeg يتضاف قبله عنوان الباك إند
export const imgSrc = (url?: string | null): string => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
};
