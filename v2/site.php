<?php
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

require_once 'session.php';
require_once 'settings.php';
require_once 'handlers/eventhandler.php';
require_once 'handlers/clanhandler.php';
require_once 'handlers/tickethandler.php';
require_once 'handlers/matchhandler.php';
require_once 'libraries/lightopenid/openid.php';

class Site {
    // Execute the site.
    public function execute() {
    	$start = explode(' ', microtime())[0] + explode(' ', microtime())[1];
		//TODO: Remove this ugly logic from here
		$openid = new LightOpenId($_SERVER['HTTP_HOST']);
		if($openid->mode) {
		    if(Session::isAuthenticated()) {
			if($openid->validate()) {
			    $id = $openid->identity;
			    $ptn = "/^http:\/\/steamcommunity\.com\/openid\/id\/(7[0-9]{15,25}+)$/";
			    preg_match($ptn, $id, $matches);

			    $user = Session::getCurrentUser();
			    $user->setSteamId($matches[1]);
			    //Qualify any clan that waited for this user
			    $clans = ClanHandler::getClansByUser($user);
			    foreach($clans as $clan) {
				$compo = $clan->getCompo();
				if(ClanHandler::isQualified($clan, $compo))
				    continue;
				$playingMembers = ClanHandler::getPlayingClanMembers($clan);
				$fullTeam = true;
				foreach($playingMembers as $member) {
				    if($member->getSteamId() === null) {
					$fullTeam = false;
					break;
				    }
				}
				if($fullTeam && count($playingMembers) == $compo->getTeamSize()) {
				    $playingClans = ClanHandler::getQualifiedClansByCompo($compo);
				    if(count($playingClans) < $compo->getParticipantLimit() || $compo->getParticipantLimit() == 0) {
					ClanHandler::setQualified($clan, true);
				    } else if(!ClanHandler::isInQualificationQueue($clan)){
					ClanHandler::addToQualificationQueue($clan);
				    }
				}
			    }
			    header("location:index.php");
			} else {
			    echo "Det skjedde en feil da vi prøvde å koble deg opp mot steam. <a href='index.php'>Gå tilbake</a>";
			    //header("location:index.php");
			}
		    } else {
			echo "Du er ikke logget inn, og kunne derfor ikke kobles opp mot steam. <a href='index.php'>Gå tilbake</a>";
		    }
		    return;
		}
		echo '<!DOCTYPE html>';
		echo '<head>';
		echo '<title>' . $this->getTitle() . '</title>';
		echo '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
		echo '<link rel="stylesheet" type="text/css" href="styles/style.css">';
		echo '<link rel="stylesheet" type="text/css" href="../api/styles/bracket.css">';
		echo '<link rel="stylesheet" type="text/css" href="../api/styles/chat.css">';
		echo '<link href="../api/styles/jquery-ui-1.11.1.css" rel="stylesheet" type="text/css" />';
		echo '<script src="../api/scripts/jquery-1.11.3.min.js"></script>';
		echo '<script src="../api/scripts/jquery-ui-1.11.1.min.js"></script>';
		//Fixed due to old source(2010, does not support our jquery version). This was only needed for ie support iirc. ie is outdated, so not our issue if users are using abandoned browsers.
		//echo '<script src="../api/scripts/jquery.ba-hashchange.min.js"></script>';
		echo '<script src="../api/scripts/login.js"></script>';
		echo '<script src="../api/scripts/logout.js"></script>';
		// These two are used by the 3d wallpaper, so we'll disable them to make stuff faster.
	 	//echo '<script src="../api/scripts/three.min.js"></script>';
		//echo '<script src="../api/scripts/SPE.min.js"></script>';
		echo '<script src="../api/scripts/jquery.noty.packaged.min.js"></script>';

		//Custom javascripts. This HAS to be included after jquery
		echo '<script src="../api/scripts/websocket.js"></script>';
		echo '<script src="../api/scripts/chat.js"></script>';
		echo "Du er ikke logget inn, og kunne derfor ikke kobles opp mot steam. <a href='index.php'>Gå tilbake</a>";	echo "Du er ikke logget inn, og kunne derfor ikke kobles opp mot steam. <a href='index.php'>Gå tilbake</a>";	echo '<script src="../api/scripts/bracket.js"></script>';
		echo '<script src="../api/scripts/match.js"></script>';
		echo '<script src="scripts/shared.js"></script>';
		echo '<script src="scripts/compo.js"></script>';
		echo '<script>var api_path = "../api/";var websocketEnabled = false;</script>';
		echo '<script>var loggedIn = ' . (Session::isAuthenticated() ? "true" : "false") . ';</script>';
		if(Session::isAuthenticated()) {
		    /*$openid = new LightOpenId($_SERVER['HTTP_HOST']);
		    $openid->identity = 'https://steamcommunity.com/openid';
		    echo '<script>var steamAuthUrl = "' . $openid->authUrl() . '";</script>';*/
		    //Steam blocks us for "discovering" steamcommunity.com/openid too often, so use static url.
		    $realm = urlencode('https://' . $_SERVER['HTTP_HOST']);
		    $returnTo = urlencode('https://' . $_SERVER['HTTP_HOST'] . "/v2/index.php");
		    //$steamAuthUrl = "https://steamcommunity.com/openid/login?openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.mode=checkid_setup&openid.return_to=http%3A%2F%2Flocalhost%2Fcompo%2Fv2%2Findex.php&openid.realm=http%3A%2F%2Flocalhost&openid.ns.sreg=http%3A%2F%2Fopenid.net%2Fextensions%2Fsreg%2F1.1&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select";
		    $steamAuthUrl = "https://steamcommunity.com/openid/login?openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.mode=checkid_setup&openid.return_to=" . $returnTo . "&openid.realm=" . $realm . "&openid.ns.sreg=http%3A%2F%2Fopenid.net%2Fextensions%2Fsreg%2F1.1&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select";
		    echo '<script>var steamAuthUrl = "' . $steamAuthUrl . '";</script>';
		}
		echo "<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create', 'UA-54254513-4', 'auto');ga('send', 'pageview');</script>";
		echo '</head>';
		echo '<body>';
		echo '</body>';
		echo('<!-- Page generated in '.round((explode(' ', microtime())[0] + explode(' ', microtime())[1]) - $start, 4).' seconds.-->');
		echo '</html>';
    }

    // Generates title.
    private function getTitle() {
	return Settings::name . ' Compo';
    }
}
?>
