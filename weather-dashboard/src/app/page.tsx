
interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

interface HomePageProps {
  searchParams?: {
    city?: string;
    unit?: 'metric' | 'imperial';
  };
}

export const dynamic = 'force-dynamic';

import SearchInput from '@/components/SearchInput';
import Link from 'next/link';
import UnitToggle from '@/components/UnitToggle';

export default async function Home({ searchParams }: HomePageProps) {
  const API_KEY = process.env.OPENWEATHERMAP_API_KEY; 
  const params = await searchParams;
  const city = params?.city || "Colombo";
  const unit = params?.unit || "metric";

  if (!API_KEY) {
    return <div className="text-center p-8">API Key is missing in .env.local!</div>;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`;
  
  try {
    const res = await fetch(url, {
      cache: 'no-store' 
    });

    if (!res.ok) {
      return <div className="text-center p-8">Error fetching data for {city}. Status: {res.status}</div>;
    }

    const weatherData: WeatherData = await res.json(); 
    console.log("Fetched weather data:", weatherData);

    const unitSymbol = unit === 'metric' ? '°C' : '°F';

    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        
        <SearchInput />
        <UnitToggle />

        <h1 className="text-4xl font-bold mb-4">Weather in {weatherData.name}</h1>
        <p className="text-6xl font-extrabold">{Math.round(weatherData.main.temp)}{unitSymbol}</p>
        <p className="text-xl mt-2 capitalize">{weatherData.weather[0].description}</p>
        <p className="text-lg mt-1">Humidity: {weatherData.main.humidity}%</p>
      
        <Link 
          href={`/details/${weatherData.name}`} 
          className="mt-6 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          View Full Details
        </Link>
      </main>
    );
  } catch (error) {
    console.error("Fetch error:", error);
    return <div className="text-center p-8">An unexpected error occurred during fetching.</div>;
  }
}