<?php

include_once('../../config/database.php');
include_once('../model/ActionLog.php');

$action = $_GET['action'];
$ActionLog = new ActionLog($conn);

if ($action == 'getTableData') 
{
    $result = $ActionLog->getAll();

    usort($result, function ($present, $past) {
        return strtotime($past['datetime']) - strtotime($present['datetime']);
    });


    $table_data = '';
    $counter = 1;
    // foreach ($result as $product) {
    //     $table_data .= '<tr>';
    //     $table_data .= '<td>' . $counter . '</td>';
    //     $table_data .= '<td>' . $product['datetime'] . '</td>';
    //     $table_data .= '<td>' . $product['role'] . '</td>';
    //     $table_data .= '<td>' . $product['username'] . '</td>';
    //     $table_data .= '<td>' . $product['action'] . '</td>';
    //     $table_data .= '</tr>';

    //     $counter++;
    // }
    foreach ($result as $product) {
        $datetime = date('Y-m-d / h:i:s A', strtotime($product['datetime']));
        $table_data .= '<tr>';
        $table_data .= '<td>' . $counter . '</td>';
        $table_data .= '<td>' . $datetime . '</td>';
        $table_data .= '<td>' . $product['role'] . '</td>';
        $table_data .= '<td>' . $product['username'] . '</td>';
        $table_data .= '<td>' . $product['action'] . '</td>';
        $table_data .= '</tr>';
    
        $counter++;
    }

    echo json_encode($table_data);

    } else if ($action === 'searchDaily') {

        if (isset($_GET['date'])) {
            $date = $_GET['date'];
            echo json_encode($ActionLog->searchDaily($date));
        } else {
            echo json_encode('No selected date');
        }

    } else if ($action === 'searchMonthly') {

        if (isset($_GET['yearmonth'])) {
            $yearmonth = explode('-', $_GET['yearmonth']);
            echo json_encode($ActionLog->searchMonthly($yearmonth));
        } else {
            echo json_encode('No selected date');
        }

    } else if ($action === 'searchRange') {

        if (isset($_GET['startDate']) && isset($_GET['endDate'])) {
            $start = $_GET['startDate'];
            $end = $_GET['endDate'];
            echo json_encode($ActionLog->searchRange($start, $end));
        } else {
            echo json_encode('No selected date');
        }
    }

?>