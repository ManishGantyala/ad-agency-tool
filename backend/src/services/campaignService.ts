import prisma from "../lib/prisma";

export const getAllCampaigns = async () => {
  return await prisma.campaign.findMany();
};

export const getCampaign = async (id: number) => {
  return await prisma.campaign.findUnique({
    where: {
      id,
    },
  });
};

export const createCampaign = async (
  name: string,
  budget: number,
  clientId: number
) => {
  if (!name || name.trim() === "") {
    throw new Error("Campaign name is required");
  }

  if (budget <= 0) {
    throw new Error("Budget must be greater than 0");
  }

  return await prisma.campaign.create({
    data: {
      name,
      budget,
      clientId,
    },
  });
};

export const updateCampaign = async (
  id: number,
  name: string,
  budget: number
) => {
  try {
    return await prisma.campaign.update({
      where: {
        id,
      },
      data: {
        name,
        budget,
      },
    });
  } catch {
    return null;
  }
};

export const deleteCampaign = async (id: number) => {
  try {
    await prisma.campaign.delete({
      where: {
        id,
      },
    });

    return true;
  } catch {
    return null;
  }
};