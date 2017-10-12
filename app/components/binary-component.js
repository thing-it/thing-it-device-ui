angular.module('thing-it-device-ui')
    .component('tiBinary', {
        templateUrl: 'templates/binary-component.html',
        controllerAs: 'vm',
        controller: function ($scope) {
            var vm = this;
            vm.isBinaryActive = false;
        }
    });