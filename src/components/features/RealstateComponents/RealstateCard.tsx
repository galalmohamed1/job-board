'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Maximize2, BedDouble, Bath } from 'lucide-react';
import { RealEstateItem } from '@/types/realestate';


interface RealstateCardProps {
  property: RealEstateItem;
  isLiked?: boolean;
  onToggleLike?: (id: string | number) => void;
}

export default function RealstateCard({
  property,
  isLiked = false,
  onToggleLike,
}: RealstateCardProps) {
  const formattedPrice =
    typeof property.price === 'number'
      ? `${property.price.toLocaleString('ar-EG')} ج.م`
      : property.price;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col group h-full">
      {/* Container للصورة والشارات */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 shrink-0">
        <Image
          src={property.image || '/img/realstate/card_apartment.jpg'}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* شارة الحالة (للبيع / للإيجار / مميز) */}
        {property.typeBadge && (
          <div className="absolute top-3 right-3 z-10">
            <span
              className={`text-[11px] font-bold text-white px-2.5 py-1 rounded-md shadow-xs ${
                property.typeBadgeColor || 'bg-[#D49B35]'
              }`}
            >
              {property.typeBadge}
            </span>
          </div>
        )}

        {/* زر الإعجاب / المفضلة */}
        {onToggleLike && (
          <button
            type="button"
            onClick={() => onToggleLike(property.id)}
            className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-slate-600 hover:text-red-500 hover:bg-white transition-all shadow-xs cursor-pointer"
            aria-label="إضافة للمفضلة"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isLiked ? 'fill-red-500 text-red-500' : ''
              }`}
            />
          </button>
        )}
      </div>

      {/* تفاصيل العقار */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* عنوان العقار */}
          <h3 className="font-bold text-[#0B2545] text-sm sm:text-base mb-1 line-clamp-1 group-hover:text-[#D49B35] transition-colors">
            {property.title}
          </h3>

          {/* الموقع الجغرافي */}
          {property.location && (
            <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="line-clamp-1">{property.location}</span>
            </div>
          )}

          {/* المميزات (المساحة، الغرف، الحمامات) */}
          <div className="flex items-center justify-between text-slate-600 text-[11px] sm:text-xs py-2.5 border-y border-slate-100 mb-3">
            {property.area ? (
              <div className="flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{property.area}</span>
              </div>
            ) : null}

            {property.rooms !== null && property.rooms !== undefined ? (
              <div className="flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                <span>{property.rooms} غرف</span>
              </div>
            ) : null}

            {property.baths !== null && property.baths !== undefined ? (
              <div className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5 text-slate-400" />
                <span>{property.baths} حمام</span>
              </div>
            ) : null}

            {property.rooms === null && !property.baths && (
              <div className="flex items-center gap-1 text-slate-400">
                <span>فرصة مميزة</span>
              </div>
            )}
          </div>
        </div>

        <div>
          {/* السعر */}
          <div className="flex items-baseline justify-end gap-1 mb-3">
            {property.period && (
              <span className="text-xs text-slate-500 font-normal">{property.period}</span>
            )}
            <span className="text-[#0B2545] font-black text-base sm:text-lg">
              {formattedPrice}
            </span>
          </div>

          {/* زر عرض التفاصيل أو التواصل */}
          {property.slug ? (
            <Link
              href={`/product/${property.slug}`}
              className="block w-full py-2 border border-slate-200 hover:border-[#D49B35] hover:bg-[#D49B35]/5 text-xs sm:text-sm font-bold text-[#0B2545] hover:text-[#D49B35] rounded-xl text-center transition-all duration-200"
            >
              عرض التفاصيل
            </Link>
          ) : (
            <button
              type="button"
              className="w-full py-2 border border-slate-200 hover:border-[#D49B35] hover:bg-[#D49B35]/5 text-xs sm:text-sm font-bold text-[#0B2545] hover:text-[#D49B35] rounded-xl text-center transition-all duration-200 cursor-pointer"
            >
              عرض التفاصيل
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

