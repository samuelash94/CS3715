var http = require('http');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');

var server = http.createServer(function (req, res) {
    if (req.method.toLowerCase() == 'get') {
        displayForm(res);
    } else if (req.method.toLowerCase() == 'post') {
        //processAllFieldsOfTheForm(req, res);
        processFormFieldsIndividual(req, res);
    }
});

function displayForm(res) {
    fs.readFile('form.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
        });
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
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('received the data:\n\n');
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

server.listen(8081);
console.log("server listening on 8081 for your information");