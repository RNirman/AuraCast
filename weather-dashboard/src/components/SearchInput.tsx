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
        className="p-2 border border-gray-300 rounded-lg text-white"
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