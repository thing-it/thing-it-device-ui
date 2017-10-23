angular.module('thing-it-device-ui')
    .component('tiJalousie', {
        templateUrl: 'templates/jalousie-component.html',
        bindings: {
            state: '<',
            change: '&'
        },
        controllerAs: 'vm',
        controller: function () {
            const vm = this;

            vm.state = {rotation: 0, percentage: 100};
            vm.jalousieData = {slatsCount: 12};
            vm.jalousieControls = {
                jalousieOpened: 0,
                rotation: 0
            };
            vm.slats = Array.apply(0, Array(+vm.jalousieData.slatsCount)).map(function (item) {
                return {
                    state: {
                        transform: 'skew(15deg, 0deg) scaleY(1)',
                        marginTop: '0px'
                    }
                };
            });

            vm.onPercentageChange = function () {
                openJalousie();
                vm.change();
            };

            vm.onRotationChange = function () {
                rotateJalousie();
                vm.change();
            };

            vm.openJalousie = openJalousie;
            vm.rotateJalousie = rotateJalousie;

            function rotateJalousie() {
                var rotation = vm.state.rotation;
                var rotation = (vm.state.rotation + 90) * 100 / 180;

                console.log('ROT ' + rotation);

                let newStateSkew = -(rotation * 30 / 100) + 15;
                let newStateScale = Math.abs(rotation - 50) / 50;
                newStateScale = newStateScale < 0.15 ? 0.15 : newStateScale;

                for (let i = 0; i < vm.jalousieData.slatsCount; i++) {
                    vm.slats[i].state.transform = `skew(${newStateSkew}deg, 0deg) scaleY(${newStateScale})`;
                }
            }

            function openJalousie() {
                const numberOfBars = vm.jalousieData.slatsCount;
                const barInterval = 100 / numberOfBars;
                const numOfOpenedBars = vm.state.percentage / barInterval;
                const barOpenedHeight = 7;
                for (let i = numberOfBars - 1; i > 0; i--) {
                    let barOpened = numOfOpenedBars - (numberOfBars - i);

                    if (barOpened > 1) {
                        barOpened = 1;
                    } else if (barOpened < 0) {
                        barOpened = 0;
                    }

                    vm.slats[i].state.marginTop = -barOpenedHeight * barOpened + 'px';
                }
            }

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