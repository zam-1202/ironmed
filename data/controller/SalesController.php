<?php

include_once('../../config/database.php');
include_once('../model/Category.php');
include_once('../model/Product.php');
include_once('../model/ProductDetails.php');
include_once('../model/Invoice.php');
include_once('../model/Sales.php');
include_once('../model/ExportSales.php');


$action = $_GET['action'];
$Category = new Category($conn);
$Product = new Product($conn);
$ProductDetails = new ProductDetails($conn);
$Invoice = new Invoice($conn);
$Sales = new Sales($conn);

function generateColor($string) {
    $color = substr(md5($string), 0, 6);
    return '#' . $color;
}

if ($action === 'getReportData') {

    $dateFrom = date('Y-m-d', strtotime($_POST['dateFrom']));
    $dateTo = date('Y-m-d', strtotime($_POST['dateTo']));

    $reports_data = $Sales->getReport($dateFrom, $dateTo);

    $chart_label = [];
    $barchart_dataset = [
        'label' => 'quantity',
        'data' => [],
        'backgroundColor' => []
    ];
    $piechart_dataset = [
        'data' => [],
        'backgroundColor' => []
    ];
    $total_sales = 0;

    foreach ($reports_data as $report_data) {
        $chart_label[] = $report_data['product_name'];

        $color = generateColor($report_data['product_name']);
        
        $piechart_dataset['data'][] = $report_data['total_price'];
        $piechart_dataset['backgroundColor'][] = $color;

        $barchart_dataset['data'][] = $report_data['total_sales'];
        $barchart_dataset['backgroundColor'][] = 'grey';

        $total_sales = $total_sales + $report_data['total_price'];
    }


    $charts_data = [
        'labels' => $chart_label,
        'barchart_dataset' => $barchart_dataset,
        'piechart_dataset' => $piechart_dataset,
        'total_sales' => $total_sales
    ];

    echo json_encode($charts_data);

} 

else if ($action === 'searchDaily') {

    if (isset($_GET['date'])) {
        $date = $_GET['date'];
        echo json_encode($Sales->searchDaily($date));
    } else {
        echo json_encode('No selected date');
    }

} else if ($action === 'searchMonthly') {

    if (isset($_GET['yearmonth'])) {
        $yearmonth = explode('-', $_GET['yearmonth']);
        echo json_encode($Sales->searchMonthly($yearmonth));
    } else {
        echo json_encode('No selected date');
    }

} else if ($action === 'searchRange') {

    if (isset($_GET['startDate']) && isset($_GET['endDate'])) {
        $start = $_GET['startDate'];
        $end = $_GET['endDate'];
        echo json_encode($Sales->searchRange($start, $end));
    } else {
        echo json_encode('No selected date');
    }

} else if ($action == "exportDaily") {
    if (isset($_GET['date'])) {
        $date = $_GET['date'];

        $sales = $Sales->ExportDaily($date);

        if ($sales) {
            $data = [];
            foreach ($sales as $sale) {
                    $data[] = [
                        'Issued By' => $sale['users_name'],
                        'Transaction Date' => $sale['date_purchased'],
                        'Invoice Number' => $sale['number'],
                        'Product Name' => $sale['name'],
                        'Quantity' => $sale['qty'],
                        'Selling Price' => $sale['original_price'],
                        'Total Purchase' => $sale['indiv_total_purchase'],
                    ];
            }

            $filename = ExportSales($data);
            echo json_encode(['filename' => $filename]);
        } else {
            echo json_encode(['message' => 'No data available']);
        }
    } else {
        echo json_encode('No date provided');
    }

} else if ($action == "exportMonthly") {
        if (isset($_GET['yearmonth'])) {
            $yearmonth = explode('-', $_GET['yearmonth']);
            $sales = $Sales->searchMonthly($yearmonth);

            if ($sales) {
                $data = [];
                foreach ($sales as $sale) {
                        $data[] = [
                            'Issued By' => $sale['users_name'],
                            'Transaction Date' => $sale['date_purchased'],
                            'Invoice Number' => $sale['number'],
                            'Product Name' => $sale['name'],
                            'Quantity' => $sale['qty'],
                            'Selling Price' => $sale['original_price'],
                            'Total Purchase' => $sale['total_purchase'],
                        ];
                }
    
                $filename = ExportSales($data);
                echo json_encode(['filename' => $filename]);
            } else {
                echo json_encode(['message' => 'No data available']);
            }
        } else {
            echo json_encode('No selected date');
        }

} else if ($action == "exportRange") {
        if (isset($_GET['startDate']) && isset($_GET['endDate'])) {
            $start = $_GET['startDate'];
            $end = $_GET['endDate'];
    
            $sales = $Sales->ExportRange($start, $end);
    
            if ($sales) {
                $data = [];
                foreach ($sales as $sale) {
                    $data[] = [
                        'Issued By' => $sale['users_name'],
                        'Transaction Date' => $sale['date_purchased'],
                        'Invoice Number' => $sale['number'],
                        'Product Name' => $sale['name'],
                        'Quantity' => $sale['qty'],
                        'Selling Price' => $sale['original_price'],
                        'Total Purchase' => $sale['total_purchase'],
                    ];
                }
    
                $filename = ExportSales($data);
                echo json_encode(['filename' => $filename]);
            } else {
                echo json_encode(['message' => 'No data available']);
            }
        } else {
            echo json_encode('No selected date');
        }

} else if ($action === 'showReportTable'){
    $dateFrom = date('Y-m-d', strtotime($_POST['dateFrom']));
    $dateTo = date('Y-m-d', strtotime($_POST['dateTo']));

    $result = $Sales->getReport($dateFrom, $dateTo);

    $table_data = '';
    $counter = 1;
    foreach ($result as $sales) {
        $table_data .= '<tr>';
        $table_data .= '<td>' . $counter . '</td>';
        $table_data .= '<td>' . $sales['product_name'] . '</td>';
        $table_data .= '<td>' . $sales['total_sales'] . '</td>';
        $table_data .= '<td>' . $sales['total_price'] . '</td>';
        $table_data .= '<td>' . $sales['bought'] . '</td>';
        $table_data .= '<td>' . $sales['transact'] . '</td>';
        $table_data .= '</tr>';

        $counter++;
    }

    echo json_encode($table_data);
}

else if ($action == "exportData") 
{
    $dateFrom = date('Y-m-d', strtotime($_POST['dateFrom']));
    $dateTo = date('Y-m-d', strtotime($_POST['dateTo']));

    $result = $Sales->getReport($dateFrom, $dateTo);

    $column_name = [];
    foreach ($result as $sales) {
        $column_name[] = [
            'Invoice ID' => $sales['transact'],
            'Product Name' => $sales['product_name'],
            'Total Sales' => $sales['total_sales'],
            'Total Price' => $sales['total_price'],
            'Transaction Date' => $sales['bought']
        ];
    }

    echo json_encode($column_name);
}


else {
    return 'Something went wrong';
}


function random_color_part() {
    return str_pad( dechex( mt_rand( 0, 255 ) ), 2, '0', STR_PAD_LEFT);
}

function random_color() {
    return random_color_part() . random_color_part() . random_color_part();
}