angular.module('thing-it-device-ui')
    .filter('abs', function() {
        return function(num) {
            return Math.abs(num);
        }
    });