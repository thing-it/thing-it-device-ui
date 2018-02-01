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
            const occupiedIcon = $(plugin.find('#occupiedIcon'));

            vm.state = {occupied: false, lastMotionTimestamp: null, ticksPerMinute: 0};
            vm.options = {showLastMotionTimestamp: true, showTicksPerMinute: true};

            vm.render = render;

            function render() {
                if (vm.state.occupied) {
                    occupiedIcon.addClass('motion');
                } else {
                    occupiedIcon.removeClass('motion');
                }
            }

            this.$onChanges = function (changes) {
                if (!changes || !changes.state || !changes.state.currentValue) {
                    return;
                }

                vm.state = changes.state.currentValue;

                if (vm.state.lastMotionTimestamp) {
                    vm.lastMotionTimestamp = moment(vm.state.lastMotionTimestamp).format('ll') + ' ' + moment(vm.state.lastMotionTimestamp).format('LT');
                } else {
                    vm.lastMotionTimestamp = '-';
                }

                vm.render();
            };
        }

    });
