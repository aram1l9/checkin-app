const express = require("express");
require("dotenv").config();
const cors = require("cors");
const config = require("./knexfile");
const bodyParser = require("body-parser");
const { addNewUser } = require("./controllers/user");
const knex = require("knex")(config);

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  return res.send("Alive");
});

app.get("/api/places", (req, res) => {
  knex
    .select("*")
    .from("places")
    .then((response) => {
      return res.status(200).json(response);
    });
});

app.post("/api/places", async (req, res) => {
  const tmpId = req.body.userId;

  const placeId = req.body.placeId;

  try {
    let userId;
    const existingUser = await knex
      .select("*")
      .from("users")
      .where("tmp_id", tmpId);
    if (existingUser.length === 0) {
      const newUserID = await addNewUser(tmpId);
      if (!!newUserID) {
        userId = newUserID;
      }
    } else {
      userId = existingUser[0].id;
    }

    let isCheckedIn = await knex.select("*").from("user_places").where({
      user_id: userId,
      place_id: placeId,
    });

    console.log(isCheckedIn, "isCheckedIn");

    if (isCheckedIn.length === 0) {
      try {
        await knex("user_places").insert({
          user_id: userId,
          place_id: placeId,
        });
        return res.status(201).json({ success: true });
      } catch (error) {
        return res.status(400).json(error);
      }
    } else {
      return res
        .status(400)
        .json({ message: "Already checked in at this place" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});

app.listen(4000, () => {
  console.log("Server running on portt 4000");
});
