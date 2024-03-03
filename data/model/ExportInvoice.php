<?php
// Include the PhpSpreadsheet library
include_once('../../vendor/autoload.php');

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

// Function to generate and export Excel file
function ExportInvoice($data)
{
    $spreadsheet = new Spreadsheet();
    $spreadsheet->getActiveSheet()->setTitle('Daily Invoice');
    $spreadsheet->getDefaultStyle()->getNumberFormat()->setFormatCode('#');
    $sheet = $spreadsheet->getActiveSheet();

    $sheet->setCellValue('A1', 'IRONMED PHARMACY');
    $sheet->mergeCells('A1:E1');
    $sheet->getStyle('A1:E1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
    $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(20)->setColor(new Color('24958f'));
    $sheet->getRowDimension('1')->setRowHeight(30);
    

    $date = date('Y-m-d'); // Example date format
    $address = '836 F. Gomez St, Santa Rosa, 4026 Laguna';
    
    // Concatenate the date and address with the separator "|"
    $sheet->setCellValue('A2', $address . ' | ' . $date);
    $sheet->mergeCells('A2:E2');
    $sheet->getStyle('A2:E2')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
    $sheet->getRowDimension('2')->setRowHeight(15);
    $sheet->getStyle('A2')->getFont()->setSize(10);
    
    
    $sheet
        ->setCellValue('A3', 'Issue By')
        ->setCellValue('B3', 'Transaction Date')
        ->setCellValue('C3', 'Invoice Number')
        ->setCellValue('D3', 'Total Items')
        ->setCellValue('E3', 'Total Purchase');

        $boldFontStyle = $sheet->getStyle('A3:E3')->getFont();
        $boldFontStyle->setBold(true);

        $sheet->getStyle('A3:I3')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);


    $row = 4;
    foreach ($data as $product) {
        $sheet->setCellValue('A' . $row, $product['Issue By']);
        $sheet->setCellValue('B' . $row, $product['Transaction Date']);
        $sheet->setCellValue('C' . $row, $product['Invoice Number']);
        $sheet->setCellValue('D' . $row, $product['Total Items']);
        $sheet->getStyle('D' . $row)->getNumberFormat()->setFormatCode('0');
        $sheet->setCellValue('E' . $row, $product['Total Purchase']);
        $sheet->getStyle('E' . $row)->getNumberFormat()->setFormatCode('0');

        $sheet->getStyle('A' . $row . ':E' . $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $row++;
    }


    $sheet->getColumnDimension('A')->setWidth(35);
    $sheet->getColumnDimension('B')->setWidth(20);
    $sheet->getColumnDimension('C')->setWidth(18);
    $sheet->getColumnDimension('D')->setWidth(25);
    $sheet->getColumnDimension('E')->setWidth(15);

    $boldStyle = $sheet->getStyle('A1:E1');
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

    $sheet->getStyle('A1:E2')->applyFromArray($borderStyle);

    //Body
    $thinBorderStyle = [
        'borders' => [
            'allBorders' => [
                'borderStyle' => Border::BORDER_THIN,
            ],
        ],
    ];

    $sheet->getStyle('A4:E' . (count($data) + 3))->applyFromArray($thinBorderStyle);
    $sheet->getStyle('A3:E' . (count($data) + 3))->applyFromArray($thinBorderStyle);

    $grandTotalPurchase = array_sum(array_column($data, 'Total Purchase'));

    $totalRow = count($data) + 2;


    // $sheet->getStyle('G' . $totalRow . ':H' . $totalRow)->getFont()->setBold(true);
    // $sheet->getStyle('G' . $totalRow . ':H' . $totalRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

$filename = isset($_GET['filename']) ? $_GET['filename'] : 'InvoiceReport_' . date('Ymd') . '.xlsx';
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
