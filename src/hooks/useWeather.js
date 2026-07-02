import { useState, useEffect, useCallback } from 'react';

const WMO_CODES = {
  0:  { label: 'Clear sky',        icon: 'sun' },
  1:  { label: 'Mainly clear',     icon: 'sun' },
  2:  { label: 'Partly cloudy',    icon: 'cloud-sun' },
  3:  { label: 'Overcast',         icon: 'cloud' },
  45: { label: 'Foggy',            icon: 'cloud' },
  48: { label: 'Icy fog',          icon: 'cloud' },
  51: { label: 'Light drizzle',    icon: 'rain' },
  53: { label: 'Drizzle',          icon: 'rain' },
  55: { label: 'Heavy drizzle',    icon: 'rain' },
  61: { label: 'Light rain',       icon: 'rain' },
  63: { label: 'Rain',             icon: 'rain' },
  65: { label: 'Heavy rain',       icon: 'rain' },
  71: { label: 'Light snow',       icon: 'cloud' },
  80: { label: 'Light showers',    icon: 'rain' },
  81: { label: 'Showers',          icon: 'rain' },
  82: { label: 'Heavy showers',    icon: 'rain' },
  95: { label: 'Thunderstorm',     icon: 'rain' },
  96: { label: 'Thunderstorm + hail', icon: 'rain' },
  99: { label: 'Thunderstorm + hail', icon: 'rain' },
};

function getWeatherMeta(code) {
  return WMO_CODES[code] || { label: 'Unknown', icon: 'cloud' };
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h >= 5  && h < 11) return 'morning';
  if (h >= 11 && h < 15) return 'afternoon';
  if (h >= 15 && h < 19) return 'evening';
  return 'night';
}

export function useWeather() {
  const [weather, setWeather] = useState({
    condition: 'Clear sky',
    generalCondition: 'Sunny',
    temp: 28,
    tempC: 28,
    feelsLike: 28,
    humidity: 70,
    wind: 10,
    icon: 'clear',
    conditionIcon: 'sun',
    day: 'Today',
    time: 'Now',
    code: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(false);
    const tod = getTimeOfDay();
    setTimeOfDay(tod);

    try {
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=-6.2088&longitude=106.8456&hourly=temperature_2m,apparent_temperature,weathercode,relative_humidity_2m,wind_speed_10m&current=temperature_2m,apparent_temperature,weathercode,relative_humidity_2m,wind_speed_10m&wind_speed_unit=kmh&temperature_unit=celsius&timezone=Asia%2FJakarta';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();

      const now = new Date();
      const hour = now.getHours();
      const hourly = data.hourly;
      const idx = hourly.time.findIndex(t => new Date(t).getHours() === hour && new Date(t).toDateString() === now.toDateString());
      
      const source = idx >= 0
        ? { temp: hourly.temperature_2m[idx], feels: hourly.apparent_temperature[idx], hum: hourly.relative_humidity_2m[idx], wind: hourly.wind_speed_10m[idx], code: hourly.weathercode[idx] }
        : { temp: data.current.temperature_2m, feels: data.current.apparent_temperature, hum: data.current.relative_humidity_2m, wind: data.current.wind_speed_10m, code: data.current.weathercode };

      const meta = getWeatherMeta(source.code);
      
      let generalCond = 'Sunny';
      let generalIconName = 'clear';
      const code = source.code;
      if (code >= 1 && code <= 3) {
        generalCond = 'Cloudy';
        generalIconName = 'cloudy';
      } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || (code >= 95 && code <= 99)) {
        generalCond = 'Rainy';
        generalIconName = 'rain';
      } else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
        generalCond = 'Snowy';
        generalIconName = 'snow';
      } else if (code === 0) {
        generalCond = 'Sunny';
        generalIconName = 'clear';
      }

      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const todayName = daysOfWeek[now.getDay()];
      const currentHour = now.getHours();
      const period = currentHour >= 12 ? 'pm' : 'am';
      const displayHour = currentHour % 12 || 12;

      setWeather({
        tempC: source.temp,
        feelsLike: source.feels,
        humidity: source.hum,
        wind: source.wind,
        condition: meta.label,
        conditionIcon: meta.icon,
        code: source.code,
        temp: Math.round(source.temp),
        generalCondition: generalCond,
        icon: generalIconName,
        day: todayName,
        time: `${displayHour} ${period}`
      });
    } catch (e) {
      console.error('Failed to fetch real-time weather data:', e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 900000);
    return () => clearInterval(weatherInterval);
  }, [fetchWeather]);

  useEffect(() => {
    const interval = setInterval(() => setTimeOfDay(getTimeOfDay()), 60000);
    return () => clearInterval(interval);
  }, []);

  return { weather, setWeather, loading, error, timeOfDay, fetchWeather };
}
