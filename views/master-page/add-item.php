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
                <div class="col-lg-6 col-md-14 ">
                    <div class="product__table-wrapper">
                        <h2 class="form-wrapper" id="txt_title">Register Stocks</h2>

                           <div>&nbsp;</div>

                        <div class="form-wrapper">
                            <form class="row g-3">
                                <div class="col-md-6">
                                    <label for="txt_product_barcode" class="form-label">Product Barcode</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-upc-scan"></i></span>
                                        <input type="text" class="form-control" id="txt_product_barcode" oninput="this.value = this.value.replace(/[^\d]/g, '').substring(0, 13)" onchange="Product.onChangeBarcode()" onkeydown="javascript: return ['Backspace','Delete','ArrowLeft','ArrowRight'].includes(event.code) ? true : !isNaN(Number(event.key)) && event.code!=='Space'" required autofocus>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label for="txt_lot_number" class="form-label">Lot number</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-upc-scan"></i></span>
                                        <input type="text" oninput="this.value = this.value.replace(/[^\d]/g, '').substring(0, 20)" class="form-control" id="txt_lot_number" maxlength="20">
                                    </div>
                                </div>

                                <div class="col-md-12">
                                    <label for="txt_product_name" class="form-label">Product Name</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-box2"></i></span>
                                        <input type="text" class="form-control" id="txt_product_name" maxlength="50" disabled onkeyup = validateProductName();><span id="pname"></span>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <label for="txt_product_category" class="form-label">Product Category</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-tag"></i></span>
                                        <select class="form-control" name="" id="slc_product_category" disabled>
                                            <option value="" selected="true" disabled>Select Category</option>
                                            <option value="">Category 1</option>
                                            <option value="">Category 2</option>
                                            <option value="">Category 3</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-md-4">
                                    <label for="txt_quantity" class="form-label">Quantity</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-box"></i></span>
                                        <input type="number" min="1" oninput="Product.limitCharacterInput(this, 6)" class="form-control" id="txt_quantity" maxlength="6">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <label for="txt_buying_price" class="form-label">Buying Price</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"(required)>₱</span>
                                        <input type="number" step="0.01" min="1" oninput="Product.limitCharacterInput(this, 6)" class="form-control" id="txt_buying_price" maxlenght="6">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <label for="txt_selling_price" class="form-label" >Selling Price</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3" (required)>₱</span>
                                        <input type="number" step="0.01" min="1" oninput="Product.limitCharacterInput(this, 6)" class="form-control" id="txt_selling_price" maxlenght="6">
                                    </div>
                                </div>                               
                                <div class="col-md-4">
                                    <label for="txt_manufature_date" class="form-label">Manufacture Date</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-calendar-x"></i></span>
                                        <input type="date" class="form-control" oninput="validity.valid || (value='')"  id="txt_manufature_date">
                                    </div>
                                </div>                                
                                <div class="col-md-4">
                                    <label for="txt_expiraton_date" class="form-label">Expiration Date</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-calendar-x"></i></span>
                                        <input type="date" class="form-control" oninput="validity.valid || (value='')"  id="txt_expiraton_date">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <label for="slc_status" class="form-label">Status</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-file-check"></i></span>
                                        <select name="" id="slc_status" class="form-control">
                                            <option value="" disabled>Select Status</option>
                                            <option value="1" selected="true" >Active</option>
                                            <option value="0">Deactivate</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-5">
                                    <label for="slc_type" class="form-label">Type</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-tags"></i></span>
                                        <select name="" id="slc_type" class="form-control">
                                            <option value="" selected="true">Select Type</option>
                                            <option value="branded">Branded</option>
                                            <option value="generic">Generic</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-7">
                                    <label for="txt_location" class="form-label">Location  </label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-upc-scan"></i></span>
                                        <input type="text" class="form-control" id="txt_location" maxlength="30" onkeyup = validateLocationName(); disabled><span id="lname">
                                    </div>
                                </div> 
                                <div class="col-6">
                                    <button type="submit" id="btn_save_product" onclick="Product.clickSaveButton()" class="btn form-control btn-main">Add Stocks</button>
                                </div>
                                <div class="col-6">
                                    <button  onclick="Product.resetFields()" class="btn form-control btn-warning">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="col-lg-5 offset-md-1">
                <div class="col-2">
        
    </div>
                    <div class="table-wrapper">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Product Name</th>
                                    <th>Barcode</th>
                                    <th>Batch</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody id = "tbody_product">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    </section>

    <?php include '../layouts/scripts.php' ?>
</body>
<script src="../../libs/scripts/master-page/add-item.js" ></script>
<script src="../../libs/scripts/pos/session_timer.js"></script>

</html>