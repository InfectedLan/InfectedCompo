//JQuery event listeners
$(document).ready(function() {
	$("#addTeam").click(function(e) {
		addTeam();
	});
});
function addTeam()
{
	window.location.href = "index.php?page=addTeam";
}