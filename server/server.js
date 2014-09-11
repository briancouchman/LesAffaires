var express = require('express');
var fs = require('fs');
var busboy = require('connect-busboy');
var bodyParser = require('body-parser');

var excelService = require('./excel-service');
var pdfService = require('./pdf-service');
var shippingService = require('./shipping-service');


var properties = require('properties');
var props = {};

var CONFIG_OPTIONS = {
  path: true,
  sections: true,
  reviver: function(key, value, section){
    //Do not split section lines
    if (this.isSection) return this.assert ();

    //Split all the string values by a comma
    if (typeof value === "string"){
      var values = value.split (",");
      return values.length === 1 ? value : values;
    }

    //Do not split the rest of the lines
    return this.assert ();
  }
}



var app = express();

/**
 * Cross domain enabling
 */
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(busboy()); //middlware for multipart request (file upload)
app.use(bodyParser.json()); //middleware for request body parsing (POST requests)


/**
 * Upload the Excel file to the server
 * @param the request with the excel file as a payload
 * @returns sends the addesses back as a list of address objects
 */
app.post('/upload', function(req, res) {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading to " + __dirname + '/files/' + filename);
        fstream = fs.createWriteStream(__dirname + '/files/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            console.log("Closing stream");
            excelService.parseExcel(__dirname + '/files/' + filename,
            function(addresses){
              res.send({uploaded: true, fileName: filename, addresses: addresses});
            },
            function(err){
              res.status(400).send({uploaded: false, error: err});
            })
        });
    });
});




/**
 * Generate the stickers for the given shipping
 * var _PDF_DIR_ = "./pdf/";
 * var _PDF_EXT_ = ".pdf";
 */
app.post('/labels', function(req, res) {
  var shippings = req.body;

  var filename = Date.now().toString();
  console.log("Generate " + shippings.length + " shippings into " + filename);


  pdfService.init(props.pdf.dir + filename + props.pdf.ext);
  for(var i = 0; i < shippings.length; i++){
    pdfService.generateShipping(shippings[i]);
  }
  pdfService.close();

  res.send(filename);
});

/**
 * Get the content of the PDF with the given filename
 */
app.get('/labels/:filename', function(req, res) {
  fs.readFile(props.pdf.dir+ req.params.filename + props.pdf.ext, function (err,data){
     res.contentType("application/pdf");
     res.send(data);
  });
})


/**
 * Generate and return a shipping, based on the address and the quantity
 */
app.post('/shipping/:pages', function(req,res){
  var address = req.body;

  var shipping = shippingService.getShipping(address, req.params.pages)

  res.send(shipping);
})


properties.parse('./config.properties', CONFIG_OPTIONS, function(error, obj){
  props = obj;
  console.log("Properties initialized");
  console.log(props);

  shippingService.init(props);

  console.log("Server running on port 5000");
  app.listen(5000);
});
