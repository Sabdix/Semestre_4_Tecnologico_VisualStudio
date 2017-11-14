(function () {
    "use strict";
    var captura = Windows.Media.Capture;
    function init() {
        WinJS.UI.processAll().done(
            function (){
                var cmdTakePicture = document.getElementById(
                "cmdTakePicture");
                var imgFoto = document.getElementById(
                    "imgFoto");
                cmdTakePicture.addEventListener("click",
                    function (){
                        var captureUI = new captura.CameraCaptureUI();
                        captureUI.photoSettings.format =
                            captura.CameraCaptureUIPhotoFormat.png;
                        captureUI.captureFileAsync(
                            captura.CameraCaptureUIMode.photo).done(
                            function (foto){
                                if (foto){
                                    var fotoURL = 
                                        URL.createObjectURL(foto)
                                    imgFoto.src = fotoURL;
                                }
                            });
                    });
            });
    }
    document.addEventListener("DOMContentLoaded", init);
})();