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
        console.log('init_events');
        $('.left_container').on('click', '.menu:not(.active)', function() {
            $('.menu.active').removeClass('active');
            $(this).addClass('active');

            $('.workspace.active').removeClass('active');
            $('.workspace[name=' + $(this).attr('target') + ']').addClass('active');
        });
    },
    init_table: function() {
        var table = this.table;

        table.sell = $('#sell_list').DataTable({
            'columns': [
                {'data': 'PRDT_CD', 'title': '상품코드'},
                {'data': 'PRDT_NAME', 'title': '상품명'},
                {'data': 'PRDT_COUNT', 'title': '수량'},
                {'data': 'EVENT_APPLY', 'title': '이벤트여부'},
                {'data': 'REG_PRICE', 'title': '소비자판매가'},
                {'data': 'SELL_PRICE', 'title': '판매가'},
            ],
            'autoWidth': true,
            'searching': false,
            'lengthChange': false,
            'info': false,
            'scrollY': '200px',
            'scrollCollapse': false,
            'autoFill': true
              ,
        });

        // table.refund = $('#refund_list').DataTable({
        //     'columns': [
        //         {'data': 'PRDT_CD', 'title': '상품코드'},
        //         {'data': 'PRDT_NAME', 'title': '상품명'},
        //         {'data': 'PRDT_COUNT', 'title': '수량'},
        //         {'data': 'EVENT_APPLY', 'title': '이벤트여부'},
        //         {'data': 'REG_PRICE', 'title': '소비자판매가'},
        //         {'data': 'SELL_PRICE', 'title': '판매가'},
        //     ],
        //     'autoWidth': true,
        //     'searching': false,
        //     'lengthChange': false,
        //     'info': false
        // });

        table.sell.row.add({
            'PRDT_CD': '1',
            'PRDT_NAME': '1',
            'PRDT_COUNT': '1',
            'EVENT_APPLY': '1',
            'REG_PRICE': '1',
            'SELL_PRICE': '1',
        }).draw();
    }
};
