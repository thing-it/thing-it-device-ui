angular.module('thing-it-device-ui')
    .component('tiSlider', {
        templateUrl: 'templates/slider-component.html',
        bindings: {
            state: '<',
            change: '&'
        },
        controllerAs: 'vm',
        controller: function () {
            const vm = this;

            this.$onChanges = function (changes) {
                vm.state = changes.state.currentValue;
            };
        }
    });