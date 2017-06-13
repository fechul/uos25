var main = {
    tab: {
        sell: {
            table: null,
            table_data: {},
            events: {},
            gifts: {},
            event_ok: true
        },
        refund: {
            table: null,
            table_data: {},
        },
        order: {
            table: null,
            table_data: {},
        },
        order_status: {
            table: null,
            table_data: {},
        },
        store: {
            table: null,
            table_data: {},
        },
        stock: {
            table: null,
            table_data: {},
        },
        return: {
            table: null,
            table_data: {},
        },
        loss: {
            table: null,
            table_data: {},
        },
        discard: {
            table: null,
            table_data: {},
        },
        member: {
            table: null,
            table_data: {},
        },
        employee: {
            table: null,
            table_data: {},
        },
    },
    init: function() {
        this.init_table();
        this.init_common_events();
        this.init_sell_events();
    },
    init_common_events: function() {
        var self = this;
        var tab = this.tab;

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
                tab.sell.table_data = {};
                tab.sell.events = {};
                tab.sell.gifts = {};
                tab.sell.event_ok = true;
                tab.sell.table.clear().draw();
                $('.workspace.sell input').val(0);
                $('.workspace.sell input#sell_product_id').val('');
            }
        });

        $('#notification_dialog_close').click(function() {
            self.notice.hide();
        });
    },
    init_sell_events: function() {
        var self = this;
        var tab = this.tab;

        $('#sell_product_id').keyup(function(e) {
            var PRDT_CD = $(this).val();

            var set_data = function(DATA) {
                if (tab.sell.table_data[PRDT_CD]) {
                    tab.sell.table_data[PRDT_CD].PRDT_CNT++;
                    tab.sell.table_data[PRDT_CD].REG_PRICE += tab.sell.table_data[PRDT_CD].PRDT_PRICE;
                } else {
                    tab.sell.table_data[PRDT_CD] = DATA;
                    tab.sell.table_data[PRDT_CD].PRDT_CNT = 1;
                    tab.sell.table_data[PRDT_CD].REG_PRICE = tab.sell.table_data[PRDT_CD].PRDT_PRICE;
                    tab.sell.table_data[PRDT_CD].DSC_PRICE = 0;
                    tab.sell.table_data[PRDT_CD].SELL_PRICE = 0;
                }

                var product_data = tab.sell.table_data[PRDT_CD];
                console.log(product_data);
                if (product_data.EVENT_CHECK == 'y') {
                    var product_event = tab.sell.events[product_data.EVENT_CD];
                    console.log(product_event);
                    if (product_event.MIN_CNT == product_event.RERQ_CNT) {
                        if (product_event.GIFT_CD) {
                            // 증점
                            if (tab.sell.gifts[product_event.GIFT_CD]) {
                                tab.sell.gifts[product_event.GIFT_CD]++;
                            } else {
                                tab.sell.gifts[product_event.GIFT_CD] = 1;
                            }
                            tab.sell.table_data[PRDT_CD].SELL_PRICE += product_data.PRDT_PRICE;
                        } else {
                            // 할인
                            tab.sell.table_data[PRDT_CD].DSC_PRICE += product_event.DISCOUNT_PRICE;
                            tab.sell.table_data[PRDT_CD].SELL_PRICE += (product_data.PRDT_PRICE - product_event.DISCOUNT_PRICE);
                        }
                    } else {
                        // n + n;
                        var remainder = product_event.current_count % product_event.RERQ_CNT;
                        if (remainder == 0 || remainder > product_event.MIN_CNT) {
                            tab.sell.table_data[PRDT_CD].DSC_PRICE += product_data.PRDT_PRICE;
                        } else {
                            tab.sell.table_data[PRDT_CD].SELL_PRICE += product_data.PRDT_PRICE;
                        }
                    }
                } else {
                    if (tab.sell.gifts[PRDT_CD]) {
                        tab.sell.gifts[PRDT_CD]--;
                        tab.sell.table_data[PRDT_CD].DSC_PRICE += product_data.PRDT_PRICE;
                        if (tab.sell.gifts[PRDT_CD] == 0) {
                            delete tab.sell.gifts[PRDT_CD];
                        }
                    } else {
                        tab.sell.table_data[PRDT_CD].SELL_PRICE += product_data.PRDT_PRICE;
                    }
                }

                tab.sell.event_ok = true;

                for (var key in tab.sell.events) {
                    if (tab.sell.events[key].current_count % tab.sell.events[key].RERQ_CNT != 0) {
                        tab.sell.event_ok = false;
                        break;
                    }
                }

                if (Object.keys(tab.sell.gifts).length) {
                    tab.sell.event_ok = false;
                }
            };

            var draw_table = function() {
                var sell_price_sum = 0;

                tab.sell.table.clear();
                for (var key in tab.sell.table_data) {
                    tab.sell.table.row.add(tab.sell.table_data[key]);
                    sell_price_sum += tab.sell.table_data[key].SELL_PRICE;
                }
                tab.sell.table.draw();
                $('#sell_price_sum').val(sell_price_sum);

                $('#sell_need_pay_price').val(sell_price_sum - parseInt($('#sell_use_point_price').val(), 10));
            };

            if (e.keyCode == 13) {
                $.ajax({
                    method: 'GET',
                    url: 'product',
                    dataType: 'json',
                    data: {
                        'PRDT_CD':PRDT_CD
                    }
                }).fail(function(get) {
                    self.notice.show('서버에서 오류가 발생했습니다.');
                }).done(function(get) {
                    if (get.RESULT) {
                        console.log(get);
                        var current_product_count = 0;

                        // 제품 추가 시 수량 설정
                        if (tab.sell.table_data[PRDT_CD]) {
                            var current_product_count = tab.sell.table_data[PRDT_CD].PRDT_CNT + 1;
                        } else {
                            var current_product_count = 1;
                        }
                        console.log(current_product_count, get.DATA.STOCK_CNT);

                        if (current_product_count <= get.DATA.STOCK_CNT) {
                            //재고 ok 판매가능
                            if (get.DATA.EVENT_CHECK == 'y') {
                                // 이벤트 품목
                                if (tab.sell.events[get.DATA.EVENT_CD]) {
                                    // 이미 가지고 있는 이벤트
                                    tab.sell.events[get.DATA.EVENT_CD].current_count++;

                                    set_data(get.DATA);

                                    draw_table();
                                } else {
                                    // 새로운 이벤트
                                    $.ajax({
                                        method: 'GET',
                                        url: 'event',
                                        dataType: 'json',
                                        data: {
                                            'EVENT_CD':get.DATA.EVENT_CD
                                        }
                                    }).fail(function(_get) {
                                        self.notice.show('서버에서 오류가 발생했습니다.');
                                    }).done(function(_get) {
                                        tab.sell.events[get.DATA.EVENT_CD] = _get.DATA;
                                        tab.sell.events[get.DATA.EVENT_CD].current_count = 1;

                                        set_data(get.DATA);

                                        draw_table();
                                    });
                                }
                            } else {
                                set_data(get.DATA);

                                draw_table();
                            }
                        } else {
                            self.notice.show('재고가 부족합니다.');
                        }
                    } else {
                        self.notice.show('서버에서 오류가 발생했습니다.');
                    }
                });
            }
        });

        $('#sell_member_check_button').click(function() {
            var json_data = {
                'PHONNO': $('#sell_member_code').val(),
                'PW': $('#sell_member_pw').val()
            };

            $.ajax({
                method: 'GET',
                url: 'point',
                dataType: 'json',
                data: json_data
            }).fail(function(get) {
                self.notice.show('서버에서 오류가 발생했습니다.');
            }).done(function(get) {
                if (get.RESULT) {
                    var saving_point = 0;
                    for (var key in tab.sell.table_data) {
                        if (tab.sell.table_data[key].ONLY_PRDT == 'y') {
                            saving_point += tab.sell.table_data[key].SELL_PRICE / 10;
                        }
                    }

                    $('#sell_use_point_price').removeAttr('disabled');
                    $('#sell_member_check_fail').hide();
                    $('#sell_member_check_complete').show();
                    $('#sell_member_before_point').val(get.DATA.POINT);
                    $('#sell_save_point_price').val(saving_point);
                    $('#sell_member_after_point').val(get.DATA.POINT);
                } else {
                    // if (get.ERR_CD == 1) {
                    //     self.notice.show('서버에서 오류가 발생했습니다.');
                    // } else {
                    //     $('#sell_member_check_fail').show();
                    // }
                    $('#sell_use_point_price').attr('disabled', 'disabled');
                    $('#sell_member_check_complete').hide();
                    $('#sell_member_check_fail').show();
                }
            });
        });

        $('#use_point_dialog_using_point').keyup(function(e) {
            $('#sell_member_after_point').val(parseInt($('#sell_member_before_point').val(), 10) - parseInt($('#use_point_dialog_using_point').val(), 10));
            if ($('#sell_member_after_point').val() < 0) {
                $('#use_point_dialog_confirm').attr('disabled', 'disabled');
            } else {
                $('#use_point_dialog_confirm').removeAttr('disabled');
            }
        });

        $('#use_point_dialog_using_point').keyup(function(e) {
            $('#sell_member_after_point').val(parseInt($('#sell_member_before_point').val(), 10) - parseInt($('#use_point_dialog_using_point').val(), 10));
            if ($('#sell_member_after_point').val() < 0) {
                $('#use_point_dialog_confirm').attr('disabled', 'disabled');
            } else {
                $('#use_point_dialog_confirm').removeAttr('disabled');
            }
        });

        $('#sell_by_cash').click(function() {
            if ($('#sell_price_sum').val() == 0) {

            } else if ($('#sell_paid_price').val() == 0) {
                self.notice.show('손님에게 받은 금액을 입력하세요.');
            } else if ($('#sell_paid_price').val() < $('#sell_price_sum').val()) {
                self.notice.show('돈을 적게 받았습니다.');
            } else {
                $('#sell_change').val($('#sell_price_sum').val() - $('#sell_paid_price').val());

                var json_data = {
                    'AGE': '',
                    'SEX': '',
                    'TOTAL_SELL_PRICE': '',
                    'PAYMENT_WAY': 'CASH'
                };

                if ($('#sell_use_point_price').val() > 0) {
                    json_data.MEMBER_USE_PHONNO = praseInt($('#sell_use_point_price').val(), 10);
                    json_data.MEMBER_USE_POINT = praseInt($('#sell_use_point_price').val(), 10);
                }

                if ($('#save_point_dialog_saving_point').val() > 0) {
                    json_data.MEMBER_SAVE_PHONNO = praseInt($('#save_point_dialog_saving_point').val(), 10);
                    json_data.MEMBER_SAVE_POINT = praseInt($('#save_point_dialog_saving_point').val(), 10);
                }

                console.log(json_data);



                // $.ajax({
                //     method: 'POST',
                //     url: 'sell',
                //     dataType: 'json',
                //     data: {
                //         'PRDT_CD':PRDT_CD
                //     }
                // }).fail(function(get) {
                //     self.notice.show('서버에서 오류가 발생했습니다.');
                // }).done(function(get) {
                //     console.log(get);
                // });
            }
        });

        $('#sell_by_card').click(function() {
            $('#sell_paid_price').val($('#sell_price_sum').val());
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
    },
    dialog: {
        use_point: {
            show: function(msg) {
                $('#use_point_dialog').addClass('shown');
            },
            hide: function() {
                $('#use_point_dialog').removeClass('shown');
            }
        },
        save_point: {
            show: function(msg) {
                $('#save_point_dialog').addClass('shown');
            },
            hide: function() {
                $('#save_point_dialog').removeClass('shown');
            }
        }
    },
    init_table: function() {
        var self = this;
        var tab = this.tab;

        tab.sell.table = $('#sell_list').DataTable({
            'columns': [
                {'data': 'PRDT_CD', 'title': '상품코드', 'width': '15%'},
                {'data': 'PRDT_NAME', 'title': '상품명', 'width': '20%'},
                {'data': 'EVENT_NAME', 'title': '이벤트', 'width': '15%'},
                {'data': 'PRDT_CNT', 'title': '수량', 'width': '8%'},
                {'data': 'REG_PRICE', 'title': '정가', 'width': '14%'},
                {'data': 'DSC_PRICE', 'title': '할인', 'width': '14%'},
                {'data': 'SELL_PRICE', 'title': '판매가', 'width': '14%'},
            ],
            'autoWidth': true,
            'searching': false,
            'lengthChange': false,
            'info': false,
            'scrollY': '321px',
            'scrollCollapse': false,
            'autoFill': true
        });

        // for (var i = 0; i < 32; i++) {
        //     tab.sell.table.row.add({
        //         'PRDT_CD': i.toString(),
        //         'PRDT_NAME': '1',
        //         'EVENT_NAME': '1',
        //         'PRDT_CNT': '1',
        //         'REG_PRICE': '1',
        //         'DSC_PRICE': '1',
        //         'SELL_PRICE': '1'
        //     }).draw();
        // }
    }
};
