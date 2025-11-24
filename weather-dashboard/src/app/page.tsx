
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

interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

interface ForecastData {
  list: ForecastItem[];
  city: {
    name: string;
  };
}

interface DailySummary {
  dayName: string;
  date: string;
  minTemp: number;
  maxTemp: number;
  description: string;
  icon: string;
}

interface ForecastListProps {
  forecasts: DailySummary[];
  unitSymbol: string;
}

export const dynamic = 'force-dynamic';

import SearchInput from '@/components/SearchInput';
import Link from 'next/link';
import UnitToggle from '@/components/UnitToggle';

function ForecastList({ forecasts, unitSymbol }: { forecasts: DailySummary[]; unitSymbol: string }) {
  const ICON_BASE_URL = "https://openweathermap.org/img/w/";

  if (forecasts.length === 0) {
    return <p className="text-red-500 mt-6">Could not generate a 5-day forecast.</p>;
  }

  return (
    <div className="mt-10 p-6 bg-white dark:bg-[#18181b] rounded-xl shadow-lg w-full max-w-2xl border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">5-Day Forecast</h2>
      <div className="flex justify-between space-x-4 overflow-x-auto">
        {forecasts.map((day) => (
          <div
            key={day.date}
            className="flex flex-col items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex-shrink-0 w-24 bg-gray-50 dark:bg-[#232326] hover:bg-gray-100 dark:hover:bg-[#2c2c31] transition-colors duration-200"
          >
            <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{day.dayName}</p>
            <img
              src={`${ICON_BASE_URL}${day.icon}.png`}
              alt={day.description}
              className="w-12 h-12"
            />
            <p className="text-xs capitalize text-gray-600 dark:text-gray-300 mb-1 text-center">{day.description}</p>
            <p className="font-bold text-gray-800 dark:text-gray-100">
              {Math.round(day.maxTemp)}<span className="text-sm">{unitSymbol}</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(day.minTemp)}<span className="text-xs">{unitSymbol}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const processForecastData = (list: ForecastItem[]): DailySummary[] => {
  const dailyMap = new Map<string, DailySummary>();
  const today = new Date().toDateString();

  for (const item of list) {
    const date = new Date(item.dt * 1000);
    const dateString = date.toDateString();
    
    if (dateString === today) continue; 

    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const timeHour = date.getHours();

    if (!dailyMap.has(dateString)) {
      dailyMap.set(dateString, {
        dayName: dayName,
        date: dateString,
        minTemp: item.main.temp_min,
        maxTemp: item.main.temp_max,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      });
    } else {
      const current = dailyMap.get(dateString)!;
      current.minTemp = Math.min(current.minTemp, item.main.temp_min);
      current.maxTemp = Math.max(current.maxTemp, item.main.temp_max);

      if (timeHour >= 12 && timeHour < 15) {
        current.description = item.weather[0].description;
        current.icon = item.weather[0].icon;
      }
    }
  }
  return Array.from(dailyMap.values()).slice(0, 5); 
};

export default async function Home({ searchParams }: HomePageProps) {
  const API_KEY = process.env.OPENWEATHERMAP_API_KEY; 
  const params = await searchParams;
  const city = params?.city || "Colombo";
  const unit = params?.unit || "metric";

  if (!API_KEY) {
    return <div className="text-center p-8">API Key is missing in .env.local!</div>;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${unit}`;

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentWeatherUrl, { next: { revalidate: 3600 } }),
      fetch(forecastUrl, { next: { revalidate: 3600 } }),
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      return <div className="text-center p-8">Error fetching data for {city}. City not found or API error.</div>;
    }

    const weatherData: WeatherData = await currentRes.json();
    const forecastData: ForecastData = await forecastRes.json();

    const dailyForecasts = processForecastData(forecastData.list);
    const unitSymbol = unit === 'metric' ? '°C' : '°F';

    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100 dark:bg-[#111113] transition-colors duration-200">
        <SearchInput />
        <UnitToggle />

        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Weather in {weatherData.name}</h1>
        <p className="text-6xl font-extrabold text-gray-800 dark:text-gray-100">{Math.round(weatherData.main.temp)}{unitSymbol}</p>
        <p className="text-xl mt-2 capitalize text-gray-700 dark:text-gray-300">{weatherData.weather[0].description}</p>
        <p className="text-lg mt-1 text-gray-700 dark:text-gray-300">Humidity: {weatherData.main.humidity}%</p>

        <ForecastList forecasts={dailyForecasts} unitSymbol={unitSymbol} />

        <Link
          href={`/details/${weatherData.name}`}
          className="mt-6 bg-green-600 dark:bg-green-700 text-white p-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors"
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