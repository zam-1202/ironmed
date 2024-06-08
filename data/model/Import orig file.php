<?php 

include_once('../../vendor/autoload.php');

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;


if(isset($_REQUEST['import-excel']))
{
    $file = $_FILES['excel-file']['tmp_name'];
    $extension = pathinfo($_FILES['excel-file']['name'],PATHINFO_EXTENSION);
    if($extension == 'xlxs' || $extension == 'xls' || $extension == 'csv')

    {
        $obj = PhpOffice\PhpSpreadsheet\IOFactory::load($file);
        $data = $obj->getActiveSheet()->toArray();
        foreach($data as $row)
        {
            $barcode = $row['0'];
            $name = $row['1'];
            $category_id = $row['2'];
            $status = $row['3'];
            $type = $row['4'];

            $insert_query = mysqli_query($conn, "INSERT INTO products SET barcode='$barcode',
            name='$name', category_id='$category_id', status='$status', type='$type'");
            if($insert_query){
                $msg = "PERPUK!";
                echo "<script>console.log('File uploaded successfully!');</script>";
            }
            else{
                $msg = "BALDOG";
            }
        }
    }
    else{
        $msg = "Invalid File accla";
    }
}


?>
