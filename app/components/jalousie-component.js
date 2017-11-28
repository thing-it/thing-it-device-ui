angular.module('thing-it-device-ui')
    .component('tiJalousie', {
        templateUrl: 'templates/jalousie-component.html',
        bindings: {
            state: '<',
            change: '&'
        },
        controllerAs: 'vm',
        controller: function ($element) {
            const vm = this;

            vm.state = {rotation: 0, percentage: 100};
            vm.jalousieData = {slatsCount: 12};
            vm.jalousieControls = {
                jalousieOpened: 0,
                rotation: 0
            };

            // Create slats

            const preview = $element.find('.jalousie-preview');

            for (var n = 0; n < vm.jalousieData.slatsCount; ++n) {
                $(preview).append('<div class="jalousie-slat" style="transform: skew(15deg, 0deg) scaleY(1); marginTop: 0px;"></div>');
            }

            vm.openJalousie = openJalousie;
            vm.rotateJalousie = rotateJalousie;

            function rotateJalousie() {
                //var rotation = vm.state.rotation;
                var rotation = (vm.state.rotation + 90) * 100 / 180;

                let newStateSkew = -(rotation * 30 / 100) + 15;
                let newStateScale = Math.abs(rotation - 50) / 50;

                newStateScale = newStateScale < 0.15 ? 0.15 : newStateScale;

                $element.find('.jalousie-slat').css('transform', 'skew(' + newStateSkew + 'deg, 0deg) scaleY(' + newStateScale + ')');

                const rotationDiv = $element.find('.jalousie-overlay .rotation');

                rotationDiv.empty();
                rotationDiv.append('<span class="value">' + vm.state.rotation.toFixed(0) + '</span><span class="unit">&deg;</span>');
            }

            function openJalousie() {
                const numberOfBars = vm.jalousieData.slatsCount;
                const barInterval = 100 / numberOfBars;
                const numOfOpenedBars = vm.state.percentage / barInterval;
                const barOpenedHeight = 7;
                const slats = $element.find('.jalousie-slat');

                for (let i = numberOfBars - 1; i > 0; i--) {
                    let barOpened = numOfOpenedBars - (numberOfBars - i);

                    if (barOpened > 1) {
                        barOpened = 1;
                    } else if (barOpened < 0) {
                        barOpened = 0;
                    }

                    $(slats[i]).css('margin-top', -barOpenedHeight * barOpened + 'px');
                }

                const percentageDiv = $element.find('.jalousie-overlay .percentage');

                percentageDiv.empty();
                percentageDiv.append('<span class="value">' + (100 - vm.state.percentage.toFixed(0)) + '</span><span class="unit">%</span>');
            }

            var plugin = $element[0].querySelector('.jalousie-plugin');
            var hammer = new Hammer(plugin);

            hammer.get('pan').set({threshold: 5, direction: Hammer.DIRECTION_ALL});

            var THROTTLING = 0.3;

            hammer.on('panmove', function ($event) {
                if ($event.offsetDirection === Hammer.DIRECTION_RIGHT || $event.offsetDirection === Hammer.DIRECTION_LEFT) {
                    vm.state.rotation = Math.min(90, Math.max(-90, vm.state.rotation + THROTTLING * 180 * $event.deltaX / $(plugin).width()));

                    rotateJalousie();
                } else if ($event.offsetDirection === Hammer.DIRECTION_UP || $event.offsetDirection === Hammer.DIRECTION_DOWN) {
                    vm.state.percentage = Math.min(100, Math.max(0, vm.state.percentage - THROTTLING * 100 * $event.deltaY / $(plugin).height()));

                    openJalousie();
                }

                vm.change();
            });

            this.$onChanges = function (changes) {
                if (!changes || !changes.state || !changes.state.currentValue) {
                    return;
                }

                vm.state = changes.state.currentValue;

                openJalousie();
                rotateJalousie();
            };
        }
    });