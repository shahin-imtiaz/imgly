var express = require('express');
var router = express.Router();

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
  mimetype: String
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

  res.writeHead(200, {
    'Content-Type': image.mimetype,
    'Content-Length': image.data.length
  });
  res.end(image.data); 
});

router.get('/', async (req, res) => {
  let images = await imgModel.find({}, []);
  res.send(images.map(({_id}) => _id));
})

router.post('/upload', (req, res) => {
  console.log(req.files.img); // the uploaded file object
  console.log(req.files.img.data.length)
  var obj = {
    id: String(currId++),
    data: req.files.img.data,
    mimetype: req.files.img.mimetype,
  }
  imgModel.create(obj, (err, item) => {
      if (err) {
          console.log(err);
      }
      else {
          res.redirect('http://localhost:3000');
      }
  });
});

module.exports = router;
