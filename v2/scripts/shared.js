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
    if(typeof func === "undefined")
    {
	noty({
	    text: errorMsg,
	    type: 'error',
	    layout: 'center',
	    timeout: 7000
	});
    }
    else
    {
	noty({
	    text: errorMsg,
	    type: 'error',
	    layout: 'center',
	    callback: {
		onClose: func
	    },
	    timeout: 7000
	});
    }
}
function info(errorMsg, func) {
    if(typeof func === "undefined")
    {
	noty({
	    text: errorMsg,
	    type: 'information',
	    layout: 'center',
	    timeout: 7000
	});
    }
    else
    {
	noty({
	    text: errorMsg,
	    type: 'information',
	    layout: 'center',
	    callback: {
		onClose: func
	    },
	    timeout: 7000
	});
    }
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
