import express from "express";
import { getSetting, updateSetting } from "../controllers/settingController";
import { authenticate, authorize } from '../middlewares/authorize';
import { ROLES } from '../utils/roles';

const router = express.Router();

router.get("/:key", getSetting);
router.put("/:key", authenticate, authorize([ROLES.ADMIN, ROLES.STAFF]), updateSetting);

export default router;
