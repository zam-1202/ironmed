<?php

include_once('../../config/database.php');
include_once('../model/User.php');

$action = $_GET['action'];
$User = new User($conn);

if ($action == 'getTableData') 
{
    $result = $User->getAll();

    $table_data = '';
    $counter = 1;
    // foreach ($result as $user) {
    //     $fullName = $user['first_name'] . ' ' . $user['last_name'] ;
   
    foreach ($result as $user) {
        // if($user['status'] == 0) {
        //     // skip deactivated user
        //     continue;
        // }
        
    $fullName = $user['first_name'] . ' ' . $user['last_name'] ;    

        $role = 'Admin';
        if($user['role'] == 3)
        {
            $role = 'User';
        }

        $status = '<span class="badge bg-success">Active</span>';
        if($user['status'] == 0)
        {
            $status = '<span class="badge bg-danger">Inactive</span>';
        }

        $last_login = '';
        if($user['last_login']) 
        {
            $last_login = date('F j, Y, g:i a', strtotime($user['last_login']));
        }

        $table_data .= '<tr>';
        $table_data .= '<td>' . $counter . '</td>';
        $table_data .= '<td>'  . $fullName . '</td>';
        $table_data .= '<td>'  . $user['username'] . '</td>';
        $table_data .= '<td>'  . $user['email'] . '</td>';
        $table_data .= '<td>'  . $role . '</td>';
        $table_data .= '<td>'  . $status . '</td>';
        $table_data .= '<td>'  . $last_login . '</td>';
        $table_data .= '<td class="col-actions">';
        $table_data .= '<div class="btn-group" role="group" aria-label="Basic mixed styles example">';
        $table_data .= '<button type="button" onclick="Admin.clickUpdate('. $user['id'] .')" class="btn btn-warning btn-sm"><i class="bi bi-list-check"></i> Update </button>';
        $table_data .= '<button type="button" onclick="Admin.clickResetPassword('. $user['id'] .')" class="btn btn-info btn-sm"><i class="bi bi-key"></i> Reset Password </button>';
        // if($_SESSION['user']['role'] == 1) {
        //     $table_data .= '<button type="button" onclick="Admin.clickDelete('. $user['id'] .')" class="btn btn-danger btn-sm"> <i class="bi bi-trash"></i> Delete</button>';
        // }
        $table_data .= '</div>';
        $table_data .= '</td>';
        $table_data .= '</tr>';

        $counter++;
    }

    echo json_encode($table_data);
}

else if ($action == 'getById')
{
    $user_id = $_POST['user_id'];

    echo json_encode($User->getById($user_id));
}

else if ($action == 'save')
{
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $role = $_POST['role'];
    $status = $_POST['status'];

    $request = [
        'first_name' => $first_name,
        'last_name' => $last_name,
        'username' => $username,
        'email' => $email,
        'password' => $password,
        'role' => $role,
        'status' => $status
    ];

    $result = $User->save($request);

    echo json_encode($result);
}

else if ($action == 'update')
{
    $user_id = $_POST['user_id'];
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $username = $_POST['username'];
    $email = $_POST['email'];
    $role = $_POST['role'];
    $status = $_POST['status'];

    $request = [
        'user_id' => $user_id,
        'first_name' => $first_name,
        'last_name' => $last_name,
        'username' => $username,
        'email' => $email,
        'role' => $role,
        'status' => $status
    ];

    $result = $User->update($request);

    echo json_encode($result);
}

else if ($action == 'delete')
{
    $user_id = $_POST['user_id'];

    $result = $User->delete($user_id);

    echo json_encode($result);
}

else if ($action == 'validateAdminPassword') 
{
    $password = $_POST['password'];

    $result = $User->validateAdminPassword($password);

    echo json_encode($result);
}

else if ($action == 'changePassword') 
{
    $password = $_POST['password'];
    $user_id = $_SESSION['user']['id'];

    $request = [
        'user_id' => $user_id,
        'password' => $password
    ];

    $result = $User->update_password($request);
    session_destroy();
    echo json_encode($result);
}

else if($action == 'resetPassword') 
{
    $password = DEFAULT_PASSWORD;
    $user_id = $_POST['user_id'];

    $request = [
        'user_id' => $user_id,
        'password' => $password
    ];

    $User->update_status($user_id, 1);
    $User->update_login_attempt($user_id, 0);
    $result = $User->update_password($request);

    echo json_encode($result);
}

else if ($action == 'searchUsers') {
    $searchTerm = $_GET['searchTerm'];
    $results = $User->searchUsers($searchTerm);

    // Initialize the $table_data variable
    $table_data = '';
    $counter = 1;

    // Process the search results and append them to $table_data
    foreach ($results as $user) {
        $fullName = $user['first_name'] . ' ' . $user['last_name'];
        $role = 'Admin';
        if ($user['role'] == 3) {
            $role = 'User';
        }

        $status = '<span class="badge bg-success">Active</span>';
        if ($user['status'] == 0) {
            $status = '<span class="badge bg-danger">Inactive</span>';
        }

        $last_login = '';
        if ($user['last_login']) {
            $last_login = date('F j, Y, g:i a', strtotime($user['last_login']));
        }

        // Format and append the user data to $table_data
        $table_data .= '<tr>';
        $table_data .= '<td>' . $counter . '</td>';
        $table_data .= '<td>' . $fullName . '</td>';
        $table_data .= '<td>' . $user['username'] . '</td>';
        $table_data .= '<td>' . $user['email'] . '</td>';
        $table_data .= '<td>' . $role . '</td>';
        $table_data .= '<td>' . $status . '</td>';
        $table_data .= '<td>' . $last_login . '</td>';
        $table_data .= '<td class="col-actions">';
        $table_data .= '<div class="btn-group" role="group" aria-label="Basic mixed styles example">';
        $table_data .= '<button type="button" onclick="Admin.clickUpdate(' . $user['id'] . ')" class="btn btn-warning btn-sm"><i class="bi bi-list-check"></i> Update </button>';
        $table_data .= '<button type  ="button" onclick="Admin.clickResetPassword(' . $user['id'] . ')" class="btn btn-info btn-sm"><i class="bi bi-key"></i> Reset Password </button>';
        $table_data .= '</div>';
        $table_data .= '</td>';
        $table_data .= '</tr>';

        $counter++;
    }

    // Output the $table_data as JSON
    echo json_encode($table_data);
}
