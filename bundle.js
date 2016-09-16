(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//Constants class
class Constants
{
    constructor()
    {
        this.constraints = {video: true, audio: true};
    }

    getConstraints()
    {
        return this.constraints;
    }

    setConstraints(constraintsDict)
    {
        this.constraints = constraintsDict;
    }
}

module.exports = Constants;

},{}],2:[function(require,module,exports){
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
},{"./Constants.js":1}],3:[function(require,module,exports){
//Module responsible for WebRTC service and browser interaction.

var RTCPeerConnection = null;
var getUserMedia = null;
var attachMediaStream = null;
var reattachMediaStream = null;
var webrtcDetectedVersion = null;

// using CHROME for now
if (navigator.webkitGetUserMedia) {
  webrtcDetectedVersion =
             parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]);

  // Creates iceServer from the url for Chrome.
  createIceServer = function(url, username, password) {
    var iceServer = null;
    var url_parts = url.split(':');
    if (url_parts[0].indexOf('stun') === 0) {
      // Create iceServer with stun url.
      iceServer = { 'url': url };
    } else if (url_parts[0].indexOf('turn') === 0) {
      if (webrtcDetectedVersion < 28) {
        // For pre-M28 chrome versions use old TURN format.
        var url_turn_parts = url.split("turn:");
        iceServer = { 'url': 'turn:' + username + '@' + url_turn_parts[1],
                      'credential': password };
      } else {
        // For Chrome M28 & above use new TURN format.
        iceServer = { 'url': url,
                      'credential': password,
                      'username': username };
      }
    }
    return iceServer;
  };

  // The RTCPeerConnection object.
  RTCPeerConnection = webkitRTCPeerConnection;

  // Get UserMedia (only difference is the prefix).
  // Code from Adam Barth.
  getUserMedia = navigator.webkitGetUserMedia.bind(navigator);

  // Attach a media stream to an element.
  attachMediaStream = function(element, stream) {
    if (typeof element.srcObject !== 'undefined') {
      element.srcObject = stream;
    } else if (typeof element.mozSrcObject !== 'undefined') {
      element.mozSrcObject = stream;
    } else if (typeof element.src !== 'undefined') {
      element.src = URL.createObjectURL(stream);
    } else {
      console.log('Error attaching stream to element.');
    }
  };

  reattachMediaStream = function(to, from) {
    to.src = from.src;
  };

  // The representation of tracks in a stream is changed in M26.
  // Unify them for earlier Chrome versions in the coexisting period.
  if (!webkitMediaStream.prototype.getVideoTracks) {
    webkitMediaStream.prototype.getVideoTracks = function() {
      return this.videoTracks;
    };
    webkitMediaStream.prototype.getAudioTracks = function() {
      return this.audioTracks;
    };
  }

  // New syntax of getXXXStreams method in M26.
  if (!webkitRTCPeerConnection.prototype.getLocalStreams) {
    webkitRTCPeerConnection.prototype.getLocalStreams = function() {
      return this.localStreams;
    };
    webkitRTCPeerConnection.prototype.getRemoteStreams = function() {
      return this.remoteStreams;
    };
  }
} else {
  console.log("Browser does not appear to be WebRTC-capable");
}
},{}],4:[function(require,module,exports){

var StreamBackend = require('./StreamBackend.js');

console.log('Constructing new app.');
var st = new StreamBackend();
console.log('Executing...');
console.log('Setting local video and audio stream...');
st.setLocalUserVideo();


},{"./StreamBackend.js":2}]},{},[4,1,2,3]);
