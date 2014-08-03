var express = require('express');
var path = require('path');
var fs = require('fs');

var app = express();

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.post('/upload', function(req, res) {
console.log("req.file -> " + req.file);
console.log("req.body -> " + req.body);
console.log("req.data -> " + req.data);
    var tempPath = req.files.file.path,
    targetPath = path.resolve('./uploadFiles/' + req.files.file.name);
    fs.rename(tempPath, targetPath, function(err) {
        if (err) throw err;
        console.log("Upload completed!");
    });
});


console.log("Server running on port 5000");
app.listen(5000);