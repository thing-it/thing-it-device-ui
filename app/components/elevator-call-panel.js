angular.module('thing-it-device-ui')
    .component('tiElevatorCallPanel', {
        templateUrl: 'templates/elevator-call-panel-component.html',
        bindings: {
            portal: '<',
            state: '<',
            options: '<',
            call: '&',
        },
        controllerAs: 'vm',
        controller: function ($element, $timeout) {

            const self = this;

            self.$onInit = function () {

                this.state = {};
                this.selection = undefined;
                this.currentCall = undefined;

                this.parent = jQuery($element).parent();

                console.log('Parent >>>', this.parent);
            }

            self.render = function () {
            }

            self.addNumber = function (number) {
                if (!this.selection) {
                    this.selection = number;
                } else if (this.selection < 10) {
                    this.selection = parseInt('' + this.selection + '' + number);
                }
            }

            self.backspace = function () {
                if (this.selection) {
                    if (this.selection > 9) {
                        this.selection = Math.floor(this.selection / 10);
                    } else {
                        this.selection = null;
                    }
                }
            }

            self.reset = function () {
                // TODO Send reset

                this.selection = undefined;
                this.currentCall = undefined;

                $('#elevatorDiv').removeClass('blinds');
            }

            self.sendCall = function () {
                // this.portal.getUserLocation().done((location) => {
                //     console.log(location);
                //
                //     this.call();
                // });

                if (!this.currentCall) {
                    this.call({parameters: {pickupFloor: this.selection}});

                    this.selection = undefined;
                } else {
                    this.call({parameters: {destinationFloor: this.selection}});
                }
            }

            self.$onChanges = function (changes) {
                if (!changes) {
                    return;
                }

                console.log('Changed >>>', changes);

                if (changes.state && changes.state.currentValue) {
                    this.state.calls = changes.state.currentValue.calls;

                    if (this.state.calls && this.portal.loggedInUser && this.state.calls[this.portal.loggedInUser._id]) {
                        this.currentCall = this.state.calls[this.portal.loggedInUser._id];

                        if (this.currentCall.pickupFloor == this.currentCall.currentFloor) {
                            $('#elevatorDiv').addClass('blinds');
                        } else if (this.currentCall.destinationFloor == this.currentCall.currentFloor) {
                            $('#elevatorDiv').addClass('blinds');
                        } else {
                            $('#elevatorDiv').removeClass('blinds');
                        }
                    }
                    else {
                        // No active call - reset

                        $timeout(() => {
                            this.selection = undefined;
                            this.currentCall = undefined;

                            $('#elevatorDiv').removeClass('blinds');
                        }, 5000);
                    }
                }

                this.render();
            };
        }
    });
