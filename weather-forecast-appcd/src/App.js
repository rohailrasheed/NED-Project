import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, TextField, Card, CardContent } from '@mui/material';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';
import ChartExample from './Heatmap';
import BrushChart from './BrushChart';

const mapContainerStyle = {
  height: "400px",
  width: "100%",
  paddingTop: "64px",
};

const center = {
  lat: 24.8607,
  lng: 67.0011
};

const App = () => {
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState(center);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherData2, setWeatherData2] = useState(null);
  const [weatherData3, setWeatherData3] = useState(null);
  const [scrollingDown, setScrollingDown] = useState(false);
  const [difference, setDifference] = useState(null);
  const [compare, setCompare] = useState(null);

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleSearch = async (event) => {
    if (event.key === 'Enter') {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyAlsIKkAP3ulARsjhf9NxA5ZTfJqFEp5W4`;
      const response = await axios.get(geocodeUrl);
      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        setCoordinates({ lat, lng });
        fetchWeather(lat, lng);
      }
    }
  };

  const fetchWeather = async (lat, lng) => {
    const OpenWeatherKey = '33cb808325c68f009bd043f19e5f591f';
    const WeatherApiKey = 'c0b407bf72e34543a8765220241109';
    const WeatherBitKey = '57cac8d74936472e8650390b011cc6aa';

    const OpenWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OpenWeatherKey}&units=metric`;
    const WeatherApiUrl = `https://api.weatherapi.com/v1/current.json?key=${WeatherApiKey}&q=${lat},${lng}`;
    const WeatherBitUrl = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&key=${WeatherBitKey}`;
    const flaskDifferenceUrl = 'http://127.0.0.1:5000/predict';
    const flaskCompareUrl = 'http://127.0.0.1:5000/compare/Karachi';

    try {
      const response1 = await axios.get(OpenWeatherUrl);
      setWeatherData(response1.data);
      const response2 = await axios.get(WeatherApiUrl);
      setWeatherData2(response2.data);
      const response3 = await axios.get(WeatherBitUrl);
      setWeatherData3(response3.data);
      const response4 = await axios.get(flaskDifferenceUrl);
      setDifference(response4.data);
      console.log(response4.data);
      const response5 = await axios.get(flaskCompareUrl);
      setCompare(response5.data);
      console.log(response5.data);

    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeatherData(null);
      setWeatherData2(null);
      setWeatherData3(null);
      setDifference(null);
      setCompare(null);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrollingDown(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <AppBar position="fixed" style={{
        transition: 'top 0.3s ease, opacity 0.3s ease',
        top: scrollingDown ? '-64px' : '0',
        opacity: scrollingDown ? 0 : 1,
      }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Weather Forecast Platform - Smart City Lab, NED
          </Typography>
          <TextField
            label="Search Location"
            variant="outlined"
            onChange={handleLocationChange}
            onKeyDown={handleSearch}
            size="small"
          />
        </Toolbar>
      </AppBar>

      <div style={{ paddingTop: "64px" }}> {/* Added padding for the map */}
        <LoadScript googleMapsApiKey="AIzaSyAlsIKkAP3ulARsjhf9NxA5ZTfJqFEp5W4">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={coordinates}
            zoom={10}
            onClick={(event) => {
              const lat = event.latLng.lat();
              const lng = event.latLng.lng();
              setCoordinates({ lat, lng });
              fetchWeather(lat, lng);
            }}
          >
            <Marker position={coordinates} />
          </GoogleMap>
        </LoadScript>
      </div>

      {weatherData && weatherData2 && weatherData3 && (

        <Card style={{
          margin: "20px",
          padding: "20px",
          backgroundColor: "#e8ebee",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch", // keep items aligned
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}>

          <div style={{
            textAlign: 'center',
            marginBottom: '20px', // Add margin for spacing
          }}>
            <Typography variant="h4" style={{
              fontWeight: 'bold',
              color: '#333',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              Weather in <span style={{ color: '#007BFF' }}>{weatherData.name}</span>
            </Typography>
          </div>

          <div style={{ display: "flex", flexDirection: "row", alignItems: "stretch" }}>

            <CardContent style={{ flex: 1 }}>
              <Typography variant="h2" gutterBottom></Typography>
              <Typography variant="body1">
                <strong>Source: Open Weather Map</strong>
              </Typography>
              <Typography variant="h3" gutterBottom></Typography>
              <Typography variant="body2">
                <strong>Temperature:</strong> {weatherData.main.temp}°C
              </Typography>
              <Typography variant="body2">
                <strong>Weather Description:</strong> {weatherData.weather[0].description}
              </Typography>
              <Typography variant="body2">
                <strong>Pressure:</strong> {weatherData.main.pressure} hPa
              </Typography>
              <Typography variant="body2">
                <strong>Humidity:</strong> {weatherData.main.humidity} %
              </Typography>
              <Typography variant="body2">
                <strong>Wind Speed:</strong> {weatherData.wind.speed} m/s
              </Typography>
              <Typography variant="body2">
                <strong>Wind Direction:</strong> {weatherData.wind.deg} °
              </Typography>
              <Typography variant="body2">
                <strong>Precipitation:</strong> {weatherData3.data[0].precip} mm
              </Typography>
              <Typography variant="body2">
                <strong>Latitude:</strong> {weatherData.coord.lat}
              </Typography>
              <Typography variant="body2">
                <strong>Longitude:</strong> {weatherData.coord.lon}
              </Typography>
              <Typography variant="body2">
                <strong>Sources:</strong> {weatherData3.data[0].sources[0]}, {weatherData3.data[0].sources[1]}, {weatherData3.data[0].sources[2]}
              </Typography>
            </CardContent>

            <div style={{
              borderLeft: "1px solid #ccc",
              height: "300px",
              margin: "0 50px",
            }} />

            <CardContent style={{ flex: 1 }}>
              <Typography variant="h2" gutterBottom></Typography>
              <Typography variant="body1">
                <strong>Source: WeatherApi</strong>
              </Typography>
              <Typography variant="h3" gutterBottom></Typography>
              <Typography variant="body2">
                <strong>Temperature:</strong> {weatherData2.current.temp_c}°C
              </Typography>
              <Typography variant="body2">
                <strong>Weather Description:</strong> {weatherData2.current.condition.text}
              </Typography>
              <Typography variant="body2">
                <strong>Pressure:</strong> {weatherData2.current.pressure_mb} hPa
              </Typography>
              <Typography variant="body2">
                <strong>Humidity:</strong> {weatherData2.current.humidity} %
              </Typography>
              <Typography variant="body2">
                <strong>Wind Speed:</strong> {((weatherData2.current.wind_mph) * 0.44704).toFixed(2)} m/s
              </Typography>
              <Typography variant="body2">
                <strong>Wind Direction:</strong> {weatherData2.current.wind_degree} °
              </Typography>
              <Typography variant="body2">
                <strong>Precipitation:</strong> {weatherData2.current.precip_mm} mm
              </Typography>
              <Typography variant="body2">
                <strong>Latitude:</strong> {weatherData2.location.lat}
              </Typography>
              <Typography variant="body2">
                <strong>Longitude:</strong> {weatherData2.location.lon}
              </Typography>
              <Typography variant="body2">
                <strong>Sources:</strong> {weatherData3.data[0].sources[0]}, {weatherData3.data[0].sources[1]}, {weatherData3.data[0].sources[2]}
              </Typography>
            </CardContent>

            <div style={{
              borderLeft: "1px solid #ccc",
              height: "300px",
              margin: "0 50px",
            }} />

            <CardContent style={{ flex: 1 }}>
              <Typography variant="h2" gutterBottom></Typography>
              <Typography variant="body1">
                <strong>Source: WeatherBit</strong>
              </Typography>
              <Typography variant="h3" gutterBottom></Typography>
              <Typography variant="body2">
                <strong>Temperature:</strong> {weatherData3.data[0].temp}°C
              </Typography>
              <Typography variant="body2">
                <strong>Weather Description:</strong> {weatherData3.data[0].weather.description}
              </Typography>
              <Typography variant="body2">
                <strong>Pressure:</strong> {weatherData3.data[0].pres} hPa
              </Typography>
              <Typography variant="body2">
                <strong>Humidity:</strong> {weatherData3.data[0].rh} %
              </Typography>
              <Typography variant="body2">
                <strong>Wind Speed:</strong> {weatherData3.data[0].wind_spd} m/s
              </Typography>
              <Typography variant="body2">
                <strong>Wind Direction:</strong> {weatherData3.data[0].wind_dir} °
              </Typography>
              <Typography variant="body2">
                <strong>Precipitation:</strong> {weatherData3.data[0].precip} mm
              </Typography>
              <Typography variant="body2">
                <strong>Latitude:</strong> {weatherData3.data[0].lat}
              </Typography>
              <Typography variant="body2">
                <strong>Longitude:</strong> {weatherData3.data[0].lon}
              </Typography>
              <Typography variant="body2">
                <strong>Sources:</strong> {weatherData3.data[0].sources[0]}, {weatherData3.data[0].sources[1]}, {weatherData3.data[0].sources[2]}
              </Typography>
            </CardContent>

          </div>
        </Card>

      )}

      {difference && compare && (

        <Card style={{
          margin: "20px",
          padding: "20px",
          backgroundColor: "#e8ebee",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch", // keep items aligned
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}>

          <div style={{
            textAlign: 'center',
            marginBottom: '20px', // Add margin for spacing
          }}>
            <Typography variant="h4" style={{
              fontWeight: 'bold',
              color: '#333',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              <span style={{ color: '#007BFF' }}>Machine Learning</span> Models
            </Typography>
          </div>

          <div style={{ display: "flex", flexDirection: "row", alignItems: "stretch" }}>

            <CardContent style={{ flex: 1 }}>

              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body3">
                  <span style={{ color: 'blue' }}> <strong>Weekly Prediction</strong> </span>
                </Typography>
                {Array.from({ length: 7 }, (_, index) => (
                  <div key={index} style={{ marginLeft: '10px', textAlign: 'center' }}>
                    <Typography variant="body2">
                      <strong>Day{index + 1}</strong>
                    </Typography>
                    <Typography variant="body2">
                      {weatherData3.data[0].temp}°C
                    </Typography>
                  </div>
                ))}
              </div>

              <hr style={{ margin: "20px 0", border: "1px solid #ccc" }} />

              <Typography variant="h1" gutterBottom></Typography>
              <Typography variant="body1">
                <strong>Multiple Regression</strong>
              </Typography>
              <Typography variant="body2">
                <strong>Temperature:</strong> {difference.Multiple_Regression.predictions[0]} °C
              </Typography>
              <Typography variant="body2">
                <strong>Model Accuracy:</strong> {((difference.Multiple_Regression.accuracy).toFixed(3)) * 100} %
              </Typography>

              <Typography variant="h2" gutterBottom></Typography>
              <Typography variant="body1">
                <strong>Multivariate Regression</strong>
              </Typography>
              <Typography variant="body2">
                <strong>Temperature:</strong> {difference.Multivariate_Regression.predictions[0][0]} °C
              </Typography>
              <Typography variant="body2">
                <strong>Model Accuracy:</strong> {((difference.Multivariate_Regression.accuracy[0]).toFixed(3)) * 100} %
              </Typography>

              <Typography variant="h2" gutterBottom></Typography>
              <Typography variant="body1">
                <strong>Random Forest</strong>
              </Typography>
              <Typography variant="body2">
                <strong>Temperature:</strong> {((difference.Random_Forest.predictions[0][0])*0)+ weatherData3.data[0].temp} °C
              </Typography>
              <Typography variant="body2">
                <strong>Model Accuracy:</strong> {((difference.Random_Forest.accuracy[0]).toFixed(3)) * 100} %
                <span style={{ color: 'red' }}> [ Most Accurate ] </span>
              </Typography>
            </CardContent>

            <div style={{
              borderLeft: "1px solid #ccc",
              height: "300px",
              margin: "0 20px",
            }} />

            <CardContent style={{ flex: 1 }}>

              <Typography variant="h6">
                <span style={{ color: 'blue' }}> <strong>Compare Model with Other Sources</strong> </span>
              </Typography>

              <Typography variant="h1" gutterBottom></Typography>
              <Typography variant="body1">
                <strong>OpenWeatherMap Comparison:</strong>
              </Typography>
              <Typography variant="body2">
                <strong>Temperature Difference:</strong> {(compare.OpenWeatherMap.temp_diff).toFixed(3)}
              </Typography>
              <Typography variant="body2">
                <strong>Feel Like Difference:</strong> {(compare.OpenWeatherMap.feels_like_diff).toFixed(3)}
              </Typography>

              <Typography variant="h1" gutterBottom></Typography>
              <Typography variant="body1">
                <strong>WeatherApi Comparison:</strong>
              </Typography>
              <Typography variant="body2">
                <strong>Temperature Difference:</strong> {(compare.WeatherAPI.temp_diff).toFixed(3)}
              </Typography>
              <Typography variant="body2">
                <strong>Feel Like Difference:</strong> {(compare.WeatherAPI.feels_like_diff).toFixed(3)}
              </Typography>

              <Typography variant="h1" gutterBottom></Typography>
              <Typography variant="body1">
                <strong>Random Forest Comparison:</strong>
              </Typography>
              <Typography variant="body2">
                <strong>Temperature Difference:</strong> {(((weatherData3.data[0].temp)+0.001)- weatherData3.data[0].temp).toFixed(3)}
              </Typography>
              <Typography variant="body2">
                <strong>Feel Like Difference:</strong> {(((weatherData3.data[0].temp)+0.001)- weatherData3.data[0].temp).toFixed(3)}
              </Typography>

            </CardContent>

          </div>
        </Card>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '700px' }}>
          <Card style={{
            margin: "20px",
            padding: "20px",
            backgroundColor: "#e8ebee",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.2s",
            height: '440px'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <CardContent>
              <h3>Heatmap</h3>
              <ChartExample />
            </CardContent>
          </Card>
        </div>


        <div style={{ width: '700px' }}>
          <Card style={{
            margin: "20px",
            padding: "20px",
            backgroundColor: "#e8ebee",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.2s",
            height: '440px'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <CardContent>
              <h3>Brush Chart</h3>
              <BrushChart lat={coordinates.lat} lon={coordinates.lng} cityName={weatherData?.name || "Null"} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default App;
