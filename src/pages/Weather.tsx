import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { PageMeta } from '../components/PageMeta'

type City = { name: string; lat: number; lon: number }
type Units = 'imperial' | 'metric'

const cities: City[] = [
  { name: 'Houston, TX', lat: 29.7604, lon: -95.3698 },
  { name: 'Durham, NC', lat: 35.9940, lon: -78.8986 },
]

function decodeWeather(code: number): string {
  const map: Record<number, string> = {
    0: 'Clear sky ☀️', 1: 'Mainly clear 🌤', 2: 'Partly cloudy ⛅', 3: 'Overcast ☁️',
    45: 'Fog 🌫', 48: 'Depositing rime fog 🌫',
    51: 'Light drizzle 🌦', 53: 'Moderate drizzle 🌦', 55: 'Dense drizzle 🌦',
    56: 'Light freezing drizzle 🧊🌦', 57: 'Dense freezing drizzle 🧊🌦',
    61: 'Slight rain 🌧', 63: 'Moderate rain 🌧', 65: 'Heavy rain 🌧',
    66: 'Light freezing rain 🧊🌧', 67: 'Heavy freezing rain 🧊🌧',
    71: 'Slight snow ❄️', 73: 'Moderate snow ❄️', 75: 'Heavy snow ❄️', 77: 'Snow grains ❄️',
    80: 'Slight rain showers 🌦', 81: 'Moderate rain showers 🌦', 82: 'Violent rain showers 🌧',
    85: 'Slight snow showers ❄️', 86: 'Heavy snow showers ❄️',
    95: 'Thunderstorm ⛈', 96: 'Thunderstorm with slight hail ⛈', 99: 'Thunderstorm with heavy hail ⛈',
  }
  return map[code] || `Unknown weather (${code})`
}

function vaporPressureDeficit(temp: number, dew: number, isMetric: boolean): string {
  const tempC = isMetric ? temp : (temp - 32) * 5 / 9
  const dewC = isMetric ? dew : (dew - 32) * 5 / 9
  const es = 0.6108 * Math.exp((17.27 * tempC) / (tempC + 237.3))
  const ea = 0.6108 * Math.exp((17.27 * dewC) / (dewC + 237.3))
  return (es - ea).toFixed(2)
}

function airDensity(temp: number, pressureHpa: number, isMetric: boolean): string {
  const tempK = isMetric ? temp + 273.15 : ((temp - 32) * 5 / 9) + 273.15
  return ((pressureHpa * 100) / (287.05 * tempK)).toFixed(3)
}

interface WeatherTooltipProps {
  active?: boolean
  payload?: any[]
  valueClass: 'tooltip-value-red' | 'tooltip-value-blue'
  formatValue: (v: number) => string
}

