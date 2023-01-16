const mongoose = require("mongoose");

const url = `mongodb+srv://fullstack:${password}@cluster0.reu4zpj.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: nameInput,
  number: numberInput,
  date: new Date(),
});

if (nameInput && numberInput) {
  person.save().then((result) => {
    console.log(`added ${nameInput} number ${numberInput} to the phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({})
    .then((result) => {
      console.log("Phonebook");
      result.forEach((person) => {
        console.log(person.name + " " + person.number);
      });
      mongoose.connection.close();
    })
    .catch((err) => console.log(err));
}
