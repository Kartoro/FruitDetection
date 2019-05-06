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
                    maxWidth: photoFrame.offsetWidth,
                    maxHeight: 1000,
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
        canvas.toBlob(function(blob) {
            console.log("Processing image...");
            console.log(URL.createObjectURL(blob));
            return URL.createObjectURL(blob);
        },
        'image/jpeg', 0.95);
    }

    function sendFile(data) {
        var urlData = processImage(data);
        var formData = new FormData();

        formData.append('imageData', urlData);

        $.ajax({
            type: 'POST',
            url: '/upload',
            data: formData,
            contentType: false,
            processData: false,
            success: function(data) {
                if (data.success) {
                    console.log('Your file was successfully uploaded!');
                } else {
                    console.log('There was an error uploading your file!');
                }
            },
            error: function(data) {
                console.log('There was an error uploading your file!');
            }
        });
    }

})();
