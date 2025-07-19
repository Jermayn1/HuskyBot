const { model, Schema } = require("mongoose");

module.exports = model("welcomeChannel", new Schema({
    GuildId: String,
    ChannelId: String
}));