document.getElementById("updateButton").addEventListener("click", function(){
	var form = document.querySelector('form');
	var data = new FormData(form);

	var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { }
    xmlHttp.open("POST", "https://www.pixelsgaming.com:8080/updateConfig", true); 
    xmlHttp.send(data);
});


var queueConfig;

if(window.Twitch.ext) {

  function loadConfig(auth) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            queueConfig = JSON.parse(xmlHttp.responseText).queueConfig;

            document.getElementById("queueConfigID").setAttribute("value", queueConfig.QueueConfigID);

            console.log(queueConfig)

            if (queueConfig.SubsOnly) {
            	document.getElementById("subsOnly").setAttribute("checked", "checked");
            }

            if (queueConfig.PrioritizeSubs) {
              document.getElementById("prioritizeSubs").setAttribute("checked", "checked");
            }

            document.getElementById("inactiveText").innerHTML = queueConfig.InactiveText;
            document.getElementById("headerCSS").innerHTML = queueConfig.HeaderCSS;
            document.getElementById("chatMessage").innerHTML = queueConfig.ChatMessage;
            document.getElementById("themeColor").innerHTML = queueConfig.ThemeColor;

            document.getElementById("alreadyInQueueMessage").innerHTML = queueConfig.UserAlreadyInQueue;
            document.getElementById("subsOnlyMessage").innerHTML = queueConfig.SubsOnlyMessage;
            document.getElementById("panelOfflineMessage").innerHTML = queueConfig.PanelOfflineMessage;
            document.getElementById("successfullyAddedToQueue").innerHTML = queueConfig.SuccessfullyAddedToQueue;
        } 
    }
    xmlHttp.open("GET", "https://www.pixelsgaming.com:8080/queueConfig?twitch_id=" + auth.channelId, true); 
    xmlHttp.send();
  }

  window.Twitch.ext.onAuthorized(function(auth) {
    loadConfig(auth);
  });

  window.Twitch.ext.onContext(function(context, contextFields) {
    
  });
  
  window.Twitch.ext.onError(function(err) {
    
  });
  
}