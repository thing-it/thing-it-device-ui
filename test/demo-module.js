let main = angular.module('DemoApp', ['thing-it-device-ui'])
    .controller('PortalController', function ($interval, $timeout) {
        this.thermostat = {
            _state: {setpoint: 22, temperature: 22},
            setState: function (state) {
                if (this.control) {
                    $interval.cancel(this.control);
                }

                this._state.setpoint = state.setpoint;

                this.controlLoop();
            },
            controlLoop: function () {
                if (this.control) {
                    $interval.cancel(this.control);
                }

                var step = this._state.setpoint > this._state.temperature ? 0.1 : -0.1;

                this.control = $interval(() => {
                    this._state.temperature += step;

                    console.log('Temp >>>', this._state.temperature);

                    this._state = {
                        setpoint: this._state.setpoint,
                        temperature: this._state.temperature
                    };

                    if (Math.abs(this._state.temperature - this._state.setpoint) < 0.05) {
                        $interval.cancel(this.control);
                    }
                }, 200);
            }
        };

        $interval(() => {
            if (this.thermostat._state.setpoint == 18) {
                this.thermostat._state = {
                    setpoint: 22,
                    temperature: this.thermostat._state.temperature
                };

                this.thermostat.controlLoop();
            } else {
                this.thermostat._state = {
                    setpoint: 18,
                    temperature: this.thermostat._state.temperature
                };

                this.thermostat.controlLoop();
            }
        }, 10000);

        this.jalousie = {
            _state: {percentage: 50, rotation: 90},
            setState: function (state) {
                // $timeout(() => {
                //     this._state = {percentage: 0, rotation: 0};
                // }, 2000);
            }
        };

        $interval(() => {
            if (this.jalousie._state.rotation == 90) {
                this.jalousie._state = {
                    rotation: 0,
                    percentage: 0
                };
            } else {
                this.jalousie._state = {
                    rotation: 90,
                    percentage: 0
                };
            }
        }, 5000);

        this.callActorService = function (component, service, parameters) {
            console.log('Actor Service ' + service + ' called with ' + JSON.stringify(parameters));

            component[service](parameters);
        }
    })
    .directive('titleDirective', function () {
        return {
            restrict: 'A',
            scope: {
                isolatedBindingFoo: '=bindingFoo'
            }
        }
    }).directive('wraperDirective', function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/wraper-directive.html',
            transclude: true,
            scope: {
                title: '@'
            },
            link: function (scope, el) {

            }
        }
    })
    .constant('BACNET_DATA', {
        name: 'Intel Pentium',
        description: 'All models support: MMX, SSE, SSE2, SSE3, SSSE3, SSE4.1, SSE4.2, AVX, Enhanced Intel SpeedStep Technology (EIST), Intel 64, XD bit (an NX bit implementation), Intel VT-x, Intel VT-d, Hyper-threading, Turbo Boost, AES-NI, Smart Cache',
        vendor: 'Intel',
        model: 'Core i7',
        softwareVersion: '7'
    })
    .constant('ROOM_CONTROL_DATA', {
        checkmark: false,
        temperature: 19.8,
        lightBright: 2,
        contrast: 3.8,
        plug: 1
    });
//     .config(function ($sceDelegateProvider) {
//     $sceDelegateProvider.resourceUrlWhitelist([
//         'self',
//         'http://www.thing-it.com/**'
//     ]);
// });