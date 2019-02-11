// Set constraints for the video stream
var constraints = { video: { facingMode: "environment" }, audio: false };
var track = null;

// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger");

// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
        })
        .catch(function(error) {
            console.error("Oops. Something is broken.", error);
        });
}

// Take a picture when cameraTrigger is tapped
//cameraTrigger.onclick = function() {
function cameratrigger2(){
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");
    // track.stop();
}
// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);

window.setInterval(cameratrigger2, 15000);

// *********** Upload file to Cloudinary ******************** //
function uploadFile(file) {
  var url = `https://api.cloudinary.com/v1_1/lynettetay/upload`;
  var xhr = new XMLHttpRequest();
  var fd = new FormData();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  });

  xhr.onreadystatechange = function(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // File uploaded successfully
      var response = JSON.parse(xhr.responseText);
      // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg
      var url = response.secure_url;
      // Create a thumbnail of the uploaded image, with 150px width
      var tokens = url.split('/');
      tokens.splice(-2, 0, 'w_150,c_scale');
      var img = new Image(); // HTML5 Constructor
      img.src = tokens.join('/');
      img.alt = response.public_id;
      document.getElementById('demo').appendChild(img);
    }
  };

  fd.append('upload_preset', unsignedUploadPreset);
  fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
  fd.append('file', file);
  xhr.send(fd);
}

uploadFile('/storage/emulated/0/DCIM/aaa.jpg'); // call the function to upload the file

/*const express = require('express');
const app = express();
const multipart = require('connect-multiparty');
const cloudinary = require('cloudinary');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const multipartMiddleware = multipart();

cloudinary.config({
    cloud_name: 'lynettetay',
    api_key: '244778964163317',
    api_secret: 'Sstxgsknm12eWJ75jvFQuwsoAug'
});

app.post('file:///storage/emulated/0/DCIM/aaa.jpg', multipartMiddleware, function(req, res) {
  //cloudinary.v2.uploader.upload(req.files.image.path,
    cloudinary.v2.uploader.upload('file:///storage/emulated/0/DCIM/aaa.jpg',
    {
      ocr: "adv_ocr"
    }, function(error, result) {
        if( result.info.ocr.adv_ocr.status === "complete" ) {
          res.json(result); // result.info.ocr.adv_ocr.data[0].textAnnotations[0].description (more specific)
         document.getElementById("demo").innerHTML = result.info.ocr.adv_ocr.data[0].textAnnotations[0].description; 
        }
    });
});
*/
