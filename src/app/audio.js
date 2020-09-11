export function initAudio() {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var processor = context.createScriptProcessor(1024, 1, 1);
    processor.connect(context.destination);

    var handleSuccess = function(stream) {
      var input = context.createMediaStreamSource(stream);
      input.connect(processor);

      var receivedAudio = false;
      processor.onaudioprocess = function(e) {
        // This will be called multiple times per second.
        // The audio data will be in e.inputBuffer
        if (!receivedAudio) {
          receivedAudio = true;
        }
      };
    };

    return navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(handleSuccess);
}

export function plu () { // playLevelUp
  pa(',,80,.3,.4,.7,2,.1,-0.73,3.42,-430,.09,.17,,,,.19');
}

export function pc() { // playConfused
  pa(',.1,75,.03,.08,.17,1,1.88,7.83,,,,,.4')
}

export function pa(seq) { // playAudio
  zzfx(...eval(`[${seq}]`))
}