var r = require('./r');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  r.auth(request, response, function() {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write('<h1>Reddit-Top-5</h1>');

    r.fetchTop5(function(data) {
      if (!data) { // no more data
        response.end();
      }

      response.write('<h3>'+data.name+'</h3>');
      data.titles.forEach(function(entry) {
        response.write('<a href="https://www.reddit.com'+entry.permalink+'">'+entry.title+'</a><br>\n');
      })
    })
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});