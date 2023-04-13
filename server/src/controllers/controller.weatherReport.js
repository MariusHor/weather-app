import { fetchWeatherAPI, fetchWeatherAPIMultiple } from "#utils";

export const getCoordinates = async (req, res, next) => {
  const { query } = req.params;

  try {
    const data = await fetchWeatherAPI({
      path: "geo/1.0/",
      params: `direct?q=${query}&limit=5`,
    });

    if (!data.length) {
      throw new Error(
        `Could not find a weather report for query "${query}". Please try another one!`
      );
    }

    const { lat, lon } = data[0];

    res.status(200).json({ lat, lon });
  } catch (error) {
    next(error);
  }
};

export const getPositionName = async (req, res, next) => {
  const { lat, lon } = req.params;

  try {
    const data = await fetchWeatherAPI({
      path: "geo/1.0/",
      params: `reverse?lat=${lat}&lon=${lon}&limit=5`,
    });

    if (!data.length || !data[0].name) {
      throw new Error(
        `Could not find location with coordinates (${lat}, ${lon}). Please try another one!`
      );
    }

    const { name, country } = data[0];

    res.status(200).json({
      locality: name,
      country,
    });
  } catch (error) {
    next(error);
  }
};

export const getWeatherReport = async (req, res, next) => {
  const { lat, lon } = req.params;

  const urlsOptions = [
    {
      path: "data/2.5/",
      params: `weather?lat=${lat}&lon=${lon}&units=metric`,
    },
    {
      path: "data/2.5/",
      params: `forecast?lat=${lat}&lon=${lon}&units=metric`,
    },
  ];

  try {
    const data = await fetchWeatherAPIMultiple(urlsOptions);

    if (!data.length) {
      throw new Error(
        `Could not find a weather report for coordinates (${lat}, ${lon}). Please try another one!`
      );
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
