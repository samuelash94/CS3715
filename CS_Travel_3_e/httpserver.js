var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var splitter = require('./splitter.js');
//var temp = require('./destinations/fileWriting.js').handleTravellerPost1();
//the above line will automatically execute handleTravellerPost1 from fileWriting


var postHTML =
	  '<html><head><title>Post Example</title></head>' +
	  '<body>' +
	  '<form method="post">' +
	  'Your Fist Name: <input name="first_name"><br>' +
	  'Your Last Name: <input name="last_name"><br>' +
	  '<input type="submit">' +
	  '</form>' +
	  '</body></html>';


//config
var config = {
    port: 8081,
    localIPs: ['127.0.0.1'],
    srcpath: '/src'
};

//create a server

http.createServer(processRequestRoute).listen(config.port);
console.log("Server has started. port:"+config.port);

//router URL
function processRequestRoute(request, response) {
	
	/*var body = "";
	  request.on('data', function (chunk) {
	    body += chunk;
	  });
	  request.on('end', function () {
	    console.log('POSTed: ' + body);
	 
	    if (body != '')
	    {
	        var hash = splitter.formValues(body);
	 
	         console.log("input1 = " + hash["first_name"]);
	         console.log("input2 = " + hash["last_name"]);
	 
	         response.writeHead(200);
	         response.write('Hello ' + hash["first_name"] + ', ' + hash["last_name"] + '!');
	         var testHTML = "Testing, " + hash["first_name"] + ", " + hash["last_name"] + ".";
	         fs.appendFile('log.txt', testHTML, function (err) {
		    	  if (err) throw err;
		    	  console.log('It\'s saved!');
		    	});
	         response.end();
	         return;
	    }
	    
	    response.writeHead(200);
	    response.end(postHTML);
	  });*/
	    
    var pathname = url.parse(request.url).pathname;
    if (pathname === '/') {
        pathname = "/index.html"; //default page
    }
    var ext = path.extname(pathname);
    var localPath = ''; //local path
    var staticres = false; //statict or not
    if (ext.length > 0) {
        localPath = '.' + pathname;
        staticRes = true;
    } else {
        localPath = '.' + config.srcpath + pathname + '.js';
        staticRes = false;
    }
    //do not allow remote access
    if (config.denyAccess && config.denyAccess.length > 0) {
        var islocal = false;
        var remoteAddress = request.connection.remoteAddress;
        for (var j = 0; j < config.localIPs.length; j++) {
            if (remoteAddress === config.localIPs[j]) {
                islocal = true;
                break;
            }
        }
        if (!islocal) {
            for (var i = 0; i < config.denyAccess.length; i++) {
                if (localPath === config.denyAccess[i]) {
                    response.writeHead(403, { 'Content-Type': 'text/plain' });
                    response.end('403:Deny access to this page');
                    return;
                }
            }
        }
    }
    //donot allow back ground js
    if (staticRes && localPath.indexOf(config.srcpath) >= 0) {
        response.writeHead(403, { 'Content-Type': 'text/plain' });
        response.end('403:Deny access to this page');
        return;
    }

    fs.exists(localPath, function (exists) {
        if (exists) {
            if (staticRes) {
                staticResHandler(localPath, ext, response); //statict resourse
            } else {
                try {
                    var handler = require(localPath);
                    if (handler.processRequest && typeof handler.processRequest === 'function') {
                        handler.processRequest(request, response); //dynamic resourse
                    } else {
                        response.writeHead(404, { 'Content-Type': 'text/plain' });
                        response.end('404:Handle Not found');
                    }
                } catch (exception) {
                    console.log('error::url:' + request.url + 'msg:' + exception);
                    response.writeHead(500, { "Content-Type": "text/plain" });
                    response.end("Server Error:" + exception);
                }
            }
        } else { //the resourse does not exist
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end('404:File Not found');
        }
    });
}

//handle the dynamic resourse
function staticResHandler(localPath, ext, response) {
    fs.readFile(localPath, "binary", function (error, file) {
        if (error) {
            response.writeHead(500, { "Content-Type": "text/plain" });
            response.end("Server Error:" + error);
        } else {
            response.writeHead(200, { "Content-Type": getContentTypeByExt(ext) });
            response.end(file, "binary");
        }
    });
}

//the type of the Content
function getContentTypeByExt(ext) {
    ext = ext.toLowerCase();
    if (ext === '.htm' || ext === '.html')
        return 'text/html';
    else if (ext === '.js')
        return 'application/x-javascript';
    else if (ext === '.css')
        return 'text/css';
    else if (ext === '.jpe' || ext === '.jpeg' || ext === '.jpg')
        return 'image/jpeg';
    else if (ext === '.png')
        return 'image/png';
    else if (ext === '.ico')
        return 'image/x-icon';
    else if (ext === '.zip')
        return 'application/zip';
    else if (ext === '.doc')
        return 'application/msword';
    else
        return 'text/plain';
}