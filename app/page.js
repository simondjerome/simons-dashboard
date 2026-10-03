"use client";

import { useEffect, useState } from "react";

function weatherText(code) {
  if (code === 0) return "Clear sky";
  if ([1,2,3].includes(code)) return "Partly cloudy";
  if ([45,48].includes(code)) return "Foggy";
  if ([51,53,55,56,57].includes(code)) return "Drizzle";
  if ([61,63,65,66,67].includes(code)) return "Rain";
  if ([71,73,75,77].includes(code)) return "Snow";
  if ([80,81,82].includes(code)) return "Rain showers";
  if ([95,96,99].includes(code)) return "Thunderstorms";
  return "Weather";
}

function weatherIcon(code) {
  if (code === 0) return "☀️";
  if ([1,2,3].includes(code)) return "⛅";
  if ([45,48].includes(code)) return "🌫️";
  if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) return "🌧️";
  if ([71,73,75,77].includes(code)) return "❄️";
  if ([95,96,99].includes(code)) return "⛈️";
  return "🌤️";
}

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [locationName, setLocationName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskError, setTaskError] = useState("");
  const [news, setNews] = useState([]);
  const [newsError, setNewsError] = useState("");
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("dashboard-theme");
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initial = saved || preferred;
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("dashboard-theme", next);
  };

  const loadWeather = () => {
    setWeatherError("");
    if (!navigator.geolocation) {
      setWeatherError("Location isn't available in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
        );
        if (!weatherRes.ok) throw new Error("Weather request failed");
        const data = await weatherRes.json();
        setWeather({ ...data, latitude, longitude });

        try {
          const placeRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (placeRes.ok) {
            const place = await placeRes.json();
            const city = place.city || place.locality || place.principalSubdivision;
            const region = place.principalSubdivision;
            setLocationName(city && region && city !== region ? `${city}, ${region}` : (city || region || ""));
          }
        } catch {}
      } catch {
        setWeatherError("Couldn't load the weather right now.");
      }
    }, () => setWeatherError("Please allow location access to show your local weather."));
  };

  const loadTasks = async () => {
    setLoadingTasks(true);
    try {
      const res = await fetch("/api/tasks", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Task request failed");
      setTasks(data.tasks || []);
      setTaskError("");
    } catch (e) {
      setTaskError(e.message);
    } finally {
      setLoadingTasks(false);
    }
  };

  const loadNews = async () => {
    setLoadingNews(true);
    try {
      const res = await fetch("/api/news", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "News request failed");
      setNews(data.articles || []);
      setNewsError("");
    } catch (e) {
      setNewsError(e.message);
    } finally {
      setLoadingNews(false);
    }
  };

  const completeTask = async (id) => {
    const previous = tasks;
    setTasks(tasks.filter(t => t.id !== id));
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error();
    } catch {
      setTasks(previous);
      alert("Couldn't complete that Todoist task.");
    }
  };

  useEffect(() => {
    loadWeather();
    loadTasks();
    loadNews();
  }, []);

  const today = new Date().toLocaleDateString("en-CA", {
    weekday: "long", month: "long", day: "numeric"
  });

  const weatherLink = weather
    ? "https://www.theweathernetwork.com/en/city/canada/ontario/vaughan/current"
    : "https://www.theweathernetwork.com/en/city/canada/ontario/vaughan/current";

  return (
    <main className="page">
      <header className="header">
        <div>
          <div className="eyebrow">PERSONAL DASHBOARD</div>
          <h1>Simon's Dashboard</h1>
          <p>{today}</p>
        </div>
        <div className="headerActions">
          <button className="iconButton" onClick={toggleTheme} aria-label="Toggle light and dark mode">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button className="refresh" onClick={() => { loadWeather(); loadTasks(); loadNews(); }}>
            ↻ Refresh
          </button>
        </div>
      </header>

      <section className="grid">
        <article className="card weather">
          <div className="cardTop"><h2>🌤️ Weather</h2><span>Today</span></div>
          {weather ? (
            <>
              {locationName && <div className="locationName">📍 {locationName}</div>}
              <div className="weatherMain">
                <div className="weatherIcon">{weatherIcon(weather.current.weather_code)}</div>
                <div>
                  <div className="temp">{Math.round(weather.current.temperature_2m)}°</div>
                  <div className="condition">{weatherText(weather.current.weather_code)}</div>
                </div>
              </div>
              <div className="weatherStats">
                <div><b>Feels like</b><span>{Math.round(weather.current.apparent_temperature)}°</span></div>
                <div><b>High / Low</b><span>{Math.round(weather.daily.temperature_2m_max[0])}° / {Math.round(weather.daily.temperature_2m_min[0])}°</span></div>
                <div><b>Rain chance</b><span>{weather.daily.precipitation_probability_max[0]}%</span></div>
                <div><b>Wind</b><span>{Math.round(weather.current.wind_speed_10m)} km/h</span></div>
              </div>
              <a className="launchButton" href={weatherLink} target="_blank" rel="noreferrer">Open Full Weather ↗</a>
            </>
          ) : <div className="placeholder">{weatherError || "Finding your location…"}</div>}
        </article>

        <article className="card tasks">
          <div className="cardTop"><h2>✅ Today's Tasks</h2><span>{tasks.length}</span></div>
          {loadingTasks ? <div className="placeholder">Loading Todoist…</div> :
           taskError ? <div className="error">{taskError}<small>Add TODOIST_API_TOKEN in your Vercel environment variables.</small></div> :
           tasks.length === 0 ? <div className="placeholder">Nothing due today. Nice work. 🎉</div> :
           <div className="taskList">
             {tasks.map(task => (
               <label className="task" key={task.id}>
                 <input type="checkbox" onChange={() => completeTask(task.id)} />
                 <span className="taskBody">
                   <span className="taskName">{task.content}</span>
                   {task.dueDate && <span className="taskMeta">{new Date(task.dueDate).toLocaleTimeString([], {hour:"numeric", minute:"2-digit"})}</span>}
                 </span>
               </label>
             ))}
           </div>}
          <a className="launchButton" href="https://todoist.com/app/today" target="_blank" rel="noreferrer">Open Todoist ↗</a>
        </article>

        <article className="card news">
          <div className="cardTop"><h2>📰 Latest News</h2><span>CBC</span></div>
          {loadingNews ? <div className="placeholder">Loading headlines…</div> :
           newsError ? <div className="error">{newsError}</div> :
           <div className="newsList">
             {news.map((a, i) => (
               <a className="headline" href={a.link} target="_blank" rel="noreferrer" key={a.link || i}>
                 <span className="newsTitle">{a.title}</span>
                 <span className="newsSource">{a.source}</span>
               </a>
             ))}
           </div>}
        </article>
      </section>

      <footer>Simon’s Dashboard · Version 1.1</footer>
    </main>
  );
}