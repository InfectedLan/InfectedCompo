<?php
require_once 'site.php';

// Force user to use https.
if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] != 'on') {
	header('Location: https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
}

// Execute the site.
$site = new Site();
$site->execute();
?>