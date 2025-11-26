export const weatherClassMap: { [key: string]: string } = {
  // Clear / Sunny
  'Clear': 'bg-gradient-to-br from-blue-400 to-sky-300 text-white',
  
  // Clouds / Overcast
  'Clouds': 'bg-gradient-to-br from-gray-400 to-gray-200 text-gray-900',
  
  // Rain / Drizzle / Thunderstorm
  'Rain': 'bg-gradient-to-br from-blue-700 to-gray-700 text-white',
  'Drizzle': 'bg-gradient-to-br from-blue-700 to-gray-700 text-white',
  'Thunderstorm': 'bg-gradient-to-br from-gray-900 to-indigo-800 text-white',
  
  // Snow
  'Snow': 'bg-gradient-to-br from-gray-300 to-white text-gray-900',
  
  // Mist / Fog / Haze (Atmosphere group)
  'Mist': 'bg-gradient-to-br from-gray-500 to-slate-500 text-white',
  'Smoke': 'bg-gradient-to-br from-gray-500 to-slate-500 text-white',
  'Haze': 'bg-gradient-to-br from-gray-500 to-slate-500 text-white',
  'Dust': 'bg-gradient-to-br from-yellow-800 to-amber-700 text-white',
  'Fog': 'bg-gradient-to-br from-gray-500 to-slate-500 text-white',
  'Sand': 'bg-gradient-to-br from-yellow-800 to-amber-700 text-white',
  
  // Default/Unknown
  'default': 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white',
};