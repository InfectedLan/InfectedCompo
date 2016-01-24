/******************************************************
 * HTML
 */

var login_html = '<div id="loginbox"><script src="../api/scripts/login.js"></script><form class="login" method="post"><ul><li><input class="input" type="text" name="identifier" placeholder="Brukernavn, E-post eller Telefon"></li><li><input class="input" name="password" type="password" placeholder="Passord"></li><li><input class="button" id="submit" name="submit" type="submit" value="Logg inn"></li></ul></form><br /><i>Du bruker samme bruker på composiden og ticketsiden</i></div>';

var sidebar_html = '<div id="content" style="display:none;"><div id="leftColumn"><div id="profileBox"><div id="userProfilePic"></div><div id="userName"></div><div><a id="editUserLabel" href="javascript:editUser()">Endre profil</a><a id="logOutLabel" href="javascript:logout()">Logg ut</a></div></div><div id="teamBox"><p style="position:absolute; top:-45px;">Teams</p><div id="teamData"><h3>Laster inn...</h3></div><p id="addTeam"><span style="font-size:20px; margin-top:-15px;">+</span> Add Team</p></div><div id="chatBox"><div id="chatContainer"></div></div></div><div id="rightColumn"><div id="banner"></div><div id="mainContent"></div></div></div>';


/******************************************************
 * Page master class
 */
var Page = function() {

};

//If this doesn't return true, it is expected that fading in is handled manually
Page.prototype.render = function() {
    $("body").html("<h1>Placeholder, please fix</h1>");
    return true;
};

//Called as soon as we know we are transferring to this page. Used to load stuff while the old page is animating out
Page.prototype.onInit = function() {

}
//Called as soon as the page starts fading out
Page.prototype.onDeInit = function() {
    console.log("Goodbye!");
};

/******************************************************
 * Login page
 */

var LoginPage = function() {
    Page.call(this);
};

//Make LoginPage a subclass of Page. Javascript OOP is weird
LoginPage.prototype = Object.create(Page.prototype);
LoginPage.prototype.constructor = LoginPage;

LoginPage.prototype.render = function() {
    $("body").html(login_html);
    return true;
};

/*****************************************************
 * Index page
 */

var IndexPage = function() {
    Page.call(this);
};

IndexPage.prototype = Object.create(Page.prototype);
IndexPage.prototype.constructor = IndexPage;
IndexPage.prototype.render = function() {
    $("#mainContent").html("<h1>Velkommen til infected compo v2!</h1>");
    return true;
};


/*****************************************************
 * Compo list page
 */

var CompoPage = function() {
    Page.call(this);
};

CompoPage.prototype = Object.create(Page.prototype);
CompoPage.prototype.constructor = CompoPage;
CompoPage.prototype.render = function() {
    $("#mainContent").html("<h1>Compoer</h1>");
    return false;
};

/*****************************************************
 * Download manager
 */

var DownloadJsonTask = function(url, onFinished) {
    this.url = url;
    this.onFinished = onFinished;
}

DownloadJsonTask.prototype.start = function() {
    var _this = this;
    $.getJSON(this.url, function(data){
	if(data.result == true)
	{
	    _this.onFinished(data);
	    _this.downloadMaster.success(_this);
	} else {
	    _this.downloadMaster.fail(_this);
	}
    });
};

DownloadJsonTask.prototype.downloadMaster = null;

var PageDownloadWaiter = function(tasks, pageId) {
    this.tasks = tasks;
    this.downloaded = 0;
    this.pageId = pageId;
    for(var i = 0; i < this.tasks.length; i++) {
	this.tasks[i].downloadMaster = this;
    }
    console.log("Download manager initialized");
};

PageDownloadWaiter.prototype.start = function() {
    console.log("Starting download");
    for(var i = 0; i < this.tasks.length; i++) {
	this.tasks[i].start();
    }
};

PageDownloadWaiter.prototype.fail = function(task) {
    error("Det skjedde en feil under nedlastingen av nødvendig data. Prøv å oppdatere siden");
    console.log("Failed download: " + task);
};

PageDownloadWaiter.prototype.success = function(task) {
    this.downloaded++;
    if(this.downloaded == this.tasks.length) {
	$("#" + this.pageId).fadeIn(300);
    }
};

/*****************************************************
 * Page bookkeeping
 */

var pages = {index: new IndexPage(), compo: new CompoPage()};
var currentPage = "login";

//Startup
console.log("Infected compo booting up!");

$(document).ready(function(){
    if(!loggedIn) {
	console.log("Init login dialog");
	var login = new LoginPage();
	currentPage = login;
	login.render();
    } else {
	if(location.hash.length>0) {
	    if(typeof(pages[location.hash.substring(1).split("-")[0]]) !== 'undefined') {
		gotoPage(location.hash.substring(1).split("-")[0]);
	    } else {
		gotoPage("index");
	    }
	} else {
	    gotoPage("index");
	}
    }
});

$(window).hashchange(function(){
    if(location.hash.length>0) {
	if(typeof(pages[location.hash.substring(1).split("-")[0]]) !== 'undefined') {
	    gotoPage(location.hash.substring(1).split("-")[0]);
	} else {
	    gotoPage("index");
	}
    } else {
	gotoPage("index");
    }
});

function gotoPage(hashId) {
    if(typeof(pages[hashId]) === 'undefined') {
	console.log("Tried to navigate to non-existing page: " + hashId);
	return;
    }
    if(currentPage == "login") {
	renderSidebar();
	currentPage = hashId;
	console.log("Starting transfer to " + hashId);
	pages[hashId].onInit();
	pages[hashId].render();
    } else {
	pages[currentPage].onDeInit();
	pages[hashId].onInit();
	$("#mainContent").fadeOut(300, function(){
	    currentPage = hashId;
	    if(pages[hashId].render()) {
		$("#mainContent").fadeIn(300);
	    }
	});
    }
}

function renderSidebar() {
    $("body").html(sidebar_html);
    var userDataTask = new DownloadJsonTask("../api/json/user/getUserData.php", function(data){
	console.log("Got user data: " + data);
	$("#userProfilePic").html('<img src="' + data.data.avatar.thumb + '" />');
	$("#userName").html('<p>' + data.data.displayName + '</p>');
    });
    var compoDataTask = new DownloadJsonTask("../api/json/compo/getCompos.php", function(data){
	var currentCompoId = -1;
	if(location.hash.substr(1).split("-")[0]=="compo") {
	    currentCompoId = location.hash.substr(1).split("-")[1];
	    console.log("Current compo id: " + currentCompoId);
	}
	for(var i = 0; i < data.data.length; i++) {
	    $("#banner").append('<div id="compoBtn' + i + '" class="gameType ' + (data.data[i].id == currentCompoId ? ' selected' : '') + '"><p>' + data.data[i].tag + '</p></div>');
	    var compo = data.data[i];
	    $("#compoBtn"+i).click(function(){
		window.location = "index.php#compo-"+compo.id;
	    });
	}
    });
    $("#addTeam").click(function() {
	window.location = "index.php#newTeam";
    });
    var downloadManager = new PageDownloadWaiter([userDataTask, compoDataTask], "content");
    downloadManager.start();
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
	var pair = vars[i].split("=");
	if (pair[0] == variable) {
	    return pair[1];
	}
    } 
    return null;
}
