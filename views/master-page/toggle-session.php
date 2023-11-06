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


        <div class="container-fluid section__body">
            <div class="row">
                <div class="col-lg-12 col-md-12 ">
                    <div class="user__form-wrapper">
                        <h2 class="section__sub-title" id="lbl_title">Session Timeout</h2>
                        <form class="row g-3">
                            <div class = "float-container"> 
                                <div class="float-child">
                                    <label class="switch">
                                        <input type="checkbox" checked id="toggle">
                                        <span class="slider round"></span>
                                        <span class="labels" data-on="ON" data-off="OFF"></span>
                                    </label>
                                </div>
                                <div class="float-child">
                                    <h6>&nbsp;&nbsp;&nbsp;Users will automatically be logged out after timeout session is met.</h6>
                                </div>
                            </div>
                            </label>
                            </div>
                        </form>
                    </div>
                   
                </div>
            </div>
        </div>

 


    <?php include '../layouts/scripts.php' ?>
</body>
<script src="../../libs/scripts/master-page/change-password.js"></script>
<script src="../../libs/scripts/pos/session_timer.js"></script>

</html>