angular.module('thing-it-device-ui')
    .component('tiLogiclink', {
        templateUrl: 'templates/logiclink-component.html',
        bindings: {
            state: '<',
            options: '<',
            change: '&'
        },
        controllerAs: 'vm',
        controller: function ($element) {
            const vm = this;
            const plugin = $($element[0].querySelector('.logiclink-plugin'));
            const occupiedIcon = $(plugin.find('#occupiedIcon'));
            const leftButton = $(plugin.find('#leftButton'));
            const rightButton = $(plugin.find('#rightButton'));
            const bluetoothIcon = $(plugin.find('#bluetoothIcon'));
            const usbIcon = $(plugin.find('#usbIcon'));
            const leftLed = $(plugin.find('#leftLed'));
            const rightLed = $(plugin.find('#rightLed'));

            vm.state = {occupied: false, lastMotionTimestamp: null, ticksPerMinute: 0};
            vm.options = {showLastMotionTimestamp: true, showTicksPerMinute: true};

            vm.render = render;

            leftButton.click(function () {
                window.alert('Left Click');
            });

            rightButton.click(function () {
                window.alert('Right Click');
            });

            function render() {
                if (vm.state.occupied) {
                    occupiedIcon.addClass('motion');
                } else {
                    occupiedIcon.removeClass('motion');
                }

                if (vm.state.bluetoothActive) {
                    bluetoothIcon.addClass('active');
                } else {
                    bluetoothIcon.removeClass('active');
                }

                if (vm.state.usbActive) {
                    usbIcon.addClass('active');
                } else {
                    usbIcon.removeClass('active');
                }

                if (vm.state.leftLedOn) {
                    leftLed.addClass('on');
                } else {
                    leftLed.removeClass('on');
                }

                if (vm.state.rightLedOn) {
                    rightLed.addClass('on');
                } else {
                    rightLed.removeClass('on');
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
