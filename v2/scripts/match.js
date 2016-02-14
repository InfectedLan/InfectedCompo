var Match = (function(){
    var matchObj = {};
    var currMatchData = null;

    var renderReadyScreen = function() { //This is the same on all plugins
	var readyData = currMatchData.readyData;
	var acceptScreenLayout = [];
	acceptScreenLayout.push('<br /><br />');
	if(matchObj.shouldAcceptMatch(datastore["userData"].id)) {
	    acceptScreenLayout.push('<p id="matchAcceptBtn" class="acpt acptLarge">ACCEPT</p>');
	} else {

	}
	acceptScreenLayout.push('<div id="vsBox">');
	acceptScreenLayout.push('<div id="vsTitle">');
	acceptScreenLayout.push('<span class="yourTeam"> ' + readyData[0].clanName + " - " + readyData[0].clanTag + ' </span> vs <span class="theirTeam"> ' + readyData[1].clanName + " - " + readyData[1].clanTag + ' </span>');
	acceptScreenLayout.push('</div>');
	acceptScreenLayout.push('<div id="vsLeft">');
	for(var i = 0; i < readyData[0].members.length; i++)
	{
	    acceptScreenLayout.push('<div class="leftPlayer">');
	    acceptScreenLayout.push('<div class="playerImg"><img src="../api/' + readyData[0].members[i].avatarUrl + '" /></div>');
	    acceptScreenLayout.push('<span class="playerName">' + readyData[0].members[i].nick + '</span>');
	    if(readyData[0].members[i].ready) {
		acceptScreenLayout.push('<div class="rdyBtn YESrdy"><p>READY</p></div>');
	    } else {
		acceptScreenLayout.push('<div class="rdyBtn NOrdy"><p>NOT READY</p></div>');
	    }
	    acceptScreenLayout.push('</div>');
	}
	acceptScreenLayout.push('</div>');
	acceptScreenLayout.push('<div id="vsRight">');
	for(var i = 0; i < readyData[1].members.length; i++)
	{
	    acceptScreenLayout.push('<div class="rightPlayer">');
	    acceptScreenLayout.push('<div class="playerImg"><img src="../api/' + readyData[1].members[i].avatarUrl + '" /></div>');
	    acceptScreenLayout.push('<span class="playerName">' + readyData[1].members[i].nick + '</span>');
	    if(readyData[1].members[i].ready) {
		acceptScreenLayout.push('<div class="rdyBtn YESrdy"><p>READY</p></div>');
	    } else {
		acceptScreenLayout.push('<div class="rdyBtn NOrdy"><p>NOT READY</p></div>');
	    }
	    acceptScreenLayout.push('</div>');
	}
	acceptScreenLayout.push('</div>');
	acceptScreenLayout.push('</div>');

	$("#matchArea").html(acceptScreenLayout.join(""));

	$("#matchAcceptBtn").click(function(e) {
	    Match.acceptMatch(currMatchData.id);
	});
    };

    Websocket.addHandler("matchUpdate", function(data){
	console.log("Got match update:");
	console.log(data);
	if(data.length == 0) {
	    currMatchData = null;
	} else {
	    currMatchData = data[0];
	}
	renderBanner();
	renderClanList();
	if(getPageName() == "currentMatch") {
	    matchObj.renderSite(false);
	}
    });

    matchObj.renderSite = function(shouldRedrawMainContent) {
	if(currMatchData == null) {
	    $("#mainContent").html("<h1>Det er ingen nåværende matcher</h1>");
	    return;
	}
	if(shouldRedrawMainContent) {
	    $("#mainContent").html('<div id="matchArea"></div><div id="chatArea"></div>');
	    $("#chatArea").html('<h3>Chat - Match (Her kan alle chatte)</h3><div id="compoChatField"></div>');
	    Chat.bindChat('compoChatField', currMatchData.chatId, 300);
	}
	loadCompoPlugin(currMatchData.compoId, function() {
	    if(currMatchData.state == 0) {
		renderReadyScreen();
	    } else if(currMatchData.state == 1) {
		compoPlugins[currMatchData.compoId].renderCustomScreen(currMatchData);
	    } else if(currMatchData.state == 2) {
		compoPlugins[currMatchData.compoId].renderGameScreen(currMatchData);
	    }
	});
    };

    matchObj.isInMatch = function() {
	return currMatchData != null;
    };

    matchObj.isChief = function(meId) {
	var banData = currMatchData.matchData.banData;
	for(var i = 0; i < banData.clans.length; i++) {
		for(var x = 0; x < banData.clans[i].members.length; x++) {
			if(banData.clans[i].members[x].userId == meId) {
				return banData.clans[i].members[x].chief;
			}
		}
	}
	return false;
    };

    matchObj.getChatId = function() {
	return currMatchData.chat;
    };

    matchObj.cleanupMatchScreen = function() {
	Chat.unbindChat("chatArea");
    };

    matchObj.shouldAcceptMatch = function(meId){
	if(currMatchData == null || currMatchData.state > 0) {
	    return false;
	}
	for(var i = 0; i < currMatchData.readyData.length; i++) {
	    for(var x = 0; x < currMatchData.readyData[i].members.length; x++) {
		if(currMatchData.readyData[i].members[x].userId == meId) {
		    console.log(currMatchData.readyData[x].members[x].userId);
		    return !currMatchData.readyData[i].members[x].ready;
		}
	    }
	}
	return false;
    };

    matchObj.acceptMatch = function() {
	Websocket.sendIntent("ready", [currMatchData.id]);
    };

    matchObj.banMap = function(optionId) {
	Websocket.sendIntent("voteMap", [currMatchData.id, optionId]);
    };

    matchObj.init = function(){
	console.log("Initializing chat");
	if(!Websocket.isConnected() && !Websocket.isConnecting()) {
	    Websocket.connect(Websocket.getDefaultConnectUrl());
	    Websocket.onOpen = function() {
		Websocket.authenticate();
	    };
	}
	Websocket.sendIntent("subscribeMatches", []);
    };

    return matchObj;
})();
