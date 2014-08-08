var assert = require("assert");
var sinon = require("sinon");
var pdf = require("../pdf-gen");


describe('PDF Generation', function(){

  before(function(){

  });

  describe('#getStartRow', function(){
    it('should return -1 when the records are empty', function(){
      pdf.helloworld('output.pdf');
    })
  })

})
