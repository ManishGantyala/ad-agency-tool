import prisma from "../lib/prisma";

export const getAllClients = async () => {
  return await prisma.client.findMany();
};

export const getClient = async (id: number) => {
  return await prisma.client.findUnique({
    where: {
      id,
    },
    include: {
      campaigns: true,
    },
  });
};

export const createClient = async (
  name: string,
  email: string
) => {
  if (!name || name.trim() === "") {
    throw new Error("Client name is required");
  }

  if (!email || email.trim() === "") {
    throw new Error("Email is required");
  }

  return await prisma.client.create({
    data: {
      name,
      email,
    },
  });
};

export const updateClient = async (
  id: number,
  name: string,
  email: string
) => {
  try {
    return await prisma.client.update({
      where: {
        id,
      },
      data: {
        name,
        email,
      },
    });
  } catch {
    return null;
  }
};

export const deleteClient = async (id: number) => {
  try {
    await prisma.client.delete({
      where: {
        id,
      },
    });

    return true;
  } catch {
    return null;
  }
};