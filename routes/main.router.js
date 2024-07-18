import express from "express";
import path from "path";
import getAllArtists from "../middleware/getAllArtists.middleware.js";
import fetchSearchResults from "../middleware/fetchSearchResults.middleware.js";
import { getArtist } from "../middleware/getArtist.middleware.js";

const router = express.Router();
router.use(express.static(path.join(process.cwd(), "static")));
router.get("/", getAllArtists, (req, res) => {
  res.render("index", { title: "Home", artists: req.artists });
});

router.get("/artists/:artist", getArtist, (req, res) => {
  res.render("artistpage", { title: "Artist page", artist: req.artists });
});

router.get("/search", fetchSearchResults, async (req, res, next) => {
  res.json(req.result);
});
export default router;
