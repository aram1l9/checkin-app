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

app.get("/api/places/:guestId", async (req, res) => {
  const guestUuid = req.params.guestId;

  let user = await knex("users").where("tmp_id", guestUuid);
  console.log(user, "user");
  let userId;
  if (user.length === 0) {
    const newUserID = await addNewUser(guestUuid);
    if (!!newUserID) {
      userId = newUserID;
    }
  } else {
    userId = user[0].id;
  }
  try {
    const data = await knex("places")
      .leftJoin("user_places", function () {
        this.on("places.id", "=", "user_places.place_id").andOn(
          "user_places.user_id",
          "=",
          userId
        );
      })
      .select(
        "places.id",
        "places.title",
        knex.raw(`(SELECT array_to_json(array_agg(row_to_json(t)))
  FROM (
    SELECT users.id, users.name
    FROM users
    JOIN user_places ON users.id = user_places.user_id
    WHERE user_places.place_id = places.id
  ) t
) AS user_names`)
      )
      .select(
        knex.raw(`
(CASE 
  WHEN user_places.id IS NOT NULL THEN 'true'
  ELSE 'false'
END) AS isChecked
`)
      )
      .groupBy("places.id", "user_places.user_id", "user_places.id");

    return res.status(200).json(data);
  } catch (err) {
    console.log(err, "err");
    return res.status(400).json({ error: true, err });
  }
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
        const data = await knex("user_places")
          .insert({
            user_id: userId,
            place_id: placeId,
          })
          .returning("user_id");
        return res.status(201).json(data);
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
