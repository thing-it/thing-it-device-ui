angular.module('thing-it-device-ui')
    .component('tiThermostat', {
        templateUrl: 'templates/thermostat-component.html',
        bindings: {
            state: '<',
            change: '&'
        },
        controllerAs: 'vm',
        controller: function ($element) {
            var that = this;

            var minTemperature = 17;
            var maxTemperature = 26;
            var interval = 0.5;
            var currentTemperature = 21;
            var setTemperature = 23;
            var state = 1;

            var sliderDiv = $("#slider");
            var slider = sliderDiv.roundSlider({
                value: setTemperature,
                step: interval,
                circleShape: "pie",
                startAngle: 315,
                radius: 80,
                width: 14,
                handleSize: "+16",
                handleShape: "dot",
                sliderType: "min-range",
                min: minTemperature,
                max: maxTemperature,
                tooltipFormat: tooltip,
                editableTooltip: false,
                mouseScrollAction: true,
                change: update,
                drag: update,
                create: function () {
                    insertGradient();
                }
            });

            tooltip = sliderDiv.find(".rs-tooltip-text");
            sliderData = sliderDiv.data("roundSlider");

            var sliderData;
            var tooltip;

            setTooltipPosition(-56, -48);
            setBackgroundColor(setTemperature);

            function setSetTemperature(val) {
                setTemperature = Number(val).toFixed(1);

                sliderData.setValue(val);
            }

            function getSetTemperature() {
                return sliderData.getValue();
            }

            function setCurrentTemperature(val) {
                currentTemperature = Number(val).toFixed(1);

                tooltip.find(".currentTemperature").html(currentTemperature + "°C");
            }

            function setState(val) {
                state = val;

                if (state == 1) {
                    tooltip.find(".state").html('<span class="heating"><i class="fa fa-fire"></i></span>');
                } else if (state == -1) {
                    tooltip.find(".state").html('<span class="cooling"><i class="fa fa-snowflake-o"></i></span>');
                } else {
                    tooltip.find(".state").html('<span class="neutral"><i class="fa fa-fire"></i></span>');
                }
            }

            function setTooltipPosition(marginTop, marginLeft) {
                tooltip.css(
                    {
                        "margin-top": marginTop,
                        "margin-left": marginLeft
                    }
                );
            }

            function insertGradient() {
                $('<div class="rs-gradient" />').insertBefore($('.rs-tooltip'));
            }

            function update(args) {
                that.state.setpoint = Number(args.value).toFixed(1);

                setTemperature = args.value;
                setBackgroundColor(setTemperature);

                that.change();
            }

            function setBackgroundColor(val) {
                var val = -230 + parseInt(val * 7.5);

                $('.rs-gradient').css({
                    background: 'hsl(' + val + ', 40%, 50%)'
                });
            }

            function tooltip(args) {
                var setTemperature = Number(args.value);
                var html = '<div class="setTemperature"><span>' + setTemperature + '°C</span></div>';

                html += '<div class="currentTemperature"><span>' + currentTemperature + '°C</span></div>';

                if (state == 1) {
                    html += '<div class="state"><span class="heating"><i class="fa fa-fire"></i></span></div>';
                } else if (state == -1) {
                    html += '<div class="state"><span class="cooling"><i class="fa fa-snowflake-o"></i></span></div>';
                } else {
                    html += '<div class="state"><span class="neutral"></i></span></div>';
                }

                return html;
            }

            this.$onChanges = function (changes) {
                if (!changes || !changes.state || !changes.state.currentValue) {
                    return;
                }

                setSetTemperature(changes.state.currentValue.setpoint);
                setCurrentTemperature(changes.state.currentValue.temperature);

                if (changes.state.currentValue.setpoint - changes.state.currentValue.temperature > 0) {
                    setState(1);
                } else if (changes.state.currentValue.setpoint - changes.state.currentValue.temperature < 0) {
                    setState(-1);
                } else {
                    setState(0)
                }
            };

        }
    });