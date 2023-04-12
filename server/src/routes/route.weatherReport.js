import express from "express";
const router = express.Router();
import {
  getCoordinates,
  getPositionName,
  getWeatherReport,
} from "../controllers/controller.weatherReport.js";

router.route("/coords/:query").get(getCoordinates);
router.route("/positionName/:lat&:lon").get(getPositionName);
router.route("/report/:lat&:lon").get(getWeatherReport);

export default router;
