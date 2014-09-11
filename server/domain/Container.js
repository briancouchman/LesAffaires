if(typeof Container === 'undefined'){
  var method = Container.prototype;

  function Container (type, quantity){
      this.type = 0;
      this.quantity = 0;
  }

  module.exports = Container;
}
