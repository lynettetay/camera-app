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

var CLOUDINARY_PRESET_NAME = 'lynettetay';
var CLOUDINARY_RETRIEVE_URL = 'http://res.cloudinary.com/lynettetay/image/upload/';
var CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/lynettetay/image/upload';

// response = JSON.parse(ev.target.responseText);

// Store the image details
/*image = {
                    angle: 0,
                    height: parseInt(response.height),
                    maxWidth: parseInt(response.width),
                    width: parseInt(response.width)
         };

// Apply a draft size to the image for editing
image.filename = parseCloudinaryURL(response.url)[0];
image.url = buildCloudinaryURL(
                    image.filename,
                    [{c: 'fit', h: 600, w: 600}]
                    );*/
                
            

        // Build the form data to post to the server
       formData = new FormData();
       formData.append(cameraSensor.toDataURL("image/webp"), file);
       formData.append('upload_preset', CLOUDINARY_PRESET_NAME);

        // Make the request
        var xhr = new XMLHttpRequest();
        xhr.open('POST', CLOUDINARY_UPLOAD_URL, true);
        xhr.send(formData);

var respone = xhr.response;
var data = JSON.parse(response);

console.log(data["text"]);

/*// Define settings for the uploader 
var CLOUDINARY_PRESET_NAME = 'lynettetay';
var CLOUDINARY_RETRIEVE_URL = 'http://res.cloudinary.com/lynettetay/image/upload/';
var CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/lynettetay/image/upload';

 function xhrComplete(ev) {
            var response;

            // Clear the request
            xhr = null
            xhrProgress = null
            xhrComplete = null

            // Handle the result of the upload
            if (parseInt(ev.target.status) == 200) {
                // Unpack the response (from JSON)
                response = JSON.parse(ev.target.responseText);

                // Store the image details
                image = {
                    angle: 0,
                    height: parseInt(response.height),
                    maxWidth: parseInt(response.width),
                    width: parseInt(response.width)
                    };

                // Apply a draft size to the image for editing
                image.filename = parseCloudinaryURL(response.url)[0];
                image.url = buildCloudinaryURL(
                    image.filename,
                    [{c: 'fit', h: 600, w: 600}]
                    );
                
                // Populate the dialog
                dialog.populate(image.url, [image.width, image.height]);

            } else {
                // The request failed, notify the user
                new ContentTools.FlashUI('no');
            }
        }

     
        // Build the form data to post to the server
        formData = new FormData();
        formData.append('/storage/emulated/0/DCIM/aaa.jpg', file);
        formData.append('upload_preset', CLOUDINARY_PRESET_NAME);

        // Make the request
        xhr = new XMLHttpRequest();
        xhr.addEventListener('readystatechange', xhrComplete);
        xhr.open('POST', CLOUDINARY_UPLOAD_URL, true);
        xhr.send(formData);
        */

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

var dotenv = require('dotenv');
dotenv.load();

var fs = require('fs');
var cloudinary = require('cloudinary').v2;


var uploads = {};

// set your env variable CLOUDINARY_URL or set the following configuration
/*cloudinary.config({
  cloud_name: '',
  api_key: '',
  api_secret: ''
});*/

console.log( "** ** ** ** ** ** ** ** ** Uploads ** ** ** ** ** ** ** ** ** **");

// File upload
cloudinary.uploader.upload('pizza.jpg',{tags:'basic_sample'},function(err,image){
  console.log();
  console.log("** File Upload");
  if (err){ console.warn(err);}
  console.log("* public_id for the uploaded image is generated by Cloudinary's service.");
  console.log("* "+image.public_id);
  console.log("* "+image.url);
  waitForAllUploads("pizza",err,image);
});


// Stream upload
var upload_stream= cloudinary.uploader.upload_stream({tags: 'basic_sample'},function(err,image) {
  console.log();
  console.log("** Stream Upload");
  if (err){ console.warn(err);}
  console.log("* Same image, uploaded via stream");
  console.log("* "+image.public_id);
  console.log("* "+image.url);
  waitForAllUploads("pizza3",err,image);
});
var file_reader = fs.createReadStream('pizza.jpg').pipe(upload_stream);


