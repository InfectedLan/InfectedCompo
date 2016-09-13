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
//Fancy dank clojure shit
(function(){
    console.log("Starting addTeam");
    var invitedUserId = [];
    var invitedUserNames = [];
    var compoTeamSize = datastore["compoList"][0].teamSize;
    var invitedPeople = 0;
    var clanId = 0;
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
			if( !isInvited(data.users[i].id) )
			{
			    console.log("Button for " + data.users[i].id);
			    var displayName = data.users[i].firstname + ' "' + data.users[i].nickname + '" ' + data.users[i].lastname;
			    $('#searchResultsResultPane').append("<b>" + displayName + '</b> <input type="button" id="inviteUser' + i + '" value="Legg til"  /><br />');
			    $("#inviteUser" + i).on('click', {inviteFunc: inviteUser, user: data.users[i]}, function(event) {
				event.data.inviteFunc(event.data.user.id, event.data.user.firstname + ' "' + event.data.user.nickname + '" ' + event.data.user.lastname);
			    });
			}
		    }
		}
	    }
  	});
    };
    var updateInvitedList = function() {
	$('#invidedPlayers').html("");
	for(var i = 0; i < invitedUserId.length; i++) {
	    $("#invidedPlayers").append('<b>' + invitedUserNames[i] + '</b> <input type="button" id="btnRemoveInvited' + i + '" value="Fjern" /><br />');
	    var _i = i;
	    $("#btnRemoveInvited"+i).on('click', function(event) {
		console.log("remove clicked: " + _i);
		removeInvited(_i);
	    });
	}
    };
    var removeInvited = function(arrayIndex) {
	if(arrayIndex < invitedUserId.length) {
	    invitedUserId.splice(arrayIndex, 1);
	    invitedUserNames.splice(arrayIndex, 1);

	    updateInvitedList();
	}
    };
    var isInvited = function(userId) {
	for(var i = 0; i < invitedUserId.length; i++) {
	    if(invitedUserId[i] == userId) {
		return true;
	    }
	}
	return false;
    };
    var registerClan = function() {
	$("#addClanButtonWrapper").html("<i>Jobber...</i>");
	var clanName = $("#clanName").val();
	var clanTag = $("#clanTag").val();
	if(clanName == "" || clanTag == "") {
	    error("Du må skrive clan name og tag!");
	} else {
	    $.getJSON('../api/json/clan/registerClan.php?name=' + encodeURIComponent(clanName) + "&tag=" + encodeURIComponent(clanTag) + "&compo=" + encodeURIComponent( $("#compoSelect").val() ), function(data){
		if(data.result == true) {
		    clanId = data.clanId;
		    for(var i = 0; i < invitedUserId.length; i++) {
			$.getJSON('../api/json/clan/inviteToClan.php?id=' + data.clanId + "&user=" + invitedUserId[i], function(data){
			    invitedPeople++;
			    if(invitedPeople==invitedUserId.length) {
				info("Clanen ble registrert!", function() {window.location = "index.php?page=team&id=" + clanId});
				noty({
				    text: "Clanen ble registrert!",
				    type: 'information',
				    layout: 'center',
				    callback: {
					onClose: function() {
					    window.location = "index.php#clan-" + clanId;
					}
				    },
				    timeout: 3000
				});
				console.log("Clan is registered!");
			    }
			});
		    }
		} else {
		    error(data.message);
		}
	    });
	}
    };
    var inviteUser = function(userId, displayName) {
	$.getJSON('../api/json/user/isEligibleForCompoParticipation.php?id=' + userId, function(data){
	    if(data.result == true) {
		invitedUserId.push(userId);
		invitedUserNames.push(displayName);

		updateSearchField();
		updateInvitedList();
	    } else {
		error(data.message);
	    }
  	});
    };
    $('#inviteSearchBox').on('input', function(){
	updateSearchField();
    });
    $('#compoSelect').change(function() {
	var selectedCompo = datastore["compoList"][$("#compoSelect option:selected").index()];
	compoTeamSize = selectedCompo.teamSize;
	invitedUserId = [];
	invitedUserNames = [];
	updateInvitedList();
    });
    $("#btnRegisterClan").on('click', function() {
	console.log("clicked");
	registerClan();
    });
    
})();
