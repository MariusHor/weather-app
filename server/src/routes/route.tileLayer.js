import express from "express";
const router = express.Router();
import { getTileLayerUrl } from "../controllers/controller.tileLayer.js";

router.route("/").get(getTileLayerUrl);

export default router;
