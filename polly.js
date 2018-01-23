var polly = new AWS.Polly(
    {region: "us-west-2",}
);
var params = {
    OutputFormat: "mp3",
    SampleRate: "16000",
    TextType: "text",
    VoiceId: "Joanna"
};
var audio = new Audio();
var isSpeaking = false;

var updateVoice = function(voiceId) {
  params.VoiceId = voiceId;
};

var populateVoices = function(element, voices) {
  for (var voice in voices) {
    var opt = document.createElement("option");
    opt.value = index;
    opt.innerHtml = element;
  }
};
var speakThoseWords =  function(err, data) {
    if (err) console.log(err);
    else {
        var url = URL.createObjectURL(new Blob([new Uint8Array(data.AudioStream).buffer]));
        audio.src = url;
        audio.play();
        isSpeaking = true;
    }
};

var speakListener = function(utterance, options, sendTtsEvent) {
  sendTtsEvent({'type': 'start', 'charIndex': 0});
  params.Text = utterance;
  polly.synthesizeSpeech(params, speakThoseWords);
  sendTtsEvent({'type': 'end', 'charIndex': utterance.length});
};

var stopListener = function() {
  audio.pause();
  isSpeaking = false;
};

chrome.ttsEngine.onSpeak.addListener(speakListener);
chrome.ttsEngine.onStop.addListener(stopListener);
chrome.tts.getVoices(function(voices) {console.log(voices);});
