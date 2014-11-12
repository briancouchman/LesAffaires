var PDFDocument = require("pdfkit");
var fs = require("fs");
var Palette = require("./domain/Palette");


var isDefined = function(obj){
  return obj != null && obj != '' && typeof obj !== 'undefined';
};

var props;


module.exports = {


    init: function(_props){
        props = _props;
    },

        start: function(){
        if(props.pdf.dir == null && props.pdf.ext == null){
            throw new Error("PDF service must be initialized with the pdf configuration. Call pdfService.init(props);");
        }

        var filename = "palette-" + Date.now().toString();
        var filepath = __dirname + props.pdf.dir + "/" + filename + props.pdf.ext;

        this.doc = new PDFDocument({
            layout: 'portrait',
            size: 'LETTER',
            margin:10
        });
        this.doc.pipe(fs.createWriteStream(filepath));

        return filename;
    },

    total: function(palette){
        var total = 0;

        for(var i = 0; i < palette.rows.length; i++){
            for(var j = 0; j < palette.rows[i].length; j++){
                total += palette.rows[i][j];
            }
        }

        return total;
    },

    generatePalettes: function(palettes){
        var totalPalettes = palettes.length;
        var currentPalette = 1, cumulTotal = 0;
        for(var i = 0; i < palettes.length; i++){
            var palette = palettes[i];
            console.log(palette);

            var currentTotal = this.total(palette);
            cumulTotal += currentTotal;

            this.generateLabel({
                date: palette.date,
                address: palette.address,
                currentPalette: currentPalette++,
                totalPalettes: totalPalettes,
                currentQty: currentTotal,
                cumulTotal: cumulTotal,
                totalQty: palette.address.quantity,
                itemsPerPacket: palette.itemsPerPacket,
                packetsPerLevel: palette.packetsPerLevel
            })
        }
    },

    generateLabel: function(options){

        if(this.doc == null){
          throw Error("You must call init first");
        }
        // Pipe it's output somewhere, like to a file or HTTP response
        // See below for browser usage


        var address = options.address;


        this.doc.fontSize(14);
        var cursor = this.doc.text("", 30, 200);

        cursor.text(address.dest ? address.dest : " ")

        cursor.text(address.company ? address.company : " ");

        cursor.text(address.add_comp ? address.add_comp : " ");

        cursor.text(address.address ? address.address.toUpperCase() : " ")

        cursor.text(address.city ? address.city.toUpperCase() + " " + address.province.toUpperCase() : " ");

        cursor.text(address.zipcode ? address.zipcode.toUpperCase() : " ");

        cursor.text(address.phone ? 'Telephone ' + address.phone : " ");

        // line
        this.addLine(318);
        var now = Date.now();
        this.doc.text("EDITION: " + new Date(options.date));
        this.doc.text("TRANSPORTEUR: ");

        this.addLine(363);

        this.doc.text("").moveDown();
        this.doc.text("Skid # : " + options.currentPalette + "  /  " + options.totalPalettes).moveDown();

        this.doc.text("QTE CETTE PALETTE: " + options.currentQty).moveDown();

        this.doc.text("Qte cumulative: " + options.cumulTotal);
        this.doc.text("Qte commandee: " + Math.round(options.totalQty)).moveDown();

        this.addLine(513);
        this.doc.text("Copies / Paquet: " + options.itemsPerPacket);
        this.doc.text("Paquet / Rangee: " + options.packetsPerLevel);

        this.addLine(558);

        if(address.day && address.hour){
            this.doc.text("LIVRAISON " + address.day.toUpperCase() + " " + address.hour.toUpperCase());
        }

        this.doc.text("LES AFFAIRES");

        this.doc.addPage();
    },

    addLine: function(y){
    this.doc.text("").moveDown();
    this.doc.moveTo(10, y).lineTo(300, y).stroke();
    },

    close: function(){
        this.doc.end()
    }
}
