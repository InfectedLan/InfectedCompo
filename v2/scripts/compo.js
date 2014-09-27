//Variables
var compoStatusUpdateId = 0;
var matchStatusUpdateId = 0;
var matchId = 0;
var lastMatchState = -1;
var shouldRefreshTeamData = true;
//JQuery event listeners
$(document).ready(function() {
	$("#addTeam").click(function(e) {
		addTeam();
	});
	compoStatusUpdateId = setInterval(updateCompoStatus, 15000);
	updateCompoStatus();
	$("#gameBannerCsGo").click(function(e) { 
		window.location = "index.php?page=compo&id=1";
	});
	$("#gameBannerLoL").click(function(e) { 
		window.location = "index.php?page=compo&id=2";
	});
	$("#gameBannerCurrentMatch").click(function(e) {
		window.location = "index.php?page=match";
	});
});
function addTeam()
{
	window.location.href = "index.php?page=addTeam";
}
function updateCompoStatus() {
	$.getJSON('../api/json/getcompostatus.php', function(data){
		if(data.result == true) {
			if(shouldRefreshTeamData) {
 				$("#teamData").html("");
				for(var i = 0; i < data.data.clans.length; i++) {
					$("#teamData").append('<div class="teamEntry" id="teamHeaderId' + data.data.clans[i].id + '"><h1>' + data.data.clans[i].tag + '</h1><h3> - ' + data.data.clans[i].compo.tag + '</h3>');
					$("#teamHeaderId" + data.data.clans[i].id).click({teamId: data.data.clans[i].id}, function(e){window.location="index.php?page=team&id=" + e.data.teamId});
				}
			}
			if(data.data.invites.length != 0) {
				//$("#teamData").append("<h3>Invites</h3>");
				for(var i = 0; i < data.data.invites.length; i++) {
					$("#teamData").append('<div class="teamEntry" id="teamHeaderId' + data.data.invites[i].clanData.id + '"><h1>' + data.data.invites[i].clanData.tag + '</h1><h3> - ' + data.data.invites[i].compo.tag + '</h3><br /><i class="teamEntry" id="inviteAccept' + data.data.invites[i].id + '">Godta</i> - <i class="teamEntry" id="inviteDecline' + data.data.invites[i].id + '">Avslå</i></div>');
					$("#inviteAccept" + data.data.invites[i].id).click({inviteId: data.data.invites[i].id}, function(e){acceptInvite(e.data.inviteId)});
					$("#inviteDecline" + data.data.invites[i].id).click({inviteId: data.data.invites[i].id}, function(e){declineInvite(e.data.inviteId)});
					$("#teamInviteId" + data.data.invites[i].clanData.id).click({teamId: data.data.invites[i].clanData.id}, function(e){window.location="index.php?page=team&id=" + e.data.teamId});
				}
			}
			if(data.data.hasOwnProperty('match')) {
				if(data.data.match.id != matchId) {
					initMatchWatchdog(data.data.match.id);
				}
			} else {
				if(matchId != 0) {
					disableMatchWatchdog();
					matchId = 0;
					shouldRefreshTeamData = true;
				}
			}
		} else {
			error(data.message);
		}
  	});
}
function initMatchWatchdog(newMatchId) {
	matchId = newMatchId;
	matchStatusUpdateId = setInterval(matchWatchdog, 5000);
	matchWatchdog();
}
function disableMatchWatchdog() {
	clearInterval(matchStatusUpdateId);
}
function matchWatchdog() {
	$.getJSON('../api/json/getmatchstatus.php?id=' + matchId, function(data){
		if(data.result == true) {
			if(data.matchData.state != lastMatchState) {
				if(data.matchData.state == 0) {
					handleAcceptState(data);
				} else if(data.matchData.state == 1) {
					handleCustomState(data);
				} else if(data.matchData.state == 2) {
					handlePlayState(data);
				} else {
					error("Unknown state: " + data.matchData.state);
				}
			}
		} else {
			error(data.message);
		}
  	});
}
function hasAccepted(data) {
	for(var i = 0; i < data.matchData.readyData.length; i++) {
		for(var x = 0; x < data.matchData.readyData[i].members.length; x++)
		{
			//console.log(i + " " + x);
			if(data.matchData.readyData[i].members[x].userId == myUserId) {
				//console.log("user!");
				return data.matchData.readyData[i].members[x].ready;
			}
		}
	}
	return false;
}
//Funuctions for states
function handleAcceptState(data) {
	
	if(currentPage == "match") {
		var acceptScreenLayout = [];
		acceptScreenLayout.push('<br /><br />');
		if(!hasAccepted(data)) {
			acceptScreenLayout.push('<p id="matchAcceptBtn" class="acpt acptLarge">ACCEPT</p>');
		} else {

		}
		acceptScreenLayout.push('<div id="vsBox">');
			acceptScreenLayout.push('<div id="vsTitle">');
				acceptScreenLayout.push('<span class="yourTeam"> ' + data.matchData.readyData[0].clanName + " - " + data.matchData.readyData[0].clanTag + ' </span> vs <span class="theirTeam"> ' + data.matchData.readyData[1].clanName + " - " + data.matchData.readyData[1].clanTag + ' </span>');
			acceptScreenLayout.push('</div>');
			acceptScreenLayout.push('<div id="vsLeft">');
				for(var i = 0; i < data.matchData.readyData[0].members.length; i++)
				{
					acceptScreenLayout.push('<div class="leftPlayer">');
						acceptScreenLayout.push('<div class="playerImg"><img src="../api/' + data.matchData.readyData[0].members[i].avatarUrl + '" /></div>');
						acceptScreenLayout.push('<span class="playerName">' + data.matchData.readyData[0].members[i].nick + '</span>');
						if(data.matchData.readyData[0].members[i].ready) {
							acceptScreenLayout.push('<div class="rdyBtn YESrdy"><p>READY</p></div>');
						} else {
							acceptScreenLayout.push('<div class="rdyBtn NOrdy"><p>NOT READY</p></div>');
						}
					acceptScreenLayout.push('</div>');
				}
			acceptScreenLayout.push('</div>');
			acceptScreenLayout.push('<div id="vsRight">');
				for(var i = 0; i < data.matchData.readyData[1].members.length; i++)
				{
					acceptScreenLayout.push('<div class="rightPlayer">');
						acceptScreenLayout.push('<div class="playerImg"><img src="../api/' + data.matchData.readyData[1].members[i].avatarUrl + '" /></div>');
						acceptScreenLayout.push('<span class="playerName">' + data.matchData.readyData[1].members[i].nick + '</span>');
						if(data.matchData.readyData[1].members[i].ready) {
							acceptScreenLayout.push('<div class="rdyBtn YESrdy"><p>READY</p></div>');
						} else {
							acceptScreenLayout.push('<div class="rdyBtn NOrdy"><p>NOT READY</p></div>');
						}
					acceptScreenLayout.push('</div>');
				}
			acceptScreenLayout.push('</div>');
		acceptScreenLayout.push('</div>');

		$("#mainContent").html(acceptScreenLayout.join(""));

		$("#matchAcceptBtn").click(function(e) {
			acceptMatch(matchId);
		});
	} else {
		if(!hasAccepted(data)) {
			$("#teamData").html("<center><h1 style='top: -10px;'>Game ready</h1></center><p id='smallAccept' class='acpt acptSmall'>ACCEPT</p>");
			$("#addTeam").remove();	
			$("#smallAccept").click(/*{matchId: data.matchData.id}, */function(e) { 
				//acceptMatch(e.data.matchId);
				acceptMatch(matchId);
			});
			shouldRefreshTeamData = false;
		}
	}
}
function isChief(data) {
	for(var i = 0; i < data.matchData.banData.clans.length; i++) {
		for(var x = 0; x < data.matchData.banData.clans[i].members.length; x++) {
			if(data.matchData.banData.clans[i].members[x].userId == myUserId) {
				return data.matchData.banData.clans[i].members[x].chief;
			}
		}
	}
	return false;
}
function getCurrentPicker(data) {
	var turn = data.matchData.banData.turn;
	for(var i = 0; i < data.matchData.banData.clans[turn].members.length; i++) {
		if(data.matchData.banData.clans[turn].members[i].chief) {
			return data.matchData.banData.clans[turn].members[i].nick;
		}
	}
}
function handleCustomState(data) {
	if(currentPage == "match") {
		var banData = [];
		banData.push('<div class="voteScreen">');
			banData.push('<div class="banBoxText">');
	            banData.push('<br>');
	            banData.push('<br>');
	            if(data.matchData.banData.turn == 2) {
	            	banData.push('<p style="text-align:right; margin:30px 0px 0px;">Vennligst vent...</p>');
	            	banData.push('<p style="font-size: 30px; margin-top: 0px; text-align:right;"></p>');
	            } else {
	            	banData.push('<p style="text-align:right; margin:30px 0px 0px;">Klikk et map når det er din tur til å banne map</p>');
	            	banData.push('<p style="font-size: 30px; margin-top: 0px; text-align:right;">Det er <span class="playerNameBanning">"'+ getCurrentPicker(data) + '" </span> sin tur til å banne</p>');
	            }
	            banData.push('<br>');
	        banData.push('</div>');
	        for(var i = 0; i < data.matchData.banData.options.length; i++) {
	        	banData.push('<div id="banBoxId' + i + '" class="banBox">');
	        		if(data.matchData.banData.options[i].isBanned) {
	        			banData.push('<img src="images/' + data.matchData.banData.options[i].thumbnailUrl + '_banned.png"/>');
	        		} else {
						banData.push('<img src="images/' + data.matchData.banData.options[i].thumbnailUrl + '.png"/>');
	        		}
	        		banData.push('<p>' + data.matchData.banData.options[i].name + '</p>');
	        	banData.push('</div>');
	        }
        banData.push('</div>');
        $("#mainContent").html(banData.join(""));
        for(var i = 0; i < data.matchData.banData.options.length; i++) {
	        	$("#banBoxId" + i).click({mapId: data.matchData.banData.options[i].id}, function(e) {
	        		banMap(e.data.mapId);
	        	});
	        }
	} else {
		if(isChief(data)) {
			$("#teamData").html("<center><h1>Du er chief!</h1>Vennligst gå <a href='index.php?page=match'>hit</a> for å banne maps</center>");
			$("#addTeam").remove();
		} else {
			//console.log("Not chief, not on match");
		}
	}
}
function handlePlayState(data) {
	if(currentPage == "match") {
		if(data.matchData.compoId == 2) { //LoL
			var matchData = [];

			matchData.push("<h1>Gamet er klart!</h1>");
			matchData.push("<p>" + data.matchData.gameData.clans[0].clanName + " lager et game med " + data.matchData.gameData.connectDetails + "</p>");
			matchData.push("<br />");
			matchData.push("<i>Si ifra til game når dere er ferdige</i>");

			$("#mainContent").html(matchData.join(""));
		} else if(data.matchData.compoId == 1) { //CS:GO
			var matchData = [];

			matchData.push('<div class="playScreen">');
            	matchData.push('<div style="position:relative; overflow:auto; height:200px;">');
                    matchData.push('<div style="float:left; position:relative; width:50%; height:100%;">');
                    	matchData.push('<p style="float:right; position:absolute; bottom:0; right:20px; font-size:30px; margin-bottom:0px;">Map: ' + data.matchData.gameData.mapData.name + ' </p>');
                    matchData.push('</div>');
                    matchData.push('<div style="float:left; position:relative; width:50%;  height:100%">');
                    	matchData.push('<div class="map">');
                    		matchData.push('<img src="images/' + data.matchData.gameData.mapData.thumbnail + '.png" />');
                        matchData.push('</div>');
                    matchData.push('</div>');
                matchData.push('</div>');
            	matchData.push('<br>');
            	//matchData.push('<p id="startGameBtn" class="acpt acptLarge go">PLAY</p>');
                matchData.push('<p style="text-align: center;">Skriv i konsollen: <i>' + data.matchData.gameData.connectDetails + '</i></p>');
                matchData.push('<p class="ippw">Hvert lag er nødt til å skrive !map de_' + data.matchData.gameData.mapData.name.toLowerCase() + ' når de kobler til</p>');
            matchData.push('</div>');
			$("#mainContent").html(matchData.join(""));
			$("#startGameBtn").click({consoleData: data.matchData.gameData.connectDetails}, function(e) {
				startGame(e.data.consoleData);
			});
		}
	} else {
		$("#teamData").html("<center><h1>Gamet ditt er klart!</h1>Vennligst gå <a href='index.php?page=match'>hit</a> for å starte</center>");
		$("#addTeam").remove();
	}
}
function startGame(consoleData) {
	window.location = 'steam://rungameid/730//' + encodeURIComponent(consoleData);
}
function banMap(mapId) {
	$.getJSON('../api/json/banmap.php?id=' + encodeURIComponent(mapId) + '&matchId=' + matchId, function(data){
		if(data.result) {
			matchWatchdog();
		} else {
			error(data.message);
		}
	});
}
function acceptMatch(id) {
	$.getJSON('../api/json/acceptmatch.php?id=' + encodeURIComponent(id), function(data){
		if(data.result) {
			window.location = "index.php?page=match";	
		} else {
			error(data.message);
		}
	});
}
function acceptInvite(inviteId) {
	$.getJSON('../api/json/acceptinvite.php?id=' + encodeURIComponent(inviteId), function(data){
		if(data.result) {
			updateCompoStatus();
		} else {
			error(data.message);
		}
	});
}
function declineInvite(inviteId) {
	$.getJSON('../api/json/declineinvite.php?id=' + encodeURIComponent(inviteId), function(data){
		if(data.result) {
			updateCompoStatus();
		} else {
			error(data.message);
		}
	});
}