$(document).ready(function () {
    Logs.loadData();
});


const Logs = (() => {
    const thisLogs = {};

    var tableConfig = {
        paging: true,
        searching: true,
        ordering: true,
        search: {
            regex: true,
        },
    };

    thisLogs.loadData = () => {
        $.ajax({
            type: "GET",
            url: ACTIONLOG_CONTROLLER + '?action=getTableData',
            dataType: "json",
            success: function (response) {
                $('.table').DataTable().destroy();
                $('#tbl_data').html(response);

                $('.table').DataTable(tableConfig);

                $(document).ready(function () {
                    var table = $('.table').DataTable();
                    $('.dataTables_filter input')
                        .off()
                        .on('input', function () {
                            $('.table').DataTable().search(this.value, true, false).draw();
                            var body = $(table.table().body());
                            body.unhighlight();
                            body.highlight(table.search());
                            var searchTerm = this.value.toLowerCase();

                            var regex = searchTerm.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
                            $.fn.dataTable.ext.search.push(function (settings, searchData, index, rowData, counter) {
                                for (var i = 0; i < searchData.length; i++) {
                                    if (searchData[i].toLowerCase().indexOf(regex) !== -1) {
                                        return true;
                                    }
                                }
                                return false;
                            });
    
                            table.draw();
    
                            $.fn.dataTable.ext.search.pop();
    
                            console.log('Search term in console: "' + searchTerm + '"');
    
                            var exactMatch = table
                                .rows({ search: 'applied' })
                                .data()
                                .toArray()
                                .some(row => row.some(value => value.toLowerCase() === searchTerm.toLowerCase()));
    
                            console.log('Exact match in DataTable:', exactMatch);
                            console.log('DataTable values:', table.rows({ search: 'applied' }).data().toArray());
                        });
    
                    });
    
                },
            error: function () {

            }
        });
    }

    return thisLogs;
})();