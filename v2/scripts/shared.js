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
function logout() {
	$.getJSON('../api/json/session/logout.php', function(data){
		if(data.result == true) {
			location.reload();
		} else {
			error(data.message);
		}
  	});
}