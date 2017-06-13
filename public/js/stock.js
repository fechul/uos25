/**
 * Created by Seo on 2017-06-14.
 */
var stock = {
    table: {
      stock_list: null
    },
    init: function () {
        this.init_table();
    },
    clear: function() {
        this.set_table();
        this.table.stock_list.clear().draw();
    },
    init_table: function() {
        var self = this;

        this.table.stock_list = $('#stock_list').DataTable({
            'columns': [
                {'data': 'PRDT_CD', 'title': '상품코드', 'width': '15%'},
                {'data': 'PRDT_NAME', 'title': '상품명', 'width': '20%'},
                {'data': 'PRDT_PRICE', 'title': '정가', 'width': '14%'},
                {'data': 'CMPNY_NAME', 'title': '업체명', 'width': '14%'},
                {'data': 'STOCK_CNT', 'title': '수량', 'width': '14%'},
            ],

            'paging': false,
            'autoWidth': true,
            'searching': false,
            'lengthChange': false,
            'info': false,
            'scrollY': '630px',
            'scrollCollapse': false,
            'autoFill': true
        });

    },
    set_table: function() {
        var self = this;

        $.ajax({
            method: 'GET',
            url: 'stock/list',
            dataType: 'json',
            data: ''
        }).fail(function(get) {
            main.notice.show('서버에서 오류가 발생했습니다.');
        }).done(function(get) {
            console.log(get);
            if (get.RESULT) {
                self.table.stock_list.rows.add(get.DATA.LIST).draw();
            } else {
                main.notice.show('서버에서 오류가 발생했습니다.');
            }
        });
    }
};