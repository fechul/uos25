var main = {
    init_events: function() {
        $('.left_container').on('click', '.menu:not(.active)', function() {
            $('.menu.active').removeClass('active');
            $(this).addClass('active');

            $('.workspace.active').removeClass('active');
            $('.workspace[name=' + $(this).attr('target') + ']').addClass('active');
        });
    }()
};
