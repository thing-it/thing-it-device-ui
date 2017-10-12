angular.module('thing-it-device-ui')
    .component('tiLight', {
        templateUrl: 'templates/light-component.html',
        controllerAs: 'vm',
        controller: function ($scope) {
            const vm = this;
            vm.brightness = 0;
            vm.lightStyle = {
                backgroundPositionY: '48px'
            }

            vm.changeBrightness = changeBrightness;

            function changeBrightness() {
                vm.lightStyle.backgroundPositionY = `${Math.abs(vm.brightness-100)/100*48}px`;
            }
        }

    });
