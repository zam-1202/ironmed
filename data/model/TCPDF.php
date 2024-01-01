<?php
include_once('../../vendor/tcpdf/tcpdf.php');
include_once('ActionLog.php');
ob_start();


class PDF extends TCPDF {

    private $conn;
    private $ActionLog;

    public function __construct($connection)
    {
        parent::__construct();
        $this->conn = $connection;
        $this->ActionLog = new ActionLog($connection);
    }

    //Page header
    public function Header() {

        $image_file = __DIR__ . '/../../libs/images/IronMedHeader.png';
        $pageWidth = $this->GetPageWidth();
        $imageX = ($pageWidth - 50) / 2; // Adjust the width (50) as needed
        $this->Image($image_file, $imageX, 5, 50, '', 'PNG', '', 'T', false, 300, '', false, false, 0, false, false, false);
        $this->SetFont('helvetica', '', 11);
        $this->SetY(20); // Adjust the Y-coordinate as needed
        $this->Cell(0, 10, '836 F. Gomez St, Santa Rosa, 4026 Laguna', 0, false, 'C', 0, '', 0, false, 'M', 'M');
    }

    // Page footer
    public function Footer() {
        $this->SetY(-15);
        $this->SetFont('helvetica', 'I', 8);
        $dateTime = date('Y-m-d | g:i:s'); // Format as needed
        $this->Cell(0, 5, 'Exported on ' . $dateTime, 0, false, 'L', 0, '', 0, false, 'T', 'M');
        $this->SetX(-26);
        $pageNumber = 'Page ' . $this->getAliasNumPage() . '/' . $this->getAliasNbPages();
        $pageNumber = trim($pageNumber);
        $this->Cell(0, 5, $pageNumber, 0, false, 'L', 0, '', 0, false, 'T', 'M');
    }

    // public function setResults($result) {
    //     $this->result = $result;
    // }


  public function ProcessTCPDF($result) {
        $pdf = new PDF('L', 'in', 'LEGAL', true, 'UTF-8', false);
        $pdf->setPageOrientation('L');
        $pdf->SetMargins(15, 30, 15);
        $pdf->SetFont('helvetica', '', 8);

        $pdf->SetHeaderMargin(20);
        $pdf->SetFooterMargin(20);
        $pdf->SetAutoPageBreak(TRUE, 17);

        $pdf->AddPage();

        // Table Header
        $html = '<div style="text-align: center;">';
        $html .= '<table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%; color: #333;">';
        $html .= '<tr>';
        $html .= '<th style="border: 1px solid #000; text-align: center; font-weight: bold;" width="20%">Product</th>';
        $html .= '<th style="border: 1px solid #000; text-align: center; font-weight: bold;" width="15%">Category</th>';
        $html .= '<th style="border: 1px solid #000; text-align: center; font-weight: bold;" width="10%">Type</th>';
        $html .= '<th style="border: 1px solid #000; text-align: center; font-weight: bold;" width="14%">Barcode</th>';
        $html .= '<th style="border: 1px solid #000; text-align: center; font-weight: bold;" width="8%">Quantity</th>';
        $html .= '<th style="border: 1px solid #000; text-align: center; font-weight: bold;" width="5%">Max Stock</th>';
        $html .= '<th style="border: 1px solid #000; text-align: center; font-weight: bold;" width="5%">Min Stock</th>';
        $html .= '<th style="border: 1px solid #000; text-align: center; font-weight: bold;" width="10%">Status</th>';
        $html .= '<th style="border: 1px solid #000; text-align: center; font-weight: bold;" width="6%">Expired Products</th>';
        $html .= '<th style="border: 1px solid #000; text-align: center; font-weight: bold;" width="7%">Designated Products</th>';        
        $html .= '</tr>';

        // Results
        foreach ($result as $row) {
            $html .= '<tr>';
            $html .= '<td width="20%">' . $row['Product'] . '</td>';
            $html .= '<td width="15%">' . $row['Category'] . '</td>';
            $html .= '<td width="10%">' . $row['Type'] . '</td>';
            $html .= '<td width="14%">' . $row['Barcode'] . '</td>';
            $html .= '<td width="8%">' . $row['Quantity'] . '</td>';
            $html .= '<td width="5%">' . $row['Max Stock'] . '</td>';
            $html .= '<td width="5%">' . $row['Min Stock'] . '</td>';
            $html .= '<td width="10%">' . $row['Status'] . '</td>';
            $html .= '<td width="6%">' . $row['Expired Products'] . '</td>';
            $html .= '<td width="7%">' . $row['Designated Products'] . '</td>';
            $html .= '</tr>';
        }
        $html .= '</table>';
        $html .= '</div>';

        $pdf->writeHTML($html, true, false, true, false, 'C');
        $pdf->Output('InventoryReport.pdf', 'I');
    }
}