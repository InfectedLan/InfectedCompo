<?php
require_once 'site.php';

// Force user to use https if we are not in a development environment. Seriously, i wont want to spend 1 hour setting up my dev environment because one line cannot allow me non-ssl.
if ( ( !isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] != 'on' ) && strpos($_SERVER['HTTP_HOST'], "localhost") == -1 ) {
	header('Location: https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
}

// Execute the site.
$site = new Site();
$site->execute();
?>