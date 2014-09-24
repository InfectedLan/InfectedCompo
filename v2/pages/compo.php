<?php
require_once 'handlers/compohandler.php';
require_once 'handlers/eventhandler.php';
require_once 'session.php';
class PageContent {
	public function render() {
		$user = Session::getCurrentUser();
		if(isset($_GET['id'])) {
			echo '<script src="scripts/viewCompo.js"></script>';
			$compo = CompoHandler::getCompo($_GET['id']);
			echo '<h1>' . $compo->getName() . '</h1>';
			echo '<br />';
			//Get list of teams
			$teams = CompoHandler::getClans($compo);
			//Count stats
			$numQualified = 0;
			foreach($teams as $clan) {
				if($clan->isQualified($compo)) {
					$numQualified++;
				}
			}
			echo '<h3>Kvalifiserte lag:</h3>';
			echo '<br />';
			echo '<br />';
			if($numQualified==0) {
				echo '<i>Ingen lag er kvalifisert enda!</i>';
			}
			echo '<ul>';
			//print_r($teams);
			foreach($teams as $clan) {
				if($clan->isQualified($compo)) {
					echo '<li class="teamEntry" id="teamButtonId' . $clan->getId() . '">' . $clan->getName() . '</li>';
				}
			}
			echo '</ul>';
			if(count($teams) != $numQualified) {
				echo '<h3>Ikke kvalifiserte/Lag under oppbygging:</h3>';
				echo '<br />';
				echo '<ul>';
					foreach($teams as $clan) {
						if(!$clan->isQualified($compo)) {
							echo '<li class="teamEntry" id="teamButtonId' . $clan->getId() . '">' . $clan->getName() . '</li>';
						}
					}
				echo '</ul>';
			}
			//Add JS
			echo '<script>var compoTeamList = [';
			 	$first = true;
				foreach($teams as $clan) {
					if(!$first) {
						echo ', ';
					}
					echo $clan->getId();
					$first = false;
				}
			echo '];</script>';
		} else {
			echo '<h1>Compoen finnes ikke!</h1>';
		}
	}
}
?>