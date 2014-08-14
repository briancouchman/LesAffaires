var express = require('express');
var fs = require('fs');
var busboy = require('connect-busboy');
var excel = require('./excel');


var app = express();

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use(busboy());

app.post('/upload', function(req, res) {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading to " + __dirname + '/files/' + filename);
        fstream = fs.createWriteStream(__dirname + '/files/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            console.log("Closing stream");
            excel.parseExcel(__dirname + '/files/' + filename, function(addresses){
              res.send({uploaded: true, fileName: filename, addresses: addresses});
            })
        });
    });
});




console.log("Server running on port 5000");
app.listen(5000);
