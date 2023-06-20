const express = require("express");
const app = express();
const path = require("path");
const PORT = 3001;

// Import the Pokémon data from your pokemon.js file
const pokemonData = require("./pokemon");

// Set the view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON data
app.use(express.json());

// Index - display a bunch of Pokémon images on the index
app.get("/pokemon", (req, res) => {
  res.render("index", { pokemon: pokemonData });
});

// New - ability to add a new Pokémon
app.get("/pokemon/new", (req, res) => {
  res.render("new");
});

app.post("/pokemon/new", (req, res) => {
  const newPokemon = {
    id: pokemonData.length + 1,
    name: req.body.name,
    type: req.body.type,
    stats: {
      hp: parseInt(req.body.hp),
      attack: parseInt(req.body.attack),
      defense: parseInt(req.body.defense),
    },
  };
  pokemonData.push(newPokemon);
  res.redirect("/pokemon");
});

// Show - separate show pages for each Pokémon, accessible by clicking on a Pokémon's image on the index page
app.get("/pokemon/:id", (req, res) => {
  const id = req.params.id;
  const foundPokemon = pokemonData.find((p) => p.id === id.toString());
  if (foundPokemon) {
    res.render("show", { pokemon: foundPokemon });
  } else {
    res.render("404");
  }
});

// Edit - render the edit form for a specific Pokémon
app.get("/pokemon/:id/edit", (req, res) => {
  const id = req.params.id;
  const foundPokemon = pokemonData.find((p) => p.id === id);
  if (foundPokemon) {
    res.render("edit", { pokemon: foundPokemon });
  } else {
    res.render("404");
  }
});

// Update - update an existing Pokémon
app.post("/pokemon/:id", (req, res) => {
  const id = req.params.id;
  const foundPokemon = pokemonData.find((p) => p.id === id);
  if (foundPokemon) {
    foundPokemon.name = req.body.name;
    foundPokemon.type = req.body.type;
    foundPokemon.img = req.body.img;
    foundPokemon.stats = {
      hp: parseInt(req.body.hp),
      attack: parseInt(req.body.attack),
      defense: parseInt(req.body.defense),
    };
    res.redirect(`/pokemon/${id}`);
  } else {
    res.render("404");
  }
});

// Delete - delete a Pokémon
app.post("/pokemon/:id/delete", (req, res) => {
  const id = req.params.id;
  const pokemonIndex = pokemonData.findIndex((p) => p.id === id);
  if (pokemonIndex !== -1) {
    pokemonData.splice(pokemonIndex, 1);
    res.redirect("/pokemon");
  } else {
    res.render("404");
  }
});
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
