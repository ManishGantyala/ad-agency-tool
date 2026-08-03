import { Router } from "express";
import { getCampaigns, getCampaignById, createCampaignHandler, updateCampaignHandler, deleteCampaignHandler } from "../controllers/campaignController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getCampaigns);
router.get("/:id", getCampaignById);
router.post("/", authenticate, createCampaignHandler);
router.put("/:id", updateCampaignHandler);
router.delete("/:id", deleteCampaignHandler);

export default router;