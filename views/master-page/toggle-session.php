<!doctype html>
<html lang="en">

<?php include '../layouts/head.php' ?>


<?php
if (!$_SESSION['user']) {
    header("Location: login.php");
}
?>

<body>
    <?php include '../layouts/nav.php'; ?>

    <section class="section product" style="border: none;">
        <div class="container-fluid section__body">
            <div class="row">
                <div class="col-lg-6 col-md-12">
                    <div class="user__form-wrapper">
                        <h2 class="form-wrapper" id="txt_title" style="color: #24958f;">Session Timeout Configuration</h2>

                        <p style="text-align: justify; font-size: 14px;">
                        Welcome! Here, you can customize the duration of inactivity
                        that triggers an automatic logout from your account for security purposes. This is a security
                        measure to protect your information in case you forget to log out or if you leave your computer unattended.
                        <span style="color: #24958f;"> Before enabling the switch button, ensure that you have entered a time
                        and successfully saved the configuration.</span>
                        </p>
                        
                        <div class="product__table-wrapper">

                            <div class="mb-5"></div>

                    <form class="row g-2">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="enableSessionTimeout" name="enableSessionTimeout">
                            <label class="form-check-label" for="enableSessionTimeout">Enable session timeout</label>
                        </div>
                    </form>

                    <div class="mb-5"></div>

                        <form class="row g-3">

                                <div class="col-md-3">
                                    <label for="minutes" class="form-label">Minutes</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-clock"></i></span>
                                        <input type="text" min="1" class="form-control" id="minute_value" oninput="this.value = this.value.replace(/[^\d]/g, '').substring(0, 2)" onchange="Product.onChangeBarcode()" onkeydown="javascript: return ['Backspace','Delete','ArrowLeft','ArrowRight'].includes(event.code) ? true : !isNaN(Number(event.key)) && event.code!=='Space'">                                    </div>
                                </div>

                                <div class="col-md-2 align-self-end">
                                    <button type="submit" id="btn_save_session" onclick="clickSaveSessionButton()" class="btn form-control btn-main">Save</button>
                                </div>
                        </form>


                    </div>
                </div>
            </div>
        </div>

    </section>


    <?php include '../layouts/scripts.php' ?>
</body>
<script src="../../libs/scripts/master-page/change-password.js"></script>
<script src="../../libs/scripts/pos/session_timer.js"></script>
<!-- <script src="../../libs/scripts/master-page/admin.js"></script> -->


</html>