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
