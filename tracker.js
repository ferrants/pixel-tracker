var http = require('http');
var url_parse = require('url');

var imgdata = [
  0x47,0x49, 0x46,0x38, 0x39,0x61, 0x01,0x00, 0x01,0x00, 0x80,0x00, 0x00,0xFF, 0xFF,0xFF,
  0x00,0x00, 0x00,0x21, 0xf9,0x04, 0x04,0x00, 0x00,0x00, 0x00,0x2c, 0x00,0x00, 0x00,0x00,
  0x01,0x00, 0x01,0x00, 0x00,0x02, 0x02,0x44, 0x01,0x00, 0x3b
];
var imgbuf = new Buffer(imgdata);

http.createServer(function (req, response) {
  console.log("\nRequest    ====");
  parsed = url_parse.parse(req.url, true);
  path = parsed.pathname;
  params = parsed.query;

  if (path == '/a.gif'){
    console.log(params);
    response.writeHead(200, {
      'Content-Type': 'image/gif',
      'Access-Control-Allow-Origin' : '*',
      'Content-Length': imgdata.length
    });
    response.end(imgbuf);
  }else{
    console.log("Failed...");
    console.log(req.url);
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.write("404 Not Found\n");
    response.end();
  }
    

}).listen(5446);




