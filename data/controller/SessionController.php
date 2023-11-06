<?php

include_once('../../config/database.php');
include_once('../model/Session.php');

$action = $_GET['action'];
$Session = new Session($conn);

if ($action == 'save')
{

    $username = $_SESSION['user']['username'];
    $hours = $_POST['hours'];
    $minutes = $_POST['minutes'];

    $request = [
        'username' => $username,
        'hours' => $hours,
        'minutes' => $minutes
    ];

    $result = $Session->save($request);

    echo json_encode($result);
}