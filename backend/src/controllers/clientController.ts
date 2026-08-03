import { Request, Response } from "express";
import {
  getAllClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
} from "../services/clientService";

export const getClients = async (
  req: Request,
  res: Response
) => {
  const clients = await getAllClients();

  res.json(clients);
};

export const getClientById = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);

  const client = await getClient(id);

  if (!client) {
    return res.status(404).json({
      message: "Client not found",
    });
  }

  res.json(client);
};

export const createClientHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email } = req.body;

    const client = await createClient(name, email);

    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({
      message: (error as Error).message,
    });
  }
};

export const updateClientHandler = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);
  const { name, email } = req.body;

  const client = await updateClient(
    id,
    name,
    email
  );

  if (!client) {
    return res.status(404).json({
      message: "Client not found",
    });
  }

  res.json(client);
};

export const deleteClientHandler = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);

  const deleted = await deleteClient(id);

  if (!deleted) {
    return res.status(404).json({
      message: "Client not found",
    });
  }

  res.status(204).send();
};