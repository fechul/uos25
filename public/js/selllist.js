var selllist = {
    table: null,
    init: function() {
        this.init_table();
        this.init_events();
    },
    clear: function() {
        this.set_table();
        this.table.clear().draw();
    },
    init_table: function() {
        var self = this;

        this.table = $('#selllist_table').DataTable({
            'columns': [
                {'data': 'SELL_CD', 'title': '판매코드', 'width': '15%'},
                {'data': 'SELL_DATE', 'title': '일자', 'width': '14%'},
                {'data': 'TOTAL_SELL_PRICE', 'title': '판매금액', 'width': '14%'},
                {'data': 'PAYMENT_WAY', 'title': '지불방법', 'width': '14%'},
                {'data': 'VIEW_DETAIL', 'title': '상세정보', 'width': '14%'},
                {'data': 'DO_REFUND', 'title': '환불하기', 'width': '14%'}
            ],
            'columnDefs': [
                {
                    'targets': 1,
                    'render': function ( row, type, data, meta ) {
                        return self.get_date_fortmat(row)
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
                },
                {
                    'targets': 5,
                    'render': function ( row, type, data, meta ) {
                        return '<button class="btn btn-primary btn-sm do_refund">환불</button>';
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
    },
    set_table: function() {
        var self = this;

        $.get('/sell/list', {}, function(response) {
            self.table.clear();
            self.table.rows.add(response.DATA.LIST).draw();
            console.log(response);
        })
    },
    init_events: function() {
        var self = this;

        $(document).on('click' ,'.view_selllist_detail', function() {
            var SELL_CD = self.table.row($(this).parents('tr')).data().SELL_CD;

            $.get('/sold_product', {
                'SELL_CD': SELL_CD
            }, function(sold_product) {
                console.log(sold_product);
            });
        });

        $(document).on('click' ,'.do_refund', function() {
            var SELL_CD = self.table.row($(this).parents('tr')).data().SELL_CD;
            main.notice.show('<label> * 환불사유</label><br><textarea id="refundDesc" data-sell_cd="' + SELL_CD + '"></textarea>', 'confirm');
        });

        $(document).on('click', '#notification_dialog_confirm', function() {
            var SELL_CD = $('#refundDesc').attr('data-sell_cd');
            var REF_DESCR = $('#refundDesc').val();

            $.post('/refund', {
                'SELL_CD': SELL_CD,
                'REF_DESCR': REF_DESCR
            }, function(refund_res) {
                if(refund_res.RESULT) {
                    self.set_table();
                } else {
                    main.notice.show('환불을 할 수 없습니다.');
                }
            });
        });
    },
    get_date_fortmat: function(d) {
        var date = new Date(d);
        var str = ''
        str += date.getFullYear();
        str += '-';
        str += date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        str += '-';
        str += date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        str += ' ';
        str += date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        str += ':';
        str += date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        str += ':';
        str += date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

        return str;
    }
};
