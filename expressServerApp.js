var express = require('express');
var request = require('request');
var app = express();
var fs = require('fs');

var bodyParser = require('body-parser');

//magodb
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://127.0.0.1:27017/test';

// Create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',function (req,res){
  // app.get('/index2.html',function (req,res){
	console.log('server started succesfully');
	// res.send('server started succesfully');
	res.sendFile(__dirname+'/index2.html')
});

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/gulpDest'));


app.get('/process_get',function (req,res){

	// Prepare output in JSON format
   response = {
       first_name:req.query.first_name,
       last_name:req.query.last_name
   };
	// res.send(JSON.stringify(response));
	res.send(response);
});

// app.post('/process_post',urlencodedParser, function (req,res){

// 	// Prepare output in JSON format
//    response = {
//        first_name:req.body.first_name,
//        last_name:req.body.last_name
//    };
// 	res.send(JSON.stringify(response));
// });

app.post('/form_post', function (req,res){

  var conversion ;
 //   response = {
 //       first_name:req.body.first_name,
 //       last_name:req.body.last_name
 //   };
	// res.send(JSON.stringify(req.body));
  var conversion = req.body.first_name+"/"+req.body.last_name;
  var url = "https://openexchangerates.org/api/latest.json?app_id=95a37b6434214428bae3d4a4d5deb386";
  request({
    uri: url,
    method: "GET"
  },
   function(error, response, body) {
    console.log("response", response);
    if(response.statusCode == 200){
      var result = JSON.parse(body);
      conversion = "SGD to INR :" + result.rates['INR'] / result.rates['SGD'] ;
      // console.log("body", body);
    }else{
      conversion = response.statusMessage + ": cant process ur request";
    }
    rest = { 'result': conversion};
    console.log(rest);
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    assert.equal(null, err);
    findRestaurants(db, function() {
        db.close();
        res.send(rest);
    });
  });
    
  });
});


// // This responds a POST request for the homepage
// app.post('/', function (req, res) {
//    console.log("Got a POST request for the homepage");
//    res.send('Hello POST');
// });

// // This responds a DELETE request for the /del_user page.
// app.delete('/del_user', function (req, res) {
//    console.log("Got a DELETE request for /del_user");
//    res.send('Hello DELETE');
// });

// // This responds a GET request for the /list_user page.
// app.get('/list_user', function (req, res) {
//    console.log("Got a GET request for /list_user");
//    res.send('Page Listing');
// });

// // This responds a GET request for abcd, abxcd, ab123cd, and so on
// app.get('/ab*cd', function(req, res) {   
//    console.log("Got a GET request for /ab*cd");
//    res.send('Page Pattern Match');
// });



// REST API 

var user = {
 "user4" : {
	"name" : "Ramky",
	"password" : "password3",
	"profession" : "APPIAN",
	"id": 4
   }
}


app.get('/listUsers', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   });
});

app.post('/addUser', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       console.log( data );
       data = JSON.parse(data);
       data['user4'] = user['user4'];
       res.end( JSON.stringify(data) );
   });
});

var id = 2;

app.get('/deleteUser', function (req, res) {

   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       delete data["user" + 2];
       
       console.log( data );
       res.end( JSON.stringify(data));
   });
})

app.get('/:id', function (req, res) {
   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       users = JSON.parse( data );
       var user = users["user" + req.params.id] 
       console.log( user );
       res.end( JSON.stringify(user));
   });
});

// app.get('/delUser', function (req, res) {
//    // First read existing users.
//    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
//        data = JSON.parse( data );
//        console.log(data['user2']);
//        // delete data['user2'];
//        res.end( JSON.stringify(data));
//    });
// });


// var url = 'mongodb://127.0.0.1:27017/test';
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  insertDocument(db, function() {
      db.close();
  });
  // db.close();
});


var server = app.listen(8081,function(){

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port);
});





var insertDocument = function(db, callback) {
   db.collection('restaurants').insertOne( {
      "address" : {
         "street" : "2 Avenue",
         "zipcode" : "10075",
         "building" : "1480",
         "coord" : [ -73.9557413, 40.7720266 ]
      },
      "borough" : "Manhattan",
      "cuisine" : "Italian",
      "grades" : [
         {
            "date" : new Date("2014-10-01T00:00:00Z"),
            "grade" : "A",
            "score" : 11
         },
         {
            "date" : new Date("2014-01-16T00:00:00Z"),
            "grade" : "B",
            "score" : 17
         }
      ],
      "name" : "Vella",
      "restaurant_id" : "41704620"
   }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the restaurants collection.");
    callback();
  });
};


var findRestaurants = function(db, callback) {
   var cursor =db.collection('restaurants').find( );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
      } else {
         callback();
      }
   });
};