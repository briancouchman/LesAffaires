var express = require('express');
var fs = require('fs');
var busboy = require('connect-busboy');
var bodyParser = require('body-parser');

var excelService = require('./excel-service');
var pdfShippingService = require('./pdf-shipping-service');
var pdfPaletteService = require('./pdf-palette-service');
var pdfInvoiceService = require('./pdf-invoice-service');
var shippingService = require('./shipping-service');
var paletteService = require('./palette-service');

var props = {};

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
 * Generate the stickers for the given shippings
 */
app.post('/shippings/labels', function(req, res) {
  var shippings = req.body;

  var filename = pdfShippingService.start();
  for(var i = 0; i < shippings.length; i++){
    pdfShippingService.generateShipping(shippings[i]);
  }
  pdfShippingService.close();

  console.log("Generate " + shippings.length + " shippings into " + filename);

  res.send(filename);
});


/**
 * Generate the stickers for the given palettes
 */
app.post('/palettes/labels', function(req, res) {
  var palettes = req.body;

  console.log("Generate " + palettes.length + " palettes into " + filename);


  var filename = pdfPaletteService.start();
  for(var i = 0; i < palettes.length; i++){
    pdfPaletteService.generatePalettes(palettes[i]);
  }
  pdfPaletteService.close();

  res.send(filename);
});


/**
 * Get the content of the PDF with the given filename
 */
app.get('/pdf/:filename', function(req, res) {
  var filepath = __dirname + props.pdf.dir + "/" + req.params.filename + props.pdf.ext;
  fs.readFile(filepath, function (err,data){
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

/**
 * Generate and return a palette, based on the address and the quantity
 */
app.post('/palettes', function(req,res){
  var address = req.body;

  res.send(paletteService.calculate(address));
})



/**
 * Generate an invoice summarizing the costs of the shipping
 */
app.post('/invoice', function(req,res){
  var shippings = req.body;


  var filename = pdfInvoiceService.start();
  pdfInvoiceService.generateInvoice(shippings);
  pdfInvoiceService.close();

  console.log("Generate invoice into " + filename);

  res.send(filename);
})





/**
 * Configuration loading and persisting
 * Configuration is stored in the file config.json
 */
app.get('/config', function(req, res){
  res.send(props);
});

app.post('/config', function(req,res){
  props = req.body;

  console.log("Saving configuration");
  var _config_str = JSON.stringify(props,null,2); //pretty print, indentation 2
  fs.writeFile(__dirname + '/config.json', _config_str, function (err) {
    if (err) throw err;

    console.log("New configuration saved successfully");
    console.log(props);

    initServices();

  })

  res.send();
})



var props = (JSON.parse(fs.readFileSync(__dirname + "/config.json", "utf8")));

var initServices = function(){
  shippingService.init(props);
  paletteService.init(props);
  pdfPaletteService.init(props);
  pdfShippingService.init(props);
  pdfInvoiceService.init(props);
}


console.log("Configuration loaded");
console.log(props);

initServices();

app.listen(5000);
console.log("Server running on port 5000");

/*
fs.readFile('./config.json', 'utf8', function (err, data) {
  if (err) {
    console.log('Error: ' + err);
    return;
  }
  //Loading properties
  console.log("Loading properties");
  console.log(data);

  console.log("Converting JSON ");
  props = JSON.parse(data);
  console.log(props);
  console.log("Properties initialized");
  console.log(props);

  shippingService.init(props);

  console.log("Server running on port 5000");
  app.listen(5000);
});
*/
