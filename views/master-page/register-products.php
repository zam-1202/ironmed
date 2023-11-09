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

    <section class="section product" style="border: none;">
        <!-- <h1 class="section__title">Admin</h1> -->
        <div class="container-fluid section__body">
            <div class="row">
                <div class="col-lg-6 col-md-12 ">
                    <div class="product__table-wrapper">
                    <h2 class="form-wrapper" id="txt_title">Register Products</h2>

                    <div>&nbsp;</div>

                        <div class="form-wrapper">
                            <form class="row g-3">
                                <div class="col-md-12">
                                    <label for="txt_product_barcode" class="form-label">Product Barcode</label>
                                    <!-- <span class="required" style="color:red;"> *</span> -->
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-upc-scan"></i></span>
                                        <input type="number" class="form-control input__barcode" id="txt_product_barcode" onkeydown="javascript: return ['Backspace','Delete','ArrowLeft','ArrowRight'].includes(event.code) ? true : !isNaN(Number(event.key)) && event.code!=='Space'" oninput="this.value = this.value.replace(/[^\d]/g, '').substring(0, 13)" required autofocus>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <label for="txt_product_name" class="form-label">Product Name</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-box2"></i></span>
                                        <input type="text" class="form-control input__product__name" id="txt_product_name" maxlength="50" onkeyup=validateProductName();><span id="regname"></span>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <label for="txt_product_category" class="form-label">Product Category</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-tag"></i></span>
                                        <select class="form-control input__category" name="" id="slc_product_category">
                                            <option value="" selected="true" disabled>Select Category</option>
                                            <option value="">Category 1</option>
                                            <option value="">Category 2</option>
                                            <option value="">Category 3</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <label for="slc_status" class="form-label">Status</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-file-check"></i></span>
                                        <select name="" id="slc_status " class="form-control input__status">
                                            <option value="" disabled>Select Status</option>
                                            <option value="1" selected="true" >Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <label for="slc_type" class="form-label">Type</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-tags"></i></span>
                                        <select name="" id="slc_type" class="form-control input__type">
                                            <option value="" selected="true">Select Type</option>
                                            <option value="branded">Branded</option>
                                            <option value="generic">Generic</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <button type="button" id="btn_save_product" onclick="Product.register()" class="btn form-control btn-main btn-register" disabled>Register Product</button>
                                    <button  onclick="Product.resetFields()" class="btn form-control btn-warning">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="col-lg-6 col-md-12">
                <input type="text" id="regproduct_search" class="form-control form-control-sm" placeholder="Search" />
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Barcode</th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody id="productsTable"></tbody>
                    </table>
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
<script src="../../libs/scripts/master-page/register-products.js" ></script>
<script src="../../libs/scripts/pos/session_timer.js"></script>

</html>