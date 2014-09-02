var express = require('express');
var fs = require('fs');
var busboy = require('connect-busboy');
var bodyParser = require('body-parser');
var excel = require('./excel');
var pdf = require('./pdfSticker');


var app = express();

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(busboy());
app.use(bodyParser.json());

app.post('/upload', function(req, res) {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading to " + __dirname + '/files/' + filename);
        fstream = fs.createWriteStream(__dirname + '/files/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            console.log("Closing stream");
            excel.parseExcel(__dirname + '/files/' + filename,
            function(addresses){
              res.send({uploaded: true, fileName: filename, addresses: addresses});
            },
            function(err){
              res.status(400).send({uploaded: false, error: err});
            })
        });
    });
});

var _PDF_DIR_ = "./pdf/";
var _PDF_EXT_ = ".pdf";

app.post('/pdf', function(req, res) {
  var addresses = req.body;

  var filename = Date.now().toString();
  console.log("Generate " + addresses.length + " addresses into " + filename);


  pdf.init(_PDF_DIR_ + filename + _PDF_EXT_);
  for(var i = 0; i < addresses.length; i++){
    pdf.generateSticker(addresses[i]);
  }
  pdf.close();

  res.send(filename);
});

app.get('/pdf/:filename', function(req, res) {
  fs.readFile(_PDF_DIR_ + req.params.filename + _PDF_EXT_, function (err,data){
     res.contentType("application/pdf");
     res.send(data);
  });
})



console.log("Server running on port 5000");
app.listen(5000);
