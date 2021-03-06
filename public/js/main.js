var main = {
    init: function() {
        Number.prototype.formatMoney = function(c, d, t){
            var n = this,
                c = isNaN(c = Math.abs(c)) ? 2 : c,
                d = d == undefined ? "." : d,
                t = t == undefined ? "," : t,
                s = n < 0 ? "-" : "",
                i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
                j = (j = i.length) > 3 ? j % 3 : 0;

            return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "") + '원';
        };
        this.init_events();
        sell.init();
        selllist.init();
        order.init();
        order_status.init();
        stock.init();
        refund.init();
        store.init();
        employee.init();
        member.init();
        cvs.init();
        _return.init();
        return_status.init();
        loss.init();
        discard.init();
        branch.init();
    },
    init_events: function() {
        var self = this;

        // common
        $('.left_container').on('click', '.menu:not(.active)', function() {
            var $this = $(this);
            var target = $this.attr('target');

            // 탭 active 변경
            $('.menu.active').removeClass('active');
            $this.addClass('active');

            // 내용 active 변경
            $('.workspace.active').removeClass('active');
            $('.workspace[name=' + target + ']').addClass('active');

            // 페이지별 초기화
            if (target == 'sell') {
                // sell.clear();
            } else if (target == 'order') {
                order.clear();
            } else if (target == 'order_status') {
                order_status.clear();
            } else if (target == 'stock'){
                stock.clear();
            } else if (target == 'store'){
                store.clear();
            } else if (target == 'selllist') {
                selllist.clear();
            } else if(target == 'refund') {
                refund.clear();
            } else if (target == 'employee'){
                employee.clear();
            } else if (target == 'member'){
                member.clear();
            } else if (target == 'return') {
                _return.clear();
            } else if (target == 'return_status') {
                return_status.clear();
            } else if (target == 'loss') {
                loss.clear();
            } else if (target == 'discard') {
                discard.clear();
            } else if (target == 'cvs') {
                cvs.clear();
            } else if (target == 'branch') {
                branch.clear();
            }
        });

        $('#notification_dialog_close').click(function() {
            self.notice.hide();
        });
    },
    notice: {
        show: function(msg, confirm) {
            if(confirm) {
                $('#notification_dialog_confirm').show();
            } else {
                $('#notification_dialog_confirm').hide();
            }
            $('#notification_dialog_msg').html(msg);
            $('#notification_dialog').addClass('shown');
        },
        hide: function() {
            $('#notification_dialog').removeClass('shown');
        }
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
