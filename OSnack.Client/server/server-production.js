const spdy = require('spdy');
const fs = require('fs');
const express = require("express");
const path = require("path");
var compression = require('compression');
const app = express();
const PORT = 8080 || process.env.PORT || 5000;

///********************
///********************
/// HTTPS Configuration 
///********************
///********************
const sslOptions = {
   key: fs.readFileSync(__dirname + '/cert/key.pem'),
   cert: fs.readFileSync(__dirname + '/cert/cert.pem')
};

// compress all responses
app.use(compression());

/// Static file cache Age
app.use(express.static(path.join(__dirname), { maxAge: "3.154e+10" /** One Year **/ }));

/// Routing
app.get("*", function (req, res) {
   res.sendFile(path.join(__dirname, "index.html"));
});

/// Create Https Server
spdy.createServer(sslOptions, app).listen(PORT, (error) => {
   if (error) {
      console.error(error);
      return process.exit(1);
   } else {
      console.log('Listening on port: ' + PORT + '.');
   }
});