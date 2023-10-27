<?php
session_start();
?>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>IronMed</title>
    <link rel="icon" type="image/x-icon" href="../../libs/images/IronMedLogo.ico">

    <!-- Plugins -->
    <link rel="stylesheet" href="../../libs/plugins/bootstrap/bootstrap-icons.css" />
    <link href="../../libs/plugins/bootstrap/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="../../libs/plugins/datatables/dataTables.bootstrap5.min.css" />
    <link rel="styesheet" href="../../libs/plugins/chart.js/Chart.min.css"/>
    <link rel="styesheet" href="../../libs/plugins/select2/css/select2.css"/>
    <!-- End Plugins -->

    <link rel="stylesheet" href="../../libs/css/index.css" />

    <?php if(isset($_SESSION['user'])) { ?>
        <input type="text" id="SessionRole" value="<?php echo $_SESSION['user']['role'] ?>" hidden></input>
    <?php } ?>
</head>