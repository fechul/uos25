var return_status = {
    table: {
        return_status: null,
        return_detail: null,
    },
    init: function() {
        this.init_table();
        this.init_events();
    },
    clear: function() {
        this.set_table();
        this.table.return_status.clear().draw();
        this.table.return_detail.clear().draw();
    },
    init_table: function() {
        var self = this;

        this.table.return_status = $('#return_status_table').DataTable({
            'columns': [
                {'data': 'RET_CD', 'title': '반품코드', 'width': '15%'},
                {'data': 'RET_DATE', 'title': '반품날짜', 'width': '20%'},
                {'data': 'RETURN_STATUS_DETAIL', 'title': '상세정보', 'width': '14%'}
            ],
            'columnDefs': [
                {
                    'targets': 1,
                    'render': function ( row, type, data, meta ) {
                        return main.get_date_fortmat(row);
                    }
                },
                {
                    'targets': 2,
                    'render': function ( row, type, data, meta ) {
                        return '<button class="btn btn-default btn-sm view_return_status_detail">보기</button>';
                    }
                }
            ],
            'order': [1, 'desc'],
            'paging': false,
            'autoWidth': true,
            'searching': false,
            'lengthChange': false,
            'info': false,
            'scrollY': '321px',
            'scrollCollapse': false,
            'autoFill': true
        });

        this.table.return_detail = $('#return_status_detail_table').DataTable({
            'columns': [
                {'data': 'PRDT_CD', 'title': '상품코드', 'width': '20%'},
                {'data': 'PRDT_NAME', 'title': '상품명', 'width': '20%'},
                {'data': 'PRDT_CNT', 'title': '수량', 'width': '14%'},
                {'data': 'RET_DESCRB', 'title': '반품 이유', 'width': '25%'}
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
            url: 'return/list',
            dataType: 'json',
            data: ''
        }).fail(function(get) {
            main.notice.show('서버에서 오류가 발생했습니다.');
        }).done(function(get) {
            if (get.RESULT) {
                self.table.return_status.rows.add(get.DATA.LIST).draw();
            } else {
                main.notice.show('서버에서 오류가 발생했습니다.');
            }
        });
    },
    init_events: function() {
        var self = this;

        $(document).on('click', '.view_return_status_detail', function() {
            var RET_CD = self.table.return_status.row($(this).parents('tr')).data().RET_CD;

            $.get('/return', {
                'RET_CD': RET_CD
            }, function(response) {
                console.log(response)
                if (response.RESULT) {
                    self.table.return_detail.clear();
                    self.table.return_detail.rows.add(response.DATA.LIST).draw();
                }
            });
        });
    }
};
