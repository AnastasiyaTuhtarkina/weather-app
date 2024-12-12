import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const WeatherApp = () => {
    const [city, setCity] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState('');
    const [view, setView] = useState('current');

    const API_KEY = 'c02afb80669f2c81e3073d9c69f0c664'; // Замените на ваш реальный API ключ

    useEffect(() => {
        if (view === 'current' && latitude && longitude) {
            axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=ru`)
                .then(response => {
                    setWeatherData(response.data);
                    setError('');
                })
                .catch(err => {
                    setError('Не удалось получить данные о погоде.');
                    console.error(err);
                });
        } else if (view === 'forecast' && latitude && longitude) {
            axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=ru`)
                .then(response => {
                    setWeatherData(response.data);
                    setError('');
                })
                .catch(err => {
                    setError('Не удалось получить данные о погоде.');
                    console.error(err);
                });
        }
    }, [view, latitude, longitude]);

    const getDailyForecast = (forecastData) => {
      const dailyData = {};
  
      forecastData.list.forEach(item => {
          const date = item.dt_txt.split(' ')[0]; // Получаем исключительно дату
          if (!dailyData[date]) {
              dailyData[date] = {
                  temp: item.main.temp,
                  description: item.weather[0].description,
                  icon: item.weather[0].icon // Добавляем иконку
              };
          }
      });

        return Object.keys(dailyData).slice(0, 5).map(date => ({
            date,
            ...dailyData[date],
        }));
    };

    const handleCityChange = (e) => {
        setCity(e.target.value);
    };

    const getCoordinates = () => {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&lang=ru`)
            .then(response => {
                setLatitude(response.data.coord.lat);
                setLongitude(response.data.coord.lon);
                setError('');
            })
            .catch(err => {
                setError('Не удалось найти город.');
                console.error(err);
            });
    };

    const forecast = weatherData && view === 'forecast' ? getDailyForecast(weatherData) : null;

    return (
        <div class="centered-container">
          <h1>Информация о Погоде</h1>
          <div class="input-container">
            <input
                type="text"
                placeholder="Введите название города"
                value={city}
                onChange={handleCityChange}
            />
          </div>
          <div>
              <button onClick={() => setView('current')}>Сейчас</button>
              <button onClick={() => setView('forecast')}>Ближайшие 5 дней</button>
          </div>
          <button onClick={getCoordinates}>Получить погоду</button>
          {error && <p className="error">{error}</p>}
          {view === 'current' && weatherData && (
              <div>
                  <h2>Текущая погода в {weatherData.name}</h2>
                  <img 
                        src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`} 
                        alt={weatherData.weather[0].description}
                  />
                  <p>Температура: {weatherData.main.temp}°C</p>
                  <p>Описание: {weatherData.weather[0].description}</p>
              </div>
          )}
          {view === 'forecast' && forecast && (
        <div className="forecast-container">
        <h4>Прогноз погоды на 5 дней</h4>
        <div className="forecast-items">
            {forecast.map(day => (
                <div key={day.date} className="forecast-day">
                    <h3>{new Date(day.date).toLocaleDateString("ru-RU", { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' })}</h3>
                    <img
                        src={`http://openweathermap.org/img/wn/${day.icon}.png`}
                        alt={day.description}
                    />
                    <p>Температура: {day.temp}°C</p>
                    <p>Описание: {day.description}</p>
                </div>
            ))}
        </div>
    </div>
)}
      </div>
  );
};

export default WeatherApp;