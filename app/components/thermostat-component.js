angular.module('thing-it-device-ui')
    .component('tiThermostat', {
        templateUrl: 'templates/thermostat-component.html',
        bindings: {
            state: '<',
            options: '<',
            change: '&'
        },
        controllerAs: 'vm',
        controller: function ($element) {
            var that = this;

            that.state = {setpoint: 22, temperature: 22}
            that.options = {maximumSetpointChange: 4, units: '°C', animateTemperatureChange: true};
            that.mode = null;
            that.setpoint = 26;

            var sliderDiv = $("#slider");
            var slider = sliderDiv.roundSlider({
                value: that.setpoint,
                step: 0.5,
                circleShape: "pie",
                startAngle: 315,
                radius: 80,
                width: 14,
                handleSize: "+16",
                handleShape: "dot",
                sliderType: "min-range",
                min: 17,
                max: 26,
                tooltipFormat: function () {
                    return '<div class="setpoint"><span>--' + that.options.units + '</span></div>' +
                        '<div class="temperature"><span>--' + that.options.units + '</span></div>' +
                        '<div class="state"></div>';
                },
                editableTooltip: false,
                mouseScrollAction: true,
                change: update,
                drag: update,
                create: function () {
                    $('<div class="rs-gradient" />').insertBefore($('.rs-tooltip'));
                }
            });

            var tooltip = sliderDiv.find(".rs-tooltip-text");
            var sliderData = sliderDiv.data("roundSlider");

            function adjustTooltipPosition() {
                tooltip.css(
                    {
                        "margin-top": -56,
                        "margin-left": -48
                    }
                );
            }

            renderState();

            // Wait until Slider is created

            window.setTimeout(function () {
                adjustTooltipPosition();
                setBackgroundColor();
                renderState();
            }, 500);

            function renderState() {
                sliderData.setValue(that.state.setpoint);

                var element = tooltip.find(".temperature").html('<span>' + that.state.temperature.toFixed(1) + that.options.units + '</span>');

                if (that.options.animateTemperatureChange) {
                    element.addClass('growAnimation');

                    window.setTimeout(function () {
                        element.removeClass('growAnimation');
                    }, 2000);
                }

                tooltip.find(".setpoint").html('<span>' + that.state.setpoint.toFixed(1) + that.options.units + '</span>');

                // Seems to be necessary to allow repeated animations

                if (that.mode === 'HEAT') {
                    tooltip.find(".state").html('<span class="heating"><i class="fa fa-fire"></i></span>');
                } else if (that.mode === 'COOL') {
                    tooltip.find(".state").html('<span class="cooling"><i class="fa fa-snowflake-o"></i></span>');
                } else {
                    tooltip.find(".state").html('<span class="neutral"></i></span>');
                }

                setBackgroundColor(that.state.setpoint);
                adjustTooltipPosition();
            }

            function update(args) {
                var newSetpoint = Number(args.value);

                // Changes are limited to options.maximumSetpointChange

                if (that.state.setpoint - newSetpoint > 0) {
                    that.state.setpoint = that.state.setpoint - Math.min(that.state.setpoint - newSetpoint, that.options.maximumSetpointChange);
                } else {
                    that.state.setpoint = that.state.setpoint + Math.min(newSetpoint - that.state.setpoint, that.options.maximumSetpointChange);
                }

                that.setpoint = that.state.setpoint;

                renderState();
                that.change();
            }

            function setBackgroundColor(val) {
                //var color = 'hsla(' + (-230 + parseInt(val * 7.5)) + ', 100%, 70%, 0.1)'
                //var color = 'hsla(' + (-230 + parseInt(val * 7.5)) + ', 100%, 0%, 0.0)'

                // console.log('===>', color);
                //
                // color = tinycolor(color);
                //
                // console.log('===>', color);
                //
                // color = color.setAlpha(0.5);
                //
                // console.log('===>', color);

                // $('.rs-gradient').css({
                //     background: color
                // });
                var color = 'hsla(' + (245 + parseInt((val - 16) * 10)) + ', 100%, 50%, 1)';

                $('.rs-range-color').css({
                    background: color
                });
            }

            this.$onChanges = function (changes) {
                if (!changes || !changes.state || !changes.state.currentValue) {
                    return;
                }

                that.state.setpoint = Number(changes.state.currentValue.setpoint.toFixed(1));
                that.setpoint = that.state.setpoint;
                that.state.temperature = Number(changes.state.currentValue.temperature.toFixed(1));
                that.state.mode = changes.state.currentValue.mode;

                // Calculate mode

                if (that.state.mode) {
                    that.mode = that.state.mode;
                } else {
                    if (changes.state.currentValue.setpoint - changes.state.currentValue.temperature > 0) {
                        that.mode = 'HEAT';
                    } else if (changes.state.currentValue.setpoint - changes.state.currentValue.temperature < 0) {
                        that.mode = 'COOL';
                    } else {
                        that.mode = null;
                    }
                }

                renderState();
            };
        }
    });