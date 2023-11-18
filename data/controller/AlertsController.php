<?php

include_once('../../config/database.php');
include_once('../model/Product.php');
include_once('../model/ProductDetails.php');

$action = $_GET['action'];
$ProductDetails = new ProductDetails($conn);
$Product = new Product($conn);

if ($action == 'getTableDataExpirationStatus') 
{
    $result = $ProductDetails->getAllAlertExpired();

    $table_data = '';
    $counter = 1;
    foreach ($result as $product) {
        $expired_status = $product['expired_status'];

        if($product['designation'] == 0 && $product['expired_status'] == 0 && $product['quantity'] != 0) 
        {
            $expired_status = '<span class="category category--red">Near Expiration</span>'; 
        }
        else if ($product['designation'] == 0 && $product['expired_status'] == 1 && $product['quantity'] != 0){
            $expired_status = '<span class="category category--red">Expired</span>' .
             '<select class="form-control" name="" id="designate" onchange="Alerts.getExpiredId('. $product['product_details_id'] .','. $product['expired_status'] . ')">
                                          0.   <option value="" selected="true">Select Designation</option>
                                            <option value="1" onchange="Alerts.Exchange('. $product['product_details_id'] .',' . $product['expired_status'] .','. $product['designation'] . ')" id="exchange">For Exchange</option>
                                            <option value="2" onchange="Alerts.Return('. $product['product_details_id'] .',' . $product['expired_status'] .','. $product['designation'] . ')" id="return">For Return</option>
                                            <option value="3"  onchange="Alerts.Decompose('. $product['product_details_id'] .',' . $product['expired_status'] .','. $product['designation'] . ')" id="decompose">Decompose</option>
                                        </select>';
        }


        $table_data .= '<tr>';
        $table_data .= '<td>' . $counter . '</td>';
        $table_data .= '<td>' . $product['product_name'] . '</td>';
        $table_data .= '<td>' . $product['batch'] . '</td>';
        $table_data .= '<td>' . $product['quantity'] . '</td>';
        $table_data .= '<td>' . $product['expiration_date'] . '</td>';
        $table_data .= '<td>' . $expired_status . '</td>';
        $table_data .= '</tr>';

        $counter++;
    }
    echo json_encode($table_data);
} 
else if ($action == 'getTableDataStockStatus') 
{
    $result = $Product->getAllByStockStatus();
    // $quantity = $_POST['quantity'];
    // $request = ['quantity' => $quantity]; 
    $table_data = '';
    $counter = 1;
    foreach ($result as $product) {
        // $stock_status = $product['stock_status'];

        if ($product['stock_status'] == 4) 
        {
            $stock_status = '<span class="category category--black">Out of Stock</span>';
        }         
        else if ($product['stock_status'] == 3) 
        {
            $stock_status = '<span class="category category--red">Oversupply</span>';
        }
        else if($product['stock_status'] == 2) 
        {
            $stock_status = '<span class="category category--orange">Insufficient</span>';
        }
        else if ($product['stock_status'] == 0)
        {
            $stock_status = '<span class="category category--orange">Newly added product, kindly add stocks at Add Stocks page.</span>';
        }
       

        

        $table_data .= '<tr>';
        $table_data .= '<td>' . $counter . '</td>';
        $table_data .= '<td>' . $product['product_name'] . '</td>';
        $table_data .= '<td>' . $product['total_quantity'] . '</td>';
        $table_data .= '<td>' . $product['max_stock'] . '</td>';
        $table_data .= '<td>' . $product['min_stock'] . '</td>';
        $table_data .= '<td>' . $stock_status . '</td>';
        $table_data .= '</tr>';

        $counter++;
    }

    echo json_encode($table_data);

}

else if ($action == 'getById')
{
    $product_details_id = $_POST['product_details_id'];

    echo json_encode($ProductDetails->getById($product_details_id));
}

else if ($action == 'getOrderById')
{
    $product_id = $_POST['product_id'];

    echo json_encode($Product->getOrderById($product_id));
}

else if ($action == 'exchange')
{
    $id = $_POST['product_details_id'];
    $designation = $_POST['designation'];
    $expired_status = $_POST['expired_status'];

    $request = [
        'product_details_id' => $id,
        'designation' => $designation,
        'expired_status' => $expired_status
    ];

    $result = $ProductDetails->Exchange($request);

    echo json_encode($result);
}

else if ($action == 'return')
{
    $id = $_POST['product_details_id'];
    $designation = $_POST['designation'];
    $expired_status = $_POST['expired_status'];

    $request = [
        'product_details_id' => $id,
        'designation' => $designation,
        'expired_status' => $expired_status
    ];

    $result = $ProductDetails->Return($request);

    echo json_encode($result);
}

else if ($action == 'decompose')
{
    $id = $_POST['product_details_id'];
    $designation = $_POST['designation'];
    $expired_status = $_POST['expired_status'];

    $request = [
        'product_details_id' => $id,
        'designation' => $designation,
        'expired_status' => $expired_status
    ];

    $result = $ProductDetails->Decompose($request);

    echo json_encode($result);
}

