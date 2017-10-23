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
        controller: function () {
            const vm = this;

            vm.state = {rotation: 0, percentage: 100};
            vm.jalousieData = {slatsCount: 12};
            vm.jalousieControls = {
                jalousieOpened: 0,
                rotation: 0
            };
            vm.slats = Array.apply(0, Array(+vm.jalousieData.slatsCount)).map(function (item) {
                return {
                    state: {
                        transform: 'skew(15deg, 0deg) scaleY(1)',
                        marginTop: '0px'
                    }
                };
            });

            vm.onPercentageChange = function () {
                openJalousie();
                vm.change();
            };

            vm.onRotationChange = function () {
                rotateJalousie();
                vm.change();
            };

            vm.openJalousie = openJalousie;
            vm.rotateJalousie = rotateJalousie;

            function rotateJalousie() {
                var rotation = vm.state.rotation;
                var rotation = (vm.state.rotation + 90) * 100 / 180;

                console.log('ROT ' + rotation);

                let newStateSkew = -(rotation * 30 / 100) + 15;
                let newStateScale = Math.abs(rotation - 50) / 50;
                newStateScale = newStateScale < 0.15 ? 0.15 : newStateScale;

                for (let i = 0; i < vm.jalousieData.slatsCount; i++) {
                    vm.slats[i].state.transform = `skew(${newStateSkew}deg, 0deg) scaleY(${newStateScale})`;
                }
            }

            function openJalousie() {
                const numberOfBars = vm.jalousieData.slatsCount;
                const barInterval = 100 / numberOfBars;
                const numOfOpenedBars = vm.state.percentage / barInterval;
                const barOpenedHeight = 7;
                for (let i = numberOfBars - 1; i > 0; i--) {
                    let barOpened = numOfOpenedBars - (numberOfBars - i);

                    if (barOpened > 1) {
                        barOpened = 1;
                    } else if (barOpened < 0) {
                        barOpened = 0;
                    }

                    vm.slats[i].state.marginTop = -barOpenedHeight * barOpened + 'px';
                }
            }

            this.$onChanges = function (changes) {
                if (!changes || !changes.state || !changes.state.currentValue) {
                    return;
                }

                console.log('Changes >>>', changes.state.currentValue);

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
            const vm = this;
            vm.thermostatData = {
                scalePosition: 0,
                scaleChange: 0,
                mouseInitial: 0,
                step: 0.1,
                mousePush: false,
                smallScaleWidth: 0,
                isNegative: false,
                isCool: false,
                isHeat: false
            };

            if (!vm.state) {
                vm.state = {setpoint: 22};
            }

            vm.widthThermostat = $element[0].querySelector('.thermostat').offsetWidth;

            vm.scaleStep = 40;
            vm.previousScalePosition = vm.state.setpoint * vm.scaleStep;
            vm.primaryScaleStyle = {
                left: vm.widthThermostat / 2 - vm.state.setpoint * vm.scaleStep
            };
            vm.smallScaleStyle = {
                width: 0,
                left: vm.state.setpoint * vm.scaleStep
            }

            // vm.mouseDown = mouseDown;
            // vm.mouseMove = mouseMove;
            // vm.mouseUp = mouseUp;
            // vm.mouseLeave = mouseLeave;

            var hammer = new Hammer($element[0].querySelector('.thermostat'));

            hammer.on('tap', function ($event) {
                if ($event.center.x > vm.widthThermostat / 2) {
                    vm.state.setpoint += 0.5;
                } else {
                    vm.state.setpoint -= 0.5;
                }

                setSmallScalePosition();

                vm.change();
            });

            hammer.get('pan').set({threshold: 5, direction: Hammer.DIRECTION_HORIZONTAL});

            hammer.on('panstart', function ($event) {
                vm.thermostatData.mousePush = true;
                vm.thermostatData.mouseInitial = $event.center.x;
            });

            hammer.on('panmove', function ($event) {
                if (!vm.thermostatData.mousePush) {
                    return;
                }
                vm.thermostatData.scaleChange = $event.center.x - vm.thermostatData.mouseInitial;
                vm.thermostatData.scalePosition = vm.previousScalePosition + vm.thermostatData.scaleChange;
                vm.state.setpoint = getTemperature();
                vm.thermostatData.isNegative = vm.state.setpoint < 0;
                vm.primaryScaleStyle = {left: vm.widthThermostat / 2 - vm.thermostatData.scalePosition};

                setSmallScalePosition();

                vm.change();
            });

            hammer.on('panend', function ($event) {
                unPush();
            });

            // function mouseDown($event) {
            //     vm.thermostatData.mousePush = true;
            //     vm.thermostatData.mouseInitial = $event.x;
            // };
            //
            // function mouseMove($event) {
            //     if (!vm.thermostatData.mousePush) {
            //         return;
            //     }
            //     vm.thermostatData.scaleChange = $event.x - vm.thermostatData.mouseInitial;
            //     vm.thermostatData.scalePosition = vm.previousScalePosition + vm.thermostatData.scaleChange;
            //     vm.state.setpoint = getTemperature();
            //     vm.thermostatData.isNegative = vm.state.setpoint < 0;
            //     vm.primaryScaleStyle = {left: vm.widthThermostat / 2 - vm.thermostatData.scalePosition};
            //
            //     vm.change();
            //
            //     setSmallScalePosition();
            // };

            function setSmallScalePosition() {
                vm.smallScaleStyle.width = Math.abs((vm.state.setpoint - vm.state.temperature) * vm.scaleStep);
                vm.thermostatData.isCool = vm.state.temperature > vm.state.setpoint;
                vm.thermostatData.isHeat = !vm.thermostatData.isCool;

                vm.smallScaleStyle.left = vm.thermostatData.isCool ?
                    vm.thermostatData.scalePosition : vm.state.temperature * vm.scaleStep;
            }

            function mouseUp() {
                unPush();
            };

            function mouseLeave() {
                unPush();
            };

            function getTemperature() {
                let temperature = vm.thermostatData.scalePosition / vm.scaleStep;
                const delimeter = 0.5;
                let tail = temperature % delimeter;
                temperature -= tail;
                temperature = tail > 0.25 ? temperature + delimeter : temperature;
                return temperature;
            };

            function unPush() {
                let temperature = vm.state.setpoint * vm.scaleStep;
                vm.primaryScaleStyle.left = vm.widthThermostat / 2 - temperature;

                vm.smallScaleStyle.left = vm.thermostatData.isCool ?
                    temperature : vm.state.temperature * vm.scaleStep;

                vm.thermostatData.mousePush = false;
                vm.previousScalePosition = vm.thermostatData.scalePosition;
            };

            this.$onChanges = function (changes) {
                if (!changes || !changes.state || !changes.state.currentValue || !changes.state.currentValue.temperature || !changes.state.currentValue.setpoint) {
                    return;
                }

                console.log('Changes >>>', changes.state.currentValue);

                vm.state = changes.state.currentValue;

                if (vm.state.temperature.toFixed(1) === vm.state.setpoint.toFixed(1)) {
                    vm.thermostatData.isCool = false;
                    vm.thermostatData.isHeat = false;
                    return;
                }

                let diffTemp = Math.abs((vm.state.setpoint - vm.state.temperature) * vm.scaleStep);

                if (vm.thermostatData.isHeat) {
                    vm.smallScaleStyle.left = (vm.state.setpoint * vm.scaleStep - diffTemp);
                }

                vm.smallScaleStyle.width = diffTemp;
                vm.state.temperature = vm.state.temperature;
            };
        }
    });