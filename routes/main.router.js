import express from "express";
import path from "path";
import getAllArtists from "../middleware/getAllArtists.middleware.js";
import getArtistsAlbums from "../middleware/getArtistsAlbums.middleware.js";
import fetchSearchResults from "../middleware/fetchSearchResults.middleware.js";
const router = express.Router();
router.use(express.static(path.join(process.cwd(), "static")));
router.get("/", getAllArtists, getArtistsAlbums, (req, res) => {
  res.render("index", { title: "Home", artists: req.artists });
});

router.get("/search", fetchSearchResults, async (req, res, next) => {
  res.json(req.result);
});
export default router;
