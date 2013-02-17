var express = require('express');

var app = express();
app.configure(function(){
  app.set('views', __dirname + '/');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.logger());
  
  app.use(express.static(__dirname + '/public'));
});


app.get('/', function(req, res){
        res.sendfile(__dirname+'/index.html');
}).listen(process.env.PORT);