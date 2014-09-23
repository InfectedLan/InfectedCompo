<?php
require_once 'handlers/compohandler.php';
require_once 'handlers/eventhandler.php';
require_once 'session.php';
class PageContent {
	public function render() {
		$user = Session::getCurrentUser();
		if(isset($_GET['id'])) {
			$compo = CompoHandler::getCompo($_GET['id']);
			echo '<h1>' . $compo->getName() . '</h1>';
			echo '<br />';
			//Get list of teams
			$teams = CompoHandler::getTeams($compo);
			echo '<h3>Kvalifiserte lag:</h3>';
			echo '<ul>';
			foreach($teams as $team) {
				if($team->isQualified($compo)) {
					echo '<li>' . $team->getName() . '</li>';
				}
			}
			echo '</ul>';
		} else {
			echo '<h1>Compoen finnes ikke!</h1>';
		}
	}
}
?>