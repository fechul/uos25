var store = {
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

        this.table = $('#store_table').DataTable({
            'columns': [
                {'data': 'STORE_CD', 'title': '입고코드', 'width': '15%'},
                {'data': 'ORDER_CD', 'title': '주문코드', 'width': '14%'},
                {'data': 'STORE_DATE', 'title': '일자', 'width': '14%'},
                {'data': 'VIEW_DETAIL', 'title': '상세정보', 'width': '14%'}
            ],
            'columnDefs': [
                {
                    'targets': 2,
                    'render': function ( row, type, data, meta ) {
                        return main.get_date_fortmat(row)
                    }
                },
                {
                    'targets': 3,
                    'render': function ( row, type, data, meta ) {
                        return '<button class="btn btn-default btn-sm view_store_detail">보기</button>';
                    }
                }
            ],
            'order': [2, 'desc'],
            'paging': true,
            'autoWidth': true,
            'searching': false,
            'lengthChange': false,
            'info': false,
            'scrollY': '271px',
            'scrollCollapse': false,
            'autoFill': true
        });

        this.detail_table = $('#store_detail_table').DataTable({
            'columns': [
                {'data': 'PRDT_CD', 'title': '상품코드', 'width': '15%'},
                {'data': 'PRDT_NAME', 'title': '상품명', 'width': '18%'},
                {'data': 'CMPNY_NAME', 'title': '업체명', 'width': '18%'},
                {'data': 'PRDT_CNT', 'title': '수량', 'width': '8%'},
            ],
            'order': [3, 'asc'],
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

        $.get('/store/list', {}, function(response) {
            if (response.RESULT) {
                self.table.clear();
                self.table.rows.add(response.DATA.LIST).draw();
            } else {
                main.notice.show('서버에서 오류가 발생했습니다.');
            }
        })
    },
    init_events: function() {
        var self = this;

        $(document).on('click' ,'.view_store_detail', function() {
            var STORE_CD = self.table.row($(this).parents('tr')).data().STORE_CD;

            $.get('/store', {
                'STORE_CD': STORE_CD
            }, function(response) {
                if (response.RESULT) {
                    self.detail_table.clear();
                    self.detail_table.rows.add(response.DATA.LIST).draw();
                }
            });
        });
    }
};
