
interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    main: string;
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
import { weatherClassMap } from '@/utils/weather-styles';
import CityNotFoundDisplay from '@/components/CityNotFoundDisplay';

function ForecastList({ forecasts, unitSymbol }: { forecasts: DailySummary[]; unitSymbol: string }) {
  const ICON_BASE_URL = "https://openweathermap.org/img/w/";

  if (forecasts.length === 0) {
    return <p className="text-red-500 mt-6">Could not generate a 5-day forecast.</p>;
  }

  return (
    <div className="mt-10 p-6 bg-white/95 dark:bg-black/40 backdrop-blur-md rounded-xl shadow-xl w-full max-w-2xl border border-white/20 dark:border-gray-700/50">
      <h2 className="text-2xl font-semibold mb-4 text-center text-white drop-shadow-lg">5-Day Forecast</h2>
      <div className="flex justify-between space-x-4 overflow-x-auto">
        {forecasts.map((day) => (
          <div
            key={day.date}
            className="flex flex-col items-center p-3 border border-white/30 rounded-lg shrink-0 w-24 bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-200 backdrop-blur-sm"
          >
            <p className="font-bold text-lg text-white drop-shadow">{day.dayName}</p>
            <img
              src={`${ICON_BASE_URL}${day.icon}.png`}
              alt={day.description}
              className="w-12 h-12"
            />
            <p className="text-xs capitalize text-white/90 mb-1 text-center drop-shadow">{day.description}</p>
            <p className="font-bold text-white drop-shadow">
              {Math.round(day.maxTemp)}<span className="text-sm">{unitSymbol}</span>
            </p>
            <p className="text-sm text-white/80">
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

    if (currentRes.status === 404 || currentRes.status === 400) {
        throw new Error(`City Not Found: ${city}`);
    }

    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error("API call failed with an unknown status.");
    }

    const weatherData: WeatherData = await currentRes.json();
    const forecastData: ForecastData = await forecastRes.json();

    const dailyForecasts = processForecastData(forecastData.list);
    const unitSymbol = unit === 'metric' ? '°C' : '°F';
    const weatherMain = weatherData.weather[0].main;
    const weatherStyle = weatherClassMap[weatherMain] || weatherClassMap['default'];

    return (
      <main className={`flex min-h-screen flex-col items-center justify-center p-8 ${weatherStyle} transition-all duration-500`}>
        <SearchInput />
        <UnitToggle />

        <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Weather in {weatherData.name}</h1>
        <p className="text-6xl font-extrabold drop-shadow-lg">{Math.round(weatherData.main.temp)}{unitSymbol}</p>
        <p className="text-xl mt-2 capitalize drop-shadow">{weatherData.weather[0].description}</p>
        <p className="text-lg mt-1 drop-shadow">Humidity: {weatherData.main.humidity}%</p>

        <ForecastList forecasts={dailyForecasts} unitSymbol={unitSymbol} />

        <Link
          href={`/details/${weatherData.name}?unit=${unit}`}
          className="mt-6 bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-all duration-200 font-semibold drop-shadow-lg border border-white/30"
        >
          View Full Details
        </Link>
      </main>
    );
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('City Not Found')) {
      return <CityNotFoundDisplay city={city} />;
    }
    
    console.error("Fetch error:", error);
    return <div className="text-center p-8 text-red-600">An unexpected error occurred. Please try again.</div>;
  }
}