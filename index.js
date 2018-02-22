var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
readline = require('readline');

//set the port 
app.set('port', (process.env.PORT || 5000));
//set directory
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//render index.ejs
app.get('/', function(request, response) {
  response.render('pages/index')
});
//testing a path
app.get('/cool', function(request, response) {
  response.send(cool());
});
//create the upload/ route to handle incoming uploads via POST

app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    var filepath = path.join(form.uploadDir, file.name)
    fs.rename(file.path, filepath);

    //create an input stream
    var instream = fs.createReadStream(filepath);

    //define readline
    var rl = readline.createInterface({
        input: instream,
        terminal: false
    });

    var fields;
    var useridPosition = -1;
    var userId, userViews = {};    
    //fire readLine handler to read each line
    rl.on('line', function(nextLine) {
        //split line by space
        fields = nextLine.split(' ');

        //if cs-userdn position is found
        if(useridPosition != -1){
          userId = fields[useridPosition]
          //check if entry is present in userViews object and increment
          if (typeof userViews[userId] === "undefined") {
            userViews[userId] = 1;
          } else {
            userViews[userId]++;
            //console.log(userId, userViews[userId])
          }          
        }

        //if field description found find cs-userdn position        
        if(fields[0] === '#Fields:'){
          for(var i=0; i<fields.length;i++){
              if(fields[i] === 'cs-userdn'){
              useridPosition = i-1;
            }
          }
        }
    }); // done with processing

 
   //write the results to file 
   rl.on('close',function(){
    fs.writeFile('./public/data/userViews.json', JSON.stringify(userViews));
   })  
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });
  // parse the incoming request containing the form data
  form.parse(req);

});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

