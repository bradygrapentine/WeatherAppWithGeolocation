import { Link } from 'react-router-dom'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { logout, isLoggedIn, authHeader, getUserId, getUser } from '../auth'
import ReactMapGL, { Marker, NavigationControl, Popup } from 'react-map-gl'

export function UserPage() {
  const user = getUser()
  const [currentLocation, setCurrentLocation] = useState({})
  const [temp, setTemp] = useState(null)
  const [feelsLike, setFeelsLike] = useState(null)
  const [humidity, setHumidity] = useState(null)
  const [windSpeed, setWindSpeed] = useState(null)
  const [gust, setGust] = useState(null)
  const [windDirection, setWindDirection] = useState(null)
  const [clouds, setClouds] = useState(null)
  const [snow, setSnow] = useState({})
  const [rain, setRain] = useState({})
  const [newLocation, setNewLocation] = useState(
    localStorage.getItem('savedLocationUser') || ''
  )
  // const [cityName, setCityName] = useState('')
  const [userLocations, setUserLocations] = useState([])

  const [viewport, setViewport] = useState({
    latitude: 27.77101804911986,
    longitude: -82.66090611749074,
    zoom: 8,
  })

  // gotta fix search to eliminate duplicate locations

  async function searchForWeather() {
    if (isValidZip(newLocation)) {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?zip=${newLocation},us&appid=d1ed4e2246ee255a3e6881943fd96a29`
      )
      if (response.status === 200) {
        console.log(response.data)
        setTemp(response.data.main.temp)
        setFeelsLike(response.data.main.feels_like)
        setHumidity(response.data.main.humidity)
        setWindSpeed(response.data.wind.speed)
        setWindDirection(response.data.wind.deg)
        setCurrentLocation({
          cityName: response.data.name,
          latitude: response.data.coord.lat,
          longitude: response.data.coord.lon,
        })
        localStorage.setItem('savedLocationUser', response.data.name)

        setGust(response.data.wind.gust)
        setClouds(response.data.clouds.all)
        if (response.data.rain) {
          setRain(response.data.rain)
        }
        if (response.data.snow) {
          setSnow(response.data.snow)
        }
        setViewport({
          latitude: response.data.coord.lat,
          longitude: response.data.coord.lon,
          zoom: 8,
        })
      }
    } else {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${newLocation}&appid=d1ed4e2246ee255a3e6881943fd96a29`
      )
      if (response.status === 200) {
        console.log(response.data)
        setTemp(response.data.main.temp)
        setFeelsLike(response.data.main.feels_like)
        setHumidity(response.data.main.humidity)
        setWindSpeed(response.data.wind.speed)
        setWindDirection(response.data.wind.deg)
        setCurrentLocation({
          cityName: response.data.name,
          latitude: response.data.coord.lat,
          longitude: response.data.coord.lon,
        })
        localStorage.setItem('savedLocationUser', response.data.name)

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
        setViewport({
          latitude: response.data.coord.lat,
          longitude: response.data.coord.lon,
          zoom: 8,
        })
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

  function handleLogout() {
    logout()
    window.location.assign('/')
  }

  function WeatherDisplay() {
    return (
      <>
        <section className="weatherDisplay">
          <ul>
            <h4>{currentLocation.cityName}'s Current Weather</h4>
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
              <label> Gust Speed:</label> <li>{gust || '0'} meters/second</li>
            </div>
            <div>
              <label> Wind Direction (in degrees): </label>{' '}
              <li>{windDirection}°</li>
            </div>
            <div>
              <label> Cloud Coverage: </label> <li>{clouds}%</li>
            </div>
            <div>
              <label> Rainfall in Last Hour (in mm): </label>{' '}
              <li>{rain['1h'] || 'N/A'}</li>
            </div>
            <div>
              <label> Snowfall in Last Hour (in mm):</label>{' '}
              <li>{snow['1h'] || 'N/A'}</li>
            </div>
            <button onClick={(event) => addLocation(event)}>
              Add to Saved Locations
            </button>
          </ul>
          {/* <li> Wind Direction: {convertToNESW(windDirection)}</li>
        Wind Speed: {convertToMPH(windSpeed)} miles/hour */}
          <div className="userPageInner">
            <h4 className="locations">Saved Locations</h4>
            {userLocations
              ? userLocations.map(function (userLocation) {
                  return (
                    <div className="savedLocationsContainer">
                      <button
                        value={userLocation.cityName}
                        onClick={function (event) {
                          searchForWeatherFromSaved(event.target.value)
                        }}
                      >
                        View
                      </button>
                      <h4 className="Saved">{userLocation.cityName}</h4>
                      <button
                        value={userLocation.id}
                        onClick={(event) => deleteLocation(event)}
                      >
                        Delete
                      </button>
                    </div>
                  )
                })
              : null}
          </div>
        </section>
      </>
    )
  }

  async function searchForWeatherFromSaved(savedLocationUser) {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${savedLocationUser}&appid=d1ed4e2246ee255a3e6881943fd96a29`
    )
    if (response.status === 200) {
      console.log(response.data)
      setTemp(response.data.main.temp)
      setFeelsLike(response.data.main.feels_like)
      setHumidity(response.data.main.humidity)
      setWindSpeed(response.data.wind.speed)
      setWindDirection(response.data.wind.deg)
      setCurrentLocation({
        cityName: response.data.name,
        latitude: response.data.coord.lat,
        longitude: response.data.coord.lon,
      })
      localStorage.setItem('savedLocationUser', response.data.name)
      setNewLocation(response.data.name)
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
      setViewport({
        latitude: response.data.coord.lat,
        longitude: response.data.coord.lon,
        zoom: 8,
      })
    }
  }

  // async function getUserPhotoURL() {
  //   if (isLoggedIn()) {
  //     const response = await fetch('/api/Users', {
  //       method: 'GET',
  //       headers: { 'content-type': 'application/json', ...authHeader() },
  //     })
  //     if (response.ok) {
  //       // window.location.assign(`/User/${getUserId()}`)
  //       console.log(response.json())
  //       console.log(userLocations)
  //     }
  //   }
  // }

  function isValidZip(newLocation) {
    return /^\d{5}(-\d{4})?$/.test(newLocation)
  }

  function convertToFahrenheit(temp) {
    if (temp !== null) {
      return ((temp - 273.15) * (9 / 5) + 32).toFixed(2)
    }
  }

  // async function loadFromLatAndLong(lat, long) {
  //   const response = await axios.get(
  //     `api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=d1ed4e2246ee255a3e6881943fd96a29`
  //     )
  //     if (response.status == 200) {
  //       set
  //     }
  // }

  function UserPageHeader() {
    return (
      <header>
        <h1 className="user">Your Forecasts</h1>
        <div className="loginAndSignup">
          {isLoggedIn() && user.photoURL ? (
            <li className="avatar">
              <img
                src={user.photoURL}
                alt={`${user.fullName}'s Avatar`}
                // height="16"
                // width="16"
              />
            </li>
          ) : null}
          <span onClick={handleLogout} className="signup">
            Sign Out
          </span>
        </div>
      </header>
    )
  }

  async function addLocation(event) {
    event.preventDefault()
    if (isLoggedIn()) {
      const response = await fetch('/api/Locations', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...authHeader() },
        body: JSON.stringify(currentLocation),
      })
      if (response.ok) {
        window.location.assign(`/User/${getUserId()}`)
        console.log(response.json())
        console.log(userLocations)
      }
    }
  }

  async function deleteLocation(event) {
    event.preventDefault()
    if (isLoggedIn()) {
      const response = await fetch(`/api/Locations/${event.target.value}`, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json', ...authHeader() },
      })
      if (response.ok) {
        window.location.assign(`/User/${getUserId()}`)
      }
    }
  }

  async function loadWeatherAndLocations() {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${newLocation}&appid=d1ed4e2246ee255a3e6881943fd96a29`
    )
    const locationsResponse = await fetch('/api/Locations', {
      headers: { 'content-type': 'application/json', ...authHeader() },
    })

    if (response.status === 200) {
      console.log(response.data)
      setTemp(response.data.main.temp)
      setFeelsLike(response.data.main.feels_like)
      setHumidity(response.data.main.humidity)
      setWindSpeed(response.data.wind.speed)
      setWindDirection(response.data.wind.deg)
      setGust(response.data.wind.gust)
      setClouds(response.data.clouds.all)
      setCurrentLocation({
        cityName: response.data.name,
        latitude: response.data.coord.lat,
        longitude: response.data.coord.lon,
      })
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
      setViewport({
        latitude: response.data.coord.lat,
        longitude: response.data.coord.lon,
        zoom: 8,
      })
    }

    if (locationsResponse.ok) {
      const locationsResponseJson = await locationsResponse.json()
      setUserLocations(locationsResponseJson)
      console.log(locationsResponseJson)
    }
  }

  useEffect(function () {
    // let savedLocation = localStorage.getItem('savedLocation')
    // savedLocation ? setLocation(JSON.parse(savedLocation)) : {}
    // if (navigator.geolocation) {
    // navigator.geolocation.getCurrentPosition(position =>{
    // const { latitude, longitude } = position.coords
    // })

    // } else {
    loadWeatherAndLocations()
    // }
  }, [])

  return (
    <>
      <UserPageHeader />

      <main className="user">
        <div className="userPage">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              searchForWeather()
            }}
          >
            <input
              type="text"
              placeholder="Zip-code or City Name"
              value={newLocation}
              onChange={(event) => setNewLocation(event.target.value)}
            />
            <input type="submit" className="search" value="Get Forecast" />
          </form>
          <WeatherDisplay />
        </div>
        <section className="map">
          <ReactMapGL
            {...viewport}
            style={{ position: 'absolute' }}
            width="100%"
            height="100%"
            onViewportChange={setViewport}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          >
            <div style={{ position: 'absolute', left: 10 }}>
              <NavigationControl />
            </div>
          </ReactMapGL>
        </section>
      </main>
      <footer></footer>
    </>
  )
}
