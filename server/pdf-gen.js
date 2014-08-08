var PDFDocument = require("pdfkit");

module.exports = {
    helloworld: function(filename){
      // Create a document
      doc = new PDFDocument();

      // Pipe it's output somewhere, like to a file or HTTP response
      // See below for browser usage
      doc.pipe fs.createWriteStream(filename)

      doc.addPage()
         .fontSize(25)
         .text('Hello world', 100, 100)

      doc.end()
    }

}
