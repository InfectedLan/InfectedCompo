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

require_once 'handlers/compohandler.php';
require_once 'handlers/eventhandler.php';
require_once 'session.php';

$user = Session::getCurrentUser();

if(isset($_GET['id'])) {
	echo '<script src="scripts/viewCompo.js"></script>';
	echo '<script src="../api/scripts/bracket.js"></script>';

	$compo = CompoHandler::getCompo($_GET['id']);
    echo '<script>var source = new DataSource(' . $compo->getId() . ');</script>';
    echo '<script>';
    echo 'var participant_type_clan = ' . Settings::compo_match_participant_type_clan . ';';
    echo 'var participant_type_winner = ' . Settings::compo_match_participant_type_match_winner . ';';
    echo 'var participant_type_looser = ' . Settings::compo_match_participant_type_match_looser . ';';
    echo 'var participant_type_walkover = ' . Settings::compo_match_participant_type_match_walkover . ';';
    echo '</script>';

	echo '<h1>' . $compo->getName() . '</h1>';

	if (CompoHandler::hasGeneratedMatches($compo)) {
		echo '<div class="bracket_container" id="bracket_container"></div><br />';
		echo '<script>var bracket = source.derive("bracket_container", ".*");</script>';
	}

	echo '<br />';
	//Get list of teams
	$teams = ClanHandler::getClansByCompo($compo);
	//Count stats
	$numQualified = 0;

	foreach ($teams as $clan) {
		if ($clan->isQualified($compo)) {
			$numQualified++;
		}
	}

  if ($compo->getParticipantLimit() != 0) {
      echo '<h3>Kvalifiserte lag(' . $numQualified . ' av ' . $compo->getParticipantLimit() . '):</h3>';
  } else {
      echo '<h3>Kvalifiserte lag:</h3>';
  }

	echo '<br />';
	echo '<br />';

	if ($numQualified==0) {
		echo '<i>Ingen lag er fullstendige enda!</i>';
	}

	echo '<ul>';
	//print_r($teams);

	foreach ($teams as $clan) {
		if ($clan->isQualified($compo)) {
			echo '<li class="teamEntry" id="teamButtonId' . $clan->getId() . '">' . $clan->getName() . '</li>';
		}
	}

	echo '</ul>';

	if (count($teams) != $numQualified) {
		echo '<br />';
		echo '<h3>Ukvalifiserte lag:</h3>';
		echo '<br />';
		echo '<ul>';

			foreach ($teams as $clan) {
				if (!$clan->isQualified($compo)) {
					echo '<li class="teamEntry" id="teamButtonId' . $clan->getId() . '">' . $clan->getName() . '</li>';
				}
			}
		echo '</ul>';
		echo '<br />';
		echo '<i>Disse lagene mangler spillere og vil ikke kunne delta med mindre de klarer å fylle laget</i>';
	}
	//Add JS
	echo '<script>var compoTeamList = [';
	 	$first = true;

		foreach ($teams as $clan) {
			if (!$first) {
				echo ', ';
			}

			echo $clan->getId();

			$first = false;
		}
	echo '];</script>';
} else {
	echo '<h1>Compoen finnes ikke!</h1>';
}
?>