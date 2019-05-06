$(document).ready(function() {
    var dataUpload;

    $("#takeBtn").click(function() {
        dataUpload = null;
        $("#inputImage").click();

        if (window.File && window.FileReader && window.FormData && window.FileList && window.Blob) {
            var $inputImage = $('#inputImage');

            $inputImage.change(function(e) {
                var file = e.target.files[0];

                if (file) {
                    if (/^image\//i.test(file.type)) {
                        readFile(file);
                    } else {
                        alert('Not a valid image!');
                    }
                }
            });
        } else {
            alert("File upload is not supported!");
        }
    });

    $("#upBtn").click(function() {
        if (dataUpload == null) {
            return;
        }
        sendFile(dataUpload);
    });


    function readFile(file) {
        var reader = new FileReader();
        reader.onloadend = function() {
            dataUpload = reader.result;
            processFile(dataUpload, file.type);
        };
        reader.onerror = function() {
            alert('There was an error reading the file!');
        };
        //$("#log").innerHTML =
        reader.readAsDataURL(file);
    }

    function processFile(dataURL, fileType) {
        var maxWidth = 800;
        var maxHeight = 800;

        var image = new Image();
        image.src = dataURL;

        image.onload = function() {
            var width = this.naturalWidth;
            var height = this.naturalHeight;

            console.log("w: " + width + " x h: "+height);
            var shouldResize = (width > maxWidth) || (height > maxHeight);

            var newWidth;
            var newHeight;

            if (width > height) {
                newHeight = height * (maxWidth / width);
                newWidth = maxWidth;
            } else {
                newWidth = width * (maxHeight / height);
                newHeight = maxHeight;
            }

            //var canvas = document.createElement('canvas');
            //var $canvas = $("#canvas");
            $("#canvas").attr("width", width);
            $("#canvas").attr("height", height);

            var context = $("#canvas")[0].getContext('2d');

            context.drawImage(this, 0, 0);


            console.log("w: " + width + " x h: "+height);
            //$("#photoFrame").height(height + "px");
            $("#photo").width(width);
            $("#photo").height(height);
            dataUpload = $("#canvas")[0].toDataURL(fileType);
            console.log(dataUpload);
            $("#photo").attr("src", dataUpload);
            $("#photo").show();
            //sendFile(dataURL);
        };

        image.onerror = function() {
            alert('There was an error processing your file!');
        };
    }

    function sendFile(fileData) {
        var formData = new FormData();

        formData.append('imageData', fileData);

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

});
