document.getElementById("queueTab").addEventListener("click", function(){
	// document.getElementById("boostView").setAttribute("hidden", "hidden");
	document.getElementById("infoView").setAttribute("hidden", "hidden");
    document.getElementById("queueView").removeAttribute("hidden"); 
});

// document.getElementById("boostTab").addEventListener("click", function(){
//     document.getElementById("queueView").setAttribute("hidden", "hidden");
// 	document.getElementById("infoView").setAttribute("hidden", "hidden");
//     document.getElementById("boostView").removeAttribute("hidden"); 
// });

document.getElementById("infoTab").addEventListener("click", function(){
    // document.getElementById("boostView").setAttribute("hidden", "hidden");
	document.getElementById("queueView").setAttribute("hidden", "hidden");
    document.getElementById("infoView").removeAttribute("hidden"); 
});

var queueConfig;
var streamerOnline = true;

if(window.Twitch.ext) {

  function updateHTML(panelConfig){
    if (panelConfig.PanelActive && streamerOnline){
      document.getElementById("topNavLabel").innerHTML = "Game With Me";
      document.getElementById("navImages").style.background = panelConfig.HeaderCSS;
      document.getElementById("mainContainer").style.background = "#09161d";
      document.getElementById("bottomNav").style.display = "flex";
      document.getElementById("queueView").style.background = "#09161d";
      document.getElementsByClassName("pixeltable")[0].innerHTML = "";

      var customStyles = document.createElement('div');
      customStyles.innerHTML = `
      <style>
        #bottomNav label:hover {
            background-color:` + panelConfig.ThemeColor + `;
        }
        #mainContainer #bottomNav input[type=radio]:checked+label {
            background-color:` + panelConfig.ThemeColor + `;
        }
        .pixelinfo {
            color:` + panelConfig.ThemeColor + `;
        }
      </style>`;

      document.body.appendChild(customStyles);
    } else {
      document.getElementById("topNavLabel").innerHTML = "Game With Me <span style='font-size:8px'>(currently disabled)</span>";
      document.getElementById("navImages").style.background = "transparent";
      document.getElementById("mainContainer").style.background = panelConfig.HeaderCSS;
      document.getElementById("bottomNav").style.display = "none";
      document.getElementById("queueView").style.background = "transparent";
      document.getElementsByClassName("pixeltable")[0].innerHTML = "<span style='color:hsla(0, 0%, 100%, .8);'>" + panelConfig.InactiveText + "</span>";
    }
  }

  function checkConfig(auth) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            var tmpQueueConfig = JSON.parse(xmlHttp.responseText).queueConfig;

            // change has occurred.
            if (queueConfig.PanelActive != tmpQueueConfig.PanelActive) {
                queueConfig = tmpQueueConfig;
                updateHTML(queueConfig);
                updateQueue(auth);
            }
        } 
    }
    xmlHttp.open("GET", "https://www.pixelsgaming.com:8080/queueConfigPublic?twitch_id=" + auth.channelId, true); 
    xmlHttp.send();
  }

  function loadConfig(auth) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            queueConfig = JSON.parse(xmlHttp.responseText).queueConfig;

            updateHTML(queueConfig);
            updateQueue(auth);
        } else {
          var myEle = document.getElementById("pixelsErrorMessage");
          if(!myEle){
            document.getElementsByClassName("pixeltable")[0].insertAdjacentHTML('beforeend', "<div id='pixelsErrorMessage' style='color:white; background-color:red; padding:5px;'>The queue is not yet configured. Please follow the steps on the config page to set up the Game Queue!</div>");
          }
        }
    }
    xmlHttp.open("GET", "https://www.pixelsgaming.com:8080/queueConfigPublic?twitch_id=" + auth.channelId, true); 
    xmlHttp.send();
  }

  function updateQueue(auth) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            var userSpots = JSON.parse(xmlHttp.responseText).userSpots;

            var tmpHTML = `
              <tr class='table-row'>
                  <th>Position</th>
                  <th class='table-mid'>User</th>
              </tr>
            `;

            for (var i = 0; i < userSpots.length; i++) {
              var position = i + 1;
              var username = userSpots[i].BattleTag;
              var isSubscriber = userSpots[i].IsSubscriber;

              var userImage = "<img class='user-img' src='https://s3.us-west-2.amazonaws.com/pixelsgaming/assets/images/logo/logo_inverse.png' height='20'>";

              if (isSubscriber) {

                userImage = "<img class='user-img' src='https://s3.us-west-2.amazonaws.com/pixelsgaming/assets/images/twitch/subscriber.png' height='20'>";
              }

              tmpHTML += `
                <tr class='table-row'>
                    <td class='user-position'>
                        <div class='user-position-wrapper'>
                            <span>` + position + `</span>
                        </div>
                    </td>
                    <td class='user-name'>
                        <div>` + userImage + `</div>
                        <div>
                            <a class='dark' href='#'>` + username + `</a>
                        </div><!---->
                    </td>
                </tr>
              `;
            }

            if (queueConfig.PanelActive && streamerOnline){
                document.getElementsByClassName("pixeltable")[0].innerHTML = "";
                document.getElementsByClassName("pixeltable")[0].insertAdjacentHTML('beforeend', tmpHTML);
            }
        } else if (xmlHttp.status == 500) {
          document.getElementsByClassName("pixeltable")[0].innerHTML = "";
          document.getElementsByClassName("pixeltable")[0].insertAdjacentHTML('beforeend', "<span style='color:white;'>The queue is empty.</span>");
        }
    }
    xmlHttp.open("GET", "https://www.pixelsgaming.com:8080/streamerQueue?twitch_id=" + auth.channelId, true); 
    xmlHttp.send();
  }

  window.Twitch.ext.onAuthorized(function(auth) {

    loadConfig(auth);

    // start timer
    setInterval(function(){ 
      checkConfig(auth);

      if (queueConfig.PanelActive && streamerOnline){
        updateQueue(auth);
      }
    }, 10000);
  });

  window.Twitch.ext.onContext(function(context, contextFields) {
    
  });
  
  window.Twitch.ext.onError(function(err) {
    
  });
  
}
