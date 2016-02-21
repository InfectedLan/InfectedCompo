/**
 * This file is part of InfectedCompo.
 *
 * Copyright (C) 2015 Infected <http://infected.no/>.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3.0 of the License, or (at your option) any later version.
 * 
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library.  If not, see <http://www.gnu.org/licenses/>.
 */
(function(){
    var currentClanId = location.hash.substr(1).split("-")[1]; //Redeclaring here for the clojures ahead
    var clan = datastore["clan-" + currentClanId + "-data"];
    var me = datastore["userData"]; //Make code a bit shorter :)
    //Find out compo object
    for(var i = 0; i < datastore["compoList"].length; i++) {
	if(datastore["compoList"][i].id == clan.compo) {
	    var compo = datastore["compoList"][i];
	}
    }
    if(typeof(compo) === "undefined") {
	error("Du prøver å se på clanen til en compo som ikke eksisterer");
	gotoPage("index");
	return;
    }
    $("#clanLabel").html(clan.name + " - " + clan.tag);
    $("#compoLabel").html(compo.title);

    //Check if we are in the clan
    var isInClan = (function() {
	for(var u = 0; u < clan.playingMembers.length; u++) {
	    if(me.id == clan.playingMembers[u].id) {
		return true;
	    }
	}
	for(var u = 0; u < clan.stepinMembers.length; u++) {
	    if(me.id == clan.stepinMembers[u].id) {
		return true;
	    }
	}
	return false;
    })();
    console.log("Are we in the clan? " + isInClan);

    if(clan.qualified) {
	$("#qualifiedNotification").html('Laget er kvalifisert til å spille i konkurransen');
    } else {
	if(isInClan) {
	    if(clan.playingMembers.length != compo.teamSize) {
		$("#qualifiedNotification").html('ADVARSEL: Dere er ikke kvalifisert, fordi dere ikke har fylt opp alle plassene. Påmeldingen er ikke ferdig før alle spillere har akseptert invitasjonene sine.');
	    } else {
		$("#qualifiedNotification").html('Beklager, laget er ikke kvalifisert, fordi dere var for sene med å fylle laget. Det kan hende dere kan bli etter-kvalifisert dersom et spillende lag må melde seg av.');
	    }		
	} else {
	    $("#qualifiedNotification").html('Laget er ikke kvalifisert');
	}
    }

    //Functions we will use later. Clojures are dank shit!!1
    var inviteUser = function(userId, displayName) {
	$.getJSON('../api/json/user/isEligibleForCompoParticipation.php?id=' + userId, function(data){
	    var passthroughId = userId;
	    if(data.result == true) {
		$.getJSON('../api/json/clan/inviteToClan.php?id=' + currentClanId + "&user=" + passthroughId, function(data){
		    if(data.result == true) {
			refresh();
		    } else {
			error(data.message);
		    }
		});
	    } else {
		error(data.message);
	    }
  	});
    }
    var updateSearchField = function() {
	var query = $('#inviteSearchBox').val();
	$.getJSON('../api/json/user/findUser.php?query=' + encodeURIComponent( query ), function(data){
	    if(data.result == true)
	    {
		$('#searchResultsResultPane').html("");
		var userLength = data.users.length;
		if(userLength==0)
		{
		    $('#searchResultsResultPane').append("<i>Det er ingen brukere som fyller kravene! Har du stavet noe feil?</i>");
		}
		else
		{
		    for(var i = 0; i < userLength; i++)
		    {
			var user = data.users[i];
			var displayName = data.users[i].firstname + ' "' + data.users[i].nickname + '" ' + data.users[i].lastname;
			$('#searchResultsResultPane').append("<b>" + displayName + '</b> <input class="inviteBtn" type="button" value="Inviter" /><br />');
			
			$("#searchResultsResultPane").find('.inviteBtn').last().on('click', {userId: user.id}, function(data) {
			    inviteUser(data.data.userId, displayName);
			});
		    }
		}
	    }
  	});
    }
    var kickUser = function(user, clan) {
	$.getJSON('../api/json/clan/kickFromClan.php?clan=' + clan + "&user=" + user, function(data){
	    if(data.result == true) {
		refresh();
	    } else {
		error(data.message);
	    }
	});
    }
    var deleteInvite = function(inviteId) {
	$.getJSON('../api/json/invite/declineInvite.php?id=' + encodeURIComponent(inviteId), function(data){
	    if(data.result) {
		refresh();
	    } else {
		error(data.message);
	    }
	});
    }
    var setAsPrimaryPlayer = function(userId, teamId) {
	$.getJSON('../api/json/clan/setAsPrimaryPlayer.php?clan=' + teamId + "&user=" + userId, function(data){
	    if(data.result == true) {
		refresh();
	    } else {
		error(data.message);
	    }
	});
    }
    var setAsStepinPlayer = function(userId, teamId) {
	console.log("Setting stepin: " + userId + ", team: " + teamId);
	$.getJSON('../api/json/clan/setAsStepinPlayer.php?clan=' + teamId + "&user=" + userId, function(data){
	    if(data.result == true) {
		refresh();
	    } else {
		error(data.message);
	    }
	});
    }
    
    if(clan.chief == me.id) {
	for(var i = 0; i < clan.playingMembers.length; i++) {
	    if(clan.playingMembers[i].id == me.id) {
		var person = clan.playingMembers[i];
		$("#playingTable").append('<tr><td>' + person.displayName + '</td><td><input class="stepinBtn" type="button" value="Set as stepin" /></td></tr>');
		$("#playingTable").find(".stepinBtn").last().on('click', {person: person}, function(data) {
		    setAsStepinPlayer(data.data.person.id, currentClanId);
		});
	    } else {
		var person = clan.playingMembers[i];
		$("#playingTable").append('<tr><td>' + person.displayName + '</td><td><input class="stepinBtn" type="button" value="Set as stepin" /></td><td><input class="kickBtn" type="button" value="Kick"/></td></tr>');
		$("#playingTable").find(".stepinBtn").last().on('click', {person: person}, function(data) {
		    setAsStepinPlayer(data.data.person.id, currentClanId);
		});
		$("#playingTable").find(".kickBtn").last().on('click', {person: person}, function(data) {
		    kickUser(data.data.person.id, currentClanId);
		});
	    }
	}
	for(var i = 0; i < clan.stepinMembers.length; i++) {
	    if(clan.stepinMembers[i].id == me.id) {
		var person = clan.stepinMembers[i];
		$("#stepinTable").append('<tr><td>' + person.displayName + '</td><td><input class="primaryBtn" type="button" value="Set as primary player" /></td></tr>');
		$("#stepinTable").find(".primaryBtn").last().on('click', {person: person}, function(data) {
		    setAsPrimaryPlayer(data.data.person.id, currentClanId);
		});
	    } else {
		var person = clan.stepinMembers[i];
		$("#stepinTable").append('<tr><td>' + person.displayName + '</td><td><input class="primaryBtn" type="button" value="Set as primary player" /></td><td><input class="kickBtn" type="button" value="Kick"/></td></tr>');
		$("#stepinTable").find(".primaryBtn").last().on('click', {person: person}, function(data) {
		    setAsPrimaryPlayer(data.data.person.id, currentClanId);
		});
		$("#stepinTable").find(".kickBtn").last().on('click', {person: person}, function(data) {
		    kickUser(data.data.person.id, currentClanId);
		});
	    }
	}
	for(var i = 0; i < clan.invitedMembers.length; i++) {
	    var person = clan.invitedMembers[i];
	    $("#invitedTable").append('<tr><td>' + person.displayName + '</td><td><input class="delInviteBtn" type="button" value="Slett invite" /></td></tr>');
	    $("#invitedTable").find(".delInviteBtn").last().on('click', {person: person}, function(data) {
		deleteInvite(data.data.person.inviteId);
	    });
	}
    } else {
	for(var i = 0; i < clan.playingMembers.length; i++) {
	    $("#playingTable").append('<tr><td>' + clan.playingMembers[i].displayName + '</td></tr>');
	}
	for(var i = 0; i < clan.stepinMembers.length; i++) {
	    $("#stepinTable").append('<tr><td>' + clan.stepinMembers[i].displayName + '</td></tr>');
	}
	for(var i = 0; i < clan.invitedMembers.length; i++) {
	    $("#invitedTable").append('<tr><td>' + clan.invitedMembers[i].displayName + '</td></tr>');
	}
    }

    if(clan.chief == me.id) {
	$("#mainContent").append('Invite teammates: <input id="inviteSearchBox" type="text" /><br /><div id="searchResultsResultPane"></div>');
	$('#inviteSearchBox').on('input', function(){
	    updateSearchField();
	});
    }
})();
