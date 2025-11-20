
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

export default async function Home() {
  // Use 'process.env' to securely access the variable
  const API_KEY = process.env.OPENWEATHERMAP_API_KEY; 
  const city = "Tokyo"; // Start with a default city

  if (!API_KEY) {
    return <div className="text-center p-8">API Key is missing in .env.local!</div>;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const res = await fetch(url, {
      // Set revalidate time to 3600 seconds (1 hour) for caching
      next: { revalidate: 3600 } 
    });

    if (!res.ok) {
      // Handle HTTP errors (e.g., 404 city not found)
      return <div className="text-center p-8">Error fetching data for {city}. Status: {res.status}</div>;
    }

    // 3. Type-cast the JSON response for type safety
    const weatherData: WeatherData = await res.json(); 

    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-4">Weather in {weatherData.name}</h1>
        <p className="text-6xl font-extrabold">{Math.round(weatherData.main.temp)}°C</p>
        <p className="text-xl mt-2 capitalize">{weatherData.weather[0].description}</p>
        <p className="text-lg mt-1">Humidity: {weatherData.main.humidity}%</p>
      </main>
    );
  } catch (error) {
    console.error("Fetch error:", error);
    return <div className="text-center p-8">An unexpected error occurred during fetching.</div>;
  }
}