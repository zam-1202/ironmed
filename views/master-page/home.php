<!doctype html>
<html lang="en">

<?php include '../layouts/head.php' ?>
<?php include_once('../../config/database.php');?>

<?php 
if(!$_SESSION['user']) {
    header("Location: login.php"); 
}

else if($_SESSION['user']['role'] === 3) {
    header("Location: userhome.php"); 
}

$currentDate = date('Y-m-d');
$sql = "SELECT * FROM sales WHERE DATE(date_purchased) = '$currentDate'";
$result = $conn->query($sql);
$sales = $result->fetch_all(MYSQLI_ASSOC);

$totalQuantity = 0;

foreach ($sales as $product){
    $totalQuantity += $product['qty'];
}

$totalQuantity = number_format($totalQuantity);
?>

<style>

</style>

<body>
    <?php include '../layouts/nav.php'; ?>


    <div class="container">
        <table class="table-grid">
            <tr>
                <td class="homebox" rowspan="2">
                    <div class="box-wrapper">
                        <div class="dateholder">
                            <?php
                             date_default_timezone_set("Asia/Singapore");
                             $monthNum  = date('m');
                             $monthName = date('F', mktime(0, 0, 0, $monthNum, 10));
                             ?>
                             <h2><?php echo $monthName; ?></h2>
                             <h2><?php echo date('d'); ?></h2>
                             <h2><?php echo date('Y'); ?></h2>
                             <div class="pos__head__date">
                               <span><?php echo date('l'); ?></span>
                               <p class="pos__head__time"><?php echo date('h:i:s A'); ?></p>
                             </div>
                        </div>
                    </div>
                </td>
                <td class="homebox">
                    <div class="box-wrapper">
                        <div class="box">
                            <h1 id="lbl_total_product"></h1>
                            <h2>Total Products</h2>
                        </div>
                    </div>
                </td>
                <td class="homebox">
                    <div class="box-wrapper">
                        <div class="box">
                          <h5>Purchased Category per Month(6 Months)</h5>
                          <canvas id="home_canvas"></canvas>   
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="homebox" colspan="2">
                    <div class="box-wrapper">
                        <h1 id="lbl_sales_today"></h1>
                        <h2>Total Sales Today</h2>
                    </div>
                </td>
            </tr>
        </table>




        <?php include '../layouts/scripts.php' ?>
</body>
<script src="../../libs/scripts/master-page/home.js" ></script>
<script src="../../libs/scripts/pos/time.js"></script>
<script src="../../libs/scripts/pos/session_timer.js"></script>


</html>