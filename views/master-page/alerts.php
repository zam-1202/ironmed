<!doctype html>
<html lang="en">

<?php include '../layouts/head.php' ?>

<?php 
if(!$_SESSION['user']) {
    header("Location: login.php"); 
}
?>

<body>
    <?php include '../layouts/nav.php'; ?>

    <section class="section user">
        <!-- <h1 class="section__title">Admin</h1> -->
        <div class="container-fluid section__body">
            <div class="row">
                <div class="col-lg-12 col-md-12 ">
                    <div class="user__table-wrapper">
                        <h2 class="section__sub-title">Expiration Status</h2>

                        <div class="table-wrapper">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Batch</th>
                                        <th>Quantity</th>
                                        <th>Expiration Date</th>
                                        <th>Product Status</th>
                                    </tr>
                                </thead>
                                <tbody id="tbody_expiration_status">
                                    
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-lg-12 col-md-12 ">
                    <div class="user__table-wrapper">
                        <h2 class="section__sub-title">Stock Status</h2>

                        <div class="table-wrapper">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Total Stock</th>
                                        <th>Max Stock</th>
                                        <th>Min Stock</th>
                                        <th>Stock Status</th>
                                    </tr>
                                </thead>
                                <tbody id="tbody_stock_status">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>



            </div>
        </div>

    </section>

    <body class="hide-session-inputs">
            <input type="number" min="1" class="form-control" id="hours_value">
            <input type="number" min="1" class="form-control" id="minute_value">
            <input type="number" min="1" class="form-control" id="seconds_value">
    </body>
    
    <?php include '../layouts/scripts.php' ?>
</body>
<script src="../../libs/scripts/master-page/alerts.js" ></script>
<script src="../../libs/scripts/pos/session_timer.js"></script>

</html>