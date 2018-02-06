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
            const vm = this;

            vm.state = {setpoint: 22, temperature: 22}
            vm.options = {maximumSetpointChange: 4, units: '°C', animateTemperatureChange: true};
            vm.mode = null;
            vm.setpoint = 26;

            var sliderDiv = $("#slider");
            var slider = sliderDiv.roundSlider({
                value: vm.setpoint,
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
                    console.log('VM >>>', vm);

                    return '<div class="setpoint"><span>--' + vm.options.units + '</span></div>' +
                        '<div class="temperature"><span>--' + vm.options.units + '</span></div>' +
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
                console.log('VM >>>', vm);
                sliderData.setValue(vm.state.setpoint);

                var element = tooltip.find(".temperature").html('<span>' + vm.state.temperature.toFixed(1) + vm.options.units + '</span>');

                if (vm.options.animateTemperatureChange) {
                    element.addClass('growAnimation');

                    window.setTimeout(function () {
                        element.removeClass('growAnimation');
                    }, 2000);
                }

                tooltip.find(".setpoint").html('<span>' + vm.state.setpoint.toFixed(1) + vm.options.units + '</span>');

                // Seems to be necessary to allow repeated animations

                if (vm.mode === 'HEAT') {
                    tooltip.find(".state").html('<span class="heating"><i class="fa fa-fire"></i></span>');
                } else if (vm.mode === 'COOL') {
                    tooltip.find(".state").html('<span class="cooling"><i class="fa fa-snowflake-o"></i></span>');
                } else {
                    tooltip.find(".state").html('<span class="neutral"></i></span>');
                }

                setBackgroundColor(vm.state.setpoint);
                adjustTooltipPosition();
            }

            function update(args) {
                var newSetpoint = Number(args.value);

                // Changes are limited to options.maximumSetpointChange

                if (vm.state.setpoint - newSetpoint > 0) {
                    vm.state.setpoint = vm.state.setpoint - Math.min(vm.state.setpoint - newSetpoint, vm.options.maximumSetpointChange);
                } else {
                    vm.state.setpoint = vm.state.setpoint + Math.min(newSetpoint - vm.state.setpoint, vm.options.maximumSetpointChange);
                }

                vm.setpoint = vm.state.setpoint;

                renderState();
                vm.change();
            }

            function setBackgroundColor(val) {
                var color = 'hsla(' + (245 + parseInt((val - 16) * 10)) + ', 100%, 50%, 1)';

                $('.rs-range-color').css({
                    background: color
                });
            }

            this.$onChanges = function (changes) {
                if (!changes) {
                    return;
                }

                if (changes.options && changes.options.currentValue) {
                    if (changes.options.currentValue.units) {
                        vm.options.units = changes.options.currentValue.units;
                    }

                    if (changes.options.currentValue.maximumSetpointChange) {
                        vm.options.maximumSetpointChange = changes.options.currentValue.maximumSetpointChange;
                    }

                    if (changes.options.currentValue.animateTemperatureChange) {
                        vm.options.animateTemperatureChange = changes.options.currentValue.animateTemperatureChange;
                    }
                }

                if (changes.state && changes.state.currentValue) {
                    vm.state.setpoint = Number(changes.state.currentValue.setpoint.toFixed(1));
                    vm.setpoint = vm.state.setpoint;
                    vm.state.temperature = Number(changes.state.currentValue.temperature.toFixed(1));
                    vm.state.mode = changes.state.currentValue.mode;

                    // Calculate mode

                    if (vm.state.mode) {
                        vm.mode = vm.state.mode;
                    } else {
                        if (changes.state.currentValue.setpoint - changes.state.currentValue.temperature > 0) {
                            vm.mode = 'HEAT';
                        } else if (changes.state.currentValue.setpoint - changes.state.currentValue.temperature < 0) {
                            vm.mode = 'COOL';
                        } else {
                            vm.mode = null;
                        }
                    }
                }

                renderState();
            };
        }
    });