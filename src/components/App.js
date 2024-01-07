import React from "react";
import Weather from "./Weather";
import Input from "./Input";
import ErrorMessage from "./ErrorMessage";
import * as model from "../functions/model.js"


class App extends React.Component{
    state = {
        location:"",
        isLoading:false,
        displayLocation:"",
        weather:{},
        curWeather:{},
        error:"",
    };

    fetchWeather = async () => {
        if(this.state.location.length < 2){
          this.setState({displayLocation:"", weather:{}})
        }

        
        try {
            this.setState({error:""});
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

            this.setState({displayLocation:`${name} ${model.convertToFlag(country_code)}`})
        
            // 1) Getting actual list of weather
            const weatherRes = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
            );
            const weatherData = await weatherRes.json();
            this.setState({weather:weatherData.daily});

            // 3) Fetting a weather date for the current day 
            const curWeatherRes = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${this.state.location}&appid=2fcab31b844cf6e2f39455e9fe066105`
            )
            if (!curWeatherRes.ok) throw new Error("Check the name of your city");
            const curWeatherData = await curWeatherRes.json();
            this.setState({curWeather: curWeatherData})
          } catch (err) {
            this.setState({error:err.message})
          } finally {
             this.setState({isLoading:false});
          }
    }

    setLocation = (e) => this.setState({location: e.target.value})

    // Initial render
    componentDidMount(){
        this.setState({location:localStorage.getItem('location') || ""})
    }

    // Re-rendering
    componentDidUpdate(prevProps, prevSate){
        if(this.state.location !== prevSate.location){
            this.fetchWeather();
            localStorage.setItem('location', this.state.location);
        }
    }

    render(){
        return <div className="app">
              <h1>Classy Weather</h1>
                <Input location = {this.state.location} onChangeLocation = {this.setLocation} /> 

              {this.state.isLoading && <p className = "loader">Loading...</p> }
              {!this.state.isLoading && this.state.error && this.state.location.length > 2 && <ErrorMessage message = {this.state.error} />}
              {this.state.weather.weathercode && !this.state.error && !this.state.isLoading && <Weather weather={this.state.weather} location={this.state.displayLocation} curWeather = {this.state.curWeather} />}
        </div>
    }
}

export default App;

