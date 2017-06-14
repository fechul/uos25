var loss = {
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
        $('#loss_prdt_cd').val('');
        $('#loss_prdt_name').val('');
        $('#loss_cnt').val('');
        $('#loss_price').val('');
    },
    init_table: function() {
        var self = this;

        this.table = $('#loss_table').DataTable({
            'columns': [
                {'data': 'LOSS_CD', 'title': '손실코드', 'width': '20%'},
                {'data': 'PRDT_CD', 'title': '상품코드', 'width': '30%'},
                {'data': 'PRDT_NAME', 'title': '상품명', 'width': '20%'},
                {'data': 'LOSS_CNT', 'title': '수량', 'width': '20%'},
                {'data': 'LOSS_PRICE', 'title': '손실금액', 'width': '20%'},
                {'data': 'LOSS_DATE', 'title': '날짜', 'width': '10%'},
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

        this.store_table = $('#loss_store_table').DataTable({
            'columns': [
                {'data': 'PRDT_CD', 'title': '상품코드', 'width': '20%'},
                {'data': 'PRDT_NAME', 'title': '상품명', 'width': '40%'},
                {'data': 'PRDT_PRICE', 'title': '정가', 'width': '15%'},
                {'data': 'STOCK_CNT', 'title': '재고량', 'width': '15%'},
                {'data': 'ADD_LOSS_BTN', 'title': '선택', 'width': '10%'}
            ],
            'columnDefs': [
                {
                    'targets': 4,
                    'render': function ( row, type, data, meta ) {
                        return '<button class="btn btn-primary btn-sm add_loss_btn">선택</button>';
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

        $('#add_loss').click(function() {
            $.post('/loss', {
                'PRDT_CD': self.selected_product.PRDT_CD,
                'LOSS_CNT': parseInt($('#loss_cnt').val(), 10),
                'LOSS_PRICE': parseInt($('#loss_price').val(), 10)
            }, function(post) {
                console.log(post);
                self.clear();

            });
        });

        $(document).on('click' ,'.add_loss_btn', function() {
            self.selected_product = self.store_table.row($(this).parents('tr')).data();
            $('#loss_prdt_cd').val(self.selected_product.PRDT_CD);
            $('#loss_prdt_name').val(self.selected_product.PRDT_NAME);
            $('#loss_price').val(0);
        });

        $('#loss_cnt').keyup(function() {
            $('#loss_price').val(parseInt($(this).val() * self.selected_product.PRDT_PRICE, 10));
        });
    },
    set_table: function() {
        var self = this;

        $.get('/loss/list', {}, function(get) {
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
