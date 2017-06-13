var order = {
    table: {
        product_list: null,
        order: null,
    },
    init: function() {
        this.init_table();
        this.init_events();
    },
    clear: function() {
        this.set_table();
        this.table.product_list.clear().draw();
        this.table.order.clear().draw();
    },
    init_table: function() {
        var self = this;

        this.table.product_list = $('#order_product_list').DataTable({
            'columns': [
                {'data': 'PRDT_CD', 'title': '상품코드', 'width': '15%'},
                {'data': 'PRDT_NAME', 'title': '상품명', 'width': '20%'},
                {'data': 'PRDT_PRICE', 'title': '정가', 'width': '14%'},
                {'data': 'CMPNY_CD', 'title': '업체코드', 'width': '14%'},
                {'data': 'CMPNY_NAME', 'title': '업체명', 'width': '14%'},
                {'data': 'ONLY_PRDT', 'title': '전용상품', 'width': '14%'},
                {'data': 'ADD_CART', 'title': '주문', 'width': '14%'},
            ],
            'columnDefs': [
                {
                'targets': 6,
                'render': function ( row, type, data, meta ) {
                    return '<button>목록추가</button>';
                }
            }],
            'paging': false,
            'autoWidth': true,
            'searching': false,
            'lengthChange': false,
            'info': false,
            'scrollY': '321px',
            'scrollCollapse': false,
            'autoFill': true
        });

        this.table.order = $('#order_table').DataTable({
            'columns': [
                {'data': 'PRDT_CD', 'title': '상품코드', 'width': '15%'},
                {'data': 'PRDT_NAME', 'title': '상품명', 'width': '20%'},
                {'data': 'PRDT_PRICE', 'title': '정가', 'width': '14%'},
                {'data': 'PRDT_CNT', 'title': '수량', 'width': '14%'}
            ],
            'paging': false,
            'autoWidth': true,
            'searching': false,
            'lengthChange': false,
            'info': false,
            'scrollY': '202px',
            'scrollCollapse': false,
            'autoFill': true
        });
    },
    set_table: function() {
        var self = this;

        $.ajax({
            method: 'GET',
            url: 'product/list',
            dataType: 'json',
            data: ''
        }).fail(function(get) {
            main.notice.show('서버에서 오류가 발생했습니다.');
        }).done(function(get) {
            console.log(get);
            if (get.RESULT) {
                self.table.product_list.rows.add(get.DATA.LIST).draw();
            } else {
                main.notice.show('서버에서 오류가 발생했습니다.');
            }
        });
    },
    init_events: function() {
        var self = this;
    }
};
