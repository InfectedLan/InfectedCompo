<?php
require_once 'handlers/clanhandler.php';
require_once 'handlers/eventhandler.php';
require_once 'session.php';
class PageContent {
	public function render() {
		$user = Session::getCurrentUser();
		if(isset($_GET['id'])) {
			echo '<script>var clanId = ' . htmlentities($_GET['id'], ENT_QUOTES, 'UTF-8') . ';</script>';
			echo '<script src="scripts/team.js"> </script>';
			$team = ClanHandler::getClan($_GET['id']);
			//echo '<center>';
				echo '<h1>' . $team->getName() . ' - ' . $team->getTag() . '</h1>';
				echo '<br />';
				$compo = ClanHandler::getCompo($team);
				echo '<h3>' . $compo->getName() . '</h3>';

			$members = $team->getMembers();
			//echo '</center>';
			if($team->getChief() == $user->getId()) {
				if(count($members) != $compo->getTeamSize()) {
					echo '<br /><b>ADVARSEL: Laget er ikke fullt, og vil ikke være kvalifisert til compoen før det er fullt!</b>';
				}
			}


			echo '<br />';
			echo '<br />';

			echo '<h1>Medlemmer</h1>';
			echo '<br />';
			echo '<table>';
				foreach ($members as $member) {
					echo '<tr>';
						$canKick = ($member->getId() != $team->getChief()) && ($user->getId() == $team->getChief());
						if($canKick) {
							echo '<td>' . $member->getDisplayName() . '</td><td><input type="button" value="Kick" onclick="kickUser(' . $member->getId() . ', ' . $team->getId() . ')" /></td>';
						} else {
							echo '<td>' . $member->getDisplayName() . '</td>';
						}
					echo '</tr>';
				}
			echo '</table>';
			echo '<br />';
			echo '<h1>Inviterte medlemmer</h1>';
			echo '<br />';
			echo '<table>';
				$invites = ClanHandler::getInvites($team);
				foreach($invites as $invite) {
					echo '<tr>';
						echo '<td>';
							echo UserHandler::getUser($invite->getUserId())->getDisplayName();
						echo '</td>';
					echo '</tr>';
				}
			echo '</table>';
			if($team->getChief() == $user->getId()) {
				echo 'Invite teammates: <input id="inviteSearchBox" type="text" />';
				echo '<br />';
				echo '<div id="searchResultsResultPane">';

				echo '</div>';
			}
		} else {
			echo '<h1>Laget finnes ikke!</h1>';
		}
	}
}
?>