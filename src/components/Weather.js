import React from "react";
import Day from "./Day";

class Weather extends React.Component{
    render(){
        const {
            temperature_2m_max: max,  
            temperature_2m_min: min, 
            time:dates, 
            weathercode:codes 
        } = this.props.weather;

        const {
          main:{
            feels_like,
            humidity,
            pressure, 
            temp,
          },
          weather:{
            0:{
              icon,
              description
            }
          },
          timezone,

        } = this.props.curWeather;


        return <div> 
                <h2>Weather {this.props.location}</h2>
                <div className="day-tab">
                 <img src = {`https://openweathermap.org/img/wn/${icon}@4x.png`} alt = {description}/> 
                  <div className="day-tab-content">
                    <span>Today is {description}</span>
                    <ul>
                      <li>🌡️ Temperature: {temp}&deg;</li>
                      <li>🌡️ Pressure: {pressure} hPa</li>
                      <li>💧 Humidity: {humidity} % </li>
                      <li>😌 Feels like: {feels_like} &deg;C</li>
                      <li>⏰ Timezone: {timezone} UTC</li>
                    </ul>
                  </div>
                </div>
                
            <ul className="weather">
               {
                dates.map((date, i) => (
                    <Day 
                      date = {date} 
                      max = {max.at(i)}
                      min = {min.at(i)}
                      time = {dates.at(i)} 
                      code = {codes.at(i)} 
                      isToday = {i===0}
                      key = {date}
                    /> 
                ))
               }
            </ul>
        </div> 
    }
}

export default Weather