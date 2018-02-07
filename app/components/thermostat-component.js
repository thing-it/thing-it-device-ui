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
            this.adjustTooltipPosition = function () {
                this.tooltip.css(
                    {
                        "margin-top": -56,
                        "margin-left": -48
                    }
                );
            }

            this.renderState = function () {
                if (this.state.setpoint) {
                    console.log('VM beginning >>>', this.state.setpoint);
                }

                console.log('VM >>>', this);

                this.sliderData.setValue(this.state.setpoint);

                const element = this.tooltip.find(".temperature").html('<span>' + (this.state.temperature ? this.state.temperature.toFixed(1) : '--') + this.options.units + '</span>');

                if (this.options.animateTemperatureChange) {
                    element.addClass('growAnimation');

                    window.setTimeout(function () {
                        element.removeClass('growAnimation');
                    }, 2000);
                }

                this.tooltip.find(".setpoint").html('<span>' + (this.state.setpoint ? this.state.setpoint.toFixed(1) : '--') + this.options.units + '</span>');

                // Seems to be necessary to allow repeated animations

                if (this.mode === 'HEAT') {
                    this.tooltip.find(".state").html('<span class="heating"><i class="fal fa-fire"></i></span>');
                } else if (this.mode === 'COOL') {
                    this.tooltip.find(".state").html('<span class="cooling"><i class="fal fa-snowflake"></i></span>');
                } else {
                    this.tooltip.find(".state").html('<span class="neutral"></i></span>');
                }

                this.setBackgroundColor(this.state.setpoint);
                this.adjustTooltipPosition();
            }

            this.update = function (args) {
                const newSetpoint = Number(args.value);

                console.log('Update >>>> ', args);

                // Changes are limited to options.maximumSetpointChange

                if (this.state.setpoint - newSetpoint > 0) {
                    this.state.setpoint = this.state.setpoint - Math.min(this.state.setpoint - newSetpoint, this.options.maximumSetpointChange);
                } else {
                    this.state.setpoint = this.state.setpoint + Math.min(newSetpoint - this.state.setpoint, this.options.maximumSetpointChange);
                }

                this.setpoint = this.state.setpoint;

                this.renderState();
                this.change();
            }

            this.setBackgroundColor = function (val) {
                var color = 'hsla(' + (245 + parseInt((val - 16) * 10)) + ', 100%, 50%, 1)';

                $('.rs-range-color').css({
                    background: color
                });
            }

            this.$onChanges = function (changes) {
                if (!changes) {
                    return;
                }

                console.log('State change >>>> ', changes);
                console.log('VM >>>> ', this);

                if (changes.options) {
                    if (changes.options.currentValue) {
                        if (changes.options.currentValue.units) {
                            this.options.units = changes.options.currentValue.units;
                        }

                        if (changes.options.currentValue.maximumSetpointChange) {
                            this.options.maximumSetpointChange = changes.options.currentValue.maximumSetpointChange;
                        }

                        if (changes.options.currentValue.animateTemperatureChange) {
                            this.options.animateTemperatureChange = changes.options.currentValue.animateTemperatureChange;
                        }
                    } else {
                        // Revert to defaults

                        this.options = {maximumSetpointChange: 4, units: '°C', animateTemperatureChange: true};
                    }
                }

                if (changes.state) {
                    if (changes.state.currentValue) {
                        this.state.setpoint = Number(changes.state.currentValue.setpoint.toFixed(1));
                        this.setpoint = this.state.setpoint;
                        this.state.temperature = Number(changes.state.currentValue.temperature.toFixed(1));
                        this.state.mode = changes.state.currentValue.mode;

                        // Calculate mode

                        if (this.state.mode) {
                            this.mode = this.state.mode;
                        } else {
                            if (changes.state.currentValue.setpoint - changes.state.currentValue.temperature > 0) {
                                this.mode = 'HEAT';
                            } else if (changes.state.currentValue.setpoint - changes.state.currentValue.temperature < 0) {
                                this.mode = 'COOL';
                            } else {
                                this.mode = null;
                            }
                        }
                    } else {
                        // At least ensure that there is a state object

                        this.state = {setpoint: 22};
                    }
                }


                this.renderState();
            };


            //this.$onInit = function () {
            this.state = {setpoint: 22, temperature: 21};
            this.options = {maximumSetpointChange: 4, units: '°C', animateTemperatureChange: true};
            this.mode = null;
            this.setpoint = this.state.setpoint;

            this.sliderDiv = $("#slider");
            this.slider = this.sliderDiv.roundSlider({
                value: this.setpoint,
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
                    console.log('VM >>>', this);

                    return '<div class="setpoint"><span>--' + this.options.units + '</span></div>' +
                        '<div class="temperature"><span>--' + this.options.units + '</span></div>' +
                        '<div class="state"></div>';
                }.bind(this),
                editableTooltip: false,
                mouseScrollAction: true,
                change: function (args) {
                    this.update(args);
                }.bind(this),
                drag: function (args) {
                    this.update(args);
                }.bind(this),
                create: function () {
                    $('<div class="rs-gradient" />').insertBefore($('.rs-tooltip'));
                }
            });

            this.tooltip = this.sliderDiv.find(".rs-tooltip-text");
            this.sliderData = this.sliderDiv.data("roundSlider");

            this.renderState();

            // Wait until Slider is created

            window.setTimeout(function () {
                this.adjustTooltipPosition();
                this.setBackgroundColor();
                console.log('VM in timeout >>>', this);
                this.renderState();
            }.bind(this), 500);
            // };
        }
    });