import fetch from "node-fetch";

import { API_WEATHER_URI } from "./constants.js";

export const fetchWeatherAPI = async (urlOptions) => {
  try {
    const response = await fetch(
      `${API_WEATHER_URI}${urlOptions.path}${urlOptions.params}&appid=${process.env.API_WEATHER_KEY}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchWeatherAPIMultiple = async (urlsOptions) => {
  try {
    const data = await Promise.all(
      urlsOptions.map((urlOptions) =>
        fetchWeatherAPI(urlOptions, {
          cache: "force-cache",
          headers: {
            "Cache-Control": "public, max-age=600",
          },
        })
      )
    );

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
