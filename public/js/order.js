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
                {'data': 'ADD_CART', 'title': '추가', 'width': '14%'},
            ],
            'columnDefs': [
                {
                'targets': 6,
                'render': function ( row, type, data, meta ) {
                    return '<button class="order_add_cart">추가</button>';
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
                {'data': 'PRDT_CNT', 'title': '수량', 'width': '14%'},
                {'data': 'REMOVE_CART', 'title': '삭제', 'width': '14%'}
            ],
            'columnDefs': [
                {

                    'targets': 3,
                    'render': function ( row, type, data, meta ) {
                        return '<input class="order_table_cnt" value=' + 0 + '>';
                    }
                },
                {
                    'targets': 4,
                    'render': function ( row, type, data, meta ) {
                        return '<button class="order_remove_cart">삭제</button>';
                    }
                }
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

        $(document).on('click' ,'.order_add_cart', function() {
            var data = self.table.product_list.row($(this).parents('tr')).data();
            var order_table_data = self.table.order.data();

            var dup = false;
            for (var i = 0; i < order_table_data.length; i++) {
                if (order_table_data[i].PRDT_CD == data.PRDT_CD) {
                    dup = true;
                    break;
                }
            }

            if (!dup) {
                self.table.order.row.add(data).draw();
            }
        });

        $(document).on('click' ,'.order_remove_cart', function() {
            self.table.order.row($(this).parents('tr')).remove().draw();
        });

        $('#do_order').click(function() {
            var rows = self.table.order.data();
            var json_data = {
                LIST: null
            };

            var LIST = [];

            for (var i = 0; i < rows.length; i++) {
                LIST.push({
                    PRDT_CD: self.table.order.row(i).data().PRDT_CD,
                    PRDT_CNT: parseInt($('.order_table_cnt').eq(i).val(), 10)
                });
            }

            json_data.LIST = JSON.stringify(LIST);

            $.post('/order', json_data, function(order) {
                console.log(order);
            })
        });
    }
};
