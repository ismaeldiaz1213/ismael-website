import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type City = {
    name: string
    lat: number
    lon: number
}

type Units = 'imperial' | 'metric'

const cities: City[] = [
    { name: 'Houston, TX', lat: 29.7604, lon: -95.3698 },
    { name: 'Durham, NC', lat: 35.9940, lon: -78.8986 },
]

function decodeWeather(code: number): string {
  const map: Record<number, string> = {
    // Clear / Clouds
    0: "Clear sky ☀️",
    1: "Mainly clear 🌤",
    2: "Partly cloudy ⛅",
    3: "Overcast ☁️",

    // Fog
    45: "Fog 🌫",
    48: "Depositing rime fog 🌫",

    // Drizzle
    51: "Light drizzle 🌦",
    53: "Moderate drizzle 🌦",
    55: "Dense drizzle 🌦",

    // Freezing Drizzle
    56: "Light freezing drizzle 🧊🌦",
    57: "Dense freezing drizzle 🧊🌦",

    // Rain
    61: "Slight rain 🌧",
    63: "Moderate rain 🌧",
    65: "Heavy rain 🌧",

    // Freezing Rain
    66: "Light freezing rain 🧊🌧",
    67: "Heavy freezing rain 🧊🌧",

    // Snow
    71: "Slight snow ❄️",
    73: "Moderate snow ❄️",
    75: "Heavy snow ❄️",

    // Snow grains
    77: "Snow grains ❄️",

    // Rain showers
    80: "Slight rain showers 🌦",
    81: "Moderate rain showers 🌦",
    82: "Violent rain showers 🌧",

    // Snow showers
    85: "Slight snow showers ❄️",
    86: "Heavy snow showers ❄️",

    // Thunderstorm
    95: "Thunderstorm ⛈",

    // Thunderstorm with hail
    96: "Thunderstorm with slight hail ⛈",
    99: "Thunderstorm with heavy hail ⛈",
  }

  return map[code] || `Unknown weather (${code})`
}

function vaporPressureDeficit(temp: number, dew: number, isMetric: boolean): string {
    const tempC = isMetric ? temp : (temp - 32) * 5/9
    const dewC = isMetric ? dew : (dew - 32) * 5/9
    const es = 0.6108 * Math.exp((17.27 * tempC)/(tempC + 237.3))
    const ea = 0.6108 * Math.exp((17.27 * dewC)/(dewC + 237.3))
    return (es - ea).toFixed(2)
}

function airDensity(temp: number, pressureHpa: number, isMetric: boolean): string {
    const tempK = isMetric
        ? temp + 273.15
        : ((temp - 32) * 5/9) + 273.15
    return ((pressureHpa * 100) / (287.05 * tempK)).toFixed(3)
}

function formatHour(time: string) {
    const d = new Date(time)
    return d.toLocaleString('en-US', { hour: 'numeric', hour12: true })
}

