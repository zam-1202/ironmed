<!doctype html>
<html lang="en">
<?php include '../layouts/head.php' ?>

<a href="login.php" class="previous round">&#8249;</a>

<body class="body__login">
    <div class="offset-md-7 col-md-4 login-wrapper">
    <div class="login">
                <div class="image-wrapper">
                    <img src="../../libs/images/IronMedHeader.png" alt="">
                </div>
                <div style="text-align: center;">
                    <p style="color:#2dafa9"><i><sup>Must be at least eight characters, has uppercase, <br> and lowercase, special character and a number</sup></i></p>
                </div>
                <div class="user__form-wrapper">
                <form class="row g-3">
                        <div class="col-md-12" style="margin-bottom: 20px;">
                            <label for="newforgetpassword" class="form-label">New Password</label>
                            <span style="color:red"> *</span>
                                <div style="position: relative;">
                                    <input type="password" class="form-control" id="txt_newforgetpassword" maxlength="128" onkeyup="ChangePassword.validateNewForgetPass()" required/>
                                    <button class="custom-search-button" type="button" id="txt_newforgetpassword-toggle" onclick="togglePasswordVisibility('txt_newforgetpassword')">SHOW</button>
                                </div>
                            <span id="forgetpass"></span>
                        </div>

                        <div class="col-md-12">
                            <label for="confirmforgetPassword" class="form-label">Confirm New Password</label>
                            <span style="color:red"> *</span>
                                <div style="position: relative;">
                                <input type="password" class="form-control" id="txt_confirmforgetPassword" maxlength="128" name="txt_oldpassword" onkeyup="ChangePassword.validateConfirmForgetPassword()">
                                    <button class="custom-search-button" type="button" id="txt_confirmforgetPassword-toggle" onclick="togglePasswordVisibility('txt_confirmforgetPassword')">SHOW</button>
                                </div>
                            <span id="confirmforgetpass"></span>
                        </div>

                        <div class="col-12">
                            <button type="submit" id="btn_save" name="btn_save" onclick="ChangePassword.confirmforgetpassword()" class="btn form-control btn-main">Update Password</button>
                        </div>
                    </form>
                </div>
    </div>


    <?php include '../layouts/scripts.php' ?>
</body>
<script src="../../libs/scripts/master-page/change-password.js"></script>
<!-- <script src="../../libs/scripts/master-page/admin.js"></script> -->

</html>