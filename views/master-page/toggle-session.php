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
                                <div class="col-md-2">
                                    <label for="hours" class="form-label">Hours</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-clock"></i></span>
                                        <input type="number" min="1" class="form-control" id="hours_value">
                                    </div>
                                </div>

                                <div class="col-md-2">
                                    <label for="minutes" class="form-label">Minutes</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-clock"></i></span>
                                        <input type="number" min="1" class="form-control" id="minute_value">
                                    </div>
                                </div>

                                <div class="col-md-2">
                                    <label for="minutes" class="form-label">Seconds</label>
                                    <div class="input-group">
                                        <span class="input-group-text" id="basic-addon3"><i class="bi bi-clock"></i></span>
                                        <input type="number" min="1" class="form-control" id="seconds_value">
                                    </div>
                                </div>

                                <div class="col-md-2 align-self-end">
                                    <button type="submit" id="btn_save_session" onclick="Admin.clickSaveSessionButton()" class="btn form-control btn-main">Save</button>
                                </div>
                        </form>


<!-- <form class="row g-3">
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
                            </div>
                        </form> -->

                        <form class="row g-2">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="enableSessionTimeout" name="enableSessionTimeout">
                                <label class="form-check-label" for="enableSessionTimeout">Enable session timeout</label>
                            </div>


                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="disableTimeoutWarning" name="disableTimeoutWarning">
                                <label class="form-check-label" for="disableTimeoutWarning">Disable session timeout warning popup</label>
                            </div>

                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="forceLogoutOnTimeout" name="forceLogoutOnTimeout">
                                <label class="form-check-label" for="forceLogoutOnTimeout">Force logout on session timeout</label>
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
<script src="../../libs/scripts/master-page/admin.js"></script>


</html>