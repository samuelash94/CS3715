var http = require('http');
http.createServer(function handler(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('Hello World\n')
    response.end();
}).listen(8888);
console.log('Server running at http://localhost:8888/');
