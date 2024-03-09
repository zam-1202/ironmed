<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

class Sales
{
    private $conn;

    public function __construct($connection)
    {
        $this->conn = $connection;
    }

    public function getReport($dateFrom, $dateTo){
        $sql = "SELECT p.id, p.name as product_name, SUM(s.qty) AS total_sales, SUM(s.price) as total_price, s.date_purchased as bought, s.invoice_id as transact
        FROM products p
        INNER JOIN sales s
        ON p.id = s.product_id
        WHERE s.void is null and SUBSTRING(s.date_purchased,1,10) between '$dateFrom' and '$dateTo'
        GROUP by p.id, p.name";
        $result = $this->conn->query($sql);
        

        $this->conn->close();
        return $result->fetch_all(MYSQLI_ASSOC);



    }

    public function searchDaily($date)
    {
        $sql = "SELECT sales.*,
                       CONCAT(users.first_name, ' ', users.last_name) AS users_name,
                       sales.date_purchased, invoices.number, products.name,
                       sales.qty, sales.original_price, invoices.total_purchase
                FROM sales
                JOIN invoices ON invoices.id = sales.invoice_id
                JOIN users ON users.id = invoices.user_id
                JOIN products ON products.id = sales.product_id
                WHERE DATE(sales.date_purchased) = '$date'
                AND (sales.void = 0 OR sales.void IS NULL)
                ORDER BY sales.date_purchased";
        $result = $this->conn->query($sql);
        
        $this->conn->close();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function searchMonthly($yearmonth)
    {
        $sql = "SELECT sales.*,
                       CONCAT(users.first_name, ' ', users.last_name) AS users_name,
                       sales.date_purchased, invoices.number, products.name,
                       sales.qty, sales.original_price, invoices.total_purchase
                FROM sales
                JOIN invoices ON invoices.id = sales.invoice_id
                JOIN users ON users.id = invoices.user_id
                JOIN products ON products.id = sales.product_id
                AND (sales.void = 0 OR sales.void IS NULL)
                WHERE YEAR(invoices.date_transact) = '$yearmonth[0]'
                AND MONTH(invoices.date_transact) = '$yearmonth[1]'
                ORDER BY sales.date_purchased";
        $result = $this->conn->query($sql);
        
        $this->conn->close();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function searchRange($start, $end)
    {
        $sql = "SELECT sales.*,
                       CONCAT(users.first_name, ' ', users.last_name) AS users_name,
                       sales.date_purchased, invoices.number, products.name,
                       sales.qty, sales.original_price, invoices.total_purchase
                FROM sales
                JOIN invoices ON invoices.id = sales.invoice_id
                JOIN users ON users.id = invoices.user_id
                JOIN products ON products.id = sales.product_id
                AND (sales.void = 0 OR sales.void IS NULL)
                WHERE  DATE(invoices.date_transact) >= '$start'
                AND DATE(invoices.date_transact) <= '$end'
                ORDER BY sales.date_purchased";
        $result = $this->conn->query($sql);
        
        $this->conn->close();
        return $result->fetch_all(MYSQLI_ASSOC);
    }
    
    
    
}
