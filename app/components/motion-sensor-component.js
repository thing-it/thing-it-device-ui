angular.module('thing-it-device-ui')
    .component('tiMotionSensor', {
        templateUrl: 'templates/motion-sensor-component.html',
        bindings: {
            state: '<',
            options: '<',
            change: '&'
        },
        controllerAs: 'vm',
        controller: function ($element) {
            const vm = this;
            const plugin = $($element[0].querySelector('.motion-sensor-plugin'));
            const icon = $(plugin.find('.peopleIcon'));

            vm.state = {motion: false, ticks: 0};
            vm.options = {showTicks: true};

            vm.render = render;

            function render() {
                if (vm.state.motion) {
                    icon.addClass('motion');
                } else {
                    icon.removeClass('motion');
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
