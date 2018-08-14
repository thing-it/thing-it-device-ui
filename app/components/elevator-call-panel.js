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

                this.pickupFloor = undefined;
                this.destinationFloor = undefined;

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

                if (this.state.calls && this.portal.loggedInUser) {
                    delete this.state.calls[this.portal.loggedInUser.account];
                }

                this.selection = undefined;
                this.currentCall = undefined;
                this.pickupFloor = undefined;
                this.destinationFloor = undefined;

                $('#elevatorDiv').removeClass('blinds');
            }

            self.next = function () {
                this.pickupFloor = this.selection;
                this.selection = undefined;
            }

            self.sendCall = function () {
                // this.portal.getUserLocation().done((location) => {
                //     console.log(location);
                //
                //     this.call();
                // });

                this.destinationFloor = this.selection;
                this.selection = undefined;

                this.call({
                    parameters: {
                        pickupFloor: this.pickupFloor,
                        destinationFloor: this.destinationFloor
                    }
                });

            }

            self.$onChanges = function (changes) {
                if (!changes) {
                    return;
                }

                console.log('Changed >>>', changes);

                if (changes.state && changes.state.currentValue) {

                    this.state.calls = changes.state.currentValue.calls;

                    console.log('User >>> ');
                    console.log(this.portal.loggedInUser.account);

                    if (this.state.calls && this.portal.loggedInUser && this.state.calls[this.portal.loggedInUser.account]) {
                        this.currentCall = this.state.calls[this.portal.loggedInUser.account];

                        if (this.currentCall.nextFloor === this.currentCall.currentFloor && this.currentCall.movingState === 'standing') {
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
                            this.pickupFloor = undefined;
                            this.destinationFloor = undefined;

                            $('#elevatorDiv').removeClass('blinds');
                        }, 10000);
                    }
                }

                this.render();
            };
        }
    });
