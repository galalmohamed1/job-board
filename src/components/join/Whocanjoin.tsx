import Image from 'next/image';
import { Briefcase, Home, Megaphone, Package, ShoppingCart, Users } from 'lucide-react';

const AUDIENCE = [
  {
    icon: Users,
    title: 'الشركاء والمستثمرون',
    desc: 'شركات - مؤسسات - أفراد يبحثون عن فرص استثمارية',
    image: '/img/business.png',
  },
  {
    icon: Megaphone,
    title: 'شركات التسويق والإعلان',
    desc: 'إدارة صفقات - حملات دعائية - تصميم - محتوى',
    image: '/img/social.png',
  },
  {
    icon: Home,
    title: 'أصحاب العقارات',
    desc: 'وحدات سكنية - تجارية - وإدارية - أراضي',
    image: '/img/realstate.jpg',
  },
  {
    icon: ShoppingCart,
    title: 'التجار وأصحاب المتاجر',
    desc: 'متاجر إلكترونية ومحلية وتجار الجملة والتجزئة',
    image: '/img/market.png',
  },
  {
    icon: Package,
    title: 'الموردون والشركات',
    desc: 'موردون - شركات تجارة ومصنعين',
    image: '/img/advertising.png',
  },
  {
    icon: Briefcase,
    title: 'مقدمو الخدمات المهنية',
    desc: 'محامون - استشاريون - عيادات وكل من يقدمه من خدمات متخصصة',
    image: '/img/law.png',
  },
];

export default function WhoCanJoin() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl md:text-2xl font-black text-[#0A2150]">من يمكنه الانضمام؟</h2>
        <p className="text-xs md:text-sm text-slate-600 mt-2 mb-6">
          نرحب بكل من يسعى لتقديم قيمة حقيقية لعملائنا وزوار المنصة.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {AUDIENCE.map(({ icon: Icon, title, desc, image }) => (
            <div
              key={title}
              className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative w-full aspect-[400/220]">
                <Image
                  src={image}
                  alt={title}
                  fill
                  sizes="(min-width: 1024px) 16vw, 50vw"
                  className="object-cover"
                />
              </div>

              <span className="relative -mt-5 mr-5 w-10 h-10 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#0A2150]" />
              </span>

              <div className="px-3 pt-2 pb-4 text-center">
                <h3 className="text-xs font-black text-[#0A2150]">{title}</h3>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-1.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}