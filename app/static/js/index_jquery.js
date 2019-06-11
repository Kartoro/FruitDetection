$(document).ready(function() {
    var dataUpload;

    $("#takeBtn").click(function() {
        dataUpload = null;
        $("#inputImage").click();

        var $inputImage = $('#inputImage');
        $inputImage.change(function(e) {
            var i = 0;
            $("#photoFrame").empty();
            var loadingImage = loadImage(
                e.target.files[0],
                function(img) {
                    console.log(i++);
                    console.log(img);
                },
                // options
                {
                    maxWidth: 500,
                    maxHeight: 1000,
                    orientation: true,
                    canvas: false
                }
            );
            //loadingImage.onload = loadingImage.onerror = null;
            e.preventDefault();
        });

    });

    $("#upBtn").click(function() {
        if (dataUpload == null) {
            return;
        }
        sendFile(dataUpload);
    });


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
