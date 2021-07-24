// import { Link } from 'react-router-dom'
import axios from 'axios'
import React, { useState, useEffect } from 'react'

export function UserPage() {
  let [location, setLocation] = useState(localStorage.getItem('location') || '')
  let [temp, setTemp] = useState(null)
  let [feelsLike, setFeelsLike] = useState(null)
  let [humidity, setHumidity] = useState(null)
  let [windSpeed, setWindSpeed] = useState(null)
  let [gust, setGust] = useState(null)
  let [windDirection, setWindDirection] = useState(null)
  let [clouds, setClouds] = useState(null)
  let [snow, setSnow] = useState({})
  let [rain, setRain] = useState({})
  let [cityName, setCityName] = useState('')

  async function loadWeather() {
    if (isValidZip(location)) {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?zip=${location},us&appid=d1ed4e2246ee255a3e6881943fd96a29`
      )
      if (response.status == 200) {
        localStorage.setItem('savedLocation', location)
        console.log(response.data)
        setTemp(response.data.main.temp)
        setFeelsLike(response.data.main.feels_like)
        setHumidity(response.data.main.humidity)
        setWindSpeed(response.data.wind.speed)
        setWindDirection(response.data.wind.deg)
        setCityName(response.data.name)
        setGust(response.data.wind.gust)
        setClouds(response.data.clouds.all)
        if (response.data.rain) {
          setRain(response.data.rain)
        }
        if (response.data.snow) {
          setSnow(response.data.snow)
        }
      }
    } else {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=d1ed4e2246ee255a3e6881943fd96a29`
      )
      if (response.status == 200) {
        localStorage.setItem('savedLocation', location)
        console.log(response.data)
        setTemp(response.data.main.temp)
        setFeelsLike(response.data.main.feels_like)
        setHumidity(response.data.main.humidity)
        setWindSpeed(response.data.wind.speed)
        setWindDirection(response.data.wind.deg)
        setCityName(response.data.name)
        setGust(response.data.wind.gust)
        setClouds(response.data.clouds.all)
        if (response.data.rain) {
          setRain(response.data.rain)
        } else {
          setRain({})
        }
        if (response.data.snow) {
          setSnow(response.data.snow)
        } else {
          setSnow({})
        }
      }
      // else if (response.status == 400 || response.status == 404) {
      //   setTemp(null)
      //   setFeelsLike(null)
      //   setHumidity(null)
      //   setWindSpeed(null)
      //   setGust(null)
      //   setWindDirection(null)
      //   setClouds(null)
      //   setSnow(null)
      //   setRain(null)
      //   setCityName('INVALID LOCATION')
      // }
    }
  }

  function isValidZip(location) {
    return /^\d{5}(-\d{4})?$/.test(location)
  }

  function convertToFahrenheit(temp) {
    if (temp !== null) {
      return ((temp - 273.15) * (9 / 5) + 32).toFixed(2)
    }
  }

  // function renderWeather() {
  //   let weatherEntries = Object.entries(weather)
  //   weatherEntries.map((entry) => {
  //     return (
  //       <li>
  //         {' '}
  //         {entry[0]}: {entry[1]}
  //       </li>
  //     )
  //   })
  // }

  function updateLocation(newLocation) {
    setLocation(newLocation)
    localStorage.setItem('location', newLocation)
  }

  // async function loadFromLatAndLong(lat, long) {
  //   const response = await axios.get(
  //     `api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=d1ed4e2246ee255a3e6881943fd96a29`
  //     )
  //     if (response.status == 200) {
  //       set
  //     }
  // }

  useEffect(function () {
    // let savedLocation = localStorage.getItem('savedLocation')
    // savedLocation ? setLocation(JSON.parse(savedLocation)) : {}
    // if (navigator.geolocation) {
    // navigator.geolocation.getCurrentPosition(position =>{
    // const { latitude, longitude } = position.coords
    // })

    // } else {
    loadWeather()
    // }
  }, [])

  // useEffect(
  //   function () {
  //     localStorage.setItem('location', location)
  //   }[location]
  // )

  return (
    <main>
      <h1>Forecast Finder</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          loadWeather()
        }}
      >
        <input
          type="text"
          placeholder="Zip-code or City Name"
          value={location}
          // onChange={(event) => setLocation(event.target.value)}
          onChange={(event) => updateLocation(event.target.value)}
        />
        <input type="submit" className="search" value="Get Forecast" />
      </form>
      <section className="weatherDisplay">
        <ul>
          <h4>{cityName || location}'s Current Weather</h4>
          <div>
            <label> Temperature:</label>
            <li> {convertToFahrenheit(temp)}℉ </li>
          </div>
          <div>
            <label> Feels Like:</label>
            <li>{convertToFahrenheit(feelsLike)}℉</li>
          </div>
          <div>
            <label> Humidity:</label>
            <li>{humidity}%</li>
          </div>
          <div>
            <label> Wind Speed:</label>
            <li>{windSpeed} meters/second</li>
          </div>
          <div>
            <label> Gust Speed:</label> <li>{gust} meters/second</li>
          </div>
          <div>
            <label> Wind Direction (in degrees): </label>{' '}
            <li>{windDirection}°</li>
          </div>
          <div>
            <label> Cloud Coverage: </label> <li>{clouds}%</li>
          </div>
          {/* <li> Rainfall in Last Hour (in mm): {rain['1h'] || 'N/A'}</li>
          <li> Snowfall in Last Hour (in mm): {snow['1h'] || 'N/A'}</li> */}
        </ul>
        {/* <li> Wind Direction: {convertToNESW(windDirection)}</li> */}
        {/* Wind Speed: {convertToMPH(windSpeed)} miles/hour */}
      </section>
    </main>
  )
}