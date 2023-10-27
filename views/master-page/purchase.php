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
                        <h2 class="section__sub-title">Purchases</h2>
                        <button type="button" onclick="Purchase.openPurchase()" class="btn btn-info btn-sm"><i class="bi bi-eye"></i> New Product Purchase </button>
<!--                         <button type="button" onclick="Purchase.openPurchase()" class="btn btn-info btn-sm"><i class="bi bi-eye"></i> Purchase Supply</button>    -->                                                 
                        <div class="table-wrapper">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Order</th>
                                        <th>Quantity</th>
                                        <th>Amount</th>
                                        <th>Date Ordered</th>
                                        <th>Receiving Date</th>
                                        <th>Supplier</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody id="tbody_purchases">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </section>

    <!-- MODAL FOR NEW PURCHASE -->
    <div class="modal fade bd-example-modal-lg" id="modal_add_order" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg ">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modal_view_deatils_header">New Purchase</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        
                    </button>
                </div>
                <div class="modal-body">
                <div class="form-wrapper">
                <form class="row g-3">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                            <div class="col-md-12">
                                    <label for="txt_product_name" class="form-label">Order</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-boxes"></i></span>
                                        <input type="text" class="form-control" id="txt_order">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label for="txt_quantity" class="form-label">Quantity</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-funnel"></i></span>
                                        <input type="number" min="1" class="form-control" id="txt_quantity">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label for="txt_amount" class="form-label">Amount</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-currency-dollar"></i></span>
                                        <input type="number" min="1" step="0.01" oninput="validity.valid || (value='')" class="form-control" id="txt_amount" maxlength="6">
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <label for="txt_receiving_date" class="form-label">Arrival Date</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-calendar-check"></i></span>
                                        <input type="date" min="0" class="form-control" id="txt_receiving_date">
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <label for="txt_supplier" class="form-label">Supplier</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-people-fill"></i></span>
                                        <input type="text" min="0" class="form-control" id="txt_supplier">
                                    </div>
                                </div>
                            </tr>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" id="add" class="btn btn-primary" onclick="Purchase.createPurchase()">Add Purchase</button>
                </form>
                </div>
                </div>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL FOR PURCHASE SUPPLY-->
    <div class="modal fade bd-example-modal-lg" id="modal_view_details" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg ">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modal_view_deatils_header">New Purchase</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        
                    </button>
                </div>
                <div class="modal-body">
                <div class="form-wrapper">
                <form class="row g-3">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                            <div class="col-md-12">
                                    <label for="txt_product_name" class="form-label">Order</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-boxes"></i></span>
                                        <input type="text" class="form-control" id="txt_order">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label for="txt_quantity" class="form-label">Quantity</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-funnel"></i></span>
                                        <input type="number" min="0" class="form-control" id="txt_quantity">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label for="txt_quantity" class="form-label">Amount</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-currency-dollar"></i></span>
                                        <input type="number" min="0" class="form-control" id="txt_amount">
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <label for="txt_quantity" class="form-label">Arrival Date</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-calendar-check"></i></span>
                                        <input type="date" min="0" class="form-control" id="txt_receiving_date">
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <label for="txt_quantity" class="form-label">Supplier</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-people-fill"></i></span>
                                        <input type="text" min="0" class="form-control" id="txt_supplier">
                                    </div>
                                </div>
                            </tr>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" id="add" class="btn btn-primary" onclick="Purchase.createPurchase()">Add Purchase</button>
                </form>
                </div>
                </div>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <?php include '../layouts/scripts.php' ?>
</body>
<script src="../../libs/scripts/master-page/purchase.js" ></script>
<script src="../../libs/scripts/pos/session_timer.js"></script>

</html>