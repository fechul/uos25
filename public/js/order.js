var sell = {
    table: null,
    table_data: [],
    events: {},
    gifts: {},
    event_ok: true,
    member_check: false,
    member_point: 0,
    init: function() {
        this.init_table();
        this.clear();
        this.init_sell_events();
    },
    clear: function() {
        var self = this;
        this.table_data = [];
        this.events = {};
        this.gifts = {};
        this.event_ok = true;
        this.member_check = false;
        this.member_point = 0;
        this.table.clear().draw();
        $('.workspace.sell input.sell_price_input').val(0);
        $('.workspace.sell input#sell_product_id').val('');
        $('.workspace.sell input#sell_member_code').val('');
        $('.workspace.sell input#sell_member_pw').val('');
        $('.point_dialog_member_check_msg').hide();
    },
    init_sell_events: function() {
        var self = this;

        $('#sell_product_id').keyup(function(e) {
            var PRDT_CD = $(this).val();

            if (e.keyCode == 13) {
                var idx = self.find_data_idx(PRDT_CD);

                if (idx >= 0) {
                    self.set_sell_list(PRDT_CD, self.table_data[idx].PRDT_CNT + 1);
                } else {
                    self.set_sell_list(PRDT_CD, 1);
                }
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
                main.notice.show('서버에서 오류가 발생했습니다.');
            }).done(function(get) {
                if (get.RESULT) {
                    $('#sell_use_point_price').removeAttr('disabled');
                    $('#sell_member_check_fail').hide();
                    $('#sell_member_check_complete').show();
                    self.member_check = true;
                    self.member_point = get.DATA.POINT;

                    self.set_price_data();
                } else {
                    // if (get.ERR_CD == 1) {
                    //     main.notice.show('서버에서 오류가 발생했습니다.');
                    // } else {
                    //     $('#sell_member_check_fail').show();
                    // }
                    $('#sell_use_point_price').attr('disabled', 'disabled');
                    $('#sell_member_check_complete').hide();
                    $('#sell_member_check_fail').show();
                }
            });
        });

        $('.sell_price_input').keyup(function(e) {
            var using_point = parseInt($('#sell_use_point_price').val() || 0, 10);

            if (using_point > self.member_point) {
                main.notice.show('보유 포인트보다 많이 사용하실 수 없습니다.');
                $(this).val(self.member_point);
            }

            $('#sell_change').val(-1 * ($('#sell_need_pay_price').val() - $(this).val()));

            self.set_price_data();
        });

        $('#sell_by_cash').click(function() {
            if ($('#sell_price_sum').val() == 0) {

            } else if ($('#sell_paid_price').val() == 0) {
                main.notice.show('손님에게 받은 금액을 입력하세요.');
            } else if ($('#sell_paid_price').val() < $('#sell_price_sum').val()) {
                main.notice.show('돈을 적게 받았습니다.');
            } else if (!$('[name=sell_radio_sex]:checked').val()) {
                main.notice.show('성별을 선택해주세요.');
            } else if (!$('[name=sell_radio_age]:checked').val()) {
                main.notice.show('연령을 선택해주세요.');
            } else {
                $('#sell_change').val($('#sell_price_sum').val() - $('#sell_paid_price').val());

                var json_data = {
                    'AGE': '',
                    'SEX': '',
                    'TOTAL_SELL_PRICE': '',
                    'PAYMENT_WAY': 'CASH'
                };

                if (self.member_check) {
                    json_data.MEMBER_USE_POINT = praseInt($('#sell_use_point_price').val() || 0, 10);
                    json_data.MEMBER_PHONNO = $('#sell_member_code');
                    json_data.MEMBER_SAVE_POINT = praseInt($('#save_point_dialog_saving_point').val(), 10);
                }




                // $.ajax({
                //     method: 'POST',
                //     url: 'sell',
                //     dataType: 'json',
                //     data: {
                //         'PRDT_CD':PRDT_CD
                //     }
                // }).fail(function(get) {
                //     main.notice.show('서버에서 오류가 발생했습니다.');
                // }).done(function(get) {
                // });
            }
        });

        $('#sell_by_card').click(function() {
            $('#sell_paid_price').val($('#sell_price_sum').val());
        });

        var sell_prdt_cnt_input_delay = 0;

        $(document).on('keyup', '.sell_prdt_cnt_input', function(e) {
            var $this = $(this);

            if (e.keyCode == 13) {
                var cnt = parseInt($this.val(), 10);
                var row = self.table.row($this.parents('tr')).data();

                if (isNaN(cnt) || cnt <= 0) {
                    self.set_sell_list(row.PRDT_CD, 0);
                } else {
                    self.set_sell_list(row.PRDT_CD, cnt);
                }
            }
        });
    },
    set_sell_list: function(PRDT_CD, NEW_PRDT_CNT) {
        var self = this;
        if (NEW_PRDT_CNT == undefined) {
            NEW_PRDT_CNT = 0;
        }

        var set_data = function(DATA) {
            var idx = self.find_data_idx(PRDT_CD);
            if (idx == -1) {
                self.table_data.push(DATA);
            }
            idx = self.find_data_idx(PRDT_CD);


            self.table_data[idx].REG_PRICE = self.table_data[idx].PRDT_PRICE * NEW_PRDT_CNT;
            self.table_data[idx].DSC_PRICE = 0;
            self.table_data[idx].SELL_PRICE = 0;

            var product_data = self.table_data[idx];

            if ((product_data.EVENT_CHECK == 'y') && product_data.EVENT_CD) {
                if (self.events[product_data.EVENT_CD].current_count == 0) {
                    self.events[product_data.EVENT_CD].current_count = NEW_PRDT_CNT;
                } else {
                    self.events[product_data.EVENT_CD].current_count -= product_data.PRDT_CNT;
                    self.events[product_data.EVENT_CD].current_count += NEW_PRDT_CNT;
                }

                var product_event = self.events[product_data.EVENT_CD];

                if (product_event.MIN_CNT == product_event.REQ_CNT) {
                    if (product_event.GIFT_CD) {
                        // 증점
                        var gift_idx = self.find_data_idx(product_event.GIFT_CD);

                        self.gifts[product_event.GIFT_CD] = {
                            PRDT_CD: PRDT_CD,
                            GIFT_CNT: Math.min(NEW_PRDT_CNT, gift_idx >= 0 ? self.table_data[gift_idx].PRDT_CNT : 0)
                        };

                        if (gift_idx >= 0) {
                            self.table_data[gift_idx].DSC_PRICE = self.table_data[gift_idx].PRDT_PRICE * self.gifts[product_event.GIFT_CD].GIFT_CNT;
                            self.table_data[gift_idx].SELL_PRICE = self.table_data[gift_idx].REG_PRICE - self.table_data[gift_idx].DSC_PRICE;
                            self.table_data[gift_idx].EVENT_NAME = '증정품';
                        }

                        self.table_data[idx].SELL_PRICE = product_data.PRDT_PRICE * NEW_PRDT_CNT;
                    } else {
                        // 할인
                        self.table_data[idx].DSC_PRICE = product_event.DISCOUNT_PRICE * NEW_PRDT_CNT;
                        self.table_data[idx].SELL_PRICE = (product_data.PRDT_PRICE - product_event.DISCOUNT_PRICE) * NEW_PRDT_CNT;
                    }
                } else {
                    // n + n;
                    var mok = parseInt(product_event.current_count / product_event.REQ_CNT, 10);
                    var remainder = product_event.current_count % product_event.REQ_CNT;

                    self.table_data[idx].DSC_PRICE = mok * (product_event.REQ_CNT - product_event.MIN_CNT) * product_data.PRDT_PRICE;
                    self.table_data[idx].SELL_PRICE = mok * product_event.MIN_CNT * product_data.PRDT_PRICE;

                    if (remainder == 0 || remainder > product_event.MIN_CNT) {
                        self.table_data[idx].DSC_PRICE += product_data.PRDT_PRICE * remainder;
                    } else {
                        self.table_data[idx].SELL_PRICE += product_data.PRDT_PRICE * remainder;
                    }
                }
            } else {
                if (self.gifts[PRDT_CD]) {
                    self.gifts[PRDT_CD].GIFT_CNT = Math.min(self.find_data_idx(self.gifts[PRDT_CD].PRDT_CD) > -1 ? self.table_data[self.find_data_idx(self.gifts[PRDT_CD].PRDT_CD)].PRDT_CNT : 0, NEW_PRDT_CNT);
                    self.table_data[idx].DSC_PRICE = self.table_data[idx].PRDT_PRICE * self.gifts[PRDT_CD].GIFT_CNT;
                    self.table_data[idx].SELL_PRICE = self.table_data[idx].REG_PRICE - self.table_data[idx].DSC_PRICE;
                    self.table_data[idx].EVENT_NAME = '증정품';
                } else {
                    self.table_data[idx].SELL_PRICE = product_data.PRDT_PRICE * NEW_PRDT_CNT;
                }
            }

            if (NEW_PRDT_CNT == 0) {
                for (var key in self.events) {
                    if (key == self.table_data[idx].EVENT_CD) {
                        if (self.events[self.table_data[idx].EVENT_CD].current_count == 0) {
                            delete self.events[key];
                            break;
                        }
                    }
                }

                for (var key in self.gifts) {
                    if (self.gifts[key].PRDT_CD == PRDT_CD) {
                        delete self.gifts[key];
                        break;
                    }
                }

                self.table_data.splice(idx, 1);
            } else {
                self.table_data[idx].PRDT_CNT = NEW_PRDT_CNT;
            }

            self.event_ok = true;

            for (var key in self.events) {
                if (self.events[key].current_count % self.events[key].REQ_CNT != 0) {
                    self.event_ok = false;
                    break;
                }
            }

            for (var key in self.gifts) {
                if (self.gifts[key].GIFT_CNT < self.table_data[self.find_data_idx(self.gifts[key].PRDT_CD)].PRDT_CNT) {
                    self.event_ok = false;
                    break;
                }
            }
        };

        $.ajax({
            method: 'GET',
            url: 'product',
            dataType: 'json',
            data: {
                'PRDT_CD':PRDT_CD
            }
        }).fail(function(get) {
            main.notice.show('서버에서 오류가 발생했습니다.');
        }).done(function(get) {
            if (get.RESULT) {
                if (NEW_PRDT_CNT <= get.DATA.STOCK_CNT) {
                    //재고 ok 판매가능
                    if (get.DATA.EVENT_CHECK == 'y') {
                        // 이벤트 품목
                        if (self.events[get.DATA.EVENT_CD]) {
                            // 이미 가지고 있는 이벤트
                            set_data(get.DATA);

                            self.draw_table();
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
                                main.notice.show('서버에서 오류가 발생했습니다.');
                            }).done(function(_get) {
                                self.events[get.DATA.EVENT_CD] = _get.DATA;
                                self.events[get.DATA.EVENT_CD].current_count = 0;

                                set_data(get.DATA);

                                self.draw_table();
                            });
                        }
                    } else {
                        set_data(get.DATA);

                        self.draw_table();
                    }
                } else {
                    main.notice.show('재고가 부족합니다.');

                    self.draw_table();
                }
            } else {
                main.notice.show('서버에서 오류가 발생했습니다.');
            }
        });
    },
    set_price_data: function() {
        var sell_price_sum = 0;
        var saving_point = 0;
        var using_point = parseInt($('#sell_use_point_price').val() || 0, 10);

        for (var key in this.table_data) {
            sell_price_sum += this.table_data[key].SELL_PRICE;
            if (this.table_data[key].ONLY_PRDT == 'y') {
                saving_point += this.table_data[key].SELL_PRICE / 10;
            }
        }

        $('#sell_price_sum').val(sell_price_sum);
        $('#sell_need_pay_price').val(sell_price_sum - using_point);
        if (this.member_check) {
            $('#sell_save_point_price').val(saving_point);
            $('#sell_member_before_point').val(this.member_point);
            $('#sell_member_after_point').val(this.member_point + saving_point - using_point);
        }
    },
    draw_table: function() {
        this.table.clear();

        for (var key in this.table_data) {
            this.table.row.add(this.table_data[key]);
        }

        this.set_price_data();

        this.table.draw();
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
    find_data_idx: function(PRDT_CD) {
        var idx = -1;
        for (var i = 0; i < this.table_data.length; i++) {
            if (this.table_data[i].PRDT_CD == PRDT_CD) {
                idx = i;
                break;
            }
        }

        return idx;
    },
    init_table: function() {
        var self = this;

        this.table = $('#sell_list').DataTable({
            'columns': [
                {'data': 'PRDT_CD', 'title': '상품코드', 'width': '15%'},
                {'data': 'PRDT_NAME', 'title': '상품명', 'width': '20%'},
                {'data': 'EVENT_NAME', 'title': '이벤트', 'width': '15%'},
                {'data': 'PRDT_CNT', 'title': '수량', 'width': '8%'},
                {'data': 'REG_PRICE', 'title': '정가', 'width': '14%'},
                {'data': 'DSC_PRICE', 'title': '할인', 'width': '14%'},
                {'data': 'SELL_PRICE', 'title': '판매가', 'width': '14%'},
            ],
            'columnDefs': [{
                'targets': 3,
                'render': function ( row, type, val, meta ) {
                    return '<input class="sell_prdt_cnt_input" value=' + row + '>';
                }
            }],
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
