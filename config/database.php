<?php

$host = 'localhost';
$username = 'u597994262_iron_med';
$password = 'IronMed_2024!';
$db_name = 'u597994262_ironmed';

$conn = new mysqli($host, $username, $password, $db_name);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Check for an active session before starting a new one
if (session_id() === '') {
  session_start();
}

CONST DEFAULT_PASSWORD = 'default123';