const moment = require("moment");

const { User, Match } = require("../../models");

const verifyAndCreateMatch = async (req, res) => {
  try {
    const { selectedUserId } = req.body;
    const { id: loggedInUser } = req.session.user;

    const match = await Match.findOne({
      where: {
        match_request_to: loggedInUser,
        match_request_from: selectedUserId,
      },
    });

    console.log(match);

    if (!match) {
      await Match.create({
        match_request_from: loggedInUser,
        match_request_to: selectedUserId,
      });

      return res.json({ success: true, data: { status: "MATCH INITIATED" } });
    } else {
      await Match.update(
        { matched: true, accepted_date: moment() },
        {
          where: {
            id: match.get("id"),
          },
        }
      );

      return res.json({ success: true, data: { status: "MATCHED" } });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to create match" });
  }
};

const deleteMatchById = (req, res) => {};

module.exports = { verifyAndCreateMatch, deleteMatchById };
