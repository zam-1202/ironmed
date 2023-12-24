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
                <div class="col-lg-8 col-md-12 ">
                    <div class="user__table-wrapper">
                        <h2 class="form-wrapper" id="txt_title">List of Accounts</h2>

                        <div class="table-wrapper">
                        <table id="userTable" class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <!-- <th>Last Login</th> -->
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="tbody_users">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="user__form-wrapper">
                        <h2 class="section__sub-title" id="lbl_title">Create Account</h2>
                        <form class="row g-3">
                            <div class="col-md-12">
                                <label for="username" class="form-label">First Name</label><span class="required" style="color:red;"> *</span>
                                <input type="text" class="form-control" id="txt_first_name" maxlength="20" onkeyup = validateFirstName();><span id="mes"></span>
                            </div>
                            <div class="col-md-12">
                                <label for="lastName" class="form-label">Last Name</label><span class="required" style="color:red;"> *</span>
                                <input type="text" class="form-control" id="txt_last_name" maxlength="20" onkeyup = validateLastName();><span id="mesi"></span>
                            </div>
                            <div class="col-md-12">
                                <label for="UserName" class="form-label">Username</label><span class="required" style="color:red;"> *</span>
                                <input type="text" class="form-control" id="txt_user_name" maxlength="20" onkeyup = "Admin.validateUsername()"><span id="message"></span>
                            </div>
                            <div class="col-md-12">
                                <label for="email" class="form-label">Email</label><span class="required" style="color:red;"> *</span>
                                <input type="text" class="form-control" id="txt_email" maxlength="50" onkeyup = validateEmail();><span id="message"></span>
                            </div>
                            <div class="col-md-12">
                                <label for="adminnewpassword" class="form-label" id="txt_adminnewpasswordlabel">Password</label>
                                <span class="required" id="passwordRequired" style="color:red; display: none;"> *</span>
                                <p id="passwordRequirements" style="color:gray"><i><sup>Must be at least eight characters, has uppercase, and lowercase, special character and a number</sup></i></p>
                                <input type="text" class="form-control" id="txt_adminnewpassword" maxlength="128" onkeyup = "ChangePassword.validateAdminConfirmPassword()"><span id="adminmess"></span>
                            </div>
                            <div class="col-md-12">
                                <label for="adminconfirmPassword" class="form-label" id="txt_adminconfirm_passwordlabel">Confirm Password</label>
                                <span class="required" id="confirmPasswordRequired" style="color:red; display: none;"> *</span>
                                <input type="text" class="form-control" id="txt_adminconfirm_password" maxlength="128" name="txt_oldpassword" onkeyup = "ChangePassword.validateAdminConfirmPassword()"><span id="confirmPass"></span>
                            </div>
                            <div class="col-md-6">
                                <label for="role" class="form-label">Role</label><span class="required" style="color:red;"> *</span>
                                <select id="slc_role" class="form-select">
                                    <option value="" disabled selected>Select</option>
                                    <option value="2">Admin</option>
                                    <option value="3">User</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label for="status" class="form-label">Status</label><span class="required" style="color:red;"> *</span>
                                <select id="slc_status" class="form-select">
                                    <option value="" disabled selected>Select</option>
                                    <option value="1">Active</option>
                                    <option value="0" disabled>Deactivate</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <!-- <button type="submit" id="btn_save" onclick="Admin.clickSaveButton()" class="btn form-control btn-primary">Register User</button> -->
                                <button type="submit" id="btn_save" onclick="Admin.clickSaveButton()" class="btn form-control btn-primary">Create Account</button>
                            </div>
                            <div class="col-12">
                                <button type="submit" id="btn_save" onclick="Admin.resetFields()" class="btn form-control btn-warning">Cancel</button>
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
<script src="../../libs/scripts/master-page/admin.js" ></script>
<script src="../../libs/scripts/master-page/change-password.js"></script>
<script src="../../libs/scripts/pos/session_timer.js"></script>
</html>
