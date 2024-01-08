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
        <h1 class="section__title">Invoice</h1>
       
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

            <table class="table table-bordered invoice__table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Issued By</th>
                        <th>Transaction Date</th>
                        <th>Invoice Number</th>
                        <th>Total Items</th>
                        <th>Total Purchase</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                            <button>View</button>
                        </td>
                    </tr> -->
                </tbody>
            </table>
        </div>


        <!-- The Modal -->
        <div class="modal modal-lg invoice__modal" id="myModal">
            <div class="modal-dialog">
                <div class="modal-content">

                    <!-- Modal Header -->
                    <div class="modal-header">
                        <h4 class="modal-title">Products</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <!-- Modal body -->
                    <div class="modal-body">

                        <table class="table" id="sales__table">
                            <thead>
                                <tr>
                                    <th>Qty</th>
                                    <th>Product Name</th>
                                    <th>Price</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- <tr>
                                    <td>2</td>
                                    <td>Kaboom</td>
                                    <th>1000</th>
                                    <td>
                                        <button class="invoice__modal__void">Void</button>
                                    </td>
                                </tr> -->
                            </tbody>
                        </table>

                    </div>

                    <!-- Modal footer -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                    </div>

                </div>
            </div>
        </div>

        <div class="modal modal-md" id="modal_confirmpassword">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">

                    <!-- Modal Header -->
                    <div class="modal-header">
                        <h4 class="modal-title">Confirm Admin Password</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <!-- Modal body -->
                    <div class="modal-body">
                        <input type="password" class="form-control admin__password__input" id="password__input">
                    </div>

                    <!-- Modal footer -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success admin__password__button">Confirm</button>
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
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
    <script src="../../libs/scripts/reports/invoice.js"></script>
    <script src="../../libs/scripts/pos/session_timer.js"></script>
</body>



</html>