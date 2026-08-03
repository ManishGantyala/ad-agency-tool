import { Router } from "express";
import { getCampaigns, getCampaignById, createCampaignHandler, updateCampaignHandler, deleteCampaignHandler } from "../controllers/campaignController";

const router = Router();

router.get("/", getCampaigns);
router.get("/:id", getCampaignById);
router.post("/", createCampaignHandler);
router.put("/:id", updateCampaignHandler);
router.delete("/:id", deleteCampaignHandler);

export default router;