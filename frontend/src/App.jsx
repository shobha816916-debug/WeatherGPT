import { useState } from 'react';
import axios from 'axios';

function App() {
  const [city, setCity] = useState('Mumbai');
  const [message, setMessage] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [chats, setChats] = useState([]);
  const [dark, setDark] = useState(true);

  const sendMsg = async () => {
    if (!message.trim()) return;
    const userMsg = `${message} (${city})`;
    setChats(prev => [...prev, { from: 'user', text: userMsg }]);
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/api/weather/chat', { city, message });
      setWeather(res.data.weather);
      setChats(prev => [...prev, { from: 'bot', text: res.data.reply }]);
      const fore = await axios.get(`http://localhost:5000/api/weather/forecast/${city}`);
      setForecast(fore.data);
    } catch (err) {
      setChats(prev => [...prev, { from: 'bot', text: "❌ " + (err.response?.data?.reply || "Backend not connected") }]);
    }
  };

  return (
    <div style={{ minHeight:'100vh', background: dark?'#0f0f0f':'#f5f5f5', color: dark?'white':'#111', fontFamily:'Arial', padding:20, transition:'0.3s' }}>
      <div style={{ maxWidth:'700px', margin:'0 auto' }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h2>🌦️ WeatherGPT Pro</h2>
          <button onClick={()=>setDark(!dark)} style={{padding:'6px 12px', borderRadius:20, cursor:'pointer'}}>{dark?'☀️ Light':'🌙 Dark'}</button>
        </div>

        <input value={city} onChange={e=>setCity(e.target.value)} placeholder="Enter City" style={{width:'100%', padding:'12px', borderRadius:10, border:'1px solid #555', marginBottom:15, background: dark?'#222':'white', color: dark?'white':'black'}}/>

        {weather && (
          <div style={{ background: dark?'#1e1e1e':'white', borderRadius:15, padding:20, display:'flex', alignItems:'center', gap:20, boxShadow:'0 4px 20px rgba(0,0,0,0.2)', marginBottom:15 }}>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} width="100" />
            <div>
              <h2 style={{margin:0}}>{weather.name} - {weather.main.temp}°C</h2>
              <p style={{margin:'5px 0', textTransform:'capitalize'}}>{weather.weather[0].description}</p>
              <p style={{margin:0, fontSize:14, opacity:0.8}}>💧 Humidity: {weather.main.humidity}% | 💨 Wind: {weather.wind.speed} m/s | 🌡️ Feels: {weather.main.feels_like}°C</p>
            </div>
          </div>
        )}

        {forecast.length>0 && (
          <div style={{display:'flex', gap:10, overflowX:'auto', marginBottom:15}}>
            {forecast.map((f,i)=>(
              <div key={i} style={{background: dark?'#1e1e1e':'white', padding:10, borderRadius:10, minWidth:90, textAlign:'center'}}>
                <p style={{fontSize:12}}>{new Date(f.dt_txt).toLocaleDateString('en', {weekday:'short'})}</p>
                <img src={`https://openweathermap.org/img/wn/${f.weather[0].icon}.png`} />
                <p style={{margin:0, fontWeight:'bold'}}>{Math.round(f.main.temp)}°C</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ border:'1px solid #555', height:'200px', overflowY:'auto', padding:'10px', background: dark?'black':'#fff', borderRadius:10 }}>
          {chats.map((c,i)=>(
            <div key={i} style={{ textAlign: c.from==='user'?'right':'left', color: c.from==='user'?'#5B9BFF':'#4ADE80', margin:'8px 0' }}>
              <b>{c.from}:</b> {c.text}
            </div>
          ))}
        </div>

        <div style={{ display:'flex', marginTop:'10px', gap:10 }}>
          <input value={message} onKeyDown={e=> e.key==='Enter' && sendMsg()} onChange={e=> setMessage(e.target.value)} placeholder="Ask: rain? humidity? wind?" style={{flex:1, padding:'12px', borderRadius:10, border:'1px solid #555', background: dark?'#222':'white', color: dark?'white':'black'}}/>
          <button onClick={sendMsg} style={{ padding:'12px 20px', background:'#3b82f6', color:'white', border:'none', borderRadius:10, cursor:'pointer' }}>Send</button>
        </div>
      </div>
    </div>
  );
}
export default App;