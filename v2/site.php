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
				echo '<script src="../api/scripts/jquery-1.11.1.min.js"></script>';
				echo '<script src="../api/scripts/jquery-ui-1.11.1.min.js"></script>';

				//Custom javascripts. This HAS to be included after jquery
				echo '<script src="scripts/shared.js"></script>';
                /*
                if(Session::isAuthenticated()) {
                    echo '<script src="../api/scripts/chat.js"></script>';
                    echo '<script>Chat.init(); $(document).ready(function() {Chat.bindChat("chatContainer", 1, 415);});</script>';
                }
                */
				echo "<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create', 'UA-54254513-4', 'auto');ga('send', 'pageview');</script>";
			echo '</head>';

			echo '<body>';
			echo '<div id="errorbox" class="error">';
				echo '<div id="errorTitle">Driftsmelding</div>';
				echo '<span id="errorMsg">Placeholder error message here...</span>';
				echo '<div class="errorClose">Lukk</div>';
			echo '</div>';
				if(Session::isAuthenticated())
				{
					echo '<script src="scripts/compo.js"></script>';
					$user = Session::getCurrentUser();
					$event = EventHandler::getCurrentEvent();
					echo '<script>';
						echo 'var myUserId = ' . $user->getId() . ';';
						echo 'var currentPage = "' . ( isset($_GET['page']) ? htmlentities($_GET['page'], ENT_QUOTES, 'UTF-8') : "none" ) . '";';
					echo '</script>';
					echo '<div id="content">';
				        echo '<div id="leftColumn">';
				            echo '<div id="profileBox">';
				            	echo '<div id="userProfilePic">';
				            		//Get avatar data

									$avatarFile = null;
									
									if ($user->hasValidAvatar()) {
										$avatarFile = $user->getAvatar()->getThumbnail();
									} else {
										$avatarFile = AvatarHandler::getDefaultAvatar($user);
									}
				                	echo '<img src="../api/' . $avatarFile . '"></img>';
				                echo '</div>';
				                echo '<div id="userName">';
				                	echo '<p>' . $user->getCompoDisplayName() . '</p>';
				                echo '</div>';
				                echo '<div>';
				                	echo '<a id="logOutLabel" href="javascript:logout()">Logg ut</a>';
				                echo '</div>';
				            echo '</div>';
				            echo '<div id="teamBox">';
				                echo '<p style="position:absolute; top:-45px;">Teams</p>';
				                echo '<div id="teamData">';
				                	echo '<h3>Laster inn...</h3>';
				                echo '</div>';
				                echo '<p id="addTeam"><span style="font-size:20px; margin-top:-15px;">+</span> Add Team</p>';
				            echo '</div>';
				            echo '<div id="chatBox">';
				            echo '<div class="boxTitle"><p class="boxTitleText">Chat - Global</p></div>';
				            echo '<div id="chatContainer"></div>';
				            echo '</div>';
				        echo '</div>';
				        echo '<div id="rightColumn">';
				            echo '<div id="banner">';
				            	//WIP
					            if(!isset($_GET['page'])) {
					            	echo '<div id="gameBannerCsGo" class="gameType" style="width:100px;"><p>CS:GO</p></div>';
					                echo '<div id="gameBannerLoL" class="gameType" style="width:70px;"><p>LoL</p></div>';
					            } else {
					            	if($_GET['page']=="compo") {
					            		echo '<div id="gameBannerCsGo" class="gameType' .  ($_GET['id'] == "5" ? ' selected' : ''). '" style="width:100px;"><p>CS:GO</p></div>';
					                	echo '<div id="gameBannerLoL" class="gameType' .  ($_GET['id'] == "6" ? ' selected' : ''). '" style="width:70px;"><p>LoL</p></div>';
					            	} else {
					            		echo '<div id="gameBannerCsGo" class="gameType" style="width:100px;"><p>CS:GO</p></div>';
					                	echo '<div id="gameBannerLoL" class="gameType" style="width:70px;"><p>LoL</p></div>';
					            	}
					            }

				                $match = MatchHandler::getMatchByUser($user, $event);
				                
				                if(isset($match)) {
				                	if(isset($_GET['page']) && $_GET['page'] == "match") {
				                		echo '<div id="gameBannerCurrentMatch" class="gameType selected" style="width:170px;"><p>Current Match</p></div>';	
				                	} else {
				                		echo '<div id="gameBannerCurrentMatch" class="gameType" style="width:170px;"><p>Current Match</p></div>';	
				                	}
				                	echo '<div id="bannerFiller"></div>';
				                } else {
				                	echo '<div id="bannerFiller2"></div>';
				                }
				                //
				                
				            echo '</div>';
				            echo '<div id="mainContent">';
				                if( isset($_GET['page'] ) && $this->viewPage($_GET['page']) )	
				                {
				                	$pageContent = new PageContent();
				                	$pageContent->render();
				                }	
				                else
				                {
				                	echo '<h1>Velkommen til infected compo!</h1>';
				                }		                
				            echo '</div>';
				        echo '</div>';
				    echo '</div>';
				}
				else
				{
					echo '<div id="loginbox">';
						echo '<script src="../api/scripts/login.js"></script>';
						echo '<form class="login" method="post">';
							echo '<ul>';
								echo '<li>';
									echo '<input class="input" type="text" name="identifier" placeholder="Brukernavn, E-post eller Telefon">';
								echo '</li>';
								echo '<li>';
									echo '<input class="input" name="password" type="password" placeholder="Passord">';
								echo '</li>';
								
								echo '<li>';
									echo '<input class="button" id="submit" name="submit" type="submit" value="Logg inn">';
								echo '</li>';
							echo '</ul>';
						echo '</form>';
						echo '<br />';
						echo '<i>Du bruker samme bruker på composiden og ticketsiden</i>';
					echo '</div>';
				}
			echo '</body>';
		echo '</html>';
	}
	
	// Generates title.
	private function getTitle() {
		return Settings::name . ' Compo';
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
		/*
		if (!$found) {
			echo '<article>';
				echo '<h1>Siden ble ikke funnet!</h1>';
			echo '</article>';
		}*/
		return $found;
	}
}
?>
