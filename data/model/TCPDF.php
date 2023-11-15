<?php
require_once('C:/xampp/htdocs/ironmed/vendor/tcpdf/tcpdf.php'); // Replace with the correct absolute path
include_once('ActionLog.php');

class PDF extends TCPDF {

    private $conn;
    private $ActionLog;

    public function __construct($connection)
    {
        $this->conn = $connection;
        $this->ActionLog = new ActionLog($connection);
    }

    public function ProcessTCPDF($result) {
        // Create a new TCPDF instance
        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
        $pdf->AddPage();
        $pdf->SetFont('helvetica', '', 12);
    
        // Set the page orientation
        $pdf->SetPageOrientation('L');

        // Set the fixed width for the image
        $imageWidth = 70;

        // Get the page width
        $pageWidth = $pdf->getPageWidth();

        // Calculate the X coordinate to center the image
        $imageX = ($pageWidth - $imageWidth) / 2;

        // Set the Y coordinate for the image
        $imageY = 2; // You can adjust this value if needed

        // Output the image in the PDF with the specified width, height, and position
        if (file_exists($imagePath = realpath(__DIR__ . '/../../libs/images/IronMedHeader.png'))) {
            $pdf->Image($imagePath, $imageX, $imageY, $imageWidth, 0, 'PNG', '', '', false, 300, '', false, false, 0, 'CM');
        } else {
            // Image file not found, handle the error
            die("Image file not found!");
        }


        // Set the header data
        // $pdf->SetHeaderData(PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE.' 001', PDF_HEADER_STRING, array(0, 64, 255), array(0, 64, 128));
    
        // Set the footer margin
        // $pdf->SetFooterMargin(PDF_MARGIN_FOOTER);
   
    
        // Define the column names and create a table in the PDF
        // ...
    

    // Function to create table header
    $html = '<table border="1" cellpadding="5">';
    $html .= '<tr>';
    $html .= '<th width="15%" style="font-weight: bold;">Product</th>';
    $html .= '<th width="15%" style="font-weight: bold;">Category</th>';
    $html .= '<th width="8%" style="font-weight: bold;">Type</th>';
    $html .= '<th width="16%" style="font-weight: bold;">Barcode</th>';
    $html .= '<th width="10%" style="font-weight: bold;">Quantity</th>';
    $html .= '<th width="7%" style="font-weight: bold;">Max Stock</th>';
    $html .= '<th width="7%" style="font-weight: bold;">Min Stock</th>';
    $html .= '<th width="7%" style="font-weight: bold;">Status</th>';
    $html .= '<th width="8%" style="font-weight: bold;">Expired Products</th>';
    $html .= '<th width="10%" style="font-weight: bold;">Designated Products</th>';
    $html .= '</tr>';

    // Output the header at a specific position
    $headerY = 80;
    $pdf->SetXY(10, $headerY); // Adjust the Y position as needed
    $pdf->writeHTML($html, true, false, true, false, 'C');
    
        // Output the header at a specific position
        $headerY = 80;
        $pdf->SetXY(10, $headerY); // Adjust the Y position as needed
        $pdf->writeHTML($html, true, false, true, false, 'C');
    
        $html = '<table border="1" cellpadding="5">';
        foreach ($result as $row) {
            $html .= '<tr>';
            $html .= '<td width="15%">' . $row['Product'] . '</td>';
            $html .= '<td width="15%">' . $row['Category'] . '</td>';
            $html .= '<td width="8%">' . $row['Type'] . '</td>';
            $html .= '<td width="16%">' . $row['Barcode'] . '</td>';
            $html .= '<td width="10%">' . $row['Quantity'] . '</td>';
            $html .= '<td width="7%">' . $row['Max Stock'] . '</td>';
            $html .= '<td width="7%">' . $row['Min Stock'] . '</td>';
            $html .= '<td width="7%">' . $row['Status'] . '</td>';
            $html .= '<td width="8%">' . $row['Expired Products'] . '</td>';
            $html .= '<td width="10%">' . $row['Designated Products'] . '</td>';
            $html .= '</tr>';
        }
        $html .= '</table>';
    
        // Output the table data
        $pdf->writeHTML($html, true, false, true, false,'C');          
    
        // Output the export date at the bottom right of each page
        $pdf->SetY(-15); // 15 units from the bottom of the page
        $pdf->SetFont('helvetica', 'I', 8);
        $exportDate = date('Y-m-d H:i:s'); // Format the date as needed
        $pdf->Cell(0, 10, 'Export Date: ' . $exportDate, 0, false, 'R');  

        // Output the PDF to the browser
        header('Content-Disposition: attachment; filename="InventoryReport.pdf"');
        echo $pdf->Output('InventoryReport.pdf', 'S');
    
        $this->ActionLog->saveLogs('inventory_export');
    }
    

}