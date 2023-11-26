<?php
// Include the PhpSpreadsheet library
include_once('../../vendor/autoload.php');

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

// Function to generate and export Excel file
function generateProductXLSX($data)
{
    // Create a new Spreadsheet object
    $spreadsheet = new Spreadsheet();
    $spreadsheet->getDefaultStyle()->getNumberFormat()->setFormatCode('#');
    $sheet = $spreadsheet->getActiveSheet();

    // Set column headers
    $sheet
        ->setCellValue('A1', 'Product')
        ->setCellValue('B1', 'Category')
        ->setCellValue('C1', 'Type')
        ->setCellValue('D1', 'Barcode')
        ->setCellValue('E1', 'Quantity')
        ->setCellValue('F1', 'Max Stock')
        ->setCellValue('G1', 'Min Stock')
        ->setCellValue('H1', 'Status')
        ->setCellValue('I1', 'Expired Products')
        ->setCellValue('J1', 'Designated Products');

        $sheet->getStyle('A1:J1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

    // Populate data into the spreadsheet
    $row = 2;
    foreach ($data as $product) {
        $sheet->setCellValue('A' . $row, $product['Product']);
        $sheet->setCellValue('B' . $row, $product['Category']);
        $sheet->setCellValue('C' . $row, $product['Type']);
        $sheet->setCellValue('D' . $row, $product['Barcode']);
        $sheet->setCellValue('E' . $row, $product['Quantity']);
        $sheet->setCellValue('F' . $row, $product['Max Stock']);
        $sheet->setCellValue('G' . $row, $product['Min Stock']);
        $sheet->setCellValue('H' . $row, $product['Status']);
        $sheet->setCellValue('I' . $row, $product['Expired Products']);
        $sheet->setCellValue('J' . $row, $product['Designated Products']);

        $sheet->getStyle('A' . $row . ':J' . $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $row++;
    }

    // Set column widths
    $sheet->getColumnDimension('A')->setWidth(40);
    $sheet->getColumnDimension('B')->setWidth(20);
    $sheet->getColumnDimension('C')->setWidth(15);
    $sheet->getColumnDimension('D')->setWidth(15);
    $sheet->getColumnDimension('E')->setWidth(15);
    $sheet->getColumnDimension('F')->setWidth(15);
    $sheet->getColumnDimension('G')->setWidth(15);
    $sheet->getColumnDimension('H')->setWidth(15);
    $sheet->getColumnDimension('I')->setWidth(20);
    $sheet->getColumnDimension('J')->setWidth(20);

    // Apply bold formatting to the first row
    $boldStyle = $sheet->getStyle('A1:J1');
    $boldFont = $boldStyle->getFont();
    $boldFont->setBold(true);


    //Header
    $headerBorderStyle = [
        'borders' => [
            'allBorders' => [
                'borderStyle' => Border::BORDER_MEDIUM,
            ],
        ],
    ];

    $sheet->getStyle('A1:J1')->applyFromArray($headerBorderStyle);

    //Body
    $thinBorderStyle = [
        'borders' => [
            'allBorders' => [
                'borderStyle' => Border::BORDER_THIN,
            ],
        ],
    ];

    $sheet->getStyle('A1:J' . count($data) + 1)->applyFromArray($thinBorderStyle);

    // Save the Excel file
    $filename = 'InventoryReport_' . date('Ymd') . '.xlsx';
    $writer = new Xlsx($spreadsheet);
    $writer->save($filename);

    // Return the filename for download link
    return $filename;
}

// Example usage
if ($_GET['action'] === 'download' && isset($_GET['filename'])) {
    // Download the generated Excel file
    $filename = $_GET['filename'];
    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment;filename="' . $filename . '"');
    header('Cache-Control: max-age=0');
    readfile($filename);
    unlink($filename); // Delete the file after download
    exit;
} else {
    // Include this file in your product controller
    // Call generateProductXLSX function with the product data
    // Pass the filename to the JavaScript for download
}
?>
