/**
 * Created by Seo on 2017-06-14.
 */
var employee = {
    table: {
        employee_list: null
    },
    init: function () {
        this.init_table();
        this.init_events();
    },
    clear: function() {
        this.set_table();
        this.table.employee_list.clear().draw();

    },
    init_table: function() {
        var self = this;

        this.table.employee_list = $('#employee_list').DataTable({
            'columns': [
                {'data': 'EMP_NAME', 'title': '직원이름', 'width': '20%'},
                {'data': 'PHONNO', 'title': '전화번호', 'width': '20%'},
                {'data': 'DAY_WORK_HOUR', 'title': '주간근무시간', 'width': '20%'},
                {'data': 'NIGHT_WORK_HOUR', 'title': '야간근무시간', 'width': '20%'},
                {'data': 'HIRED_DATE', 'title': '고용날짜', 'width': '20%'},
                {'data': 'DELETE_EMP', 'title': '해고', 'width': '14%'},
            ],
            'columnDefs': [
                {
                    'targets': 5,
                    'render': function ( row, type, data, meta ) {
                        return '<button class="btn btn-default btn-sm delete_employee">해고</button>';
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
            url: 'employee/list',
            dataType: 'json',
            data: ''
        }).fail(function(get) {
            main.notice.show('서버에서 오류가 발생했습니다.');
        }).done(function(get) {
            console.log(get);
            if (get.RESULT) {
                self.table.employee_list.rows.add(get.DATA.LIST).draw();
            } else {
                main.notice.show('서버에서 오류가 발생했습니다.');
            }
        });
    },
    init_events: function () {
        var self = this;

        $(document).on('click' ,'.delete_employee', function() {
            self.table.employee_list.row($(this).parents('tr')).remove().draw();
        });

        $('#employee_hire').click(function() {
            var emp_name = $('#employee_name').val();
            var emp_phonno = $('#employee_phonno').val();
            var json_data = {
                EMP_NAME: emp_name,
                PHONNO: emp_phonno
            };

            $.post('/employee', json_data, function(order) {
                console.log(order);
                self.clear();
            })
        });
    }
};
