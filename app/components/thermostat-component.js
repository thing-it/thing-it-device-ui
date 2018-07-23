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

            // roundslider patch

            var fn1 = $.fn.roundSlider.prototype._setProperties;

            $.fn.roundSlider.prototype._setProperties = function () {
                fn1.apply(this);
                var o = this.options, r = o.radius, d = r * 2,
                    r1 = r - (o.width / 2) - this._border(true),
                    svgNS = "http://www.w3.org/2000/svg";
                this._circum = Math.PI * (r1 * 2);

                var $svg = $(document.createElementNS(svgNS, "svg"));
                $svg.attr({"height": d, "width": d});

                this.$circle = $(document.createElementNS(svgNS, 'circle')).attr({
                    "fill": "transparent", "class": "rs-transition", "cx": r, "cy": r, "r": r1,
                    "stroke-width": o.width, "stroke-dasharray": this._circum
                });
                var $path = this.$circle.clone().addClass("path-bg");
                this._setDashOffset($path, this._end);
                $svg.append($path, this.$circle.addClass("range-bg"));

                this.$svg_box = $(document.createElement("div")).addClass("rs-transition rs-svg").append($svg).css({
                    "height": d, "width": d, "transform-origin": "50% 50%",
                    "transform": "rotate(" + (o.startAngle + 180) + "deg)"
                }).appendTo(this.innerContainer);
            }

            $.fn.roundSlider.prototype._setDashOffset = function ($ele, deg) {
                var pct = (1 - (deg / 360)) * this._circum;
                $ele.css({strokeDashoffset: pct});
            }
            var fn2 = $.fn.roundSlider.prototype._changeSliderValue;
            $.fn.roundSlider.prototype._changeSliderValue = function (val, deg) {
                fn2.apply(this, arguments);
                deg = deg - this.options.startAngle;

                if (this._rangeSlider) {
                    this.$svg_box.rsRotate(this._handle1.angle + 180);
                    deg = this._handle2.angle - this._handle1.angle;
                }
                this._setDashOffset(this.$circle, deg);
            }

            this.renderState = function () {
                if (this.state.setpoint) {
                    console.log('VM beginning >>>', this.state.setpoint);
                }

                console.log('VM >>>', this);

                this.sliderData.setValue(this.state.setpoint);

                // const element = this.tooltip.find(".temperature").html('<span>' + (this.state.temperature ? this.state.temperature.toFixed(1) : '--') + this.options.units + '</span>');
                //
                // if (this.options.animateTemperatureChange) {
                //     element.addClass('growAnimation');
                //
                //     window.setTimeout(function () {
                //         element.removeClass('growAnimation');
                //     }, 2000);
                // }

                // this.tooltip.find(".setpoint").html('<span>' + (this.state.setpoint ? this.state.setpoint.toFixed(1) : '--') + this.options.units + '</span>');

                // Seems to be necessary to allow repeated animations

                var mode;

                if (this.state.mode) {
                    mode = this.state.mode;
                } else {
                    if (this.state.setpoint - this.state.temperature > 0) {
                        mode = 'HEAT';
                    } else if (this.state.setpoint - this.state.temperature < 0) {
                        mode = 'COOL';
                    } else {
                        mode = null;
                    }
                }

                console.log('MODE &&&&&&&', mode);

                if (mode === 'HEAT') {
                    this.tooltip.find(".state").html('<span class="heating"><i class="fal fa-fire"></i></span>');
                    this.container.addClass('heating');
                    this.container.removeClass('cooling');
                } else if (mode === 'COOL') {
                    this.tooltip.find(".state").html('<span class="cooling"><i class="fal fa-snowflake"></i></span>');
                    this.container.removeClass('heating');
                    this.container.addClass('cooling');
                } else {
                    this.tooltip.find(".state").html('<span class="neutral"></i></span>');
                    this.container.removeClass('heating');
                    this.container.removeClass('cooling');
                }

                this.setBackgroundColor(this.state.setpoint);
                this.adjustTooltipPosition();
            }

            this.update = function (value) {
                const newSetpoint = Number(value);

                if (this.options && this.options.maximumSetpointChange) {
                    // Changes are limited to options.maximumSetpointChange

                    if (this.state.setpoint - newSetpoint > 0) {
                        this.state.setpoint = this.state.setpoint - Math.min(this.state.setpoint - newSetpoint, this.options.maximumSetpointChange);
                    } else {
                        this.state.setpoint = this.state.setpoint + Math.min(newSetpoint - this.state.setpoint, this.options.maximumSetpointChange);
                    }
                } else {
                    this.state.setpoint = newSetpoint;
                }

                this.renderState();
                this.change();
            }

            this.setBackgroundColor = function (val) {
                var color = 'hsla(' + (235 + parseInt((val - 16) * 15)) + ', 100%, 50%, 1)';

                $('.rs-control circle.range-bg').css({
                    stroke: color
                });

                $('.rs-range-color').css({
                    background: color
                });
            }

            this.$onChanges = function (changes) {
                if (!changes) {
                    return;
                }

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
                        this.state.temperature = Number(changes.state.currentValue.temperature.toFixed(1));
                        this.state.mode = changes.state.currentValue.mode;
                    } else {
                        // At least ensure that there is a state object

                        this.state = {setpoint: 22};
                    }
                }


                this.renderState();
            };


            //this.$onInit = function () {
            this.state = {setpoint: 22, temperature: 21};
            this.options = {maximumSetpointChange: 4, units: '&deg;C', animateTemperatureChange: true};

            this.container = $($element).find('.thermostat');
            this.sliderDiv = $("#slider");

            this.slider = this.sliderDiv.roundSlider({
                value: this.state.setpoint,
                step: 0.5,
                circleShape: "pie",
                startAngle: 315,
                radius: 150,
                width: 25,
                // handleSize: "+16",
                //handleShape: "dot",
                handleSize: "30,10",
                handleShape: "square",
                sliderType: "min-range",
                min: 17,
                max: 26,
                tooltipFormat: function () {
                    return '';
                    // return '<div class="setpoint"><span>--' + this.options.units + '</span></div>' +
                    //     '<div class="temperature"><span>--' + this.options.units + '</span></div>' +
                    //     '<div class="state"></div>';
                }.bind(this),
                editableTooltip: false,
                mouseScrollAction: true,
                change: function (event) {
                    this.update(event.value);
                }.bind(this),
                // drag: function (args) {
                //     this.update(args);
                // }.bind(this),
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
                this.renderState();
            }.bind(this), 500);
            //};
        }
    });