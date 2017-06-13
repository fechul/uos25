/**
 * Created by Seo on 2017-06-14.
 */

var member = {
    table: {
        member_list: null
    },
    init: function () {
        this.init_table();
        this.init_events();
    },
    clear: function() {
        this.set_table();
        this.table.member_list.clear().draw();
    },
    init_table: function() {
        var self = this;

        this.table.member_list = $('#member_list').DataTable({
            'columns': [
                {'data': 'PHONNO', 'title': '전화번호', 'width': '20%'},
                {'data': 'POINT', 'title': '마일리지', 'width': '20%'},
                {'data': 'JOIN_DATE', 'title': '가입날짜', 'width': '20%'},
                {'data': 'DELETE_MEMBER', 'title': '회원삭제', 'width': '14%'},
            ],
            'columnDefs': [
                {
                    'targets': 2,
                    'render': function ( row, type, data, meta ) {
                        return main.get_date_fortmat(row);
                    }
                },
                {
                    'targets': 3,
                    'render': function ( row, type, data, meta ) {
                        return '<button class="btn btn-default btn-sm delete_member">회원삭제</button>';
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

    },
    set_table: function() {
        var self = this;

        $.ajax({
            method: 'GET',
            url: 'member/list',
            dataType: 'json',
            data: ''
        }).fail(function(get) {
            main.notice.show('서버에서 오류가 발생했습니다.');
        }).done(function(get) {
            console.log(get);
            if (get.RESULT) {
                self.table.member_list.clear();
                self.table.member_list.rows.add(get.DATA.LIST).draw();
            } else {
                main.notice.show('서버에서 오류가 발생했습니다.');
            }
        });
    },
    init_events: function () {
        var self = this;

        $(document).on('click' ,'.delete_member', function() {
            var data = self.table.member_list.row($(this).parents('tr')).data();
            // self.table.employee_list.row($(this).parents('tr')).remove().draw();

            $.ajax({
                method: 'DELETE',
                url: 'member',
                dataType: 'json',
                data: {
                    'PHONNO': data.PHONNO
                }
            }).fail(function(get) {
                main.notice.show('서버에서 오류가 발생했습니다.');
            }).done(function (get) {
                console.log(get);
                if (get.RESULT) {

                } else {

                }

                self.set_table();
            })

        });

        $('#member_register').click(function() {
            var member_phonno = $('#member_phonno').val();
            var member_pw = $('#member_pw').val();
            var json_data = {
                PHONNO: member_phonno,
                PW: member_pw
            };

            $.post('/member', json_data, function(register) {
                console.log(register);
                self.clear();
            })
        });
    }
};
