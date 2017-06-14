var _return = {
    table: {
        product_list: null,
        _return: null,
    },
    init: function() {
        this.init_table();
        this.init_events();
    },
    clear: function() {
        this.set_table();
        this.table.product_list.clear().draw();
        this.table._return.clear().draw();
    },
    init_table: function() {
        var self = this;

        this.table.product_list = $('#return_product_list').DataTable({
            'columns': [
                {'data': 'PRDT_CD', 'title': '상품코드', 'width': '14%'},
                {'data': 'PRDT_NAME', 'title': '상품명', 'width': '19%'},
                {'data': 'PRDT_PRICE', 'title': '정가', 'width': '13%'},
                {'data': 'CMPNY_NAME', 'title': '업체명', 'width': '14%'},
                {'data': 'ONLY_PRDT', 'title': '전용상품', 'width': '12%'},
                {'data': 'STOCK_CNT', 'title': '재고', 'width': '14%'},
                {'data': 'ADD_CART', 'title': '추가', 'width': '14%'},
            ],
            'columnDefs': [
                {
                'targets': 6,
                'render': function ( row, type, data, meta ) {
                    return '<button class="btn btn-default btn-sm return_add_cart">추가</button>';
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

        this.table._return = $('#return_table').DataTable({
            'columns': [
                {'data': 'PRDT_CD', 'title': '상품코드', 'width': '15%'},
                {'data': 'PRDT_NAME', 'title': '상품명', 'width': '20%'},
                {'data': 'PRDT_PRICE', 'title': '정가', 'width': '14%'},
                {'data': 'PRDT_CNT', 'title': '수량', 'width': '14%'},
                {'data': 'RET_DESCRB', 'title': '반품이유', 'width': '14%'},
                {'data': 'REMOVE_CART', 'title': '삭제', 'width': '14%'}
            ],
            'columnDefs': [
                {

                    'targets': 3,
                    'render': function ( row, type, data, meta ) {
                        return '<input class="return_table_cnt" value=' + 1 + '>';
                    }
                },
                {
                    'targets': 4,
                    'render': function ( row, type, data, meta ) {
                        return '<input type="input" class="ret_describe"></input>';
                    }
                },
                {
                    'targets': 5,
                    'render': function ( row, type, data, meta ) {
                        return '<button class="btn btn-default btn-sm return_remove_cart">삭제</button>';
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
            url: 'stock/list',
            dataType: 'json',
            data: ''
        }).fail(function(get) {
            main.notice.show('서버에서 오류가 발생했습니다.');
        }).done(function(get) {
            if (get.RESULT) {
                self.table.product_list.rows.add(get.DATA.LIST).draw();
            } else {
                main.notice.show('서버에서 오류가 발생했습니다.');
            }
        });
    },
    init_events: function() {
        var self = this;

        $(document).on('click' ,'.return_add_cart', function() {
            var data = self.table.product_list.row($(this).parents('tr')).data();
            var return_table_data = self.table._return.data();

            var dup = false;
            for (var i = 0; i < return_table_data.length; i++) {
                if (return_table_data[i].PRDT_CD == data.PRDT_CD) {
                    dup = true;
                    break;
                }
            }

            if (!dup) {
                self.table._return.row.add(data).draw();
            }
        });

        $(document).on('click' ,'.return_remove_cart', function() {
            self.table._return.row($(this).parents('tr')).remove().draw();
        });

        $('#do_return').click(function() {
            var rows = self.table._return.data();
            var json_data = {
                LIST: null
            };

            var LIST = [];

            for (var i = 0; i < rows.length; i++) {
                var PRDT_CNT = parseInt($('.return_table_cnt').eq(i).val(), 10);
                var RET_DESCRB = $('.ret_describe').eq(i).val();
                LIST.push({
                    PRDT_CD: self.table._return.row(i).data().PRDT_CD,
                    PRDT_CNT: PRDT_CNT,
                    RET_DESCRB: RET_DESCRB
                });
            }

            json_data.LIST = JSON.stringify(LIST);

            $.post('/return', json_data, function(_return) {
                self.clear();
            });
        });
    }
};
