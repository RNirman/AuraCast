'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchInput() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const value = query.trim();
    if (value) {
      const encoded = encodeURIComponent(value);
      router.push(`/?city=${encoded}`);
      setQuery('');
      console.log('SearchInput: navigated to', `/?city=${encoded}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 mb-8">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter city name..."
        className="p-2 border border-gray-300 rounded-lg text-gray-900 dark:text-gray-100 bg-white/80 dark:bg-black/30 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button 
        type="submit"
        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
}