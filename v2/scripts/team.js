/*
 * This file is part of InfectedCompo.
 *
 * Copyright (C) 2015 Infected <http://infected.no/>.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

$(document).ready(function(){
	$('#inviteSearchBox').on('input', function(){
		updateSearchField();
	});
});
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
					var displayName = data.users[i].firstname + ' "' + data.users[i].nickname + '" ' + data.users[i].lastname;
					$('#searchResultsResultPane').append("<b>" + displayName + '</b> <input type="button" value="Inviter" onclick="inviteUser(\'' + data.users[i].id + '\', \'' + data.users[i].firstname + ' &quot;' + data.users[i].nickname + '&quot; ' + data.users[i].lastname + '\')" /><br />');
				}
			}
		}
  	});
}
var passthroughUserId = 0;
function inviteUser(userId, displayName) {
	passthroughUserId = userId;
	$.getJSON('../api/json/user/isEligibleForCompoParticipation.php?id=' + passthroughUserId, function(data){
		if(data.result == true) {
			$.getJSON('../api/json/clan/inviteToClan.php?id=' + clanId + "&user=" + passthroughUserId, function(data){
				if(data.result == true) {
					location.reload();
				} else {
					error(data.message);
				}
			});
		} else {
			error(data.message);
		}
  	});
}
function kickUser(user, clan) {
	$.getJSON('../api/json/clan/kickFromClan.php?clan=' + clan + "&user=" + user, function(data){
		if(data.result == true) {
			location.reload();
		} else {
			error(data.message);
		}
	});
}
function deleteInvite(inviteId) {
	$.getJSON('../api/json/invite/declineInvite.php?id=' + encodeURIComponent(inviteId), function(data){
		if(data.result) {
			location.reload();
		} else {
			error(data.message);
		}
	});
}
function setAsPrimaryPlayer(userId, teamId) {
	$.getJSON('../api/json/clan/setAsPrimaryPlayer.php?clan=' + teamId + "&user=" + userId, function(data){
		if(data.result == true) {
			location.reload();
		} else {
			error(data.message);
		}
	});
}
function setAsStepinPlayer(userId, teamId) {
	$.getJSON('../api/json/clan/setAsStepinPlayer.php?clan=' + teamId + "&user=" + userId, function(data){
		if(data.result == true) {
			location.reload();
		} else {
			error(data.message);
		}
	});
}