export function Weather() {
    const [selectedCity, setSelectedCity] = useState<City>(cities[0])
    const [data, setData] = useState<any>(null)
    const [units, setUnits] = useState<Units>('imperial')
    const [loading, setLoading] = useState<boolean>(true)

    const isMetric = units === 'metric'

    // Prepare chart data for next 24 hours (skip current hour)
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
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current_weather=true&hourly=temperature_2m,apparent_temperature,relativehumidity_2m,precipitation_probability,precipitation,cloudcover,pressure_msl,surface_pressure,windspeed_10m,windgusts_10m,dewpoint_2m,visibility,cape,lifted_index,freezing_level_height&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode,sunrise,sunset&temperature_unit=${isMetric ? 'celsius' : 'fahrenheit'}&windspeed_unit=${isMetric ? 'kmh' : 'mph'}&precipitation_unit=${isMetric ? 'mm' : 'inch'}&timezone=auto`

            const weatherRes = await fetch(weatherUrl)
            const weatherJson = await weatherRes.json()

            setData(weatherJson)
            setLoading(false)
        }
        fetchWeather()
    }, [selectedCity, units, isMetric])

    if (loading || !data) return <div className="p-20 text-center">Crunching numbers...</div>

    const CustomTemperatureTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/10 p-3 rounded-lg border border-white/20 backdrop-blur-sm">
                    <p className="text-sm font-semibold">{payload[0].payload.time}</p>
                    <p style={{ color: '#ef4444' }} className="font-bold">{payload[0].value.toFixed(1)}°</p>
                </div>
            )
        }
        return null
    }

    const CustomPrecipTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/10 p-3 rounded-lg border border-white/20 backdrop-blur-sm">
                    <p className="text-sm font-semibold">{payload[0].payload.time}</p>
                    <p style={{ color: '#3b82f6' }} className="font-bold">{payload[0].value}% 💧</p>
                </div>
            )
        }
        return null
    }

    const todayStr = new Date().toISOString().split('T')[0]
    const startIndex = data.daily.time.findIndex((d: string) => d >= todayStr)
    const safeStart = startIndex === -1 ? 0 : startIndex
    const sevenDayForecast = data.daily.time
        .map((time: string, i: number) => ({
            time,
            index: i,
        }))
        .slice(safeStart, safeStart + 7)

    const getTodayDate = () => {
        return new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        })
    }

    return (
        <main className="min-h-screen px-6 py-16">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold" style={{ color: 'var(--color-text)' }}>
                        Big Brain Weather
                    </h1>
                    <button
                        onClick={() => setUnits(isMetric ? 'imperial' : 'metric')}
                        className="text-sm px-3 py-1 rounded-full border"
                        style={{ borderColor: 'var(--color-border)', color: 'var(--color-accent)' }}
                    >
                        {isMetric ? 'Go Back to Freedom Units 🦅' : 'Switch to Metric'}
                    </button>
                </div>
                {/* City Toggle */}
                <div className="flex gap-4 mb-10">
                    {cities.map(city => (
                        <button
                            key={city.name}
                            onClick={() => setSelectedCity(city)}
                            className="px-4 py-2 rounded-xl border transition-all"
                            style={{
                                borderColor:
                                    selectedCity.name === city.name
                                        ? 'var(--color-accent)'
                                        : 'var(--color-border)',
                                color:
                                    selectedCity.name === city.name
                                        ? 'var(--color-accent)'
                                        : 'var(--color-text)',
                            }}
                        >
                            {city.name}
                        </button>
                    ))}
                </div>

                {/* Current Conditions */}
                <section className="mb-16 p-6 rounded-2xl border bg-white/5" style={{ borderColor: 'var(--color-border)' }}>
                    <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
                        Current Conditions
                    </h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div>
                            <div className="text-5xl font-bold" style={{ color: 'var(--color-accent)' }}>
                                {data.current_weather.temperature.toFixed(1)}°
                            </div>
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
                        <div className="text-sm opacity-60">
                            {decodeWeather(data.current_weather.weathercode)}
                        </div>
                    </div>
                </section>

                {/* 24 Hour Temperature Graph */}
                <section className="mb-16">
                    <div className="flex justify-between items-baseline mb-4">
                        <h2 className="text-xl" style={{ color: 'var(--color-text)' }}>24h Temperature Trend</h2>
                        <span className="text-sm opacity-60">{getTodayDate()}</span>
                    </div>
                    <div className="p-4 rounded-2xl border bg-white/5" style={{ borderColor: 'var(--color-border)' }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis 
                                    dataKey="time" 
                                    stroke="rgba(255,255,255,0.5)"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis 
                                    stroke="rgba(255,255,255,0.5)"
                                    style={{ fontSize: '12px' }}
                                />
                                <Tooltip content={<CustomTemperatureTooltip />} />
                                <Line 
                                    type="monotone" 
                                    dataKey="temp" 
                                    stroke="var(--color-accent)"
                                    strokeWidth={3}
                                    dot={{ fill: 'var(--color-accent)', r: 4 }}
                                    activeDot={{ r: 6 }}
                                    isAnimationActive={true}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* 24 Hour Precipitation */}
                <section className="mb-16">
                    <div className="flex justify-between items-baseline mb-4">
                        <h2 className="text-xl" style={{ color: 'var(--color-text)' }}>24h Precipitation Probability</h2>
                        <span className="text-sm opacity-60">{getTodayDate()}</span>
                    </div>
                    <div className="p-4 rounded-2xl border bg-white/5" style={{ borderColor: 'var(--color-border)' }}>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis 
                                    dataKey="time" 
                                    stroke="rgba(255,255,255,0.5)"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis 
                                    stroke="rgba(255,255,255,0.5)"
                                    style={{ fontSize: '12px' }}
                                />
                                <Tooltip content={<CustomPrecipTooltip />} />
                                <Bar 
                                    dataKey="precip" 
                                    fill="#3b82f6"
                                    isAnimationActive={true}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* 7 Day Forecast */}
                <section className="mb-16">
                    <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>7 Day Forecast</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {sevenDayForecast.map(({ time, index }: { time: string; index: number }) => (
                            <div key={time} className="p-4 rounded-xl border bg-white/5 flex justify-between items-center" style={{ borderColor: 'var(--color-border)' }}>
                                <div className="w-24">
                                    {new Date(time).toLocaleDateString('en-US', { weekday: 'long' })}
                                </div>
                                <div className="text-sm opacity-60 flex-1 px-4">
                                    {decodeWeather(data.daily.weathercode[index])}
                                </div>
                                <div className="font-mono">
                                    <span style={{ color: 'var(--color-accent)' }}>
                                        {data.daily.temperature_2m_max[index].toFixed(1)}°
                                    </span>
                                    <span className="mx-2 opacity-30">|</span>
                                    <span>
                                        {data.daily.temperature_2m_min[index].toFixed(1)}°
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Live Radar */}
                <section className="mb-16">
                    <h2 className="text-2xl mb-6" style={{ color: 'var(--color-text)' }}>Live Radar</h2>
                    <iframe
                        title="weather radar"
                        src={`https://www.rainviewer.com/map.html?loc=${selectedCity.lat},${selectedCity.lon},6&oFa=0&oC=0&oU=0&oCS=1&oF=0&oAP=1&c=1&o=83&lm=1&layer=radar&sm=1&sn=1`}
                        width="100%" height="500" style={{ border: 'none', borderRadius: '16px' }}
                    />
                </section>

                {/* Nerdy Panel with Graphics */}
                <section className="p-6 rounded-2xl border bg-white/5" style={{ borderColor: 'var(--color-border)' }}>
                    <h2 className="text-2xl mb-6" style={{ color: 'var(--color-text)' }}>Nerdy Atmospheric Stats</h2>
                    
                    {/* Detailed Stats */}
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
