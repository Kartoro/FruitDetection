// Funtions to control web front-end elements,
// process input imamge, send to server,
// and get labelled image and count response.

(function() {
    var takeBtn = document.querySelector("#takeBtn");
    var photoFrame = document.querySelector("#photoFrame");
    $("#loading").hide();

    // Click camera button to input image
    takeBtn.addEventListener("click", function() {
        var inputImage = document.querySelector("#inputImage");
        inputImage.click();
        inputImage.onchange = function(e) {
            $("#initOver>h3").hide();
            while (photoFrame.firstChild) {
                photoFrame.removeChild(photoFrame.firstChild);
            }
            // Process input image
            var loadingImage = loadImage(
                e.target.files[0],
                function(img) {
                    photoFrame.appendChild(img);
                },
                // options
                {
                    maxWidth: 2000,
                    maxHeight: 2000,
                    orientation: true,
                    canvas: true,
                    noRevoke: true
                }
            );
            e.preventDefault();
        };
    }, false);

    // Click upload button to send image
    document.querySelector("#upBtn").addEventListener("click", function() {
        var canvas = photoFrame.querySelector("canvas");
        if (canvas == null) {
            alert("Please take a photo or select a file.");
            return;
        }
        sendFile(canvas);
    });

    // Convert canvas to blob
    function processImage(canvas) {
        return new Promise(function(resolve, reject) {
            canvas.toBlob(function(blob) {
                    console.log("Processing image...");
                    resolve(blob);
                },
                'image/jpeg', 0.95);
        });
    }

    // Ajax send image to server
    function sendFile(canvas) {
        processImage(canvas).then(function(blob) {
            var formData = new FormData();
            formData.append('image', blob, 'pic.jpg');
            return formData;
        }).then(function(formSent) {
            $("#loading").fadeIn();
            $.ajax({
                type: 'POST',
                url: '/upload',
                data: formSent,
                contentType: false,
                processData: false,
                success: function(res) {
                    if (res.code == 200) {
                        console.log('Your file was successfully processed!');
                        $("#loading").fadeOut();
                        $("#photoFrame").append("<img id='resImg'/><p id='count'></p>");
                        $("canvas").hide();
                        $("#resImg").attr("src", 'data:image/jpeg;base64,' + res.img.replace(/^b'|'$/g, ''));
                        $("#count").text("count = " + res.count);
                    } else {
                        $("#loading").fadeOut();
                        console.log(res.code + " - There was an error uploading your file!");
                    }
                },
                error: function(res) {
                    $("#loading").fadeOut();
                    console.log(res.code + " - Error!");
                }
            });
        });
    }

})();
