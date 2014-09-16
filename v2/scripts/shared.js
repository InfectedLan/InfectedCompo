//Error box functions
/*
function error(errorMsg) {
	$('#errorMsg').text(errorMsg);
	errorFunction = 0;
	showErrorBox();
}
function info(errorMsg) {
	$('#errorMsg').text(errorMsg);
	errorFunction = 0;
	showInfoBox();
}
*/
function error(errorMsg, func) {
	$('#errorMsg').text(errorMsg);
	if(typeof func === "undefined")
	{
		errorFunction = 0;
	}
	else
	{
		errorFunction = func;
	}
	showErrorBox();
}
function info(errorMsg, func) {
	$('#errorMsg').text(errorMsg);
	if(typeof func === "undefined")
	{
		errorFunction = 0;
	}
	else
	{
		errorFunction = func;
	}
	showInfoBox();
}
function hideErrorBox() {
	$("#errorbox").fadeOut(200);
}
function showErrorBox() {
	$("#errorbox").fadeIn(200);
	$('#errorbox').attr("class", "error");
}
function showInfoBox() {
	$("#errorbox").fadeIn(200);
	$('#errorbox').attr("class", "info");
}
$(document).ready(function() {	
	$('.errorClose').click(function() {
		hideErrorBox();
		errorFunction();
	});
});
var errorFunction = 0;