var main = {
    init: function() {
        this.init_events();
        sell.init();
        order.init();
        stock.init();
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
                sell.clear();
            } else if (target == 'order') {
                order.clear();
            } else if (target == 'stock'){
                stock.clear();
            }
        });

        $('#notification_dialog_close').click(function() {
            self.notice.hide();
        });
    },
    notice: {
        show: function(msg) {
            $('#notification_dialog_msg').html(msg);
            $('#notification_dialog').addClass('shown');
        },
        hide: function() {
            $('#notification_dialog').removeClass('shown');
        }
    }
};
