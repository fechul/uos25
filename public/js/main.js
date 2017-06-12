var main = {
    table: {
        sell: null,
        refund: null,
        order: null,
        order_status: null,
        store: null,
        stock: null,
        return: null,
        loss: null,
        discard: null,
        member: null,
        employee: null
    },
    init: function() {
        this.init_events();
        this.init_table();
        // this.init_page('sell');
    },
    init_events: function() {
        var self = this;

        // common
        $('.left_container').on('click', '.menu:not(.active)', function() {
            $('.menu.active').removeClass('active');
            $(this).addClass('active');

            $('.workspace.active').removeClass('active');
            $('.workspace[name=' + $(this).attr('target') + ']').addClass('active');
        });

        // sell
        $('#sell_product_id').keyup(function(e) {
            var PRDT_CD = $(this).val();
            if (e.keyCode == 13) {
                $.ajax({
                    method: 'GET',
                    url: 'product',
                    dataType: 'json',
                    data: {
                        'PRDT_CD':PRDT_CD
                    }
                }).fail(function(res) {

                }).done(function(res) {
                    if (res.RESULT) {
                        if (res.EVENT_CHECK == 'Y') {

                        } else {

                        }
                        
                        this.table.sell.row.add({
                            'PRDT_CD': res.PRDT_CD,
                            'PRDT_NAME': res.PRDT_NAME,
                            'EVENT_NAME': res.EVENT_NAME,
                            'PRDT_CNT': '',
                            'REG_PRICE': res.PRDT_PRICE,
                            'DSC_PRICE': '',
                            'SELL_PRICE': ''
                        })
                    } else {
                        // 상품을 찾을 수 없습니다.
                    }
                });
            }
        });
    },
    init_table: function() {
        var table = this.table;

        table.sell = $('#sell_list').DataTable({
            'columns': [
                {'data': 'PRDT_CD', 'title': '상품코드'},
                {'data': 'PRDT_NAME', 'title': '상품명'},
                {'data': 'EVENT_NAME', 'title': '이벤트'},
                {'data': 'PRDT_CNT', 'title': '수량'},
                {'data': 'REG_PRICE', 'title': '정가'},
                {'data': 'DSC_PRICE', 'title': '할인'},
                {'data': 'SELL_PRICE', 'title': '판매가'},
            ],
            'autoWidth': true,
            'searching': false,
            'lengthChange': false,
            'info': false,
            'scrollY': '321px',
            'scrollCollapse': false,
            'autoFill': true
              ,
        });

        // table.refund = $('#refund_list').DataTable({
        //     'columns': [
        //         {'data': 'PRDT_CD', 'title': '상품코드'},
        //         {'data': 'PRDT_NAME', 'title': '상품명'},
        //         {'data': 'PRDT_CNT', 'title': '수량'},
        //         {'data': 'EVENT_APPLY', 'title': '이벤트여부'},
        //         {'data': 'REG_PRICE', 'title': '소비자판매가'},
        //         {'data': 'SELL_PRICE', 'title': '판매가'},
        //     ],
        //     'autoWidth': true,
        //     'searching': false,
        //     'lengthChange': false,
        //     'info': false
        // });

        for (var i = 0; i < 32; i++) {
            table.sell.row.add({
                'PRDT_CD': '1',
                'PRDT_NAME': '1',
                'EVENT_NAME': '1',
                'PRDT_CNT': '1',
                'REG_PRICE': '1',
                'DSC_PRICE': '1',
                'SELL_PRICE': '1',
            }).draw();
        }
    }
};
