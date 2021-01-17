const express = require("express");
const path = require("path");
var compression = require('compression');
const app = express();
const PORT = process.env.PORT || 5000;

// compress all responses
app.use(compression());

/// Static file cache Age
app.use(express.static(path.join(__dirname), { maxAge: "3.154e+10" /** One Year **/ }));

/// Routing
app.get("*", function (req, res) {
   res.sendFile(path.join(__dirname, "index.html"));
});

/// Create Https Server
app.listen(PORT);
