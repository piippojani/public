$( document ).ready(function() {
  var msg = {
    messageType: "SETTINGS",
    options: {
      "width": 600,
      "height": 400
    }
  };
  console.log(msg);
  parent.postMessage( msg, "*" );
});

// check for browser support
if ( window.addEventListener ) {
  // onload
  window.addEventListener('load', function() {
      var saveButton = document.getElementById('saveGame');
      var loadButton = document.getElementById('loadGame');

      function reverse(s){
        return s.split("").reverse().join("");
      };

      saveButton.onclick = function() {
        var msg = {
          messageType: "SAVE",
          gameState: getGameState()
        };
        console.log(msg);
        parent.postMessage( msg, "*" );
      };

      loadButton.onclick = function() {
        var msg = {
          messageType: "LOAD_REQUEST"
        };
        parent.postMessage( msg, "*" );
      };

  }, false);

  window.addEventListener("message", function(evt) {
      if(evt.data.messageType === "LOAD") {
        gameState = evt.data.gameState;
        loadGameState(gameState);
      } else if (evt.data.messageType === "ERROR") {
        alert(evt.data.info);
      }
    });
}

function sendScoreToService(score){
  var msg = {
    messageType: "SCORE",
    score: score // Float
  };
  console.log(msg);
  parent.postMessage( msg, "*" );
}
