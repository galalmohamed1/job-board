import { Mail, MapPin, Phone, Share2 } from 'lucide-react';

// روابط السوشيال - غيّرها بروابطك الحقيقية
const SOCIAL_LINKS = {
  facebook: '#',
  x: '#',
  instagram: '#',
  linkedin: '#',
  youtube: '#',
};

const SOCIAL_CLASS =
  'w-6 h-6 rounded-full bg-[#0A2150] hover:bg-[#C9972B] text-white flex items-center justify-center transition-colors';

function IconCircle({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-10 h-10 rounded-full bg-[#C9972B] text-white flex items-center justify-center mx-auto">
      {children}
    </span>
  );
}

export default function ContactInfo() {
  return (
    <div className="bg-[#F4F9FE] rounded-lg border border-[#DCE8F5] shadow-2xs p-6">
      <h2 className="text-xl font-black text-[#0A2150]">معلومات التواصل</h2>
      <p className="text-xs text-slate-500 mt-1.5 mb-6">
        يمكنك التواصل معنا من خلال أي من القنوات التالية
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8">
        {/* العمود الأيمن: البريد + السوشيال */}
        <div className="space-y-8 sm:pl-6 sm:border-l sm:border-[#DCE8F5] text-center">
          <div>
            <IconCircle>
              <Mail className="w-5 h-5" />
            </IconCircle>
            <h3 className="text-xs font-black text-[#0A2150] mt-3">البريد الإلكتروني</h3>
            <p className="text-xs text-slate-700 mt-1.5" dir="ltr">
              info@horusmarket.online
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
              نرد على استفساراتك خلال 24 ساعة
            </p>
          </div>

          <div>
            <IconCircle>
              <Share2 className="w-4 h-4" />
            </IconCircle>
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <a href={SOCIAL_LINKS.facebook} aria-label="Facebook" className={SOCIAL_CLASS}>
                <span className="text-[11px] font-black leading-none">f</span>
              </a>
              <a href={SOCIAL_LINKS.x} aria-label="X" className={SOCIAL_CLASS}>
                <span className="text-[10px] font-black leading-none">X</span>
              </a>
              <a href={SOCIAL_LINKS.instagram} aria-label="Instagram" className={SOCIAL_CLASS}>
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                </svg>
              </a>
              <a href={SOCIAL_LINKS.linkedin} aria-label="LinkedIn" className={SOCIAL_CLASS}>
                <span className="text-[9px] font-black leading-none">in</span>
              </a>
              <a href={SOCIAL_LINKS.youtube} aria-label="YouTube" className={SOCIAL_CLASS}>
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
                  <path d="M8 6l10 6-10 6V6z" />
                </svg>
              </a>
            </div>
            <h3 className="text-xs font-black text-[#0A2150] mt-3">تابعنا على</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
              للحصول على آخر الأخبار
              <br />
              والتحديثات
            </p>
          </div>
        </div>

        {/* العمود الأيسر: الهاتف + العنوان */}
        <div className="space-y-8 text-center">
          <div>
            <IconCircle>
              <Phone className="w-5 h-5" />
            </IconCircle>
            <h3 className="text-xs font-black text-[#0A2150] mt-3">الهاتف</h3>
            <p className="text-xs text-slate-700 mt-1.5" dir="ltr">
              +20 2 1234 5678
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
              من الأحد إلى الخميس
              <br />
              من 9 صباحاً إلى 5 مساءً
            </p>
          </div>

          <div>
            <IconCircle>
              <MapPin className="w-5 h-5" />
            </IconCircle>
            <h3 className="text-xs font-black text-[#0A2150] mt-3">العنوان</h3>
            <p className="text-[11px] text-slate-500 leading-loose mt-1.5">
              45 شارع شاسيبون
              <br />
              قصر النيل - وسط البلد
              <br />
              القاهرة - مصر
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}