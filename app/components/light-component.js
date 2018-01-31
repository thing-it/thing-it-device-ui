angular.module('thing-it-device-ui')
    .component('tiLight', {
        templateUrl: 'templates/light-component.html',
        bindings: {
            state: '<',
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
                if (vm.state.switch) {
                    plugin.removeClass('off');
                    plugin.addClass('on');
                } else {
                    plugin.addClass('off');
                    plugin.removeClass('on');
                }
            }

            function toggle() {
                vm.state.switch = !vm.state.switch;

                vm.render();
                vm.change();
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
