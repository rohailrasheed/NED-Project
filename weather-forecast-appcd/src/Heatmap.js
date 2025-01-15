import React, { useState, useEffect } from "react";
import { AgCharts } from "ag-charts-react";
import "ag-charts-enterprise";
import { getData } from './data'; // Ensure this path is correct

const ChartExample = () => {
  const [options, setOptions] = useState(null); // Start with null

  useEffect(() => {
    getData().then(data => {
      console.log("Data retrieved:", data); // Log the data to check

      if (data.length > 0) {
        setOptions({
          data: data,
          title: {
            text: "Heatmap of Apparent Temperature vs Weather Description",
          },
          series: [
            {
              type: "heatmap",
              xKey: "description", // Weather description for x-axis
              xName: "Weather Description",
              yKey: "feels_like", // Apparent temperature for y-axis
              yName: "Apparent Temperature (°C)",
              colorKey: "temperature", // Temperature for grid color
              colorName: "Temperature (°C)",
            },
          ],
          gradientLegend: {
            gradient: {
              thickness: 50,
              preferredLength: 400,
            },
          },
          // Setting the size of the chart
          width: 600,
          height: 365,
          background: {
            fill: 'rgba(255, 255, 255, 0)', // Transparent background
          },
        });
      } else {
        console.error("No data found");
      }
    }).catch(error => {
      console.error("Error fetching data:", error);
    });
  }, []);

  return options ? <AgCharts options={options} /> : <div>Loading...</div>;
};

export default ChartExample;
