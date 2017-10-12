angular.module('thing-it-device-ui')
    .component('tiBacnet', {
        templateUrl: 'templates/bacnet-component.html',
        controllerAs: 'vm',
        controller: function (BACNET_DATA) {
            const vm = this;
            vm.bacnetData = BACNET_DATA;
        }
    });