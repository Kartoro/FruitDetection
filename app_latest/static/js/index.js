(function() {
    var dataUpload;
    var takeBtn = document.querySelector("#takeBtn");
    var photoFrame = document.querySelector("#photoFrame");
    takeBtn.addEventListener("click", function() {
        dataUpload = null;
        var inputImage = document.querySelector("#inputImage");
        inputImage.click();
        inputImage.onchange = function(e) {
            while (photoFrame.firstChild) {
                photoFrame.removeChild(photoFrame.firstChild);
            }
            var loadingImage = loadImage(
                e.target.files[0],
                function(img) {
                    photoFrame.appendChild(img);
                    console.log(img);
                },
                // options
                {
                    //maxWidth: photoFrame.offsetWidth,
                    maxWidth: 2000,
                    maxHeight: 2000,
                    orientation: true,
                    canvas: true,
                    noRevoke: true
                }
            );
            //loadingImage.onload = loadingImage.onerror = null;
            e.preventDefault();
        };

    }, false);

    document.querySelector("#upBtn").addEventListener("click", function() {
        var canvas = photoFrame.querySelector("canvas");
        if (canvas == null) {
            alert("Please take a photo or select a file.");
            return;
        }
        sendFile(canvas);
    });

    function processImage(canvas) {
        //var formData = new FormData();
        return new Promise(function(resolve, reject) {
            canvas.toBlob(function(blob) {
                    console.log("Processing image...");
                    resolve(blob);
                },
                'image/jpeg', 0.95);
        });
    }

    function sendFile(canvas) {
        processImage(canvas).then(function(blob) {
            var formData = new FormData();
            formData.append('image', blob, 'pic.jpg');
            return formData;
        }).then(function(formSent) {
            $.ajax({
                type: 'POST',
                url: '/upload',
                data: formSent,
                contentType: false,
                processData: false,
                success: function(res) {
                    //res = JSON.parse(data);
                    if (res.code == 200) {
                        console.log('Your file was successfully uploaded!');
                        $("#photoFrame").append("<img id='resImg'/><p id='count'></p>");
                        $("canvas").hide();
                        $("#resImg").attr("src", 'data:image/jpeg;base64,'+res.img.replace(/^b'|'$/g,''));
                        $("#count").text("count = " + res.count);
                    } else {
                        console.log('!!! There was an error uploading your file!');
                    }
                },
                error: function(res) {
                    //res = JSON.parse(data);
                    console.log(res.code);
                }
            });
        });
    }

})();
