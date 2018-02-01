angular.module('thing-it-device-ui')
    .component('tiLight', {
        templateUrl: 'templates/light-component.html',
        bindings: {
            state: '<',
            options: '<',
            change: '&',
            toggle: '&'
        },
        controllerAs: 'vm',
        controller: function ($element) {
            const vm = this;
            const plugin = $($element[0].querySelector('.light-plugin'));
            const container = $(plugin.find('#container'));

            vm.state = {switch: false};
            vm.render = render;
            // vm._toggle = _toggle;

            // Initial render

            vm.render();

            function render() {
                var value;

                if (vm.options && vm.options.fieldMappings) {
                    value = vm.state[vm.options.fieldMappings.switch];
                } else {
                    value = vm.state.switch;
                }

                if (value) {
                    container.removeClass('off');
                    container.addClass('on');
                } else {
                    container.addClass('off');
                    container.removeClass('on');
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
