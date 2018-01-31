angular.module('thing-it-device-ui')
    .component('tiLight', {
        templateUrl: 'templates/light-component.html',
        bindings: {
            state: '<',
            options: '<',
            change: '&'
        },
        controllerAs: 'vm',
        controller: function ($element) {
            const vm = this;
            const plugin = $($element[0].querySelector('.light-plugin'));

            vm.state = {switch: false};
            vm.render = render;
            vm.toggle = toggle;

            // Initial render

            vm.render();

            function render() {
                var value;

                if (vm.options && vm.options.fieldMappings) {
                    value = vm.state[vm.options.fieldMappings.switch];
                } else {
                    value = vm.state.switch;
                }

                console.log('VM (render)', vm);

                if (value) {
                    plugin.removeClass('off');
                    plugin.addClass('on');
                } else {
                    plugin.addClass('off');
                    plugin.removeClass('on');
                }
            }

            function toggle() {
                if (vm.options && vm.options.fieldMappings) {
                    vm.state[vm.options.fieldMappings.switch] = !vm.state[vm.options.fieldMappings.switch];
                } else {
                    vm.state.switch = !vm.state.switch;
                }

                console.log('VM', vm);

                vm.render();
                vm.change();
            }

            this.$onChanges = function (changes) {
                if (!changes || !changes.state || !changes.state.currentValue) {
                    return;
                }

                vm.state = changes.state.currentValue;

                console.log('VM (change)', vm);

                vm.render();
            };
        }

    });
