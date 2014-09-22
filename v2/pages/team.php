<?php
require_once 'handlers/clanhandler.php';
require_once 'handlers/eventhandler.php';
require_once 'session.php';
class PageContent {
	public function render() {
		$user = Session::getCurrentUser();
		if(isset($_GET['id'])) {
			$team = ClanHandler::getClan($_GET['id']);
			//echo '<center>';
				echo '<h1>' . $team->getTag() . ' ' . $team->getName() . '</h1>';
				echo '<br />';
				$compo = ClanHandler::getCompo($team);
				echo '<h3>' . $compo->getName() . '</h3>';
			//echo '</center>';

			echo '<br />';
			echo '<br />';

			echo '<h1>Medlemmer</h1>';
			echo '<br />';
			echo '<table>';
				$members = $team->getMembers();
				foreach ($members as $member) {
					$canKick = ($member->getId() != $team->getChief()) && ($user->getId() == $team->getChief());
					if($canKick) {
						echo '' . $member->getDisplayName() . '<input type="button" value="Kick" onclick="kickUser(' . $member->getId() . ', ' . $team->getId() . ')" /><br />';
					} else {
						echo '' . $member->getDisplayName() . '<br />';
					}
				}
			echo '</table>';

		} else {
			echo '<h1>Laget finnes ikke!</h1>';
		}
	}
}
?>