import { Request, Response } from "express";
import {
  getAllCampaigns,
  getCampaign,
  createCampaign as createCampaignService,
  updateCampaign,
  deleteCampaign,
} from "../services/campaignService";

export const getCampaigns = async (
  req: Request,
  res: Response
) => {
  const campaigns = await getAllCampaigns();

  res.json(campaigns);
};

export const getCampaignById = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);

  const campaign = await getCampaign(id);

  if (!campaign) {
    return res.status(404).json({
      message: "Campaign not found",
    });
  }

  res.json(campaign);
};

export const createCampaignHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, budget, clientId } = req.body;

    const campaign = await createCampaignService(
      name,
      budget,
      clientId
    );

    res.status(201).json(campaign);
  } catch (error) {
    res.status(400).json({
      message: (error as Error).message,
    });
  }
};

export const updateCampaignHandler = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);
  const { name, budget } = req.body;

  const campaign = await updateCampaign(
    id,
    name,
    budget
  );

  if (!campaign) {
    return res.status(404).json({
      message: "Campaign not found",
    });
  }

  res.json(campaign);
};

export const deleteCampaignHandler = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);

  const deleted = await deleteCampaign(id);

  if (!deleted) {
    return res.status(404).json({
      message: "Campaign not found",
    });
  }

  res.status(204).send();
};