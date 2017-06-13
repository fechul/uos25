var refund = {
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

        this.table = $('#refund_list').DataTable({
            'columns': [
                {'data': 'REF_CD', 'title': '환불코드', 'width': '15%'},
                {'data': 'REF_DATE', 'title': '일자', 'width': '14%'},
                {'data': 'PRDT_NAME', 'title': '상품명', 'width': '14%'},
                {'data': 'PRDT_CNT', 'title': '수량', 'width': '14%'},
                {'data': 'REF_PRICE', 'title': '환불금액', 'width': '14%'},
                {'data': 'REF_DESCR', 'title': '환불사유', 'width': '14%'}
            ],
            'columnDefs': [
                {
                    'targets': 1,
                    'render': function ( row, type, data, meta ) {
                        return self.get_date_fortmat(row)
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

        $.get('/refund/list', {}, function(response) {
            self.table.clear();
            self.table.rows.add(response.DATA.LIST).draw();
            console.log(response);
        })
    },
    init_events: function() {

    },
    get_date_fortmat: function(d) {
        var date = new Date(d);
        var str = ''
        str += date.getFullYear();
        str += '-';
        str += date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        str += '-';
        str += date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        str += ' ';
        str += date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        str += ':';
        str += date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        str += ':';
        str += date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

        return str;
    }
};
