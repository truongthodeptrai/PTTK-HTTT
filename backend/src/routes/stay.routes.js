const express = require("express");
const StayModel = require("../models/Stay.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const stays = await StayModel.findAll();
    res.json(stays);
  } catch (error) {
    console.error("Failed to load stays:", error);
    res.status(500).json({ message: "Failed to load stays" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const stay = await StayModel.findById(req.params.id);

    if (!stay) {
      return res.status(404).json({ message: "Stay not found" });
    }

    res.json(stay);
  } catch (error) {
    console.error("Failed to load stay:", error);
    res.status(500).json({ message: "Failed to load stay" });
  }
});

module.exports = router;
