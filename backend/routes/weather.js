 const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/chat', async (req,res)=>{
  const {city, message} = req.body;
  try{
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const {data} = await axios.get(url);
    let reply = `Currently in ${city}: ${data.main.temp}°C, ${data.weather[0].description}.`;
    res.json({reply, weather: data});
  }catch(e){
    res.status(400).json({reply: 'City not found'});
  }
});

router.get('/forecast/:city', async (req,res)=>{
  try{
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${req.params.city}&appid=${apiKey}&units=metric`;
    const {data} = await axios.get(url);
    const daily = data.list.filter(i=> i.dt_txt.includes('12:00:00')).slice(0,5);
    res.json(daily);
  }catch(e){
    res.status(400).json({error: 'Forecast not found'});
  }
});
module.exports = router;