
<!doctype html>
<html lang="en">

<?php include '../layouts/head.php' ?>

<style>

</style>

<body class="body__login">
    <div class="offset-md-4 col-md-4 login-wrapper">
    <img class="login-wrapper-image" src="../../libs/images/diamond.png" alt="">
        <div class="login">
            <div class="image-wrapper">
                <img src="../../libs/images/IronMedLogo.png" alt="">
            </div>
            <form class="login__form" action="">
                <input type="text" id="txt_username" placeholder="Username" maxlength="20">
                <input type="password" name = "txt_password" id="txt_password" placeholder="Password" maxlength="20">
                <span  id="togglePassword" style="cursor: pointer;" ></span>
                <button class="btn form-control btn-primary" onclick="Login.submit()" type="submit">Login</button>
                <button class="btn form-control btn-primary" onclick="redirectToForgotPassword()">Forgot Password</button>
            </form>
        </div>
 
    </div>



    <?php include '../layouts/scripts.php' ?>
</body>
<script src="../../libs/scripts/master-page/login.js" ></script>
<script src="../../libs/scripts/master-page/forget-password.js" ></script>          
</html>