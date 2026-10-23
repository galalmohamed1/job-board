import { CategoryCardData } from "@/types/category";
import { ArrowLeft, Briefcase, ChevronDown, Handshake, Megaphone, ShoppingCart, Target } from "lucide-react";
import { useState } from "react";
export const CATEGORIES_DATA: CategoryCardData[] = [
  {
    id: 'partners',
    title: 'الشركاء والموردون',
    description: 'فرص للتعاون التجاري وتوريد المنتجات والخدمات',
    image: '/img/business.png',
    iconType: 'partners',
    ctaText: 'كن شريكاً معنا',
  },
  {
    id: 'legal',
    title: 'الخدمات المهنية',
    description: 'استشارات قانونية وخدمات مهنية متخصصة',
    image: '/img/law.png',
    iconType: 'legal',
    ctaText: 'تعرف على الخدمات',
  },
  {
    id: 'campaigns',
    title: 'الحملات الدعائية',
    description: 'حملات إعلانية وتسويقية وإعلامية متكاملة',
    image: '/img/advertising.png',
    iconType: 'campaigns',
    ctaText: 'اكتشف المزيد',
    hasDropdown: true,
  },
  {
    id: 'marketing',
    title: 'التسويق والإعلان',
    description: 'إدارة حساباتك وحملاتك الإعلانية وتسويق منتجاتك وخدماتك',
    image: '/img/social.png',
    iconType: 'marketing',
    ctaText: 'تعرف على الخدمات',
  },
  {
    id: 'store',
    title: 'المتجر',
    description: 'منتجات متنوعة بجودة عالية وأسعار تنافسية',
    image: '/img/market.png',
    iconType: 'store',
    ctaText: 'تسوق الآن ←',
  },
];

function CategoriesSection() {
    const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
    const renderIcon = (type: string) => {
    switch (type) {
      case 'store':
        return <ShoppingCart className="w-5 h-5 text-ink-gold-light" />;
      case 'marketing':
        return <Megaphone className="w-5 h-5 text-ink-gold-light" />;
      case 'campaigns':
        return <Target className="w-5 h-5 text-ink-gold-light" />;
      case 'legal':
        return <Briefcase className="w-5 h-5 text-ink-gold-light" />;
      case 'partners':
        return <Handshake className="w-5 h-5 text-ink-gold-light" />;
      default:
        return <ShoppingCart className="w-5 h-5 text-ink-gold-light" />;
    }
  };
  return (
    <section className="py-12 bg-white font-['Cairo']">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                {CATEGORIES_DATA.map((cat) => {
            const isCampaign = cat.id === 'campaigns';
            const isDropdownActive = activeDropdownId === cat.id;
            return (
              <div
                key={cat.id}
                className="relative overflow-visible flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 text-center"
                >
                {/* Image Slot (من غير overflow-hidden) */}
                <div className="relative h-44 w-full">
                    {/* الـ overflow-hidden على الصورة بس */}
                    <div className="absolute inset-0 overflow-hidden rounded-t-2xl bg-slate-100">
                    <img
                        src={cat.image}
                        alt={cat.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                    />
                    </div>

                    {/* Badge برّه الـ div اللي فيه overflow-hidden */}
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-10 w-11 h-11 rounded-full bg-[#1E3A8A] flex items-center justify-center border-2 border-white shadow-md">
                    {renderIcon(cat.iconType)}
                    </div>
                </div>

                {/* Card Body */}
                <div className="pt-8 pb-5 px-4 flex flex-col flex-1 items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A] mb-2 font-['Cairo']">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed min-h-[36px] font-['Cairo']">
                      {cat.description}
                    </p>
                  </div>

                  {/* Button */}
                  <div className="w-full mt-4 relative">
                    <button
                      type="button"
                      onClick={() => {
                        if (isCampaign) {
                          setActiveDropdownId(isDropdownActive ? null : cat.id);
                        }
                      }}
                      className="w-full py-2 px-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 hover:border-[#D49B35] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm font-['Cairo']"
                    >
                      {cat.id === 'store' && (
                        <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
                      )}
                      <span>{cat.ctaText.replace('←', '').trim()}</span>
                      {isCampaign && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isDropdownActive ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </button>

                    {/* Submenu for Campaigns card */}
                    {isCampaign && isDropdownActive && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-30 text-right">
                        {/* {campaignSubItems.map((sub, i) => {
                          const SubIcon = sub.icon;
                          return (
                            <a
                              key={i}
                              href="#campaigns"
                              onClick={() => setActiveDropdownId(null)}
                              className="flex items-center gap-2 p-2 hover:bg-[#FDF8ED] rounded-lg text-xs font-semibold text-slate-800 transition-colors"
                            >
                              <span className="w-6 h-6 rounded-md bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0">
                                <SubIcon className="w-3.5 h-3.5" />
                              </span>
                              <span>{sub.title}</span>
                            </a>
                          );
                        })} */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
            </div>
        </div>
    </section>
  )
}

export default CategoriesSection