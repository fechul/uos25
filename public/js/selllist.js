var selllist = {
    table: null,
    init: function() {
        this.init_table();
        this.init_events();
    },
    clear: function() {
        this.set_table();
        this.table.clear().draw();
    },
    init_table: function() {
        var self = this;

        this.table = $('#selllist_table').DataTable({
            'columns': [
                {'data': 'SELL_CD', 'title': '판매코드', 'width': '15%'},
                {'data': 'SELL_DATE', 'title': '일자', 'width': '14%'},
                {'data': 'TOTAL_SELL_PRICE', 'title': '판매금액', 'width': '14%'},
                {'data': 'PAYMENT_WAY', 'title': '지불방법', 'width': '14%'},
                {'data': 'VIEW_DETAIL', 'title': '지불방법', 'width': '14%'}
            ],
            'columnDefs': [
                {
                    'targets': 1,
                    'render': function ( row, type, data, meta ) {
                        return new Date(row);
                    }
                },
                {
                    'targets': 4,
                    'render': function ( row, type, data, meta ) {
                        return '<button class="btn btn-default btn-sm">자세히</button>';
                    }
                }
            ],
            'paging': false,
            'autoWidth': true,
            'searching': false,
            'lengthChange': false,
            'info': false,
            'scrollY': '321px',
            'scrollCollapse': false,
            'autoFill': true
        });
    },
    set_table: function() {
        var self = this;

        $.get('/sell/list', {}, function(response) {
            self.table.rows.add(response.DATA.LIST).draw();
            console.log(response);
        })
    },
    init_events: function() {
        var self = this;
    }
};
