//Simple Server

var http = require('http');
const port = 8080;
var static = require('node-static');
var file = new(static.Server)();
var app = http.createServer(function (req, res) {
  file.serve(req, res);
}).listen(port);

process.on('SIGTERM', function () {
  server.close(function () {
    process.exit(0);
  });
});