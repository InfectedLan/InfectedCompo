//Variables
var compoStatusUpdateId = 0;
//JQuery event listeners
$(document).ready(function() {
	$("#addTeam").click(function(e) {
		addTeam();
	});
	compoStatusUpdateId = setInterval(updateCompoStatus, 5000);
	updateCompoStatus();
});
function addTeam()
{
	window.location.href = "index.php?page=addTeam";
}
function updateCompoStatus() {
	$.getJSON('../api/json/getcompostatus.php', function(data){
		if(data.result == true) {
			$("#teamData").html("");
			for(var i = 0; i < data.data.clans.length; i++) {
				$("#teamData").append('<div class="teamEntry" id="teamHeaderId' + data.data.clans[i].id + '"><h1>' + data.data.clans[i].tag + '</h1><h3> - ' + data.data.clans[i].compo.tag + '</h3>');
				$("#teamHeaderId" + data.data.clans[i].id).click({teamId: data.data.clans[i].id}, function(e){window.location="index.php?page=team&id=" + e.data.teamId});
			}
			if(data.data.invites.length != 0) {
				//$("#teamData").append("<h3>Invites</h3>");
				for(var i = 0; i < data.data.invites.length; i++) {
					$("#teamData").append('<div><h1>' + data.data.invites[i].clanTag + '</h1><h3> - ' + data.data.invites[i].compo.tag + '</h3><br /><i class="teamEntry" id="inviteAccept' + data.data.invites[i].id + '">Godta</i> - <i class="teamEntry" id="inviteDecline' + data.data.invites[i].id + '">Avslå</i></div>');
					$("#inviteAccept" + data.data.invites[i].id).click({inviteId: data.data.invites[i].id}, function(e){acceptInvite(e.data.inviteId)});
					$("#inviteDecline" + data.data.invites[i].id).click({inviteId: data.data.invites[i].id}, function(e){declineInvite(e.data.inviteId)});
				}
			}
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