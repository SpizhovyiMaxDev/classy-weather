import React from "react";


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
  
  function convertToFlag(countryCode) {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  }
  
  function formatDay(dateStr) {
    return new Intl.DateTimeFormat("en", {
      weekday: "short",
    }).format(new Date(dateStr));
  }
  

class App extends React.Component{
    state = {
        location:"West Kelowna",
        isLoading:false,
        displayLocation:'',
        weather:{},
    };

    fetchWeather = async () => {
        try {
            this.setState({isLoading:true})
            // 1) Getting location (geocoding)
            const geoRes = await fetch(
              `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`
            );
            const geoData = await geoRes.json();
            console.log(geoData);
        
            if (!geoData.results) throw new Error("Location not found");
        
            const { latitude, longitude, timezone, name, country_code } =
              geoData.results.at(0);

            this.setState({displayLocation:`${name} ${convertToFlag(country_code)}`})
        
            // 2) Getting actual weather
            const weatherRes = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
            );
            const weatherData = await weatherRes.json();
            this.setState({weather:weatherData.daily});
          } catch (err) {
            console.error(err);
          } finally {
            this.setState({isLoading:false});
          }
    }

    setLocation = (e) => this.setState({location: e.target.value})

    /****************************************  3:36  ***************************************************/
    // useEffect []
    componentDidMount(){
        this.fetchWeather();
    }

    // gives acces to the previous methods, and previous props.And this method called on re-renders
    // useEffect [location]
    componentDidUpdate(prevProps, prevSate){
        if(this.state.location !== prevSate.location){
            this.fetchWeather();
        }
    }
    /*******************************************************************************************/

    render(){
        return <div className="app">
              <h1>Classy Weather</h1>
                <Input location = {this.state.location} onChangeLocation = {this.setLocation} /> 
              <button onClick={this.fetchWeather}>
                Get Weather
              </button>

              {this.state.isLoading && <p className = "loader">Loading...</p> }
              {this.state.weather.weathercode && <Weather weather = {this.state.weather} location = {this.state.displayLocation}/> }
        </div>
    }
}

export default App;



class Weather extends React.Component{
    render(){
        const {
            temperature_2m_max: max,  
            temperature_2m_min: min, 
            time:dates, 
            weathercode:codes 
        } = this.props.weather;

        return <div> 
            <h2>Weather {this.props.location}</h2>
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
                    /> 
                ))
               }
            </ul>
        </div> 
    }
}


class Day extends React.Component{
    render(){
        const {date, max, min, time, code, isToday} = this.props;
        return <li class = "day">
            <span>{getWeatherIcon(code)}</span>
            <p>{!isToday ? formatDay(date) : "Today"}</p>
            <p>{min.toFixed(1)} &deg; &mdash; {min.toFixed(1)}&deg;</p>
        </li>
    }
}

class Input extends React.Component{
    render(){
        return <div> 
        <input 
          type = "text" 
          placeholder="Search for location..." 
          value={this.props.location} 
          onChange = {this.props.onChangeLocation}
        /> 
    </div> 
    }
}