/**
 * Created by Seo on 2017-06-14.
 */
var employee = {
    table: {
        employee_list: null,
        employee: null
    },
    init: function () {
        this.init_table();
        this.init_events();
    },
    clear: function() {
        this.set_table();
        this.table.product_list.clear().draw();
        this.table.order.clear().draw();
    },
};
