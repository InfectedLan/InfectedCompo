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
require_once 'handlers/tickethandler.php';
require_once 'handlers/matchhandler.php';

class Site {
    // Execute the site.
    public function execute() {
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
	echo '<script src="../api/scripts/jquery.ba-hashchange.min.js"></script>';
	echo '<script src="../api/scripts/login.js"></script>';
	echo '<script src="../api/scripts/logout.js"></script>';
	// These two are used by the 3d wallpaper, so we'll disable them to make stuff faster.
 	//echo '<script src="../api/scripts/three.min.js"></script>';
	//echo '<script src="../api/scripts/SPE.min.js"></script>';
	echo '<script src="../api/scripts/jquery.noty.packaged.min.js"></script>';

	//Custom javascripts. This HAS to be included after jquery
	echo '<script src="scripts/shared.js"></script>';
	echo '<script src="scripts/compo.js"></script>';
	echo '<script src="../api/scripts/websocket.js"></script>';
	echo '<script src="../api/scripts/chat.js"></script>';
	echo '<script>var loggedIn = ' . (Session::isAuthenticated() ? "true" : "false") . ';</script>';
	echo "<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create', 'UA-54254513-4', 'auto');ga('send', 'pageview');</script>";
	echo '</head>';
	echo '<body>';
	echo '</body>';
	echo '</html>';
    }

    // Generates title.
    private function getTitle() {
	return Settings::name . ' Compo';
    }
}
?>
