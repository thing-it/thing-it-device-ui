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
            vm.switch = false;
            vm.render = render;
            // vm._toggle = _toggle;

            // Initial render

            vm.render();

            function render() {
                if (vm.options && vm.options.fieldMappings) {
                    vm.switch = vm.state[vm.options.fieldMappings.switch];
                } else {
                    vm.switch = vm.state.switch;
                }

                if (vm.switch) {
                    container.removeClass('off');
                    container.addClass('on');
                } else {
                    container.addClass('off');
                    container.removeClass('on');
                }
            }

            this.$onChanges = function (changes) {
                if (!changes) {
                    return;
                }

                if (changes.state && changes.state.currentValue) {
                    vm.state = changes.state.currentValue;
                } else {
                    vm.state = {};
                }

                vm.render();
            };
        }

    });
