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

$(document).ready(function(){
	$('#inviteSearchBox').on('input', function(){
		updateSearchField();
	});
	$('#compoSelect').change(function() {
		compoTeamSize = compoTeamSizes[$("#compoSelect option:selected").index()];
		invitedUserId = [];
		invitedUserNames = [];
		updateInvitedList();
	});
	compoTeamSize = compoTeamSizes[0];
});

var invitedUserId = [];
var invitedUserNames = [];
var compoTeamSize = 0;

function updateSearchField()
{
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
					if( !isInvited(data.users[i].userId) )
					{
						var displayName = data.users[i].firstname + ' "' + data.users[i].nickname + '" ' + data.users[i].lastname;
						$('#searchResultsResultPane').append("<b>" + displayName + '</b> <input type="button" value="Legg til" onclick="inviteUser(\'' + data.users[i].id + '\', \'' + data.users[i].firstname + ' &quot;' + data.users[i].nickname + '&quot; ' + data.users[i].lastname + '\')" /><br />');
					}
				}
			}
		}
  	});
}
function inviteUser(userId, displayName) {
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
}
function updateInvitedList() {
	$('#invidedPlayers').html("");
	for(var i = 0; i < invitedUserId.length; i++) {
		$("#invidedPlayers").append('<b>' + invitedUserNames[i] + '</b> <input type="button" value="Fjern" onClick="removeInvited(' + i + ')" /><br />');
	}
}
function removeInvited(arrayIndex) {
	if(arrayIndex < invitedUserId.length) {
		invitedUserId.splice(arrayIndex, 1);
		invitedUserNames.splice(arrayIndex, 1);

		updateInvitedList();
	}
}
function isInvited(userId) {
	for(var i = 0; i < invitedUserId.length; i++) {
		if(invitedUserId[i] == userId) {
			return true;
		}
	}
	return false;
}
//Handle clan registration
var invitedPeople = 0;
var clanId = 0;
function registerClan() {
	//if(invitedUserId.length != compoTeamSize-1) {
		//error("Du har ikke invitert nok folk!");
	//} else {
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
							}
						});
					}
				} else {
					error(data.message);
				}
		  	});
		}
	//}
}