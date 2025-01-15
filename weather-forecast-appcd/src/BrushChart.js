import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const BrushChart = ({ lat, lon, cityName }) => {
  const [series, setSeries] = useState([]);
  const [minY, setMinY] = useState(null);
  const [maxY, setMaxY] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const apiKey = 'c0b407bf72e34543a8765220241109';
      const today = new Date();
      const dataPromises = [];

      for (let i = 0; i < 5; i++) {
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - i);
        const formattedDate = pastDate.toISOString().split('T')[0];

        const url = `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${lat},${lon}&dt=${formattedDate}`;
        dataPromises.push(fetch(url).then(response => response.json()));
      }

      try {
        const weatherData = await Promise.all(dataPromises);
        const data = [];

        weatherData.forEach(dayData => {
          if (dayData.forecast && dayData.forecast.forecastday) {
            const temp = dayData.forecast.forecastday[0].day.avgtemp_c;
            const date = new Date(dayData.forecast.forecastday[0].date).getTime();
            data.push({ x: date, y: temp });
          }
        });

        // Set temperature data
        setSeries([{ name: 'Temperature', data }]);

        // Set min and max Y values
        const temperatures = data.map(point => point.y);
        setMinY(Math.min(...temperatures) - 5); // Add some padding
        setMaxY(Math.max(...temperatures) + 5); // Add some padding
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    if (lat && lon) {
      fetchWeatherData();
    }
  }, [lat, lon]);

  const options = {
    chart: {
      id: 'chart1',
      type: 'line',
      zoom: {
        enabled: true,
      },
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      title: {
        text: 'Temperature (°C)',
      },
      min: minY,
      max: maxY,
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    title: {
      text: `Temperature Data for ${cityName}`,
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
      },
    },
  };

  return (
    <div>
      <ReactApexChart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default BrushChart;
