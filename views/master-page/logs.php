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

    <section class="section user" style="border: none;">
        <div class="container-fluid section__body">
            <div class="row">
                <div class="col-lg-12 col-md-12">
                    <div class="user__table-wrapper">
                        <h2 class="form-wrapper mb-4">Action Logs</h2>

                        <div class="container-fluid section__body">

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
                                        <input type="date" class="invoice__filters__daily__input" id="txt_invoice_date">
                                        <button class="invoice__filters__daily__button">Search</button>
                                    </div>
                                    <div class="invoice__filters__group invoice__filters__monthly hidden">
                                        <label for="" class="invoice__filters__monthly__label">Month/Year</label>
                                        <input type="month" class="invoice__filters__monthly__input" id="txt_invoice_month">
                                        <button class="invoice__filters__monthly__button">Search</button>
                                    </div>
                                    <div class="invoice__filters__group invoice__filters__range hidden">
                                        <label for="" class="invoice__filters__range__label">Start Date</label>
                                        <input type="date" class="invoice__filters__monthly__input__start" id="txt_invoice_startdate">
                                        <label for="" class="invoice__filters__range__label">End Date</label>
                                        <input type="date" class="invoice__filters__monthly__input__end" id="txt_invoice_enddate">
                                        <button class="invoice__filters__range__button">Search</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="table-wrapper inventory-box mt-4">
                            <table class="table table-bordered logs_table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date and Time</th>
                                        <th>Role</th>
                                        <th>Username</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody id="tbl_data">
                        
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
<script src="../../libs/scripts/master-page/logs.js" ></script>
<script src="../../libs/scripts/pos/session_timer.js"></script>

</html>