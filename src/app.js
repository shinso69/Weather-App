const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const hbs = require("hbs");

const geocode = require("../utils/geocode");
const forecast = require("../utils/forecast");

const app = express();
dotenv.config({ path: "./config/config.env" });
const port = process.env.PORT || 3000;

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Set up handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Set up static directory
app.use(express.static(publicDirectoryPath));

// ROUTES
// Render Routes
app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Armando Santos"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Armando Santos"
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    msg: "This is the Help Page",
    name: "Armando Santos"
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Address must be provided"
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          res.send({ error });
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address
        });
      });
    }
  );
});

// 404 Page
app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404 Help",
    msg: "Help article not found!",
    name: "Armando Santos"
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    msg: "Page not Found!",
    name: "Armando Santos"
  });
});

// Initialize server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
