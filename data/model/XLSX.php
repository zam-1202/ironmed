
<?php

include_once('../../vendor/autoload.php');

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\IOFactory;

class EXCEL
{
    private $conn;

    public function __construct($connection)
    {
        $this->conn = $connection;
    }

    public function ExportXLSX($data)
    {
        $spreadsheet = new Spreadsheet();
        $activeWorksheet = $spreadsheet->getActiveSheet();
    
        // Assuming $data is an array with column names and values
        foreach ($data as $rowIndex => $rowData) {
            $columnIndex = 'A';
            foreach ($rowData as $value) {
                $activeWorksheet->setCellValue($columnIndex . $rowIndex, $value);
                $columnIndex++;
            }
        }
    
        // Save the spreadsheet with a dynamic filename
        $filename = 'Inventory_Reports_' . date('Ymd_gis') . '.xlsx';
        $writer = new Xlsx($spreadsheet);
        $writer->save($filename);
        return $filename;
        // Output debugging information
        echo 'File saved: ' . $filename;
        header('Location: ' . $filename);
        exit;

    }
}    

?>
