const config = require("../knexfile");
const knex = require("knex")(config);

const addNewUser = async (tmpId) => {
  try {
    const data = await knex("users")
      .insert({
        name: `User ${tmpId}`,
        tmp_id: tmpId,
      })
      .returning("id");

    return data[0].id;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = { addNewUser };
