<?php
class PageContent {
	public function render() {
		echo "<h1>Lag team</h1>";
		echo "<table>";
			echo '<tr>';
				echo '<td>';
					echo '<h3>Et par detaljer...</h3>';
					echo '<p>Før du kan lage klanen må vi få vite litt mer om den. Vennligst fyll ut litt mer om den...</p>';
				echo '</td>';
				echo '<td>';
					echo '<h3>Inviter teammates</h3>';
				echo '</td>';
			echo '</tr>';
		echo "</table>";
	}
}
?>