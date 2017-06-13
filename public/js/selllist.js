var selllist = {
    table: null,
    detail_table: null,
    init: function() {
        this.init_table();
        this.init_events();
    },
    clear: function() {
        this.set_table();
        this.table.clear().draw();
        this.detail_table.clear().draw();
    },
    init_table: function() {
        var self = this;

        this.table = $('#selllist_table').DataTable({
            'columns': [
                {'data': 'SELL_CD', 'title': '판매코드', 'width': '15%'},
                {'data': 'SELL_DATE', 'title': '일자', 'width': '14%'},
                {'data': 'TOTAL_SELL_PRICE', 'title': '판매금액', 'width': '14%'},
                {'data': 'PAYMENT_WAY', 'title': '지불방법', 'width': '14%'},
                {'data': 'VIEW_DETAIL', 'title': '상세정보', 'width': '14%'}
            ],
            'columnDefs': [
                {
                    'targets': 1,
                    'render': function ( row, type, data, meta ) {
                        return main.get_date_fortmat(row)
                    }
                },
                {
                    'targets': 3,
                    'render': function ( row, type, data, meta ) {
                        if (row == 'CASH') {
                            return '현금';
                        } else {
                            return '카드';
                        }
                    }
                },
                {
                    'targets': 4,
                    'render': function ( row, type, data, meta ) {
                        return '<button class="btn btn-default btn-sm view_selllist_detail">보기</button>';
                    }
                }
            ],
            'order': [1, 'desc'],
            'paging': true,
            'autoWidth': true,
            'searching': false,
            'lengthChange': false,
            'info': false,
            'scrollY': '271px',
            'scrollCollapse': false,
            'autoFill': true
        });

        this.detail_table = $('#selllist_detail_table').DataTable({
            'columns': [
                {'data': 'PRDT_CD', 'title': '상품코드', 'width': '15%'},
                {'data': 'PRDT_NAME', 'title': '상품명', 'width': '18%'},
                {'data': 'PRDT_CNT', 'title': '수량', 'width': '8%'},
                {'data': 'REG_PRICE', 'title': '정가', 'width': '10%'},
                {'data': 'SELL_PRICE', 'title': '판매금액', 'width': '10%'},
                {'data': 'EVENT_APPLY', 'title': '이벤트적용', 'width': '10%'},
                {'data': 'EVENT_NAME', 'title': '이벤트명', 'width': '10%'},
            ],
            'order': [2, 'asc'],
            'paging': false,
            'autoWidth': true,
            'searching': false,
            'lengthChange': false,
            'info': false,
            'scrollY': '251px',
            'scrollCollapse': false,
            'autoFill': true
        });
    },
    set_table: function() {
        var self = this;

        $.get('/sell/list', {}, function(response) {
            self.table.rows.add(response.DATA.LIST).draw();
        })
    },
    init_events: function() {
        var self = this;

        $(document).on('click' ,'.view_selllist_detail', function() {
            var SELL_CD = self.table.row($(this).parents('tr')).data().SELL_CD;

            $.get('/sold_product', {
                'SELL_CD': SELL_CD
            }, function(sold_product) {
                if (sold_product.RESULT) {
                    self.detail_table.clear();
                    self.detail_table.rows.add(sold_product.DATA.LIST).draw();
                }
            });
        });
    }
};
