'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBox({ mobile = false }: { mobile?: boolean }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="relative flex items-center w-full"
    >
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="ابحث عن منتج أو خدمة أو قسم..."
        className={`w-full bg-white text-slate-800 placeholder-slate-400 text-xs rounded-lg py-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-gold-primary text-right ${
          mobile ? 'ps-10 pe-3' : 'md:text-sm ps-12 pe-4 shadow-inner'
        }`}
      />
      <button
        type="submit"
        aria-label="بحث"
        className={`absolute inset-s-1 top-1 bottom-1 rounded-md flex items-center justify-center text-white cursor-pointer bg-gold-primary ${
          mobile ? 'px-2.5' : 'px-3.5'
        }`}
      >
        <Search className={mobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      </button>
    </form>
  );
}