var express = require('express');
var router = express.Router();

/* GET img listing. */
router.get('/', (req, res) => {
  res.send('respond with a resource');
});

router.post('/upload', (req, res) => {
  console.log(req.files.img); // the uploaded file object
});

module.exports = router;
