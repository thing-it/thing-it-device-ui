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
                if (!changes || !changes.state || !changes.state.currentValue.temperature || !changes.state.currentValue.setpoint) {
                    return;
                }

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