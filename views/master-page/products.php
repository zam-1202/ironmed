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

    <div class="container-fluid section__body">
    <div class="row">
        <div class="col-lg-11 col-md-11 mx-auto">
            <div class="user__table-wrapper">
                <h2 class="form-wrapper mb-4">List of Products</h2>
                <div class="col-md-12">
                    <div class="row">
                        <div class="col-md-2">
                            <button class="btn btn-dropdown-export dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Export</button>
                            <ul class="dropdown-menu">
                                    <li class="active"><a class="dropdown-item export-option" onclick="Product.chooseCSV()">CSV</a></li>
                                    <li class="active"><a class="dropdown-item export-option" onclick="Product.chooseXLSX()">XLSX</a></li>
                                    <li class="active"><a class="dropdown-item export-option" onclick="Product.choosePDF()">PDF</a></li>
                                </ul>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-tag"></i></span>
                                        <select class="form-control small-dropdown" name="" id="slc_product_category" onchange="Product.loadFilteredTableData()">
                                            <option value="" selected="true" disabled>Filter by Category</option>
                                            <option value="">Category 1</option>
                                            <option value="">Category 2</option>
                                            <option value="">Category 3</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-tags"></i></span>
                                        <select name="" id="slc_type" class="form-control small-dropdown" onchange="Product.loadFilteredTableDataByType()">
                                            <option value="" selected="true">Select Type</option>
                                            <option value="branded">Branded</option>
                                            <option value="generic">Generic</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="table-wrapper inventory-box mt-4">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Type</th>
                                <th>Barcode</th>
                                <th>Stock</th>
                                <th>Max Stock</th>
                                <th>Min Stock</th>
                                <th>Selling Price</th>
                                <th>Status</th>
                                <th>Expired</th>
                                <!-- <th>Lot Number </th> -->
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="tbody_product">
                            <!-- Table body content -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>


    <!-- MODAL FOR PRODUCT DETAILS -->

    <div class="modal fade bd-example-modal-xl" id="modal_view_details" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl ">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modal_view_details_header">Product details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <div class="modal-body">
                <div class="table-wrapper">

                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Batch</th>
                                <th>Lot Number</th>
                                <th>Quantity</th>
                                <th>Buy Price</th>
                                <th>Date Added</th>
                                <th>Manufacture Date</th>
                                <th>Expiration Date</th>
                                <th>Already Expired?</th>

                                <!-- <th>Actions</th> -->
                            </tr>
                        </thead>
                        <tbody id="tbody_product_details">
                        </tbody>
                    </table>
                </div>
                </div>
            </div>
        </div>
    </div>



    <!-- MODAL FOR UPDATE PRODUCT DETAIL -->
    <div class="modal fade" id="modal_update_details" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modal_update_details_header">New message</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="message-text" class="col-form-label">Name:</label>
                            <div class="input-group">
                                <span class="input-group-text" id="basic-addon3"><i class="bi bi-box2"></i></span>
                                <input type="text" class="form-control" id="txt_product_name">
                            </div>
                            <div class="form-group">
                                <label for="message-text" class="col-form-label">Barcode:</label>
                                <div class="input-group">
                                    <span class="input-group-text" id="basic-addon3"><i class="bi bi-upc-scan"></i></span>
                                    <input type="text" class="form-control" id="txt_product_barcode">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="recipient-name" class="col-form-label">Category:</label>
                                <div class="input-group">
                                    <span class="input-group-text" id="basic-addon3"><i class="bi bi-tag"></i></span>
                                    <select class="form-control" name="" id="slc_product_category_modal">
                                        <option value="" selected="true">Select Category</option>
                                        <option value="">Catgeory 1</option>
                                        <option value="">Catgeory 2</option>
                                        <option value="">Catgeory 3</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="message-text" class="col-form-label">Selling Price:</label>
                                <div class="input-group">
                                    <span class="input-group-text" id="basic-addon3">₱</span>
                                    <input type="number" step="0.01" min="0" oninput="validity.valid || (value='')" class="form-control" id="txt_selling_price" max="1000000">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="message-text" class="col-form-label">Max Stock:</label>
                                <div class="input-group">
                                    <span class="input-group-text" id="basic-addon3"><i class="bi bi-clipboard2-plus"></i></span>
                                    <input type="number" min="0" oninput="validity.valid || (value='')" class="form-control" id="txt_max_stock">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="message-text" class="col-form-label">Min Stock:</label>
                                <div class="input-group">
                                    <span class="input-group-text" id="basic-addon3"><i class="bi bi-clipboard2-minus"></i></span>
                                    <input type="number" min="0" oninput="validity.valid || (value='')" class="form-control" id="txt_min_stock">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="message-text" class="col-form-label">Status:</label>
                                <div class="input-group">
                                    <span class="input-group-text" id="basic-addon3"><i class="bi bi-file-check"></i></span>
                                    <select name="" id="slc_status" class="form-control">
                                        <option value="" selected="true" disabled>Select Status</option>
                                        <option value="1">Active</option>
                                        <option value="0">Deactivate</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="message-text" class="col-form-label">Type:</label>
                                <div class="input-group">
                                    <span class="input-group-text" id="basic-addon3"><i class="bi bi-file-check"></i></span>
                                    <select name="" id="slc_type_modal" class="form-control">
                                        <option value="" selected="true">Select Type</option>
                                        <option value="branded">Branded</option>
                                        <option value="generic">Generic</option>
                                    </select>
                                </div>
                            </div>
                            <!-- <div class="form-group">
                                    <label for="txt_location" class="form-label">Location  </label>
                                    <span class="required" style="color:red;"> *</span>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-upc-scan"></i></span>
                                        <input type="text" class="form-control" id="txt_location">
                                    </div>
                                </div>  -->
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="Product.update()">Save</button>
                </div>
            </div>
        </div>
    </div>

    <body class="hide-session-inputs">
            <input type="number" min="1" class="form-control" id="hours_value">
            <input type="number" min="1" class="form-control" id="minute_value">
            <input type="number" min="1" class="form-control" id="seconds_value">
    </body>

    <?php include '../layouts/scripts.php' ?>
</body>
<script src="../../libs/scripts/master-page/products.js"></script>
<script src="../../libs/scripts/pos/session_timer.js"></script>

</html>