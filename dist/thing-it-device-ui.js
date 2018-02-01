angular.module('thing-it-device-ui', ['ngMaterial','ngMessages']);
angular.module('thing-it-device-ui')
    .filter('abs', function() {
        return function(num) {
            return Math.abs(num);
        }
    });
angular.module('thing-it-device-ui')
    .component('tiArea', {
        templateUrl: 'templates/area-component.html',
        controllerAs: 'vm',
        controller: function () {
            const vm = this;
            vm.items = [
                {name: 'Kitchen', active: true},
                {name: 'Livingroom', active: false},
                {name: 'Beedroom', active: true},
                {name: 'Hall', active: true}
            ];
        }
    });
angular.module('thing-it-device-ui')
    .component('tiBacnet', {
        templateUrl: 'templates/bacnet-component.html',
        controllerAs: 'vm',
        controller: function (BACNET_DATA) {
            const vm = this;
            vm.bacnetData = BACNET_DATA;
        }
    });
angular.module('thing-it-device-ui')
    .component('tiBinary', {
        templateUrl: 'templates/binary-component.html',
        controllerAs: 'vm',
        controller: function ($scope) {
            var vm = this;
            vm.isBinaryActive = false;
        }
    });
angular.module('thing-it-device-ui')
    .component('tiDimmer', {
        templateUrl: 'templates/dimmer-component.html',
        bindings: {
            state: '<',
            change: '&',
            up: '&',
            down: '&',
        },
        controllerAs: 'vm',
        controller: function ($element) {
            const plugin = $($element[0].querySelector('.dimmer-plugin'));
            const vm = this;

            vm.state = {
                switch: false,
                brightness: 0
            };

            vm.render = render;
            vm.changeBrightness = changeBrightness;
            vm.toggle = toggle;

            // Initial rendering

            vm.render();

            function render() {
                if (vm.state.switch) {
                    var color = tinycolor('#FFFF00').desaturate(100 - vm.state.brightness).lighten((100 - vm.state.brightness) / 5);
                    var backgroundColor = tinycolor('#DDDDDD').lighten(vm.state.brightness);

                    console.log('Color >>>', color.toString());
                    console.log('Background Color >>>', backgroundColor.toString());

                    plugin.css('color', color.toString());
                    plugin.css('background-color', backgroundColor.toString());
                } else {
                    plugin.css('color', '#B3B3B1');
                    plugin.css('background-color', '#DDDDDD');
                }
            }

            function changeBrightness($event) {
                vm.render();
                vm.change();
            }

            function toggle() {
                vm.state.switch = !vm.state.switch;

                vm.render();
                vm.change();
            }

            this.$onChanges = function (changes) {
                if (!changes || !changes.state || !changes.state.currentValue) {
                    return;
                }

                vm.state = changes.state.currentValue;

                vm.render();
            };
        }

    });

angular.module('thing-it-device-ui')
    .component('tiHumiditySensor', {
        templateUrl: 'templates/humidity-sensor-component.html',
        bindings: {
            state: '<'
        },
        controllerAs: 'vm',
        controller: function ($element) {
            const vm = this;
            const plugin = $($element[0].querySelector('.humidity-sensor-plugin'));

            vm.options = {};
            vm.state = {humidity: null};

            vm.render = render;

            function render() {
            }

            this.$onChanges = function (changes) {
                if (!changes || !changes.state || !changes.state.currentValue) {
                    return;
                }

                vm.state = changes.state.currentValue;

                vm.render();
            };
        }

    });

