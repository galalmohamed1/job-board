'use client';

import { useShop } from '@/context/ShopContext';
import CategoryCard from '../features/CategoryComponents/CategoryCard';


export default function CategoriesSection() {
  const { categories } = useShop();

  return (
    <section className="py-12 bg-white font-['Cairo']">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map((cat) => (
            <CategoryCard
              key={cat._id}
              id={cat._id}
              name={cat.title}
              description={cat.description}
              image={cat.image?.secure_url}
            />
          ))}
        </div>
      </div>
    </section>
  );
}