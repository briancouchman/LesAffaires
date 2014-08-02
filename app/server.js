var express = require('express');
var fs = require('fs');

var app = express();

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/apis/jobs', function(req, res) {
	res.sendfile('./convertcsv.json');
});

app.get('/apis/jobs/:jobName', function(req, res) {
    fs.readFile('./convertcsv.json', 'utf8', function (err, data) {
        if (err) {
            console.log('Error: ' + err);
            return;
        }
        data = JSON.parse(data);
        var result = [];
        for(var i = 0; i < data.length; i++){
            if(data[i].job == req.params.jobName){
                result.push(data[i]);
            }
        }
        res.send(result);
    });
});


console.log("Server running on port 5000");
app.listen(5000);