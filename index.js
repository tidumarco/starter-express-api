const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();
app.use(express.static("build"));
app.use(express.json());
app.use(cors());

app.use(morgan("tiny"));

app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);

app.get("/api/persons", (request, response) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then((person) => {
      response.json(person);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  //   if (!body.name || !body.number) {
  //     return response.status(400).json({
  //       error: "name or number missing",
  //     });
  //   }

  //   if (persons.find((person) => person.name === body.name)) {
  //     return response.status(400).json({
  //       error: "name already in database",
  //     });
  //   }
  const person = new Person({
    name: body.name,
    number: body.number,
    // id: generateId(),
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const body = request.body;
  Person.findByIdAndUpdate(id, body, {
    new: true,
  })
    .then((person) => {
      response.json(person);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
