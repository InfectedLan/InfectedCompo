<?php
require_once 'session.php';
require_once 'settings.php';
require_once 'utils.php';
require_once 'handlers/eventhandler.php';
require_once 'handlers/tickethandler.php';

class Site {
	
	public function __construct() {

	}
	
	// Execute the site.
	public function execute() {
		echo '<!DOCTYPE html>';
			echo '<head>';
				echo '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
			    echo '<link rel="stylesheet" type="text/css" href="style/style.css">';
			    echo '<script src="scripts/shared.js"></script>';

			    echo '<title>' . $this->getTitle() . '</title>';

				echo '<script src="../api/scripts/jquery-1.11.1.min.js"></script>';
			    echo '<link href="../api/style/jquery-ui-1.11.1.css" rel="stylesheet" type="text/css" />';
				echo '<script src="../api/scripts/jquery-ui-1.11.1.min.js"></script>';
			echo '</head>';

			echo '<body>';
			echo '<div id="errorbox" class="error">';
				echo '<div id="errorTitle">Feil</div>';
				echo '<span id="errorMsg">Placeholder error message here...</span>';
				echo '<div class="errorClose">Lukk</div>';
			echo '</div>';
				if(Session::isAuthenticated())
				{
					echo '<div id="content">';
				        echo '<div id="leftColumn">';
				            echo '<div id="profileBox">';
				            	echo '<div id="userProfilePic">';
				                	echo '<img></img>';
				                echo '</div>';
				                echo '<div id="userName">';
				                	echo '<p>Warbo "warb" Warbosen warbolomommelom</p>';
				                echo '</div>';
				            echo '</div>';
				            echo '<div id="teamBox">';
				                echo '<p style="position:absolute; left:20px; top:-45px;">Teams</p>';
				                echo '<h1>wArp - CS:GO</h1>';
								echo '<h1>wArp - LoL</h1>';
				                echo '<p id="addTeam"><span style="font-size:20px; margin-top:-15px;">+</span> Add Team</p>';
				            echo '</div>';
				            echo '<div id="chatBox">';
				            echo '</div>';
				        echo '</div>';
				        echo '<div id="rightColumn">';
				            echo '<div id="banner">';
				            	echo '<div class="gameType" style="width:100px;"><p>CS:GO</p></div>';
				                echo '<div class="gameType" style="width:70px;"><p>LoL</p></div>';
				                echo '<div class="gameType selected" style="width:170px;"><p>Current Match</p></div>';
				                echo '<div id="bannerFiller"></div>';
				            echo '</div>';
				            echo '<div id="mainContent">';
				                echo 'placeholder';
				                
				            echo '</div>';
				        echo '</div>';
				    echo '</div>';
				}
				else
				{
					echo '<div id="loginbox">';
						echo '<script src="../api/scripts/login.js"></script>';
						echo '<form class="login" method="post">';
							echo '<li>';
								echo '<input class="input" type="text" name="username" placeholder="Brukernavn">';
							echo '</li>';
							echo '<li>';
								echo '<input class="input" name="password" type="password" placeholder="Passord">';
							echo '</li>';
							
							echo '<li>';
								echo '<input class="button" id="submit" name="submit" type="submit" value="Logg inn">';
							echo '</li>';
							echo '<li>';
								echo '<i>Du bruker samme bruker på composiden og ticketsiden</i>';
							echo '</li>';
						echo '</form>';
					echo '</div>';
				}
			echo '</body>';
		echo '</html>';
	}
	
	// Generates title.
	private function getTitle() {
		return Settings::name . ' compo system';
	}
	
	private function viewPage($pageName) {
		$directoryList = array('pages');
		$includedPages = array();
		$found = false;
		
		foreach ($directoryList as $directory) {
			$filePath = $directory . '/' . $pageName . '.php';
		
			if (!in_array($pageName, $includedPages) &&
				in_array($filePath, glob($directory . '/*.php'))) {
				// Make sure we don't include pages with same name twice, 
				// and set the found varialbe so that we don't have to display the not found message.
				array_push($includedPages, $pageName);
				$found = true;
			
				include_once $filePath;
			}
		}
			
		if (!$found) {
			echo '<article>';
				echo '<h1>Siden ble ikke funnet!</h1>';
			echo '</article>';
		}
	}
}
?>