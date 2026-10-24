'use client';

import CategoriesSection from "@/components/Home/categoriesSection";
import Banner from "@/components/Home/banner";
import ProductSection from "@/components/Home/ProductSection";
import MarketingSolutionsBanner from "@/components/Home/MarketingSolutionsBanner";
import BusinessCtaBanner from "@/components/Home/BusinessCtaBanner";

export default function Home() {
  return (
    <>
      <Banner />
      <CategoriesSection />
      <MarketingSolutionsBanner />
      <ProductSection />
      <BusinessCtaBanner />
    </>
  );
}
