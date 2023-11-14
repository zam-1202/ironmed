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

   
    <section class="section user" style="border: none;">
        <div class="container-fluid section__body">
            <div class="row">
                <div class="col-lg-6 col-md-13 ">
                    <div class="user__table-wrapper">
                    <h2 class="form-wrapper" id="txt_title">Register Category</h2>

                    <div>&nbsp;</div>

                        <div class="form-wrapper">
                            <form class="row g-3">
                                <div class="col-md-12">
                                    <label for="productBarcode" class="form-label">Category Name</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-tag"></i></span>
                                        <input type="text" class="form-control" id="txt_category_name" maxlength="50" onkeyup=validateCategoryName(); oninput="this.value = this.value.toUpperCase();"><span id="cname"></span>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <button type="submit" id="btn_save_category" onclick="Category.clickSaveButton()" class="btn form-control btn-primary">Register Category</button>
                                    <div class="mb-2"></div>
                                    <button  onclick="Category.clickCancel()" class="btn form-control btn-warning">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="table-wrapper">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Category Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id = 'tbody_category'>
                            </tbody>
                        </table>
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
<script src="../../libs/scripts/master-page/category.js" ></script>
<script src="../../libs/scripts/pos/session_timer.js"></script>

</html>