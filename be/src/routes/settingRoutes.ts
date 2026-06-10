import express from "express";
import { getSetting, updateSetting } from "../controllers/settingController";

const router = express.Router();

router.get("/:key", getSetting);
router.put("/:key", updateSetting);

export default router;
