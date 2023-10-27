$(document).ready(function () {
    Alerts.loadTableDataExpiredStatus();
    Alerts.loadTableDataStockStatus();
});


const Alerts = (() => {
    const thisAlerts = {};

    thisAlerts.loadTableDataExpiredStatus = () => {
        $.ajax({
            type: "GET",
            url: ALERT_CONTROLLER + '?action=getTableDataExpirationStatus',
            dataType: "json",
            success: function (response) {
                $('.table').DataTable().destroy();
                $('#tbody_expiration_status').html(response);

                $('.table').DataTable();
            },
            error: function () {

            }
        });
    }

    thisAlerts.loadTableDataStockStatus = () => {
        $.ajax({
            type: "GET",
            url: ALERT_CONTROLLER + '?action=getTableDataStockStatus',
            dataType: "json",
            success: function (response) {
                $('.table').DataTable().destroy();
                $('#tbody_stock_status').html(response);

                $('.table').DataTable();
            },
            error: function () {

            }
        });
    }

    thisAlerts.getExpiredId = (id) => {
        product_details_id = id;

        $.ajax({
            type: "POST",
            url: ALERT_CONTROLLER + '?action=getById',
            dataType: "json",
            data:{
                product_details_id: id,
            },            
            success: function (response) {
                // thisAlerts.changeStatus();
                // thisAlerts.getDesignationId();
                thisAlerts.Exchange();
                thisAlerts.Return();
                thisAlerts.Decompose();
            },
            error: function () {

            }
        });        
    }

    thisAlerts.Exchange = (designation, expired_status) => {
        product_details_id = product_details_id;

        $.ajax({
            type: "POST",
            url: ALERT_CONTROLLER + '?action=exchange',
            dataType: "json",
            data:{
                product_details_id: product_details_id,
                designation: designation,
                expired_status: expired_status,
            },
            success: function (response) 
            {
                $('#exchange').html(response);
                thisAlerts.loadTableDataExpiredStatus();
                thisAlerts.loadTableDataStockStatus();    
            },
            error: function () {

            }
        });         
    }

    thisAlerts.Return = (designation, expired_status) => {
        product_details_id = product_details_id;

        $.ajax({
            type: "POST",
            url: ALERT_CONTROLLER + '?action=return',
            dataType: "json",
            data:{
                product_details_id: product_details_id,
                designation: designation,
                expired_status: expired_status,
            },
            success: function (response) 
            {
                $('#return').html(response);
                thisAlerts.loadTableDataExpiredStatus();
                thisAlerts.loadTableDataStockStatus();    
            },
            error: function () {

            }
        });         
    }

    thisAlerts.Decompose = (designation, expired_status) => {
        product_details_id = product_details_id;

        $.ajax({
            type: "POST",
            url: ALERT_CONTROLLER + '?action=decompose',
            dataType: "json",
            data:{
                product_details_id: product_details_id,
                designation: designation,
                expired_status: expired_status,
            },
            success: function (response) 
            {
                $('#decompose').html(response);
                thisAlerts.loadTableDataExpiredStatus();
                thisAlerts.loadTableDataStockStatus();    
            },
            error: function () {

            }
        });         
    }


    return thisAlerts;
})();