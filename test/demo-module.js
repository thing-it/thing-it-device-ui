let main = angular.module('DemoApp', ['thing-it-device-ui'])
    .controller('PortalController', function ($interval, $timeout) {
        this.thermostat = {
            _state: {setpoint: 22, temperature: 18},
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
                }, 5000);
            }
        };

        this.thermostat.controlLoop();

        // $interval(() => {
        //     if (this.thermostat._state.setpoint == 18) {
        //         this.thermostat._state = {
        //             setpoint: 22,
        //             temperature: this.thermostat._state.temperature
        //         };
        //
        //         this.thermostat.controlLoop();
        //     } else {
        //         this.thermostat._state = {
        //             setpoint: 18,
        //             temperature: this.thermostat._state.temperature
        //         };
        //
        //         this.thermostat.controlLoop();
        //     }
        // }, 10000);

        this.jalousie = {
            _state: {position: 100, rotation: 90},
            setState: function (state) {
                // $timeout(() => {
                //     this._state = {position: 0, rotation: 0};
                // }, 2000);
            }
        };

        $interval(() => {
            if (this.jalousie._state.rotation == 90) {
                this.jalousie._state = {
                    rotation: 0,
                    position: 100
                };
            } else {
                this.jalousie._state = {
                    rotation: 90,
                    position: 50
                };
            }
        }, 5000);

        this.dimmer = {
            _state: {brightness: 0},
            setState: function (state) {
                this._state = state;
            }
        };

        $interval(() => {
            if (this.dimmer._state.brightness == 100) {
                this.dimmer._state = {
                    brightness: 0
                };
            } else {
                this.dimmer._state = {
                    brightness: 100
                };
            }
        }, 7000);

        this.light = {
            _state: {switch: false},
            setState: function (state) {
                this._state = state;
            }
        };

        $interval(() => {
            if (this.light._state.switch) {
                this.light._state = {
                    switch: false
                };
            } else {
                this.light._state = {
                    switch: true
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