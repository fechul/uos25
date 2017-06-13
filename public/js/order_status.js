var order_status = {
    table: {
        order_status: null,
        order_detail: null,
    },
    init: function() {
        this.init_table();
        this.init_events();
    },
    clear: function() {
        this.set_table();
        this.table.order_status.clear().draw();
        this.table.order_detail.clear().draw();
    },
    init_table: function() {
        var self = this;

        this.table.order_status = $('#order_status_table').DataTable({
            'columns': [
                {'data': 'ORDER_CD', 'title': '주문코드', 'width': '15%'},
                {'data': 'ORDER_DATE', 'title': '주문날짜', 'width': '20%'},
                {'data': 'TOTAL_ORDER_PRICE', 'title': '주문가격', 'width': '14%'},
                {'data': 'ORDER_STATUS_DETAIL', 'title': '상세정보', 'width': '14%'}
            ],
            'columnDefs': [
                {
                    'targets': 1,
                    'render': function ( row, type, data, meta ) {
                        return main.get_date_fortmat(row);
                    }
                },
                {
                    'targets': 3,
                    'render': function ( row, type, data, meta ) {
                        return '<button class="btn btn-default btn-sm view_order_status_detail">보기</button>';
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

        this.table.order_detail = $('#order_status_detail_table').DataTable({
            'columns': [
                {'data': 'PRDT_CD', 'title': '상품코드', 'width': '20%'},
                {'data': 'PRDT_NAME', 'title': '상품명', 'width': '20%'},
                {'data': 'PRDT_CNT', 'title': '수량', 'width': '14%'},
                {'data': 'RECEIVE_CHECK', 'title': '수령 확인', 'width': '14%'}
            ],
            'paging': false,
            'autoWidth': true,
            'searching': false,
            'lengthChange': false,
            'info': false,
            'scrollY': '210px',
            'scrollCollapse': false,
            'autoFill': true
        });
    },
    set_table: function() {
        var self = this;

        $.ajax({
            method: 'GET',
            url: 'order/list',
            dataType: 'json',
            data: ''
        }).fail(function(get) {
            main.notice.show('서버에서 오류가 발생했습니다.');
        }).done(function(get) {
            console.log(get);
            if (get.RESULT) {
                self.table.order_status.rows.add(get.DATA.LIST).draw();
            } else {
                main.notice.show('서버에서 오류가 발생했습니다.');
            }
        });
    },
    init_events: function() {
        var self = this;

        $('#do_order').click(function() {
            var rows = self.table.order.data();
            var json_data = {
                LIST: null
            };

            var LIST = [];
            var TOTAL_ORDER_PRICE = 0;

            for (var i = 0; i < rows.length; i++) {
                var PRDT_CNT = parseInt($('.order_table_cnt').eq(i).val(), 10);
                LIST.push({
                    PRDT_CD: self.table.order.row(i).data().PRDT_CD,
                    PRDT_CNT: PRDT_CNT
                });
                TOTAL_ORDER_PRICE += self.table.order.row(i).data().PRDT_PRICE * PRDT_CNT;
            }

            json_data.TOTAL_ORDER_PRICE = TOTAL_ORDER_PRICE;
            json_data.LIST = JSON.stringify(LIST);

            $.post('/order', json_data, function(order) {
                self.clear();
            })
        });
    }
};
