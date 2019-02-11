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

function parseCloudinaryURL(url) {
    // Parse a Cloudinary URL and return the filename and list of transforms
    var filename, i, j, transform, transformArgs, transforms, urlParts;

    // Strip the URL down to just the transforms, version (optional) and
    // filename.
    url = url.replace(CLOUDINARY_RETRIEVE_URL, '');

    // Split the remaining path into parts
    urlParts = url.split('/');

    // The path starts with a '/' so the first part will be empty and can be
    // discarded.
    urlParts.shift();

    // Extract the filename
    filename = urlParts.pop();

    // Strip any version number from the URL
    if (urlParts.length > 0 && urlParts[urlParts.length - 1].match(/v\d+/)) {
        urlParts.pop();
    }

    // Convert the remaining parts into transforms (e.g `w_90,h_90,c_fit >
    // {w: 90, h: 90, c: 'fit'}`).
    transforms = [];
    for (i = 0; i < urlParts.length; i++) {
        transformArgs = urlParts[i].split(',');
        transform = {};
        for (j = 0; j < transformArgs.length; j++) {
            transform[transformArgs[j].split('_')[0]] =
                transformArgs[j].split('_')[1];
        }
        transforms.push(transform);
    }

    return [filename, transforms];
}

function buildCloudinaryURL(filename, transforms) {
    // Build a Cloudinary URL from a filename and the list of transforms 
    // supplied. Transforms should be specified as objects (e.g {a: 90} becomes
    // 'a_90').
    var i, name, transform, transformArgs, transformPaths, urlParts;

    // Convert the transforms to paths
    transformPaths = [];
    for  (i = 0; i < transforms.length; i++) {
        transform = transforms[i];
        
        // Convert each of the object properties to a transform argument
        transformArgs = [];
        for (name in transform) {
            if (transform.hasOwnProperty(name)) {
                transformArgs.push(name + '_' + transform[name]);
            }
        }
        
        transformPaths.push(transformArgs.join(','));
    }
    
    // Build the URL
    urlParts = [CLOUDINARY_RETRIEVE_URL];
    if (transformPaths.length > 0) {
        urlParts.push(transformPaths.join('/'));
    }
    urlParts.push(filename);

    return urlParts.join('/');
}

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
                
            

        // Build the form data to post to the server
        formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_PRESET_NAME);

        // Make the request
        xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', xhrProgress);
        xhr.addEventListener('readystatechange', xhrComplete);
        xhr.open('POST', CLOUDINARY_UPLOAD_URL, true);
        xhr.send(formData);

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
