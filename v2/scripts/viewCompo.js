$(document).ready(function() {
	for(var i = 0; i < compoTeamList.length; i++) {
		$("#teamButtonId" + compoTeamList[i]).click({compoId: compoTeamList[i]}, function(e){
			window.location = "index.php?page=team&id=" + e.data.compoId;
		});
	}
});