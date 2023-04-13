import { API_MAPTILER_URI } from "#utils";

const getTileLayerUrl = async (req, res, next) => {
  try {
    const tileLayerUrl = `${API_MAPTILER_URI}maps/streets-v2/{z}/{x}/{y}.png?key=${process.env.MAP_TILER_KEY}`;

    res.json({ tileLayerUrl });
  } catch (error) {
    next(error);
  }
};

export default getTileLayerUrl;
