(function() {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 900; // We will scale the photo width to this
  var height = 0; // This will be computed based on the input stream

  // Camera (on?) streaming
  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var camera = null;
  var video = null;
  var videoOverlay = null;
  var canvas = null;
  var photo = null;
  var output = null;
  var takeBtn = null;
  var isTake = true;

  function startup() {
    camera = document.getElementById('camera');
    video = document.getElementById('video');
    videoOverlay = document.getElementById('videoOverlay');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    //output = document.getElementsByClassName('output');
    takeBtn = document.getElementById('takeBtn');

    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      })
      .then(function(stream) {
        video.srcObject = stream;
        video.play();
      })
      .catch(function(err) {
        console.log("An error occurred: " + err);
      });

    video.addEventListener('canplay', function(ev) {
      if (!streaming) {
        width = video.videoWidth
        height = video.videoHeight / (video.videoWidth / width);

        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.

        if (isNaN(height)) {
          height = width / (4 / 3);
        }

        //camera.setAttribute('width', width);
        console.log("HEIGHT: " + height);
        camera.height = height;
        photo.setAttribute('width', width);
        photo.setAttribute('height', height);
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    takeBtn.addEventListener('click', function(ev) {
      takeBtn.disabled = true;
      if (isTake) {
        takepicture();
        isTake = false;
      } else {
        retake();
        isTake = true;
      }
      takeBtn.disabled = false;
      ev.preventDefault();
    }, false);

    clearphoto();
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }

  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      width = video.offsetWidth;
      height = video.offsetHeight;
      console.log("w: " + width);
      console.log("h: " + height);
      canvas.width = width;
      canvas.height = height;
      photo.width = width
      photo.height = height;

      context.drawImage(video, 0, 0, width, height);

      var data = canvas.toDataURL('image/jpg');
      photo.setAttribute('src', data);
      video.style.display = 'none';
      photo.style.zIndex = "99";
      photo.style.display = 'block';
      takeBtn.innerHTML = 'Retake';
    } else {
      clearphoto();
    }
  }

  function retake() {
    video.style.display = 'block';
    photo.style.display = 'none';
    photo.style.zIndex = "-1";
    takeBtn.innerHTML = 'Take photo';
  }
  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener('load', startup, false);
})();
