
<!doctype html>
<html lang="en">

<?php include '../layouts/head.php' ?>

<style>

</style>

<a href="login.php" class="previous round">&#8249;</a>

<body class="body__login">
    <div class="offset-md-4 col-md-4 login-wrapper">
    <img class="login-wrapper-image" src="../../libs/images/diamond.png" alt="">
        <div class="login">
            <div class="image-wrapper">
                <img src="../../libs/images/IronMedLogo.png" alt="">
            </div>
            <form class="login__form" action="">
                <input type="text" id="txt_email" placeholder="Email">
                <button class="btn form-control btn-primary" id="sendOTPButton" type="button">Send OTP</button>
            </form>
        </div>
 
    </div>



    <?php include '../layouts/scripts.php' ?>
</body>
<!-- <script src="../../libs/scripts/master-page/login.js" ></script> -->
<script src="../../libs/scripts/master-page/mail.js" ></script>

           
</html>