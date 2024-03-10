<?php
// Include the PhpSpreadsheet library
include_once('../../vendor/autoload.php');

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

// Function to generate and export Excel file
function ExportSales($data)
{
    $spreadsheet = new Spreadsheet();
    $spreadsheet->getActiveSheet()->setTitle('Sales');
    $spreadsheet->getDefaultStyle()->getNumberFormat()->setFormatCode('#');
    $sheet = $spreadsheet->getActiveSheet();

    $sheet->setCellValue('A1', 'IRONMED PHARMACY');
    $sheet->mergeCells('A1:G1');
    $sheet->getStyle('A1:G1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
    $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(20)->setColor(new Color('24958f'));
    $sheet->getRowDimension('1')->setRowHeight(30);
    // $sheet->getStyle('I5:J5')->getFont()->setBold(true)->setSize(20)->setColor(new Color('24958f'));
    

    $date = date('Y-m-d'); // Example date format
    $address = '836 F. Gomez St, Santa Rosa, 4026 Laguna';
    
    // Concatenate the date and address with the separator "|"
    $sheet->setCellValue('A2', $address . ' | ' . $date);
    $sheet->mergeCells('A2:G2');
    $sheet->getStyle('A2:G2')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
    $sheet->getRowDimension('2')->setRowHeight(15);
    $sheet->getStyle('A2')->getFont()->setSize(10);
    
    
    $sheet
        ->setCellValue('A3', 'Issued By')
        ->setCellValue('B3', 'Transaction Date')
        ->setCellValue('C3', 'Invoice Number')
        ->setCellValue('D3', 'Product Name')
        ->setCellValue('E3', 'Quantity')
        ->setCellValue('F3', 'Selling Price')
        ->setCellValue('G3', 'Total Purchase');

        $boldFontStyle = $sheet->getStyle('A3:G3')->getFont();
        $boldFontStyle->setBold(true);

        $sheet->getStyle('A3:I3')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);


    $row = 4;
    foreach ($data as $product) {
        $sheet->setCellValue('A' . $row, $product['Issued By']);
        $sheet->setCellValue('B' . $row, $product['Transaction Date']);
        $sheet->setCellValue('C' . $row, $product['Invoice Number']);
        $sheet->setCellValue('D' . $row, $product['Product Name']);
        $sheet->setCellValue('E' . $row, $product['Quantity']);
        $sheet->setCellValue('F' . $row, $product['Selling Price']);
        $sheet->setCellValue('G' . $row, $product['Total Purchase']);

        $sheet->getStyle('F' . $row)->getNumberFormat()->setFormatCode('#,##0.00'); // Adjust as per your requirement
        $sheet->getStyle('G' . $row)->getNumberFormat()->setFormatCode('#,##0.00'); // Adjust as per your requirement

        $sheet->getStyle('A' . $row . ':G' . $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $row++;
    }


    $sheet->getColumnDimension('A')->setWidth(35);
    $sheet->getColumnDimension('B')->setWidth(20);
    $sheet->getColumnDimension('C')->setWidth(18);
    $sheet->getColumnDimension('D')->setWidth(25);
    $sheet->getColumnDimension('E')->setWidth(15);
    $sheet->getColumnDimension('F')->setWidth(15);
    $sheet->getColumnDimension('G')->setWidth(15);

    $boldStyle = $sheet->getStyle('A1:G1');
    $boldFont = $boldStyle->getFont();
    $boldFont->setBold(true);


    $borderStyle = [
        'borders' => [
            'outline' => [
                'borderStyle' => Border::BORDER_THIN,
                'color' => ['rgb' => '000000'],
            ],
        ],
    ];

    $sheet->getStyle('A1:G2')->applyFromArray($borderStyle);

    //Body
    $thinBorderStyle = [
        'borders' => [
            'allBorders' => [
                'borderStyle' => Border::BORDER_THIN,
            ],
        ],
    ];

    $sheet->getStyle('A4:G' . (count($data) + 3))->applyFromArray($thinBorderStyle);
    $sheet->getStyle('A3:G' . (count($data) + 3))->applyFromArray($thinBorderStyle);

    // Calculate the sum of Total Purchase values
    $grandTotalPurchase = array_sum(array_column($data, 'Total Purchase'));

    $sheet->mergeCells('I5:J5');
    $sheet->setCellValue('I5', 'Grand Total:');

    $sheet->mergeCells('K5:M5');
    $sheet->setCellValue('K5', $grandTotalPurchase);
    $sheet->getStyle('K5')->getNumberFormat()->setFormatCode('#,##0.00');
    $sheet->getStyle('I5:K5')->getFont()->setBold(true)->setSize(15)->setColor(new Color('24958f'));
    $sheet->getStyle('K5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);



$filename = isset($_GET['filename']) ? $_GET['filename'] : 'SalesReport_' . date('Ymd') . '.xlsx';
$writer = new Xlsx($spreadsheet);
$writer->save($filename);
return $filename;

}


if ($_GET['action'] === 'download' && isset($_GET['filename'])) {
    $filename = $_GET['filename'];
    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment;filename="' . $filename . '"');
    header('Cache-Control: max-age=0');
    readfile($filename);
    unlink($filename);
    exit;
} else {

}
?>
