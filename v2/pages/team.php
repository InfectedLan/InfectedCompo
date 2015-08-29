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
require_once 'handlers/clanhandler.php';
require_once 'handlers/invitehandler.php';
require_once 'handlers/eventhandler.php';

$user = Session::getCurrentUser();

if (isset($_GET['id']) &&
	is_numeric($_GET['id'])) {
	echo '<script>var clanId = ' . htmlentities($_GET['id'], ENT_QUOTES, 'UTF-8') . ';</script>';
	echo '<script src="scripts/team.js"> </script>';

	$team = ClanHandler::getClan($_GET['id']);

	//echo '<center>';
	echo '<h1>' . $team->getName() . ' - ' . $team->getTag() . '</h1>';
	echo '<br />';

	$compo = CompoHandler::getCompoByClan($team);

	echo '<h3>' . $compo->getName() . '</h3>';

	$playingMembers = ClanHandler::getPlayingClanMembers($team);
	$stepinMembers = ClanHandler::getStepInClanMembers($team);
	//echo '</center>';

	if ($team->getChief() == $user) {
        if (ClanHandler::isQualified($team, $compo)) {
            echo '<br /><b>Laget ditt er kvalifisert til å spille i konkurransen</b>';
        } else {
            if (count($playingMembers) != $compo->getTeamSize()) {
                echo '<br /><b>ADVARSEL: Laget er ikke fullt, og vil ikke være kvalifisert til compoen før det er fullt!</b>';
            } else {
                if ($compo->getParticipantLimit() != 0) {
                    echo "<br /><b>Beklager, men ditt lag ble ikke fullt før alle plassene var tatt!</b>";
                }
            }
        }
	}
    echo '</table>';
    echo '<br />';
	echo '<br />';
	echo '<br />';

	echo '<h1>Medlemmer</h1>';
	echo '<br />';
	echo '<table>';

    foreach ($playingMembers as $member) {
        echo '<tr>';
      	if ($user == $team->getChief()) { //Are we a chief?
            if ($member->getId() != $team->getChief()) { //Only show kick button if this isnt us
                echo '<td>' . $member->getCompoDisplayName() . '</td><td><input type="button" value="Set as stepin" onclick="setAsStepinPlayer(' . $member->getId() . ', ' . $team->getId() . ')" /></td><td><input type="button" value="Kick" onclick="kickUser(' . $member->getId() . ', ' . $team->getId() . ')" /></td>';
            } else {
                echo '<td>' . $member->getCompoDisplayName() . '</td><td><input type="button" value="Set as stepin" onclick="setAsStepinPlayer(' . $member->getId() . ', ' . $team->getId() . ')" /></td>';
            }
        } else {
            echo '<td>' . $member->getCompoDisplayName() . '</td>';
        }
        echo '</tr>';
    }

	echo '</table>';
	echo '<br />';

	if (count($stepinMembers) > 0) {
		echo '<h1>Step-in medlemmer</h1>';
		echo '<br />';
		echo '<table>';

        foreach ($stepinMembers as $member) {
            echo '<tr>';
            if ($user == $team->getChief()) { //Are we a chief?
                if ($member->getId() != $team->getChief()) { //Only show kick button if this isnt us
                    echo '<td>' . $member->getCompoDisplayName() . '</td><td><input type="button" value="Set as primary player" onclick="setAsPrimaryPlayer(' . $member->getId() . ', ' . $team->getId() . ')" /></td><td><input type="button" value="Kick" onclick="kickUser(' . $member->getId() . ', ' . $team->getId() . ')" /></td>';
                } else {
                    echo '<td>' . $member->getCompoDisplayName() . '</td><td><input type="button" value="Set as primary player" onclick="setAsPrimaryPlayer(' . $member->getId() . ', ' . $team->getId() . ')" /></td>';
                }
            } else {
                echo '<td>' . $member->getCompoDisplayName() . '</td>';
            }
            echo '</tr>';
        }
        echo '</table>';
        echo '<br />';
    }

    echo '<h1>Inviterte medlemmer</h1>';
    echo '<br />';
    echo '<table>';

    $inviteList = InviteHandler::getInvitesByClan($team);

    foreach ($inviteList as $invite) {
        echo '<tr>';
        echo '<td>';

        if ($team->getChief() == $user) {
            echo UserHandler::getUser($invite->getUser()->getId())->getCompoDisplayName() . '<input type="button" value="Slett invite" onClick="deleteInvite(' . $invite->getId() . ')" />';
        } else {
            echo UserHandler::getUser($invite->getUser()->getId())->getCompoDisplayName();
        }

        echo '</td>';
        echo '</tr>';
    }
    echo '</table>';

    if ($team->getChief() == $user) {
        echo 'Invite teammates: <input id="inviteSearchBox" type="text" />';
        echo '<br />';
        echo '<div id="searchResultsResultPane">';

        echo '</div>';
    }
} else {
    echo '<h1>Laget finnes ikke!</h1>';
}
?>
