var branch = {
    money_table: null,
    data: null,
    init: function () {
        var self = this;
        $.get('/branch', {}, function(get) {
            if (get.RESULT) {
                self.data = get.DATA;
                for (var key in get.DATA) {
                    if (key == 'PAYMENT_RATE') {
                        $('.branch_info[name=' + key + ']').html(get.DATA[key] + '%');
                    } else {
                        $('.branch_info[name=' + key + ']').html(get.DATA[key]);
                    }
                }
            }
        });
        this.init_table();
        this.init_events();
    },
    clear: function() {
        this.set_table();
        this.money_table.clear().draw();
    },
    init_table: function() {
        var self = this;

        this.money_table = $('#branch_money_table').DataTable({
            'columns': [
                {'data': 'HISTORY_DATE', 'title': '날짜', 'width': '40%'},
                {'data': 'IO_TYPE', 'title': '출납유형', 'width': '30%'},
                {'data': 'PRICE', 'title': '금액', 'width': '30%'}
            ],
            'columnDefs': [
                {
                    'targets': 0,
                    'render': function ( row, type, data, meta ) {
                        return main.get_date_fortmat(row);
                    }
                },
                {
                    'targets': 1,
                    'render': function ( row, type, data, meta ) {
                        if (row == 'I') {
                            return '납';
                        } else {
                            return '출';
                        }
                    }
                }],
            'order': [0, 'desc'],
            'paging': false,
            'autoWidth': true,
            'searching': false,
            'lengthChange': false,
            'info': false,
            'scrollY': '280px',
            'scrollCollapse': false,
            'autoFill': true
        });

    },
    set_table: function() {
        var self = this;

        $.get('/branch/money', {
            'IO_TYPE': ''
        }, function(get) {
            console.log('d : ', get);
            if (get.RESULT) {
                self.money_table.clear();
                self.money_table.rows.add(get.DATA.LIST).draw();

                var revenue = 0;

                for (var i = 0; i <  get.DATA.LIST.length; i++) {
                    if (get.DATA.LIST[i].IO_TYPE == 'I') {
                        revenue += get.DATA.LIST[i].PRICE;
                    } else {
                        revenue -= get.DATA.LIST[i].PRICE;
                    }
                }

                $('.branch_info[name="REVENUE"]').html(revenue);
                $('.branch_info[name="MARGIN_TO_PAY"]').html(revenue * self.data.PAYMENT_RATE / 100);
            } else {
                main.notice.show('서버에서 오류가 발생했습니다.');
            }
        })
    },
    init_events: function () {
        var self = this;

        $('#pay_margin').click(function() {
            $.post('/margin', {}, function(post) {
                console.log(post);
            });
        });
    }
};
