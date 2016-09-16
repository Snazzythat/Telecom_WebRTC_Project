
var StreamBackend = require('./StreamBackend.js');

console.log('Constructing new app.');
var st = new StreamBackend();
console.log('Executing...');
console.log('Setting local video and audio stream...');
st.setLocalUserVideo();

