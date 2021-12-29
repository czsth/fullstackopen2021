import React, { useState, useEffect } from 'react'
import axios from 'axios'

// query hint & box
const Query = ({ query, onQueryChange }) => {
    return (
        <div>
            find countries / regions&nbsp;
            <input
                value={query}
                onChange={onQueryChange}
            />
        </div>
    )
}

// country line
const CountryLine = ({ country, onShowButtonClick }) => {
    return (
        <div>
            {country.name.common}
            <button
                onClick={(event) =>
                    onShowButtonClick(event, country.name.common)}
            >
                show
            </button>
        </div>
    )
}

// country list
const CountryList = ({ countries, onShowButtonClick }) => {
    if (countries.length > 10) {
        return (
            <p>Too many matches, specify another filter</p>
        )
    } else if (countries.length > 1) {
        return (
            <div>
                {countries.map(country =>
                    <CountryLine
                        key={country.name.common}
                        country={country}
                        onShowButtonClick={onShowButtonClick}
                    />
                )}
            </div>
        )
    } else if (countries.length === 1) {
        const focused = countries[0]
        return (
            <CountryDetail country={focused} />
        )
    } else {
        return (
            <div></div>
        )
    }
}

// capital weather
const CapitalWeather = ({ name, latlng }) => {
    const [weatherData, setWeatherData] = useState({})
    useEffect(() => {
        const [lat, lng] = latlng

        const apiKey = process.env.REACT_APP_API_KEY
        const location = `${lng},${lat}`
        const lang = 'en'
        const url = `https://devapi.qweather.com/v7/weather/now?key=${apiKey}&location=${location}&lang=${lang}`

        axios
            .get(url)
            .then(response => {
                setWeatherData(response.data)
                console.log(response.data)
            })
    }, [])

    if (Object.keys(weatherData).length > 0) {

        const temperature = weatherData.now.temp
        const windSpeed = weatherData.now.windSpeed
        const windDirection = weatherData.now.windDir

        return (
            <div>
                <h3>Weather in {name}</h3>

                <p>
                    <strong>temperature: </strong>{temperature} Celsius
                </p>
                <p>
                    <strong>wind: </strong>{windSpeed} mps direction {windDirection}
                </p>
            </div >
        )
    } else {
        return (
            <></>
        )
    }
}

// country detail
const CountryDetail = ({ country }) => {
    console.log(`highlighting ${country.name.common}`)

    return (
        <div>
            <h1>{country.name.common}</h1>

            <table>
                <tbody>
                    {country.capital ?
                        <tr>
                            <td>Capital</td>
                            <td>{country.capital.join(', ')}</td>
                        </tr>
                        :
                        <></>
                    }

                    <tr>
                        <td>Population</td>
                        <td>{country.population}</td>
                    </tr>
                </tbody>
            </table>

            <h3>languages</h3>
            <ul>
                {Object.entries(country.languages).map(([key, value]) => (
                    <li key={key}>{value}</li>
                ))}
            </ul>

            <img src={country.flags.png} alt='flag' />

            <CapitalWeather
                name={
                    country.capital ?
                        country.capital[0]
                        :
                        country.name.common
                }
                latlng={
                    country.capital ?
                        country.capitalInfo.latlng
                        :
                        country.latlng
                }
            />
        </div>
    )
}


const App = () => {
    const [query, setQuery] = useState('')
    const [countries, setCountries] = useState([])

    useEffect(() => {
        console.log('asking promise for countries data')
        axios
            .get('https://restcountries.com/v3.1/all')
            .then(response => {
                console.log('promise fulfilled')
                console.log(`${response.data.length} countries got`)

                setCountries(response.data)
            })
    }, [])

    const countriesToShow = countries
        .filter(country =>
            country.name.common.toLowerCase().includes(
                query.toLowerCase()
            )
        )
        .sort((a, b) => a.name.common.localeCompare(b.name.common))

    const onQueryChange = (event) => {
        console.log('query changed')
        setQuery(event.target.value)
    }

    const onShowButtonClick = (event, countryName) => {
        console.log('show button clicked:', countryName)
        setQuery(countryName)
    }

    return (
        <div>
            <Query query={query} onQueryChange={onQueryChange} />
            <CountryList
                countries={countriesToShow}
                onShowButtonClick={onShowButtonClick}
            />
        </div>
    )
}

export default App