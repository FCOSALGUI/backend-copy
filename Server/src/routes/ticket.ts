import { Router } from "express";
import {
  getAllTickets,
  getTickets,
  createTicket,
  updateTicket,
  updateTicketStatus,
  updateTicketPriority,
  updateTicketAssignee,
  deleteTicket,
} from "../controllers/ticket";
import validateToken from "./validate-token";

const router = Router();

router.get("/", validateToken, getTickets);
router.get("/all", validateToken, getAllTickets);
router.post("/create", validateToken, createTicket);
router.put("/update/:id", validateToken, updateTicket);
router.put("/updateStatus/:id", validateToken, updateTicketStatus);
router.put("/updatePriority/:id", validateToken, updateTicketPriority);
router.put("/updateAssignee/:id", validateToken, updateTicketAssignee);
router.delete("/delete/:id", validateToken, deleteTicket);

export default router;
