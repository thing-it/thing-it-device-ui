angular.module('thing-it-device-ui')
    .component('tiDimmer', {
        templateUrl: 'templates/dimmer-component.html',
        bindings: {
            state: '<',
            change: '&',
            up: '&',
            down: '&',
        },
        controllerAs: 'vm',
        controller: function ($element) {
            const plugin = $($element[0].querySelector('.dimmer-plugin'));
            const vm = this;

            vm.state = {
                switch: false,
                brightness: 0
            };

            vm.render = render;
            vm.changeBrightness = changeBrightness;
            vm.toggle = toggle;

            // Initial rendering

            vm.render();

            function render() {
                if (vm.state.switch) {
                    var color = tinycolor('#FFFF00').desaturate(100 - vm.state.brightness).lighten((100 - vm.state.brightness) / 5);
                    var backgroundColor = tinycolor('#DDDDDD').lighten(vm.state.brightness);

                    console.log('Color >>>', color.toString());
                    console.log('Background Color >>>', backgroundColor.toString());

                    plugin.css('color', color.toString());
                    plugin.css('background-color', backgroundColor.toString());
                } else {
                    plugin.css('color', '#B3B3B1');
                    plugin.css('background-color', '#DDDDDD');
                }
            }

            function changeBrightness($event) {
                vm.render();
                vm.change();
            }

            function toggle() {
                vm.state.switch = !vm.state.switch;

                vm.render();
                vm.change();
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
