import Papa from 'papaparse';

// Function to fetch and parse CSV data
export const getData = () => {
    return new Promise((resolve, reject) => {
        const csvFilePath = '/Weather Forecasting.csv'; 

        fetch(csvFilePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                console.log("Fetched data:", data); // Check the fetched data
                Papa.parse(data, {
                    header: true,
                    complete: function(results) {
                        console.log("Parsed results:", results); // Check parsed results
                        const formattedData = results.data.map(row => {
                            // Convert temperatures from Fahrenheit to Celsius
                            const temperatureCelsius = Math.round((parseFloat(row.temp) - 32) * 5 / 9);
                            const feelsLikeCelsius = Math.round((parseFloat(row.app_temp) - 32) * 5 / 9);

                            return {
                                description: row.description, // Weather description for x-axis
                                feels_like: feelsLikeCelsius, // Apparent temperature for y-axis in Celsius
                                temperature: temperatureCelsius, // Temperature for grid color in Celsius
                            };
                        });

                        // Take only the first 150 entries
                        const limitedData = formattedData.slice(0, 150);
                        resolve(limitedData);
                    },
                    error: function(error) {
                        reject(error);
                    }
                });
            })
            .catch(error => {
                console.error("Fetch error:", error);
                reject(error);
            });
    });
};
