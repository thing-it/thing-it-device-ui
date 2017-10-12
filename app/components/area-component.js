angular.module('thing-it-device-ui')
    .component('tiArea', {
        templateUrl: 'templates/area-component.html',
        controllerAs: 'vm',
        controller: function () {
            const vm = this;
            vm.items = [
                {name: 'Kitchen', active: true},
                {name: 'Livingroom', active: false},
                {name: 'Beedroom', active: true},
                {name: 'Hall', active: true}
            ];
        }
    });