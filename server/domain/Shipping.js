var method = Shipping.prototype;

function Shipping (_pagesPerItem){
    this.pagesPerItem = _pagesPerItem;
    this.box15 = [];
    this.box17 = [];
    this.envT7 = [];
    this.envT6 = [];
    this.address = null;
    this.quantity;
}

method.addBox15 = function(pages){
  var items = Math.floor(pages/this.pagesPerItem);
  this.box15.push(items);
  return pages % this.pagesPerItem;
}
method.addBox17 = function(pages){
  var items = Math.floor(pages/this.pagesPerItem);
  this.box17.push(items);
  return pages % this.pagesPerItem;
}
method.addEnvT7 = function(pages){
  var items = Math.floor(pages/this.pagesPerItem);
  this.envT7.push(items);
  return pages % this.pagesPerItem;
}
method.addEnvT6 = function(pages){
  var items = Math.floor(pages/this.pagesPerItem);
  this.envT6.push(items);
  return pages % this.pagesPerItem;
}

module.exports = Shipping;
