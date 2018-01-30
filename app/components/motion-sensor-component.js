angular.module('thing-it-device-ui')
    .component('tiMotionSensor', {
        templateUrl: 'templates/motion-sensor-component.html',
        bindings: {
            state: '<',
            change: '&'
        },
        controllerAs: 'vm',
        controller: function ($element) {
            const vm = this;
            const plugin = $($element[0].querySelector('.motion-sensor-plugin'));

            vm.state = {motion: false, ticks: 0};

            vm.render = render;

            function render() {
                console.log('Render >>>', vm.state);

                if (vm.state.motion) {
                    plugin.addClass('motion');
                    plugin.addClass('alertColor');
                } else {
                    plugin.removeClass('motion');
                    plugin.removeClass('alertColor');
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
