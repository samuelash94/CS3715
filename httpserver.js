var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var formidable = require("formidable");
var util = require('util');
var express = require('express');
var app = express();
var router = express.Router();
var routes = require('./routes')

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', routes.index);

//handle["/404"] = requestHandlers.error404;

//config
var config = {
    port: 8081,
    localIPs: ['127.0.0.1'],
    srcpath: '/src'
};

//create a server

//var server = http.createServer(processRequestRoute).listen(config.port);

http.createServer(function (req, res){
	req.setEncoding('utf8');
    if (req.method.toLowerCase() == 'get') {
        //displayForm(res);
    } else if (req.method.toLowerCase() == 'post') {
        //processAllFieldsOfTheForm(req, res);
        processFormFieldsIndividual(req, res);
    }
    //processRequestRoute(req, res);
}).listen(config.port);

console.log("Server has started. port:"+config.port);

function displayForm(res){
    fs.readFile('index.html', function (err, data) {
        /*res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
        });*/
        res.write(data);
        res.end();
    });
}

function processAllFieldsOfTheForm(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        //Store the data from the fields in your data store.
        //The data store could be a file or database or any other store based
        //on your application.
        /*res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('received the data:\n\n');*/
        res.end(util.inspect({
            fields: fields,
            files: files
        }));
    });
}

function processFormFieldsIndividual(req, res) {
    //Store the data from the fields in your data store.
    //The data store could be a file or database or any other store based
    //on your application.
    var fields = {};
    var a;
    var b;
    var form = new formidable.IncomingForm();
    /*fs.appendFile("test.JSON", "}]", function(err){
        	if(err) throw err;
        });*/
    form.on('field', function (field, value) {
        console.log(field);
        console.log(value);
        fields[field] = value;
        /*fs.appendFile("test.JSON", "\"" + field + "\":\"" + value + "\",", function(err){
        	if(err) throw err;
        */
    });
    /*fs.appendFile("test.JSON", "[{", function(err){
    	if(err) throw err;
    });*/

    form.on('end', function () {
        a = JSON.stringify(fields);
        if (a == "{}"){
    		console.log("fields is blank");
    		return;
    	}
        console.log(a);
     // Take the JSON file, make it into an object, and then change the object and write the file.
     fs.readFile('test.JSON', 'utf8', function read(err, data) {
         if (err) {
             throw err;
         }
         var content = data;

         console.log(content);
         content = content.replace('[','');
         content = content.replace(']','');
         console.log(content);
         content += ",\n" + a;
      	 content = "[" + content + "]";
      	 console.log(content);
      	 b = content;
      	 console.log(b);
      	fs.writeFile("test.JSON", b, function(err){
        	if(err) throw err;
        });

     });
     	
    });
    form.parse(req);
}

//router URL
function processRequestRoute(request, response) {
	
    var pathname = url.parse(request.url).pathname;
    if (pathname === '/') {
        pathname = "/index.html"; //default page
    }
    var ext = path.extname(pathname);
    var temp;
    var localPath = ''; //local path
    var staticres = false; //statict or not
    if (ext.length > 0) {
        localPath = '.' + pathname;
        staticRes = true;
    } else {
        localPath = '.' + pathname + '.js';
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
    if(ext === '.JSON'){ formWriting(request, response); }
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