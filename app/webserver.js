var express = require('express');

var app = express();

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.get(/^(.+)$/, function(req, res) {
	res.sendfile('04-28-2014/' + req.params[0]);
});
/*
app.get('/apis/tags', function(req, res) {
	res.sendfile('./tags.json');
});

app.get('/apis/features?:params', function(req, res) {
	res.sendfile('./pois.json');
});

app.get('/hotels/1?:params', function(req, res) {
	res.sendfile('./hotel1.json');
});

app.get('/hotels/1/features?:params', function(req, res) {
	res.sendfile('./poistohotel.json');
});

app.get('/apis/localization/languages', function(req, res) {
	res.sendfile('./languages.json');
});
app.get('/features/new', function(req, res) {
    res.send([{name:'wine1'}, {name:'wine2'}]);
});
app.get('/features/:id', function(req, res) {
    res.send({id:req.params.id, name: "The Name", description: "description"});
});
*/
module.exports = app;