const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs');
let path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, './uploads')));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to LemonMood server application." });
});

require("./app/routes/user.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 19090;
app.listen(PORT, () => {
  console.log(`LemonMood Server is running on port ${PORT}.`);
});
