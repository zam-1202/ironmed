
<nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
        <a class="navbar-brand header-img" href="../master-page/home.php">
            <img src="../../libs/images/IronMedLogo3.png" alt="">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link" href="/ironmed/views/master-page/home.php">Home</a>
                </li>
                <!-- <li class="nav-item">
                    <a class="nav-link" aria-current="page" href="../master-page/alerts.php">Alerts</a>
                </li> -->
                <?php if ($_SESSION['user']['role'] != 3) { ?>
                    <li class="nav-item">
                        <a class="nav-link" href="/ironmed/views/master-page/admin.php">Account</a>
                    </li>

                    <li class="nav-item dropdown active">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Registry
                        </a>
                        <ul class="dropdown-menu">
                            <li class="active"><a class="dropdown-item" href="../master-page/register-products.php">Products</a></li>
                            <li class="active"><a class="dropdown-item" href="../master-page/add-item.php">Stocks</a></li>
                            <li class="active"><a class="dropdown-item" href="../master-page/category.php">Category</a></li>
                        </ul>
                    </li>
                    
                    <li class="nav-item">
                        <a class="nav-link" href="/ironmed/views/master-page/logs.php">Logs</a>
                    </li>

                <?php } ?>
                <li class="nav-item">
                    <a class="nav-link" href="/ironmed/views/master-page/products.php">Products</a>
                </li>
                <?php if ($_SESSION['user']['role'] != 3) { ?>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Reports
                    </a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="../reports/invoice.php">Invoices</a></li>
                        <li><a class="dropdown-item" href="../reports/sales.php">Sales</a></li>
                        <li><a class="dropdown-item" href="../reports/designated.php">Expired Products</a></li>
                    </ul>
                </li>
                <?php } ?>
                <!-- <li class="nav-item">
                    <a class="nav-link" href="../reports/invoice.php">Invoice</a>
                </li> -->
                <li class="nav-item">
                    <a class="nav-link" href="/ironmed/views/pos/index.php">POS</a>
                </li>

            </ul>
           
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 pull-right">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-person-circle"></i>
                        <?php echo ($_SESSION["user"]["fullname"]);
                        ?>
                    </a>

                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="../master-page/change-password.php">Change Password</a></li>
                        <li><a class="dropdown-item" href="../master-page/toggle-session.php">Session Timeout Settings</a></li>
                        <li class="nav-item">
                            <a class="dropdown-item" href="#" onclick="logout()">Logout</a>
                        </li>
                    </ul>
                </li>
                <li class="nav-item">
                <span class="badge rounded-pill bg-danger" style="float:right;margin-bottom:-10px;"><?php 
                    echo     $_SESSION['alert']['expiredToday'] ,                     
                             $_SESSION['alert']['nearExpire'] ,
                             $_SESSION['alert']['overStock'] ,
                             $_SESSION['alert']['underStock'] ,
                             $_SESSION['alert']['outofStock'];
                             ?></span> <!-- your badge -->
                    <a class="nav-link" href="/ironmed/views/master-page/alerts.php">Alerts</a>
                </li>

            </ul>

            <!-- <div>

            </div>
            <form class="d-flex" role="search">
                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                <button class="btn btn-outline-success" type="submit">Search</button>
            </form> -->
        </div>
    </div>
</nav>

<script>
document.querySelectorAll('.nav-link').forEach(link => {
    // Remove the hostname and compare the paths
    // console.log("Comparing:", link.getAttribute('href'), window.location.pathname);
    if (link.getAttribute('href') === window.location.pathname) {
        link.setAttribute('aria-current', 'page');
    }
});

</script>