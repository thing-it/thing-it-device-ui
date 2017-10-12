angular.module('thing-it-device-ui')
    .component('tiMultiState', {
        templateUrl: 'templates/multi-state-component.html',
        controllerAs: 'vm',
        controller: function ($scope) {
            const vm = this;

            vm.previosAcviteIndex = 0;
            vm.items = [
                {name: 'one', active: true},
                {name: 'two', active: false},
                {name: 'three', active: false},
                {name: 'four', active: false}
            ];

            vm.changeMethod = changeMethod;
            
            function changeMethod(index) {
                vm.items[vm.previosAcviteIndex].active = false;
                vm.items[index].active = true;
                vm.previosAcviteIndex = index;
            }
        }
    });