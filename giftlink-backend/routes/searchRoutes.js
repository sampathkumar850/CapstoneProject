/* jshint esversion: 8 */
const express = require("express");
const router = express.Router();
const connectToDatabase = require("../models/db");

// Search for gifts
router.get("/", async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("gifts");

    let query = {};

    // Filter by name (partial, case-insensitive match)
    if (req.query.name && req.query.name.trim() !== "") {
      query.name = { $regex: req.query.name, $options: "i" };
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by condition
    if (req.query.condition) {
      query.condition = req.query.condition;
    }

    // Filter by age (max years)
    if (req.query.age_years) {
      query.age_years = { $lte: parseFloat(req.query.age_years) };
    }

    const gifts = await collection.find(query).toArray();
    res.json(gifts);
  } catch (e) {
    console.error("Search failed:", e);
    res.status(500).send("Internal server error during search.");
  }
});

module.exports = router;
