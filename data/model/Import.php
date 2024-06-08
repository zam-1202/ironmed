<?php
include_once('../../vendor/autoload.php');
include_once('ActionLog.php'); // Adjust the path as needed

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ExcelImporter
{
    private $conn;
    private $ActionLog;

    public function __construct($connection)
    {
        $this->conn = $connection;
        $this->ActionLog = new ActionLog($connection); // If needed, adjust to match your ActionLog class instantiation
    }

    public function importData($file)
    {
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);

        if (in_array($extension, ['xlsx', 'xls', 'csv'])) {
            $obj = IOFactory::load($file['tmp_name']);
            $data = $obj->getActiveSheet()->toArray();

            $isFirstRow = true;
            foreach ($data as $row) {
                if ($isFirstRow) {
                    $isFirstRow = false;
                    continue; // Skip the first row
                }

                // Extract data from columns A to E (indices 0 to 4)
                $barcode = isset($row[0]) ? $row[0] : null;
                $name = isset($row[1]) ? $row[1] : null;
                $category_id = isset($row[2]) ? $row[2] : null;
                $status = isset($row[3]) ? $row[3] : null;
                $type = isset($row[4]) ? $row[4] : null;

                if (is_null($barcode) || is_null($name) || is_null($category_id) || is_null($status) || is_null($type)) {
                    return "Error: Missing data in one of the required columns (A to E).";
                }

                // Check for duplicate barcode or name
                $checkSql = "SELECT id FROM products WHERE barcode = ? OR name = ?";
                $checkStmt = $this->conn->prepare($checkSql);
                $checkStmt->bind_param("ss", $barcode, $name);
                $checkStmt->execute();
                $checkStmt->store_result();

                if ($checkStmt->num_rows > 0) {
                    // Duplicate found, skip insertion or handle accordingly
                    continue;
                }

                // Insert data if no duplicates found
                $sql = "INSERT INTO products (barcode, name, category_id, status, type) VALUES (?, ?, ?, ?, ?)";
    
                $stmt = $this->conn->prepare($sql);
                $stmt->bind_param("isiis", $barcode, $name, $category_id, $status, $type);
            
                if ($stmt->execute() === TRUE) {
                    $this->ActionLog->saveLogs('product', 'saved');        
                } else {
                    return "Error: " . $sql . "<br>" . $this->conn->error;
                }
            }

            return "Data imported successfully!";
        } else {
            return "Invalid file format. Please upload a valid Excel file.";
        }
    }

}
?>
