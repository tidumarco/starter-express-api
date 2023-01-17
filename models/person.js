require("dotenv").config();
const mongoose = require("mongoose");
const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{3}/.test(v) && v.replace(/-/g, "").length >= 9;
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, "User phone number required."],
  },
});
const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: String,
  number: String,
  date: new Date(),
});

let error = person.validateSync();

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