function WeatherTooltip({ active, payload, valueClass, formatValue }: WeatherTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/10 p-3 rounded-lg border border-white/20 backdrop-blur-sm">
        <p className="text-sm font-semibold">{payload[0].payload.time}</p>
        <p className={`${valueClass} font-bold`}>{formatValue(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

function formatHour(time: string) {
  return new Date(time).toLocaleString('en-US', { hour: 'numeric', hour12: true })
}

const axisTick = { fontSize: 12, fill: 'rgba(255,255,255,0.5)' }
const axisStroke = 'rgba(255,255,255,0.5)'
const gridStroke = 'rgba(255,255,255,0.1)'

export function Weather() {
  const [selectedCity, setSelectedCity] = useState<City>(cities[0])
  const [data, setData] = useState<any>(null)
  const [units, setUnits] = useState<Units>('imperial')
  const [loading, setLoading] = useState<boolean>(true)

  const isMetric = units === 'metric'

  const chartData = data ? data.hourly.time.slice(1, 25).map((time: string, i: number) => ({
    time: formatHour(time),
    temp: data.hourly.temperature_2m[i + 1],
    precip: data.hourly.precipitation_probability[i + 1],
    humidity: data.hourly.relativehumidity_2m[i + 1],
    windspeed: data.hourly.windspeed_10m[i + 1],
  })) : []

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true)
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current_weather=true&hourly=temperature_2m,apparent_temperature,relativehumidity_2m,precipitation_probability,precipitation,cloudcover,pressure_msl,surface_pressure,windspeed_10m,windgusts_10m,dewpoint_2m,visibility,cape,lifted_index,freezing_level_height&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode,sunrise,sunset&temperature_unit=${isMetric ? 'celsius' : 'fahrenheit'}&windspeed_unit=${isMetric ? 'kmh' : 'mph'}&precipitation_unit=${isMetric ? 'mm' : 'inch'}&timezone=auto`
      const json = await fetch(url).then((r) => r.json())
      setData(json)
      setLoading(false)
    }
    fetchWeather()
  }, [selectedCity, units, isMetric])

  if (loading || !data) return <div className="p-20 text-center">Crunching numbers...</div>

  const todayStr = new Date().toISOString().split('T')[0]
  const startIndex = data.daily.time.findIndex((d: string) => d >= todayStr)
  const safeStart = startIndex === -1 ? 0 : startIndex
  const sevenDayForecast = data.daily.time
    .map((time: string, i: number) => ({ time, index: i }))
    .slice(safeStart, safeStart + 7)

  const todayDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <main className="min-h-screen px-6 py-16">
      <PageMeta title="Weather" description="Some cool weather because yes." />
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="c-text text-4xl font-bold">Big Brain Weather</h1>
          <button
            onClick={() => setUnits(isMetric ? 'imperial' : 'metric')}
            className="weather-unit-btn text-sm px-3 py-1 rounded-full border"
          >
            {isMetric ? 'Go Back to Freedom Units 🦅' : 'Switch to Metric'}
          </button>
        </div>

        <div className="flex gap-4 mb-10">
          {cities.map((city) => (
            <button
              key={city.name}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 rounded-xl border transition-all ${selectedCity.name === city.name ? 'weather-city-btn-active' : 'weather-city-btn'}`}
            >
              {city.name}
            </button>
          ))}
        </div>

        <section className="weather-section mb-16 p-6 rounded-2xl border bg-white/5">
          <h2 className="c-text text-2xl font-semibold mb-6">Current Conditions</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="c-accent text-5xl font-bold">{data.current_weather.temperature.toFixed(1)}°</div>
              <div className="opacity-70">Feels like {data.hourly.apparent_temperature[0].toFixed(2)}°</div>
            </div>
            <div>
              <div>Humidity: {data.hourly.relativehumidity_2m[0]}%</div>
              <div>Dew Point: {data.hourly.dewpoint_2m[0].toFixed(2)}°</div>
              <div>Visibility: {(data.hourly.visibility[0] / 1000).toFixed(2)} km</div>
            </div>
            <div>
              <div>Wind: {data.hourly.windspeed_10m[0].toFixed(2)}</div>
              <div>Gusts: {data.hourly.windgusts_10m[0].toFixed(2)}</div>
            </div>
            <div className="text-sm opacity-60">{decodeWeather(data.current_weather.weathercode)}</div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex justify-between items-baseline mb-4">
            <h2 className="c-text text-xl">24h Temperature Trend</h2>
            <span className="text-sm opacity-60">{todayDate}</span>
          </div>
          <div className="weather-section p-4 rounded-2xl border bg-white/5">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="time" stroke={axisStroke} tick={axisTick} />
                <YAxis stroke={axisStroke} tick={axisTick} />
                <Tooltip content={<WeatherTooltip valueClass="tooltip-value-red" formatValue={(v) => `${v.toFixed(1)}°`} />} />
                <Line type="monotone" dataKey="temp" stroke="var(--color-accent)" strokeWidth={3} dot={{ fill: 'var(--color-accent)', r: 4 }} activeDot={{ r: 6 }} isAnimationActive />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex justify-between items-baseline mb-4">
            <h2 className="c-text text-xl">24h Precipitation Probability</h2>
            <span className="text-sm opacity-60">{todayDate}</span>
          </div>
          <div className="weather-section p-4 rounded-2xl border bg-white/5">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="time" stroke={axisStroke} tick={axisTick} />
                <YAxis stroke={axisStroke} tick={axisTick} />
                <Tooltip content={<WeatherTooltip valueClass="tooltip-value-blue" formatValue={(v) => `${v}% 💧`} />} />
                <Bar dataKey="precip" fill="#3b82f6" isAnimationActive />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="c-text text-2xl font-semibold mb-6">7 Day Forecast</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {sevenDayForecast.map(({ time, index }: { time: string; index: number }) => (
              <div key={time} className="weather-section p-4 rounded-xl border bg-white/5 flex justify-between items-center">
                <div className="w-24">{new Date(time).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                <div className="text-sm opacity-60 flex-1 px-4">{decodeWeather(data.daily.weathercode[index])}</div>
                <div className="font-mono">
                  <span className="c-accent">{data.daily.temperature_2m_max[index].toFixed(1)}°</span>
                  <span className="mx-2 opacity-30">|</span>
                  <span>{data.daily.temperature_2m_min[index].toFixed(1)}°</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="c-text text-2xl mb-6">Live Radar</h2>
          <iframe
            title="weather radar"
            src={`https://www.rainviewer.com/map.html?loc=${selectedCity.lat},${selectedCity.lon},6&oFa=0&oC=0&oU=0&oCS=1&oF=0&oAP=1&c=1&o=83&lm=1&layer=radar&sm=1&sn=1`}
            width="100%"
            className="weather-radar-iframe"
            height="500"
          />
        </section>

        <section className="weather-section p-6 rounded-2xl border bg-white/5">
          <h2 className="c-text text-2xl mb-6">Nerdy Atmospheric Stats</h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div>Lifted Index: {data.hourly.lifted_index[0].toFixed(2)}</div>
              <div>Freezing Level: {data.hourly.freezing_level_height[0].toFixed(2)} m</div>
            </div>
            <div>
              <div>VPD: {vaporPressureDeficit(data.current_weather.temperature, data.hourly.dewpoint_2m[0], isMetric)} kPa</div>
              <div>Air Density: {airDensity(data.current_weather.temperature, data.hourly.pressure_msl[0], isMetric)} kg/m³</div>
            </div>
            <div>
              <div>Precip Max: {data.daily.precipitation_probability_max[0]}%</div>
              <div>Cloud Cover: {data.hourly.cloudcover[0]}%</div>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}
