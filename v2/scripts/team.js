$(document).ready(function(){
	$('#inviteSearchBox').on('input', function(){
		updateSearchField();
	});
});
function updateSearchField()
{
	var query = $('#inviteSearchBox').val();
	updateKey = Math.random();
	$.getJSON('../api/json/searchusers.php?key=' + encodeURIComponent(updateKey) + "&query=" + encodeURIComponent( query ), function(data){
		if(data.result == true && data.key == updateKey)
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
					$('#searchResultsResultPane').append("<b>" + displayName + '</b> <input type="button" value="Inviter" onclick="inviteUser(\'' + data.users[i].userId + '\', \'' + data.users[i].firstname + ' &quot;' + data.users[i].nickname + '&quot; ' + data.users[i].lastname + '\')" /><br />');
				}
			}
		}
  	});
}
var passthroughUserId = 0;
function inviteUser(userId, displayName) {
	passthroughUserId = userId;
	$.getJSON('../api/json/canparticipateincompos.php?id=' + passthroughUserId, function(data){
		if(data.result == true) {
			$.getJSON('../api/json/invitetoclan.php?id=' + clanId + "&user=" + passthroughUserId, function(data){
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