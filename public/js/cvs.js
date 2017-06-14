var cvs = {
    table: {
        cvs_all: null,
        cvs_branch: null,
    },
    init: function() {
        this.init_table();
        this.init_events();
    },
    clear: function() {
        this.set_table();
        this.table.cvs_all.clear().draw();
        this.table.cvs_branch.clear().draw();
    },
    init_table: function() {
        var self = this;

        this.table.cvs_all = $('#cvs_all_table').DataTable({
            'columns': [
                {'data': 'CVS_CD', 'title': '생활서비스코드', 'width': '15%'},
                {'data': 'CVS_NAME', 'title': '생활서비스명', 'width': '14%'},
                {'data': 'PRVD_CMPNY', 'title': '제공업체', 'width': '20%'},
                {'data': 'DESCR', 'title': '설명', 'width': '20%'}
            ],
            'columnDefs': [],
            'order': [1, 'desc'],
            'paging': false,
            'autoWidth': true,
            'searching': false,
            'lengthChange': false,
            'info': false,
            'scrollY': '210px',
            'scrollCollapse': false,
            'autoFill': true
        });

        this.table.cvs_branch = $('#cvs_branch_table').DataTable({
            'columns': [
                {'data': 'CVS_CD', 'title': '생활서비스코드', 'width': '25%'},
                {'data': 'CVS_NAME', 'title': '생활서비스명', 'width': '25%'},
                {'data': 'MANAGE', 'title': '제공업체', 'width': '20%'}
            ],
            'columnDefs': [
                {
                'targets': 2,
                'render': function ( row, type, data, meta ) {
                    return '<button class="btn btn-default del_cvs">삭제</button>';
                }
            }],
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
            url: 'cvs/list',
            dataType: 'json',
            data: ''
        }).fail(function(get) {
            main.notice.show('서버에서 오류가 발생했습니다.');
        }).done(function(get) {
            if (get.RESULT) {
                self.table.cvs_all.clear();
                self.table.cvs_all.rows.add(get.DATA.LIST).draw();
            } else {
                main.notice.show('서버에서 오류가 발생했습니다.');
            }
        });

        $.ajax({
            method: 'GET',
            url: 'cvs/list/branch',
            dataType: 'json',
            data: ''
        }).fail(function(get) {
            main.notice.show('서버에서 오류가 발생했습니다.');
        }).done(function(get) {
            if (get.RESULT) {
                self.table.cvs_branch.clear();
                self.table.cvs_branch.rows.add(get.DATA.LIST).draw();
            } else {
                main.notice.show('서버에서 오류가 발생했습니다.');
            }
        });
    },

    init_events: function() {
        var self = this;

        $('#enroll_cvs').click(function() {
            var CVS_CD = $('#enroll_cvs_code').val();

            $.post('/cvs', {
                'CVS_CD': CVS_CD
            }, function(response) {
                if(response.RESULT) {
                    self.set_table();
                } else {
                    main.notice.show('등록에 실패했습니다. 다시 시도해주세요.');
                }
            });
        });

        $(document).on('click', '.del_cvs', function() {
            var CVS_CD = self.table.cvs_branch.row($(this).parents('tr')).data().CVS_CD;
            
            $.ajax({
                method: 'DELETE',
                url: 'cvs',
                dataType: 'json',
                data: {CVS_CD: CVS_CD}
            }).fail(function(get) {
                main.notice.show('서버에서 오류가 발생했습니다.');
            }).done(function(get) {
                if (get.RESULT) {
                    self.set_table();
                } else {
                     main.notice.show('삭제에 실패했습니다. 다시 시도해주세요.');
                }
            });
        });
    }
};
