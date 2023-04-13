import express from "express";
import { getTileLayerUrl } from "#controllers";

const router = express.Router();
router.route("/").get(getTileLayerUrl);

export default router;
