function route(handle, pathName, response, postData) {
	console.log("About to route a request for " + pathName);
	if(typeof handle[pathName] === 'function'){
		return handle[pathName](response, postData);
	}else{
		console.log("No request handler found for " + pathName);
		return handle["/404"](pathName, response, postData);
	}
}

exports.route = route;