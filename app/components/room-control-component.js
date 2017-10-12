angular.module('thing-it-device-ui')
    .component('tiRoomControl', {
        templateUrl: 'templates/room-control-component.html',
        controllerAs: 'vm',
        controller: function (ROOM_CONTROL_DATA) {
            const vm = this;

            vm.roomControlData = ROOM_CONTROL_DATA;
        }
    });