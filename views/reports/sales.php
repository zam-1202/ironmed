<!doctype html>
<html lang="en">

<?php include '../layouts/head.php' ?>
<?php 
if(!$_SESSION['user']) {
    header("Location: login.php"); 
}

else if($_SESSION['user']['role'] === 3) {
    header("Location: home.php"); 
}
?>

<body>
    <?php include '../layouts/nav.php'; ?>

    <section class="section user">
        <h1 class="section__title">Sales</h1>
        <div class="container-fluid section__body">
            <div class="row">
                <div class="col-lg-12 col-md-12 ">
                    <div class="user__table-wrapper">
                        <!-- <h2 class="section__sub-title">Sales Report</h2> -->                   
                            <div class="invoice__filters">
                                <div class="invoice__filters__left">
                                    <label for="">Filter by</label>
                                    <select name="" id="" class="invoice__filters__select" onchange=" this.dataset.chosen = this.value;">
                                        <option value="0" selected="true">Daily</option>
                                        <option value="1">Monthly</option>
                                        <option value="2">Date Range</option>
                                    </select>
                                </div>
                                <div class="invoice__filters__right">
                                    <div class="invoice__filters__group invoice__filters__daily ">
                                        <label for="" class="invoice__filters__daily__label">Date</label>
                                        <input type="date" id="date_daily" class="invoice__filters__daily__input">
                                        <button class="invoice__filters__daily__button">Search</button>
                                    
                                    </div>
                                    <div class="invoice__filters__group invoice__filters__daily hidden">
                                        <label for="" class="invoice__filters__monthly__label">Month/Year</label>
                                        <input type="month" id="date_monthly" class="invoice__filters__monthly__input">
                                        <button class="invoice__filters__monthly__button">Search</button>
                                    </div>
                                    <div class="invoice__filters__group invoice__filters__range hidden">
                                        <label for="" class="invoice__filters__range__label">Start Date</label>
                                        <input type="date" id="date_start" class="invoice__filters__monthly__input__start">
                                        <label for="" class="invoice__filters__range__label">End Date</label>
                                        <input type="date" id="date_end" class="invoice__filters__monthly__input__end">
                                        <button class="invoice__filters__range__button">Search</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- <div class="row">
                            <div class="col-lg-6 col-md-6">
                                <h4 id="lbl_total_sales">Total Sales</h4> 
                                <canvas id="piechart"></canvas>
                            </div>
                            <div class="col-lg-6 col-md-6">
                                <canvas id="productSalesChart"></canvas>
                            </div>
                        </div> -->


                    </div>
                </div>



            </div>
        </div>

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
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Date Purchased</th>
                                        <th>Invoice ID</th>
                                    </tr>
                                </thead>
                                <tbody id="tbody_sales">
                                </tbody>
                            </table>
                            
                        </div>
                    </div>
                </div>



            </div>
        </div>
        <div class="d-flex justify-content-center mt-4">
              <button onclick="Sales.export();" class="btn btn-primary">Export Sales Report</button>
        </div>
       
    </section>
        
       

    </section>

    <body class="hide-session-inputs">
            <input type="number" min="1" class="form-control" id="hours_value">
            <input type="number" min="1" class="form-control" id="minute_value">
            <input type="number" min="1" class="form-control" id="seconds_value">
    </body>


    <?php include '../layouts/scripts.php' ?>
    <script src="../../libs/scripts/reports/sales.js"></script>
    <script src="../../libs/scripts/pos/session_timer.js"></script>


</body>

</html>
<script>
    // window.print();
    // window.close();
    // window.onfocus = function () { window.close(); }
    document.getElementById("btnPrint").classList.remove("hidden-print");
    window.onfocus = function () { setTimeout(function () { window.close(); }, 500); }
    const $btnPrint = document.querySelector("#btnPrint");
    $btnPrint.addEventListener("click", () => {
        window.print();
    });
</script>
