import Image from 'next/image';
function BannerProduct() {
  return (
    <div className="max-w-7xl mx-auto mt-3 px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 md:bg-[url('/img/banner_no_text.png')] md:bg-cover md:bg-right md:bg-no-repeat">

        {/* الصورة فوق (موبايل بس) */}
        <div className="relative h-44 bg-[url('/img/banner_no_text.png')] bg-cover bg-position-[80%_50%] sm:h-56 md:hidden">
          <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-slate-50 to-transparent" />
        </div>

        {/* النص */}
        <div className="relative px-5 pb-6 pt-2 text-right md:flex md:aspect-1029/156 md:items-center md:justify-end md:px-8 md:py-0">
          <div className="md:w-[52%] md:pe-6">
            <h1 className="mb-2 text-2xl font-black leading-tight text-ink-primary sm:text-3xl lg:text-5xl">
              اكتشف منتجاتنا المميزة
            </h1>
            <p className="text-sm font-medium text-slate-600 sm:text-base lg:text-xl">
              جودة عالية - أسعار تنافسية - توصيل آمن وسريع
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default BannerProduct