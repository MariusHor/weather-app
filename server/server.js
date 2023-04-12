import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import WeatherReportRoute from "./src/routes/route.weatherReport.js";
import TileLayerRoute from "./src/routes/route.tileLayer.js";
import { errorMiddleware } from "./src/middlewares/errorMiddleware.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/weatherReport", WeatherReportRoute);
app.use("/tileLayer", TileLayerRoute);
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
