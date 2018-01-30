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
