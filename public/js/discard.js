var discard = {
    table: null,
    store_table: null,
    selected_product: null,
    init: function () {
        this.init_table();
        this.init_events();
    },
    clear: function() {
        this.table.clear().draw();
        this.store_table.clear().draw();
        this.set_table();
        $('#discard_prdt_cd').val('');
        $('#discard_prdt_name').val('');
        $('#discard_cnt').val('');
        $('#discard_price').val('');
    },
    init_table: function() {
        var self = this;

        this.table = $('#discard_table').DataTable({
            'columns': [
                {'data': 'DISCARD_CD', 'title': '폐기코드', 'width': '20%'},
                {'data': 'PRDT_CD', 'title': '상품코드', 'width': '30%'},
                {'data': 'PRDT_NAME', 'title': '상품명', 'width': '20%'},
                {'data': 'DISCARD_CNT', 'title': '수량', 'width': '20%'},
                {'data': 'DISCARD_PRICE', 'title': '폐기금액', 'width': '20%'},
                {'data': 'DISCARD_DATE', 'title': '날짜', 'width': '10%'},
            ],
            'columnDefs': [
                {
                    'targets': 5,
                    'render': function ( row, type, data, meta ) {
                        return main.get_date_fortmat(row)
                    }
                }
            ],
            'order': [5, 'desc'],
            'paging': false,
            'autoWidth': true,
            'searching': false,
            'lengthChange': false,
            'info': false,
            'scrollY': '321px',
            'scrollCollapse': false,
            'autoFill': true
        });

        this.store_table = $('#discard_store_table').DataTable({
            'columns': [
                {'data': 'PRDT_CD', 'title': '상품코드', 'width': '20%'},
                {'data': 'PRDT_NAME', 'title': '상품명', 'width': '40%'},
                {'data': 'PRDT_PRICE', 'title': '정가', 'width': '15%'},
                {'data': 'STOCK_CNT', 'title': '재고량', 'width': '15%'},
                {'data': 'ADD_DISCARD_BTN', 'title': '선택', 'width': '10%'}
            ],
            'columnDefs': [
                {
                    'targets': 4,
                    'render': function ( row, type, data, meta ) {
                        return '<button class="btn btn-primary btn-sm add_discard_btn">선택</button>';
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
    init_events: function() {
        var self = this;

        $('#add_discard').click(function() {
            $.post('/discard', {
                'PRDT_CD': self.selected_product.PRDT_CD,
                'DISCARD_CNT': parseInt($('#discard_cnt').val(), 10),
                'DISCARD_PRICE': parseInt($('#discard_price').val(), 10)
            }, function(post) {
                console.log(post);
                self.clear();

            });
        });

        $(document).on('click' ,'.add_discard_btn', function() {
            self.selected_product = self.store_table.row($(this).parents('tr')).data();
            $('#discard_prdt_cd').val(self.selected_product.PRDT_CD);
            $('#discard_prdt_name').val(self.selected_product.PRDT_NAME);
            $('#discard_price').val(0);
        });

        $('#discard_cnt').keyup(function() {
            $('#discard_price').val(parseInt($(this).val() * self.selected_product.PRDT_PRICE, 10));
        });
    },
    set_table: function() {
        var self = this;

        $.get('/discard/list', {}, function(get) {
            if (get.RESULT) {
                self.table.clear();
                self.table.rows.add(get.DATA.LIST).draw();
            } else {
                main.notice.show('서버에서 오류가 발생했습니다.');
            }
        });

        $.ajax({
            method: 'GET',
            url: 'stock/list',
            dataType: 'json',
            data: ''
        }).fail(function(get) {
            main.notice.show('서버에서 오류가 발생했습니다.');
        }).done(function(get) {
            if (get.RESULT) {
                self.store_table.clear();
                self.store_table.rows.add(get.DATA.LIST).draw();
            } else {
                main.notice.show('서버에서 오류가 발생했습니다.');
            }
        });
    }
};
