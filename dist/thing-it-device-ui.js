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
    .component('tiJalousie', {
        templateUrl: 'templates/jalousie-component.html',
        bindings: {
            state: '<',
            change: '&'
        },
        controllerAs: 'vm',
        controller: function ($element) {
            const vm = this;

            vm.state = {rotation: 0, percentage: 100};
            vm.jalousieData = {slatsCount: 12};
            vm.jalousieControls = {
                jalousieOpened: 0,
                rotation: 0
            };

            // Create slats

            const preview = $element.find('.jalousie-preview');

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
                const numOfOpenedBars = vm.state.percentage / barInterval;
                const barOpenedHeight = 7;
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
                percentageDiv.append('<span class="value">' + (100 - vm.state.percentage.toFixed(0)) + '</span><span class="unit">%</span>');
            }

            var plugin = $element[0].querySelector('.jalousie-plugin');
            var hammer = new Hammer(plugin);

            hammer.get('pan').set({threshold: 5, direction: Hammer.DIRECTION_ALL});

            var THROTTLING = 0.3;

            hammer.on('panmove', function ($event) {
                // In case that state has been overwritten with a null state

                if (!vm.state) {
                    vm.state = {rotation: 0, percentage: 100};
                }

                if ($event.offsetDirection === Hammer.DIRECTION_RIGHT || $event.offsetDirection === Hammer.DIRECTION_LEFT) {
                    vm.state.rotation = Math.min(90, Math.max(-90, vm.state.rotation + THROTTLING * 180 * $event.deltaX / $(plugin).width()));

                    rotateJalousie();
                } else if ($event.offsetDirection === Hammer.DIRECTION_UP || $event.offsetDirection === Hammer.DIRECTION_DOWN) {
                    vm.state.percentage = Math.min(100, Math.max(0, vm.state.percentage - THROTTLING * 100 * $event.deltaY / $(plugin).height()));

                    openJalousie();
                }

                vm.change();
            });

            this.$onChanges = function (changes) {
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
        controllerAs: 'vm',
        controller: function ($scope) {
            const vm = this;
            vm.brightness = 0;
            vm.lightStyle = {
                backgroundPositionY: '48px'
            }

            vm.changeBrightness = changeBrightness;

            function changeBrightness() {
                vm.lightStyle.backgroundPositionY = `${Math.abs(vm.brightness-100)/100*48}px`;
            }
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

            console.log('Slider ===> ', slider);

            tooltip = sliderDiv.find(".rs-tooltip-text");

            var sliderData = sliderDiv.data("roundSlider");
            var tooltip;

            console.log('Slider Data ===> ', sliderData);

            setTooltipPosition(-56, -48);
            setBackgroundColor(setTemperature);

            function setSetTemperature(val) {
                if (val == null || val == undefined) {
                    val = '--'
                } else {
                    setTemperature = Number(val).toFixed(1);
                }

                sliderData.setValue(val);
            }

            function getSetTemperature() {
                return sliderData.getValue();
            }

            function setCurrentTemperature(val) {
                if (val == null || val == undefined) {
                    val = '--'
                } else {
                    currentTemperature = Number(val).toFixed(1);
                }

                tooltip.find(".currentTemperature").html(currentTemperature + "°C").addClass('growAnimation');

                // Seems to be necessary to allow repeated animations

                window.setTimeout(function () {
                    tooltip.find(".currentTemperature").removeClass('growAnimation');
                }, 2000);
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
                var color = 'hsla(' + (-230 + parseInt(val * 7.5)) + ', 100%, 70%, 0.1)'

                // console.log('===>', color);
                //
                // color = tinycolor(color);
                //
                // console.log('===>', color);
                //
                // color = color.setAlpha(0.5);
                //
                // console.log('===>', color);

                $('.rs-gradient').css({
                    background: color
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