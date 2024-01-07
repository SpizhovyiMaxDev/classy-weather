import React from "react";
import * as model from "../functions/model.js"

class Day extends React.Component{
    render(){
        const {date, max, min, time, code, isToday} = this.props;
        return <li className = "day">
            <span>{model.getWeatherIcon(code)}</span>
            <p>{!isToday ? model.formatDay(date) : "Today"}</p>
            <p>{time}</p>
            <p>{min.toFixed(1)} &deg; &mdash; {max.toFixed(1)}&deg;</p>
        </li>
    }
}

export default Day


function getWeatherIcon(wmoCode) {
    const icons = new Map([
      [[0], "☀️"],
      [[1], "🌤"],
      [[2], "⛅️"],
      [[3], "☁️"],
      [[45, 48], "🌫"],
      [[51, 56, 61, 66, 80], "🌦"],
      [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
      [[71, 73, 75, 77, 85, 86], "🌨"],
      [[95], "🌩"],
      [[96, 99], "⛈"],
    ]);
    const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
    if (!arr) return "NOT FOUND";
    return icons.get(arr);
  }
