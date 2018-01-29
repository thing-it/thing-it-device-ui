angular.module('thing-it-device-ui')
    .component('tiDimmer', {
        templateUrl: 'templates/dimmer-component.html',
        bindings: {
            state: '<',
            change: '&'
        },
        controllerAs: 'vm',
        controller: function ($element) {
            const plugin = $($element[0].querySelector('.dimmer-plugin'));
            const vm = this;

            vm.state = {brightness: 0};

            vm.changeBrightness = changeBrightness;
            vm.render = render;

            // Initial rendering

            vm.render();

            function changeBrightness($event) {
                vm.render();
                vm.change();
            }

            function render() {
                var color = tinycolor('#FFFF00').desaturate(100 - vm.state.brightness).lighten((100 - vm.state.brightness) / 5);
                var backgroundColor = tinycolor('#DDDDDD').lighten(vm.state.brightness);

                plugin.css('color', color.toString());
                plugin.css('background-color', backgroundColor.toString());
            }

            this.$onChanges = function (changes) {
                if (!changes || !changes.state || !changes.state.currentValue) {
                    return;
                }

                vm.state = changes.state.currentValue;

                vm.render();
            };
        }

    });
