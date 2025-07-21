mongoose = require("mongoose");

const sponsorSchema = new mongoose.Schema({
 name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hash later
});

module.exports = mongoose.models.Sponsor|| mongoose.model('Sponsor', sponsorSchema);