angular.module('thing-it-device-ui')
    .component('tiJalousie', {
        templateUrl: 'templates/jalousie-component.html',
        bindings: {
            state: '<',
            options: '<',
            change: '&',
            up: '&',
            down: '&',
            stop: '&',
        },
        controllerAs: 'vm',
        controller: function ($element) {
            const vm = this;

            vm.state = {rotation: 0, position: 100};
            vm.options = {allowPositionPan: false};
            vm.jalousieData = {slatsCount: 12};
            vm.jalousieControls = {
                jalousieOpened: 0,
                rotation: 0
            };

            // Create slats

            const preview = $element.find('.jalousie-preview');
            const upButton = $($element.find('#upButton'));
            const stopButton = $($element.find('#stopButton'));
            const downButton = $($element.find('#downButton'));

            upButton.click(function(){
                vm.up();
            });

            stopButton.click(function(){
                vm.stop();
            });

            downButton.click(function(){
                vm.down();
            });

            for (var n = 0; n < vm.jalousieData.slatsCount; ++n) {
                $(preview).append('<div class="jalousie-slat" style="transform: skew(15deg, 0deg) scaleY(1); marginTop: 0px;"></div>');
            }

            vm.openJalousie = openJalousie;
            vm.rotateJalousie = rotateJalousie;

            function rotateJalousie() {
                //var rotation = vm.state.rotation;
                var rotation = (vm.state.rotation + 90) * 100 / 180;

                let newStateSkew = -(rotation * 30 / 100) + 15;
                let newStateScale = Math.abs(rotation - 50) / 50;

                newStateScale = newStateScale < 0.15 ? 0.15 : newStateScale;

                $element.find('.jalousie-slat').css('transform', 'skew(' + newStateSkew + 'deg, 0deg) scaleY(' + newStateScale + ')');

                const rotationDiv = $element.find('.jalousie-overlay .rotation');

                rotationDiv.empty();
                rotationDiv.append('<span class="value">' + vm.state.rotation.toFixed(0) + '</span><span class="unit">&deg;</span>');
            }

            function openJalousie() {
                const numberOfBars = vm.jalousieData.slatsCount;
                const barInterval = 100 / numberOfBars;
                const numOfOpenedBars = (100 - vm.state.position) / barInterval;
                const barOpenedHeight = 10;
                const slats = $element.find('.jalousie-slat');

                for (let i = numberOfBars - 1; i > 0; i--) {
                    let barOpened = numOfOpenedBars - (numberOfBars - i);

                    if (barOpened > 1) {
                        barOpened = 1;
                    } else if (barOpened < 0) {
                        barOpened = 0;
                    }

                    $(slats[i]).css('margin-top', -barOpenedHeight * barOpened + 'px');
                }

                const percentageDiv = $element.find('.jalousie-overlay .percentage');

                percentageDiv.empty();
                percentageDiv.append('<span class="value">' + vm.state.position.toFixed(0) + '</span><span class="unit">%</span>');
            }

            var plugin = $($element[0].querySelector('.jalousie-plugin'));

            // plugin.dblclick(function (event) {
            //     event.offsetY / plugin.height();
            //
            //     if (event.offsetY / plugin.height() > 0.5) {
            //         vm.state.position = 100;
            //     } else {
            //         vm.state.position = 0;
            //     }
            //
            //     openJalousie();
            //     vm.change();
            // });

            var hammer = new Hammer(plugin[0]);

            hammer.get('pan').set({threshold: 5, direction: Hammer.DIRECTION_ALL});

            var THROTTLING = 0.3;

            hammer.on('panmove', function ($event) {
                // In case that state has been overwritten with a null state

                if (!vm.state) {
                    vm.state = {rotation: 0, position: 100};
                }

                if ($event.offsetDirection === Hammer.DIRECTION_RIGHT || $event.offsetDirection === Hammer.DIRECTION_LEFT) {
                    vm.state.rotation = Math.round(Math.min(90, Math.max(0, vm.state.rotation + THROTTLING * 180 * $event.deltaX / plugin.width())));

                    rotateJalousie();
                } else if (vm.options.allowPositionPan && ($event.offsetDirection === Hammer.DIRECTION_UP || $event.offsetDirection === Hammer.DIRECTION_DOWN)) {
                    vm.state.position = Math.round(Math.min(100, Math.max(0, vm.state.position + THROTTLING * 100 * $event.deltaY / plugin.height())));

                    openJalousie();
                }

                $event.srcEvent.stopPropagation();
            });

            hammer.on('panend', function ($event) {
                vm.change();
            });

            this.$onChanges = function (changes) {
                console.log('Changes >>>', changes);

                if (!changes || !changes.state || !changes.state.currentValue) {
                    return;
                }

                vm.state = changes.state.currentValue;

                openJalousie();
                rotateJalousie();
            };
        }
    });
