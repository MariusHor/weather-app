import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { weatherReportRoute, tileLayerRoute } from "#routes";
import { errorLogger, errorResponder } from "#middlewares";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/weatherReport", weatherReportRoute);
app.use("/tileLayer", tileLayerRoute);

app.use(errorLogger);
app.use(errorResponder);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
