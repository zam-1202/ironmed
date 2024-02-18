<?php

include_once('../../config/database.php');
include_once('../model/Category.php');
include_once('../model/Product.php');
include_once('../model/ProductDetails.php');
include_once('../model/Invoice.php');
include_once('../model/ExportInvoice.php');


$action = $_GET['action'];
$Category = new Category($conn);
$Product = new Product($conn);
$ProductDetails = new ProductDetails($conn);
$Invoice = new Invoice($conn);


if ($action === 'confirmedCheckout') {

    $discounted = $_POST['discounted'];

    if (isset($_POST['data'])) {
        $data = $_POST['data'];
        $osca_number = $_POST['osca_number'];
        $customerName = $_POST['customerName'];
        $cashPayment = $_POST['cashPayment'];
        echo json_encode($Invoice->save($data, $discounted, $customerName, $osca_number, $cashPayment));
    }

} else if ($action === 'getTotalSalesToday') {
    echo json_encode($Invoice->getTotalSalesToday());

} else if ($action === 'searchDaily') {

    if (isset($_GET['date'])) {
        $date = $_GET['date'];
        echo json_encode($Invoice->searchDaily($date));
    } else {
        echo json_encode('No selected date');
    }

} else if ($action === 'searchMonthly') {

    if (isset($_GET['yearmonth'])) {
        $yearmonth = explode('-', $_GET['yearmonth']);
        echo json_encode($Invoice->searchMonthly($yearmonth));
    } else {
        echo json_encode('No selected date');
    }

} else if ($action === 'searchRange') {

    if (isset($_GET['startDate']) && isset($_GET['endDate'])) {
        $start = $_GET['startDate'];
        $end = $_GET['endDate'];
        echo json_encode($Invoice->searchRange($start, $end));
    } else {
        echo json_encode('No selected date');
    }

} else if ($action === 'getInvoiceSales') {

    if (isset($_GET['invoice_id'])) {
        $invoice_id = $_GET['invoice_id'];
        echo json_encode($Invoice->getInvoiceSales($invoice_id));
    } else {
        echo json_encode('No Invoice ID');
    }

} else if ($action === 'voidItem') {

    if (isset($_POST['product']) && isset($_POST['invoice'])) {
        $invoice_id = $_POST['invoice'];
        $product_id = $_POST['product'];
        echo json_encode($Invoice->voidItem($invoice_id, $product_id));
    } else {
        echo json_encode('No Invoice ID');
    }

} else if ($action == "exportDaily") {
    if (isset($_GET['date'])) {
        $date = $_GET['date'];

        $invoices = $Invoice->ExportDaily($date);

        if ($invoices) {
            $data = [];
            foreach ($invoices as $invoice) {
                // Exclude VOIDED items (where 'Action' is equal to 1)
                // if ($invoice['void'] != 1) {
                    $data[] = [
                        'Issue By' => $invoice['users_name'],
                        'Transaction Date' => $invoice['date_transact'],
                        'Invoice Number' => $invoice['number'],
                        'Product Name' => $invoice['product_name'], 
                        'Quantity' => $invoice['qty'], 
                        'Price' => $invoice['price'], 
                        'Total Items' => $invoice['total_items'],
                        'Total Purchase' => $invoice['total_purchase'],
                        'Action' => $invoice['void'], 
                    ];
                // }
            }

            $filename = ExportInvoice($data);
            echo json_encode(['filename' => $filename]);
        } else {
            echo json_encode('No data found for the specified date');
        }
    } else {
        echo json_encode('No date provided');
    }
}
