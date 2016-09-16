var Constants = require('./Constants.js');

var audio_video_constaints = {};

class StreamBackEnd
{
    constructor()
    {
        var constants = new Constants();
        audio_video_constaints = constants.getConstraints();
    }

    successCallback(stream)
    {
        window.stream = stream; // stream available to console
        var video = document.querySelector("localVideo");
        video.src = window.URL.createObjectURL(stream);
    }

    errorCallback(error)
    {
        console.log("getUserMedia error: ", error);
    }

    setLocalUserVideo()
    {
        navigator.getUserMedia(audio_video_constaints, this.successCallback, this.errorCallback);
    }

}

module.exports = StreamBackEnd;