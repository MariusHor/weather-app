import express from "express";
import {
  getCoordinates,
  getPositionName,
  getWeatherReport,
} from "#controllers";

const router = express.Router();
router.route("/coords/:query").get(getCoordinates);
router.route("/positionName/:lat&:lon").get(getPositionName);
router.route("/report/:lat&:lon").get(getWeatherReport);

export default router;
