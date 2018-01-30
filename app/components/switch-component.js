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
