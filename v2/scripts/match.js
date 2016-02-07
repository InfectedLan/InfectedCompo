var Match = (function(){
    var matchObj = {};

    matchObj.init = function(){
	console.log("Initializing chat");
	if(!Websocket.isConnected()) {
	    Websocket.connect(Websocket.getDefaultConnectUrl());
	    Websocket.onOpen = function() {
		Websocket.authenticate();
	    };
	}
	Websocket.sendIntent("subscribeMatches", []);
    };

    return matchObj;
})();