angular.module('thing-it-device-ui')
    .component('tiLight', {
        templateUrl: 'templates/light-component.html',
        bindings: {
            state: '<',
            options: '<',
            change: '&'
        },
        controllerAs: 'vm',
        controller: function ($element) {
            const vm = this;
            const plugin = $($element[0].querySelector('.light-plugin'));

            vm.state = {switch: false};
            vm.render = render;
            vm.toggle = toggle;

            // Initial render

            vm.render();

            function render() {
                var value;

                if (vm.options && vm.options.fieldMappings) {
                    value = vm.state[vm.options.fieldMappings.switch];
                } else {
                    value = vm.state.switch;
                }

                console.log('VM (render)', vm);

                if (value) {
                    plugin.removeClass('off');
                    plugin.addClass('on');
                } else {
                    plugin.addClass('off');
                    plugin.removeClass('on');
                }
            }

            function toggle() {
                if (vm.options && vm.options.fieldMappings) {
                    vm.state[vm.options.fieldMappings.switch] = !vm.state[vm.options.fieldMappings.switch];
                } else {
                    vm.state.switch = !vm.state.switch;
                }

                console.log('VM', vm);

                vm.render();
                vm.change();
            }

            this.$onChanges = function (changes) {
                if (!changes || !changes.state || !changes.state.currentValue) {
                    return;
                }

                vm.state = changes.state.currentValue;

                console.log('VM (change)', vm);

                vm.render();
            };
        }

    });

angular.module('thing-it-device-ui')
    .component('tiMotionSensor', {
        templateUrl: 'templates/motion-sensor-component.html',
        bindings: {
            state: '<',
            options: '<',
            change: '&'
        },
        controllerAs: 'vm',
        controller: function ($element) {
            const vm = this;
            const plugin = $($element[0].querySelector('.motion-sensor-plugin'));
            const icon = $(plugin.find('.peopleIcon'));

            vm.state = {motion: false, ticks: 0};
            vm.options = {showTicks: true};

            vm.render = render;

            function render() {
                if (vm.state.motion) {
                    icon.addClass('motion');
                } else {
                    icon.removeClass('motion');
                }
            }

            this.$onChanges = function (changes) {
                if (!changes || !changes.state || !changes.state.currentValue) {
                    return;
                }

                vm.state = changes.state.currentValue;

                vm.render();
            };
        }

    });

angular.module('thing-it-device-ui')
    .component('tiMultiState', {
        templateUrl: 'templates/multi-state-component.html',
        controllerAs: 'vm',
        controller: function ($scope) {
            const vm = this;

            vm.previosAcviteIndex = 0;
            vm.items = [
                {name: 'one', active: true},
                {name: 'two', active: false},
                {name: 'three', active: false},
                {name: 'four', active: false}
            ];

            vm.changeMethod = changeMethod;
            
            function changeMethod(index) {
                vm.items[vm.previosAcviteIndex].active = false;
                vm.items[index].active = true;
                vm.previosAcviteIndex = index;
            }
        }
    });
angular.module('thing-it-device-ui')
    .component('tiRoomControl', {
        templateUrl: 'templates/room-control-component.html',
        controllerAs: 'vm',
        controller: function (ROOM_CONTROL_DATA) {
            const vm = this;

            vm.roomControlData = ROOM_CONTROL_DATA;
        }
    });
angular.module('thing-it-device-ui')
    .component('tiSlider', {
        templateUrl: 'templates/slider-component.html',
        bindings: {
            state: '<',
            change: '&'
        },
        controllerAs: 'vm',
        controller: function () {
            const vm = this;

            this.$onChanges = function (changes) {
                vm.state = changes.state.currentValue;
            };
        }
    });
angular.module('thing-it-device-ui')
    .component('tiSwitch', {
        templateUrl: 'templates/switch-component.html',
        bindings: {
            state: '<',
            options: '<',
            change: '&',
            toggle: '&'
        },
        controllerAs: 'vm',
        controller: function ($element) {
            const vm = this;
            const plugin = $($element[0].querySelector('.switch-plugin'));

            vm.options = {units: 'kWh'};
            vm.state = {switch: false, power: 0};

            vm.render = render;
            vm._toggle = _toggle;

            function render() {
            }

            function _toggle() {
                vm.state.switch = !vm.state.switch;
                vm.render();
                vm.toggle();
            }

            this.$onChanges = function (changes) {
                if (!changes || !changes.state || !changes.state.currentValue) {
                    return;
                }

                vm.state = changes.state.currentValue;

                vm.render();
            };
        }

    });

angular.module('thing-it-device-ui')
    .component('tiTemperatureSensor', {
        templateUrl: 'templates/temperature-sensor-component.html',
        bindings: {
            state: '<'
        },
        controllerAs: 'vm',
        controller: function ($element) {
            const vm = this;
            const plugin = $($element[0].querySelector('.temperature-sensor-plugin'));

            vm.options = {units: 'C'};
            vm.state = {temperature: null};

            vm.render = render;

            function render() {
            }

            this.$onChanges = function (changes) {
                if (!changes || !changes.state || !changes.state.currentValue) {
                    return;
                }

                vm.state = changes.state.currentValue;

                vm.render();
            };
        }

    });

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