var http = require('http');
var fs = require('fs');
var url = require('url');

http.createServer(function(req, res){

// Parse the request containing file name
var pathname = url.parse(req.url).pathname;

// Print the name of the file for which request is made.
console.log("Request for " + pathname + " received.");

fs.readFile(pathname.substr(1),function(err, data){
	if (err) {
		console.log(err);
		// HTTP Status: 404 : NOT FOUND
		// Content Type: text/plain
		res.writeHead(404, {'Content-Type': 'text/html'});
	}else{	
		//Page found	  
		// HTTP Status: 200 : OK
		// Content Type: text/plain
		res.writeHead(200, {'Content-Type': 'text/html'});	

		// Write the content of the file to response body
		res.write(data.toString());		
	}
	// Send the response body 
	res.end();
});

// res.writeHead(200, {'Content-type': 'text-plain'});
// fs.readFile('FirstNode.js',function(err,data){
// 	if(err) return res.end('hello nodes server listened ur request');
// 	res.end( data );
// });

console.log('async server');
}).listen(8081);


console.log('Server running at http://127.0.0.1:8081/');