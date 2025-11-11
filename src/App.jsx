import { useState, useEffect } from 'react';

const WeatherDetails = ({ icon, temp, city, country, lat, log, humidityl, windl }) => {
  return (
    <>
      <div className="flex justify-center my-6">
        <span className="material-symbols-outlined text-white text-[150px]">
          {icon}
        </span>
      </div>

      <div className="text-white text-8xl font-bold text-center mb-2">{temp}°c</div>
      <div className="text-white text-4xl text-center font-medium mb-4">{city}</div>
      <div className="text-white text-xl text-center">{country}</div>

      <div className="flex justify-center text-white text-sm my-6 space-x-10">
        <div>
          <span className="font-bold mr-2">Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="font-bold mr-2">Longitude</span>
          <span>{log}</span>
        </div>
      </div>

      <div className="w-full h-24 bg-white/10 rounded-xl mt-6 p-4 flex justify-around items-center">
        <div className="flex items-center text-white text-lg">
        
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold">{humidityl}%</div>
            <div className="text-sm">Humidity</div>
          </div>
        </div>

        <div className="h-full w-px bg-white/30 mx-4"></div>
        
        <div className="flex items-center text-white text-lg">
         
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold">{windl} km/h</div>
            <div className="text-sm">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  )
}


function App() {
  const [icon, seticon] = useState("cloud");
  const [temp, settemp] = useState(0);
  const [city, setcity] = useState("Colombo");
  const [country, setcountry] = useState("SL");
  const [lat, setlat] = useState(0);
  const [log, setlog] = useState(0);
  const [humidityl, sethumidityl] = useState(0);
  const [windl, setwindl] = useState(0);
  const [text, settext] = useState("Colombo");
  const [citynotfound, setcitynotfound] = useState(false);
  const [loading, setloading] = useState(false);

  const weatherIconMap = {
    "01d": "sunny", "01n": "clear_night",
    "02d": "partly_cloudy_day", "02n": "partly_cloudy_night",
    "03d": "cloud", "03n": "cloud",
    "04d": "cloud", "04n": "cloud",
    "09d": "rainy", "09n": "rainy",
    "10d": "rainy", "10n": "rainy",
    "11d": "thunderstorm", "11n": "thunderstorm",
    "13d": "ac_unit", "13n": "ac_unit",
    "50d": "foggy", "50n": "foggy",
  };
 

  const searchWeather = async () => {
    setloading(true);
    setcitynotfound(false);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=efe633ba91fe7321350893e3d1337dd3`;

    try {
      let res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) { setcitynotfound(true); } else { console.error('API error:', res.statusText); }
        setloading(false); return;
      }
      let data = await res.json();
      sethumidityl(data.main.humidity);
      setwindl(data.wind.speed);
      settemp(Math.floor(data.main.temp - 273.15));
      setcity(data.name);
      setcountry(data.sys.country);
      setlat(data.coord.lat);
      setlog(data.coord.lon);
      const iconCode = data.weather[0].icon;
      seticon(weatherIconMap[iconCode] || "cloud");
    } catch (error) {
      console.error("Fetch error:", error.message);
      setcitynotfound(true);
    } finally {
      setloading(false);
    }
  }

  const handlecity = (e) => { settext(e.target.value); }
  const handlekeydown = (e) => { if (e.key === "Enter") { searchWeather(); } }
  useEffect(() => { searchWeather(); }, []);

  return (
    <>
      <div className='flex justify-center items-center min-h-screen bg-gray-900'>
        <div className="w-full max-w-sm p-6 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl shadow-2xl">
          
          <div className="flex items-center bg-white/20 rounded-full p-1.5 backdrop-blur-sm">
            <input
              className='flex-grow bg-transparent text-white placeholder-white/80 p-2 ml-2 focus:outline-none'
              type="text"
              placeholder='Search city...'
              onChange={handlecity}
              value={text}
              onKeyDown={handlekeydown}
            />
            <button 
              className="search-icon p-2 bg-white/30 rounded-full hover:bg-white/50 transition duration-150" 
              onClick={searchWeather}
              aria-label="Search"
            >
              <span className="material-symbols-outlined text-white text-2xl">search</span>
            </button>
          </div>

          {loading && <div className="text-white text-center mt-8 text-xl">Loading...</div>}
          {citynotfound && <div className="text-yellow-300 text-center mt-8 text-xl">City Not Found</div>}
          
          {!loading && !citynotfound && (
            <WeatherDetails
              icon={icon}
              temp={temp}
              city={city}
              country={country}
              log={log}
              lat={lat}
              humidityl={humidityl}
              windl={windl}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default App;