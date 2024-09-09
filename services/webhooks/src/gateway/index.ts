import express from "express";

import crispRoute from "./crisp";
// Routes
import rentalsRoute from "./rentals";
import stripeRoute from "./stripe";


const router = express.Router();

//Endpoints
router.use("/rentals", rentalsRoute);
router.use("/stripe", stripeRoute);
router.use("/crisp", crispRoute);

export default router;
