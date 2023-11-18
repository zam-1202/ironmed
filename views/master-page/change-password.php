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

    <section class="section user">
        <!-- <h1 class="section__title">Admin</h1> -->
        <div class="container-fluid section__body">
            <div class="row">
                <div class="col-lg-12 col-md-12 ">
                    <div class="user__form-wrapper">
                        <h2 class="section__sub-title" id="lbl_title">Change Password</h2>
                        <form class="row g-3">
                            <div class="col-md-12">
                                <input type="hidden" id="old_password" value="<?php echo($_SESSION['user']['password']); ?>">
                                <label for="oldpassword" class="form-label">Old Password</label>
                                <input type="password" class="form-control" id="txt_oldpassword" maxlength="128" name="txt_oldpassword" onkeyup = "ChangePassword.validateOldPassword()" autofill="on"><span id="oldp"></span>
                            </div>
                            <div class="col-md-12">
                                <label for="newpassword" class="form-label">New Password</label>
                                <!-- <p style="color:gray"><i><sup>Must be at least eight characters, has uppercase, and lowercase, special character and a number</sup></i></p> -->
                                <p style="color:gray"><i><sup>Must be at least eight characters, has uppercase, and lowercase, special character and a number</sup></i></p>
                                <input type="password" class="form-control" id="txt_newpassword" maxlength="128" onkeyup = validateNewPass(); required/><span id="mess"></span>
                            </div>
                            <div class="col-md-12">
                                <label for="confirmPassword" class="form-label">Confirm New Password</label>
                                <input type="password" class="form-control" id="txt_confirm_password" maxlength="128" name="txt_oldpassword" onkeyup = "ChangePassword.validateConfirmPassword()"><span id="confirmPass"></span>
                            </div>
                            <div class="col-12">
                                <button type="submit" id="btn_save" name="btn_save" onclick="ChangePassword.confirm()" class="btn form-control btn-main">Update Password</button>
                            </div>
                        </form>
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
<script src="../../libs/scripts/master-page/change-password.js"></script>
<script src="../../libs/scripts/pos/session_timer.js"></script>

</html>