var fileupload;
var button_upload;
var button_download;
var preview;
var previewContext;
var image;
var download;
var settings;

var setting_red;
var setting_contrast;
var setting_crispyness;

var filename = "Image";

window.addEventListener("load", function() {
    fileupload = document.getElementById("fileupload");
    button_upload = document.getElementById("button-upload");
    button_download = document.getElementById("button-download");
    preview = document.getElementById("preview");
    previewContext = preview.getContext("2d");
    image = document.getElementById("image");
    download = document.getElementById("download");
    settings = document.getElementsByClassName("setting");

    setting_red = document.getElementById("red");
    setting_contrast = document.getElementById("contrast");
    setting_crispyness = document.getElementById("crispyness");


    fileupload.addEventListener("input", function() {
        var filepath = fileupload.value.split("\\");
        filename = filepath[filepath.length-1];
    
        var file = fileupload.files[0];
        var reader  = new FileReader();
        
        reader.onload = function(e)  {
            image.onload = function() {
                deepfry();
            };
            image.src = e.target.result;
        }
        reader.readAsDataURL(file);
    
        button_upload.innerHTML = filename;
    });

    button_download.addEventListener("click", function() {
        var downloadURL = preview.toDataURL();
        download.href = downloadURL;
        download.download = filename;
        download.click();
    });

    for (var i = 0; i < settings.length; i ++) {
        settings[i].addEventListener("change", function() {
            deepfry();
        });
    }
})

async function deepfry() {
    if (image.src != undefined) {
        preview.width = image.width;
        preview.height = image.height;
    
        previewContext.drawImage(image, 0, 0);
    
        var imageData = previewContext.getImageData(0, 0, preview.width, preview.height);
        var data = imageData.data;
    
        for (var i = 0; i < data.length; i += 4) {
    
            // red
    
            data[i] = Math.min(255, (data[i] + (setting_red.value / 100) * 255));
            data[i+1] = Math.max(0, (data[i+1] - (setting_red.value / 100) * 100));
            data[i+2] = Math.max(0, (data[i+2] - (setting_red.value / 100) * 100));
    
            // contrast

            var contrast = 1 + (setting_contrast.value / 100);
    
            data[i] = Math.min(255, contrast * (data[i] - 128) + 128 + 1); // ... + 1 = brightness
            data[i+1] = Math.min(255, contrast * (data[i+1] - 128) + 128 + 1);
            data[i+2] = Math.min(255, contrast * (data[i+2] - 128) + 128 + 1);
    
            // crispyness

            var crispyness_shift = ((Math.random()*2) - 1) * (setting_crispyness.value / 100);
            
            data[i] = Math.max(0, Math.min(255, (data[i] + (crispyness_shift * 255))));
            data[i + 1] = Math.max(0, Math.min(255, (data[i + 1] + (crispyness_shift * 255))));
            data[i + 2] = Math.max(0, Math.min(255, (data[i + 2] + (crispyness_shift * 255))));
            
        }
        previewContext.putImageData(imageData, 0, 0);
    }
}