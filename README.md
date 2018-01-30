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

# General

## Options

All components can be configured in behavior and appearance via options, e.g.

```
<ti-thermostat options="{maximumSetpointChange: 4, units: 'F'}" ...
```


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

## UI

<p align="center"><a href="./doc/images/thermostat.png"><img src="./doc/images/thermostat.png" width="70%" height="70%"></a></p>

# Jalousie

```
<ti-jalousie state="portal.jalousie._state"
                   change="portal.callActorService(portal.jalousie, 'setState', portal.jalousie._state)"></ti-jalousie>
```

*state* must contain the fields *percentage* and *rotation*.

Changes to the state object are only detected if the reference is changes, i.e.

```
this._state = {position: this._state.percentage, rotation: 90};
```

as opposed to

```
this._state.rotation = 90;
```

## UI

<p align="center"><a href="./doc/images/jalousie.png"><img src="./doc/images/jalousie.png" width="70%" height="70%"></a></p>

# Light

## UI

<p align="center"><a href="./doc/images/light.png"><img src="./doc/images/light.png" width="70%" height="70%"></a></p>

# Dimmer

## UI

<p align="center"><a href="./doc/images/dimmer.png"><img src="./doc/images/dimmer.png" width="70%" height="70%"></a></p>

# Switch

## UI

<p align="center"><a href="./doc/images/jalousie.png"><img src="./doc/images/jalousie.png" width="70%" height="70%"></a></p>

# Temperature Sensor

## UI

<p align="center"><a href="./doc/images/temperature-sensor.png"><img src="./doc/images/temperature-sensor.png" width="70%" height="70%"></a></p>

# Motion Sensor

## UI

<p align="center"><a href="./doc/images/motion-sensor.png"><img src="./doc/images/motion-sensor.png" width="70%" height="70%"></a></p>

# Humidity Sensor

## UI

<p align="center"><a href="./doc/images/humidity-sensor.png"><img src="./doc/images/humidity-sensor.png" width="70%" height="70%"></a></p>
