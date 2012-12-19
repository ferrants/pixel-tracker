var http = require('http');
var url_parse = require('url');
var mongodb = require('mongodb');
var config = require('./config');

var imgdata = [
  0x47,0x49, 0x46,0x38, 0x39,0x61, 0x01,0x00, 0x01,0x00, 0x80,0x00, 0x00,0xFF, 0xFF,0xFF,
  0x00,0x00, 0x00,0x21, 0xf9,0x04, 0x04,0x00, 0x00,0x00, 0x00,0x2c, 0x00,0x00, 0x00,0x00,
  0x01,0x00, 0x01,0x00, 0x00,0x02, 0x02,0x44, 0x01,0x00, 0x3b
];
var imgbuf = new Buffer(imgdata);

var col_hits;

var start_mongo = function(callback){
  var server = new mongodb.Server(config.mongo.host, config.mongo.port, {});
  new mongodb.Db(config.mongo.db, server, {}).open(function (error, client) {
    if (error){
      console.log(error);
      throw "Unable to connect to Mongo";
    }
    
    console.log("Conected to DB");
    col_hits = new mongodb.Collection(client, 'hits');
    if (typeof callback == 'function'){
      callback();
    }
  });
};

var start_server = function(hit_callback){
  if (typeof hit_callback != 'function'){
    hit_callback = function(hit){
      console.log(hit);
    };
  }
  http.createServer(function (req, response) {
    parsed = url_parse.parse(req.url, true);
    path = parsed.pathname;
    params = parsed.query;

    if (path == '/a.gif'){
      hit_callback(params);
      response.writeHead(200, {
        'Content-Type': 'image/gif',
        'Access-Control-Allow-Origin' : '*',
        'Content-Length': imgdata.length
      });
      response.end(imgbuf);
    }else{
      console.log("Failed ("+ req.url +")");
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.write("404 Not Found\n");
      response.end();
    }
  }).listen(config.app.port);
};

start_mongo(start_server(function(hit){
  console.log("\nRequest ====");
  if (typeof config.app.preprocess_hit == 'function'){
    hit = config.app.preprocess_hit(hit);
  }
  console.log(hit);
  col_hits.insert(hit);

}));






