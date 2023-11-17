<?php

require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class EXCEL extends \PhpOffice\PhpSpreadsheet\Writer\Xlsx
{
    private $conn;
    private $ActionLog;

    public function __construct($connection)
    {
        $this->conn = $connection;
        $this->ActionLog = new ActionLog($connection);
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
        $filename = 'Inventory_Report_' . date('Ymd_His') . '.xlsx';
        $writer = new Xlsx($spreadsheet);
        $writer->save($filename);
    
        // Optionally return the filename for further use
        return $filename;
        $result = $XLSX->ExportXLSX($column_name);
    }
}    


?>
