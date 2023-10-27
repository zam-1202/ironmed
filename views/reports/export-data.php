<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title></title>
</head>
<body>
            <section class="section user">
        <!-- <h1 class="section__title">Admin</h1> -->
        <div class="container-fluid section__body">
            <div class="row">
                <div class="col-lg-12 col-md-12 ">
                    <div class="user__table-wrapper">
                        <h2 class="section__sub-title">Sales Table</h2>

                        <div class="table-wrapper">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Product Name</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Date Purchased</th>
                                        <th>Invoice ID</th>
                                    </tr>
                                </thead>
                                <tbody id="tbody_export">

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </section>
<?php 
$filename = "Sales Report" . date('Y-m-d') . ".csv";

header('Content-Type:application/csv');
header('Content-Disposition:attachment; filename="' . $filename . '";');
// echo $table;
?>

    <?php include '../layouts/scripts.php' ?>
    <script src="../../libs/scripts/reports/sales.js"></script>
    <script src="../../libs/scripts/pos/session_timer.js"></script>
</body>
</html>
