import { Router } from "express";
import {
  getClients,
  getClientById,
  createClientHandler,
  updateClientHandler,
  deleteClientHandler,
} from "../controllers/clientController";

const router = Router();

router.get("/", getClients);
router.get("/:id", getClientById);
router.post("/", createClientHandler);
router.put("/:id", updateClientHandler);
router.delete("/:id", deleteClientHandler);

export default router;