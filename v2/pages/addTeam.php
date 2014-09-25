<?php
require_once 'handlers/compohandler.php';
require_once 'handlers/eventhandler.php';
class PageContent {
	public function render() {
		$currEvent = EventHandler::getCurrentEvent();
		echo '<script src="scripts/addTeam.js"> </script>';
		echo "<h1>Lag team</h1>";
		echo "<table>";
			echo '<tr>';
				echo '<td width="50%">';
					echo '<table>';
						echo '<tr>';
							echo '<td>';
								echo 'Teamname:';
							echo '</td>';
							echo '<td>';
								echo '<input type="text" id="clanName" />';
							echo '</td>';
						echo '</tr>';
						echo '<tr>';
							echo '<td>';
								echo 'Teamtag:';
							echo '</td>';
							echo '<td>';
								echo '<input type="text" id="clanTag" />';
							echo '</td>';
						echo '</tr>';
						echo '<tr>';
							echo '<td>';
								echo 'Compo:';
							echo '</td>';
							echo '<td>';
								echo '<select id="compoSelect">';
									$compos = CompoHandler::getComposForEvent($currEvent);
									foreach ($compos as $compo) {
										echo '<option value="' . $compo->getId() . '">' . $compo->getName() . '</option>';
									}
								echo '</select>';
								//Output team sizes
								echo '<script>';
									echo 'var compoTeamSizes = [';
									$a = false;
									foreach ($compos as $compo) {
										echo ($a == true ? ', ' : '') . $compo->getTeamSize();
										$a = true;
									}
									echo '];';
								echo '</script>';
							echo '</td>';
						echo '</tr>';
						echo '<tr>';
							echo '<td>';
								echo '<div id="addClanButtonWrapper">';
									echo '<input type="button" value="Lag klan!" onClick="registerClan()" />';
								echo '</div>';
							echo '</td>';
						echo '</tr>';
					echo '</table>';
					//echo '<p>Før du kan lage klanen må vi få vite litt mer om den. Vennligst fyll ut litt mer om den. Du kan for øyeblikket bare melde en klan på en compo. Lag flere dersom dere skal delta i flere kompoer.</p>';
				echo '</td>';
				echo '<td width="50%">';
					echo 'Invite teammates: <input id="inviteSearchBox" type="text" />';
					echo '<br />';
					echo '<div id="searchResultsResultPane">';

					echo '</div>';
					echo '<br />';
					echo '<h3>Invited players:</h3>';
					echo '<div id="invidedPlayers">';

					echo '</div>';
				echo '</td>';
			echo '</tr>';
		echo "</table>";
	}
}
?>