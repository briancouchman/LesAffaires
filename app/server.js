var express = require('express');
var fs = require('fs');
var busboy = require('connect-busboy');
var excelParser = require('excel-parser');


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
            parseExcel(__dirname + '/files/' + filename, function(addresses){
              res.send({uploaded: true, fileName: filename, addresses: addresses});
            })
        });
    });
});


var parseExcel = function(filename, callback){
  console.log("Parsing " + filename);
  excelParser.parse({
    inFile: filename,
    worksheet: 1,
  },function(err, records){
    if(err) {
      console.error("Parsing with error: " + err);
    }else{
      console.log("Parsing successful");
      //console.log(records);
      var startRow = 0;
      //Find the starting point
      for(var i=0; i < records.length; i++){
        var row = records[i];
        if(row[0] == "Adressage"){
          startRow = i;
          break;
        }
      }

      var ADDRESS=2, ADD_COMP=3, CITY=4, PROVINCE=5, ZIPCODE= 6, QUANTITY=7;

      var addresses = [];
      for(var j=startRow; j < records.length; j++){
        var row = records[j];
        if(row[QUANTITY] != '' && row[QUANTITY] > 0){
          addresses.push({
            address: row[ADDRESS],
            add_comp: row[ADD_COMP],
            city: row[CITY],
            province: row[PROVINCE],
            zipcode: row[ZIPCODE],
            quantity: row[QUANTITY]
          });
        }
      }
      console.log("addresses : " + addresses.length);
      if(typeof callback === 'function'){
        callback.call(this, addresses);
      }
    }
  });


}

console.log("Server running on port 5000");
app.listen(5000);
