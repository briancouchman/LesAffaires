'use strict';

var PDFDocument = require('pdfkit');
var fs = require('fs');

var filepath = "invoice.pdf";

var doc = new PDFDocument({
  layout: 'portrait',
  size: 'letter',
  margin:10
});
doc.pipe(fs.createWriteStream(filepath));


var currencyRenderer = function(item){
  return item && item + "$";
}

var tableOptions = {
    columns:[
        { id: 'code',     width: 10, name: 'Code' },
        { id: 'name',     width: 40, name: 'Name' },
        { id: 'quantity', width: 25, name: 'Quantity' },
        { id: 'price',    width: 25, name: 'Price' }
    ],
    y: 250,
    margins: {
        left: 40,
        top: 0,
        right: 40,
        bottom: 20
    },
    padding: {
        left: 10,
        top: 10,
        right: 10,
        bottom: 10
    },
    font: __dirname + '/../font/Arial_Narrow.ttf',
    boldFont: __dirname + '/../font/Arial_Narrow.ttf'
};


var products = [
  {
    code: 'box15',
    name: 'Boite 15 pouces',
    quantity: 20,
    price: 6.20
  },
  {
    code: 'box17',
    name: 'Boite 17 pouces',
    quantity: 20,
    price: 6.20
  }
]


doc.table(products, tableOptions);

doc.end()
