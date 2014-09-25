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
					if( !isInvited(data.users[i].userId) )
					{
						var displayName = data.users[i].firstname + ' "' + data.users[i].nickname + '" ' + data.users[i].lastname;
						$('#searchResultsResultPane').append("<b>" + displayName + '</b> <input type="button" value="Legg til" onclick="inviteUser(\'' + data.users[i].userId + '\', \'' + data.users[i].firstname + ' &quot;' + data.users[i].nickname + '&quot; ' + data.users[i].lastname + '\')" /><br />');
					}
				}
			}
		}
  	});
}
function inviteUser(userId, displayName) {
	if(invitedUserId.length < compoTeamSize-1) {
		$.getJSON('../api/json/canparticipateincompos.php?id=' + userId, function(data){
			if(data.result == true) {
				if(invitedUserId.length<compoTeamSize) {
					
				} else {
					error("Laget ditt er fullt!");
				}
			} else {
				error(data.message);
			}
	  	});
	} else {
		error("Laget er for stort!");
	}
}