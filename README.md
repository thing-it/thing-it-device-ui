# thing-it-device-ui
UI Components for [thing-it] Device, Actor and Sensor UIs

Supports complex UIs such as

* Thermostats
* Jalousies
* Light
* RGB Light
* Door Lock
* Gate

# Setup

```
npm install
```

# Testing

Run server via 

```
npm server
```

UI can be found under

```
http://localhost:3333/test/index.html
```

# Components

# Thermostat

```
<ti-thermostat state="portal.thermostat._state"
                   change="portal.callActorService(portal.thermostat, 'setState', portal.thermostat._state)"></ti-thermostat>
```

*state* must contain the fields *setpoint* and *temperature*.

Changes to the state object are only detected if the reference is changes, i.e.

```
this._state = {setpoint: this._state.setpoint, temperature: 27};
```

as opposed to

```
this._state.temperature = 27;
```

# Jalousie

```
<ti-jalousie state="portal.jalousie._state"
                   change="portal.callActorService(portal.jalousie, 'setState', portal.jalousie._state)"></ti-jalousie>
```

*state* must contain the fields *percentage* and *rotation*.

Changes to the state object are only detected if the reference is changes, i.e.

```
this._state = {percentage: this._state.percentage, rotation: 90};
```

as opposed to

```
this._state.rotation = 90;
```

# Light

# RGB Light

# Door Lock

# Gate