const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Video } = require("../models/Video");
var ffmpeg= require('fluent-ffmpeg');

const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now())
    },

    fileFilter:(req, res, cb)=> {
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4'){
            return cb(res.status(400).end('Only Mp4 is allowed'), false);
        }
        cb(null,true)
    }
  })
   
  var upload = multer({ storage: storage }).single("file")


router.post("/uploadfiles", (req, res) => {

    upload(req, res, err=>{
        if(err){
            return res.json({success:false,err})
        }
        return res.json({success:true, filePath: res.req.file.path, fileName: res.req.file.filename})
    })

});

router.post("/thumbnail", (req, res) => {

  let thumbsFilePath= "";
  let fileDuration="";

  ffmpeg.ffprobe(req.body.filePath, function(err, metadata){
    console.dir(metadata);
    console.log(metadata.format.duration);

    fileDuration= metadata.format.duration;
  })

  ffmpeg(req.body.filePath)
  .on('filenames', function(filenames) {
    console.log('Will generate ' + filenames.join(', '))
    thumbsFilePath= "uploads/thumbnails/" + filenames[0];
  })
  .on('end', function() {
    console.log('Screenshots taken');
    return res.json({success:true ,thumbsFilePath: thumbsFilePath, fileDuration:fileDuration})
  })
  .screenshots({
    // Will take screens at 20%, 40%, 60% and 80% of the video
    count: 3,
    folder: 'uploads/thumbnails',
    size: '320x240',
    //%b means filename without extension
    filename:'thumbnail-%b.png'
  });

});

router.post("/uploadVideo", (req, res) => {

  const video = new Video(req.body)

  video.save((err, video)=> {
    if(err) return res.status(400).json({success:false, err})
    return res.status(200).json({
      success: true
    })
  })

});

router.get("/getVideos", (req, res) => {

  Video.find()
        .populate('writer')
        .exec((err, videos)=> {
          if(err) return res.status(400).send(err);
          res.status(200).json({success:true, videos})
        })

});

router.post("/getVideo", (req, res) => {

  Video.findOne({"_id": req.body.videoId})
        .populate('writer')
        .exec((err, video)=> {
          if(err) return res.status(400).send(err);
          res.status(200).json({success:true, video})
        })

});



module.exports = router;
