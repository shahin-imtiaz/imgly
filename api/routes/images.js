var express = require('express');
var router = express.Router();
const spawn = require("child_process").spawn; 
var imageSizeOf = require('image-size');
var fs = require('fs');
var util = require('util');

const mongoose = require("mongoose");

// Connecting to MongoDB
mongoose.connect("mongodb://mongodb:27017/imgly");

// If there is a connection error send an error message
mongoose.connection.on("error", error => {
        console.log("Database connection error:", error);    
            databaseConnection = "Error connecting to Database";
          });

var imageSchema = new mongoose.Schema({
  data: Buffer,
  mimetype: String,
  width: Number,
  height: Number,
  tags: [{
    tag: String,
    weight: Number,
  }],
});

var imgModel = new mongoose.model('Image', imageSchema);

let currId = 1;

// If connected to MongoDB send a success message
mongoose.connection.once("open", () => {
        console.log("Connected to Database!");
            databaseConnection = "Connected to Database";});

/* GET img listing. */
router.get('/:id', async (req, res) => {
  let image = await imgModel.findById(req.params['id']);
  // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++")
  // console.log(image)

  res.writeHead(200, {
    'Content-Type': image.mimetype,
    'Content-Length': image.data.length
  });
  res.end(image.data); 
});

router.get('/', async (req, res) => {
  let images = await imgModel.find({}, []);
  images.reverse();
  res.send(images.map(({_id, width, height, tags}) => ({id: _id, width, height, tags})));
})

router.post('/upload', async (req, res) => {
  const readFile = util.promisify(fs.readFile);
  const data = await readFile(req.files.img.tempFilePath);
  let {width, height} = imageSizeOf(data);

  let modelData = [];
  // spawn new child process to call the python script
  const python = spawn('python3', ['model.py', req.files.img.tempFilePath]);
  // collect data from script
  python.stdout.on('data', function (data) {
   console.log('Pipe data from python script ...');
   modelData.push(data.toString());
  });
  // python.stderr.on('data', data => console.error(data.toString()));
  // in close event we are sure that stream from child process is closed
  python.on('close', (code) => {
    console.log(`inference ended with code ${code}`);
    console.log(modelData.join(''));

    let predictionClasses = JSON.parse(/Predictions: (.*)/.exec(modelData.join(''))[1]);
    var obj = {
      data: data,
      mimetype: req.files.img.mimetype,
      width, height,
      tags: predictionClasses.map(([tag, weight]) => ({tag, weight})),
    }
  
    imgModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect(process.env.FRONTEND_URL);
        }
    });
  }); 
});


module.exports = router;