// File upload (example for promise api)
cloudinary.uploader.upload('pizza.jpg',{tags:'basic_sample'})
.then(function(image){
  console.log();
  console.log("** File Upload (Promise)");
  console.log("* public_id for the uploaded image is generated by Cloudinary's service.");
  console.log("* "+image.public_id);
  console.log("* "+image.url);
})
.catch(function(err){
  console.log();
  console.log("** File Upload (Promise)");
  if (err){ console.warn(err);}
});



// Public Id
cloudinary.uploader.upload('pizza.jpg',{tags: 'basic_sample',public_id:'my_favorite_pizza'},function(err,image){
  console.log();
  console.log("** Public Id");
  if (err){ console.warn(err);}
  console.log("* Same image, uploaded with a custom public_id");
  console.log("* "+image.public_id);
  console.log("* "+image.url);
  waitForAllUploads("pizza2",err,image);
});


// Eager Transformations:
// Applied as soon as the file is uploaded, instead of lazily applying them when accessed by your site's visitors.
var eager_options = {
  width: 200, height: 150, crop: 'scale', format: 'jpg'
};
cloudinary.uploader.upload("lake.jpg", {tags : "basic_sample", public_id : "blue_lake", eager: eager_options}, function(err,image){
  // "eager" parameter accepts a hash (or just a single item). You can pass
  // named transformations or transformation parameters as we do here.
  console.log();
  console.log("** Eager Transformations");
  if (err){ console.warn(err);}
  console.log("* "+image.public_id);
  console.log("* "+image.eager[0].url);
  waitForAllUploads("lake",err,image);
});


// Remote URL:
// In the two following examples, the file is fetched from a remote URL and stored in Cloudinary.
// This allows you to apply transformations and take advantage of Cloudinary's CDN layer.
cloudinary.uploader.upload('http://res.cloudinary.com/lynettetay/image/upload/couple.jpg', {tags : "basic_sample"}, function(err,image){
  console.log();
  console.log("** Remote Url");
  if (err){ console.warn(err);}
  console.log("* "+image.public_id);
  console.log("* "+image.url);
  waitForAllUploads("couple",err,image);
});


// Here, the transformation is applied to the uploaded image BEFORE storing it on the cloud.
// The original uploaded image is discarded.
cloudinary.uploader.upload('http://res.cloudinary.com/lynettetay/image/upload/couple.jpg',
                           {"tags":"basic_sample","width":500,"height":500,"crop":"fit","effect":"saturation:-70"} ,
                           function(err,image){
                             console.log();
                             console.log("** Remote Url");
                             if (err){ console.warn(err);}
                             console.log("* "+image.public_id);
                             console.log("* "+image.url);
                             waitForAllUploads("couple2",err,image);
                           });


 function waitForAllUploads(id,err,image){
   uploads[id] = image;
   var ids = Object.keys(uploads);
   if (ids.length==6){
     console.log();
     console.log ('**  uploaded all files ('+ids.join(',')+') to cloudinary');
     performTransformations();
   }
 }

function performTransformations(){
  console.log();
  console.log();
  console.log();
  console.log( ">> >> >> >> >> >> >> >> >> >>  Transformations << << << << << << << << << <<");
  console.log();
  console.log( "> Fit into 200x150");
  console.log( "> " + cloudinary.url(uploads.pizza2.public_id, {width: 200, height: 150, crop: "fit", format: "jpg"}));

  console.log();
  console.log( "> Eager transformation of scaling to 200x150");
  console.log( "> " + cloudinary.url(uploads.lake.public_id, eager_options));

  console.log();
  console.log( "> Face detection based 200x150 thumbnail");
  console.log( "> " + cloudinary.url(uploads.couple.public_id, {width: 200, height: 150, crop: "thumb", gravity: "faces", format: "jpg"}));

  console.log();
  console.log( "> Fill 200x150, round corners, apply the sepia effect");
  console.log( "> " + cloudinary.url(uploads.couple2.public_id, {width: 200, height: 150, crop: "fill", gravity: "face", radius: 10, effect:"sepia", format: "jpg"}));

  console.log();
  console.log( "> That's it. You can now open the URLs above in a browser");
  console.log( "> and check out the generated images.");
}
