const router = require("express").Router();
const Game = require("../db").import("../models/game");

router.get("/all", async (req, res) => {
  try {
    const allGame = await Game.findAll({ where: { owner_id: req.user.id } });
    if(!allGame) throw new Error();
    res.status(200).json({
      games: allGame,
      message: "Data fetched.",
    });
  } catch {
    res.status(500).json({
      message: "Data not found",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const gameId = await Game.findOne({
      where: { id: req.params.id, owner_id: req.user.id },
    });
   if(!gameId) throw new Error();
    res.status(200).json({
      game: gameId,
    });
  } catch (err) {
    res.status(500).json({
      message: "Data not found.",
    });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { title, studio, esrb_rating, user_rating, have_played } =
      req.body.game;
    const createGame = await Game.create({
      title,
      owner_id: req.user.id,
      studio,
      esrb_rating,
      user_rating,
      have_played,
    });
    res.status(200).json({
      game: createGame,
      message: "Game created.",
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const { title, studio, esrb_rating, user_rating, have_played } =
      req.body.game;
    const updateGame = await Game.update(
      {
        title,
        studio,
        esrb_rating,
        user_rating,
        have_played,
      },
      {
        where: { id: req.params.id, owner_id: req.user.id },
      }
    );
    if(!updateGame) throw new Error();
    res.status(200).json({
      game: updateGame,
      message: "Successfully updated.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/remove/:id", async (req, res) => {
  try {
    const deleteGame = await Game.destroy({
      where: { id: req.params.id, owner_id: req.user.id },
    });
    if(!deleteGame) throw new Error();
    res.status(200).json({
      game: deleteGame,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
