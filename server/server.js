import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { weatherReportRoute, tileLayerRoute } from "#routes";
import { errorMiddleware } from "#middlewares";

// App config
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/weatherReport", weatherReportRoute);
app.use("/tileLayer", tileLayerRoute);

app.use(errorMiddleware);

// Listener
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
