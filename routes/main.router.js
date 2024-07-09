import express from "express";
import getAllArtists from "../middleware/getAllArtists.middleware.js";
const router = express.Router();

router.get("/", getAllArtists, (req, res) => {
  res.render("index", { title: "Home", artists: req.artists });
});

export default router;
