// خريطة جوجل (iframe) - موقع المستشار شريف عسكر
// لو النتيجة مش دقيقة، زوّد الشارع والمنطقة في ADDRESS (مثلاً: "المستشار شريف عسكر، شارع كذا، المنطقة، القاهرة")
const PLACE_NAME = 'المستشار شريف عسكر';
const ADDRESS = ''; // اختياري: حط هنا عنوان المكتب بالتفصيل
const MAP_QUERY = encodeURIComponent(ADDRESS ? `${PLACE_NAME}، ${ADDRESS}` : PLACE_NAME);

export default function ContactMap() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden h-full min-h-[260px] flex flex-col">
      <iframe
        title="موقع المستشار شريف عسكر"
        src={`https://www.google.com/maps?q=${MAP_QUERY}&hl=ar&z=15&output=embed`}
        className="w-full flex-1 min-h-65 border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-sm text-blue-600 hover:underline py-2 border-t border-slate-200"
      >
        فتح في خرائط جوجل
      </a>
    </div>
  );
}