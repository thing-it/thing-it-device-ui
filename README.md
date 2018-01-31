# thing-it-device-ui

UI Components for [thing-it] Device, Actor and Sensor UIs

Supports complex UIs such as

* Thermostat
* Jalousy
* Light
* Dimmer 
* Switch
* Motion Sensor
* Temperature Sensor
* Humidity Sensor

You can use components to implement UIs for [thing-it-node](https://www.npmjs.com/package/thing-it-device-node) Device Plugins quickly and safely.

You can see the use components e.g. in the UIs of

* [thing-it-device-bacnet](https://www.npmjs.com/package/thing-it-device-bacnet) 
* [thing-it-device-ubisys](https://www.npmjs.com/package/thing-it-device-ubisys) 

(check the **web/** folder of these repositories).

# Setup

You only need to explicitly install this package if you intend to add more components or adjust functionality in the existing ones.

```
npm install
```

# Testing

Run server via 

```
node server
```

UI can be tested under

```
http://localhost:3333/test/index.html
```

# Components

# General

## DOM Embedding

The components are expected to live in a flex layout container.

## State Field IDs

The UI components expect state variables to have specific IDs such as **temperature** or **switch**, however if your plugin state fields
do not match the prescribed IDs, you can provide a mapping table in **options** like so:

```
<div wraper-directive title="Light">
    <ti-light state="portal.light._state"
              change="portal.callActorService(portal.light, 'setState', portal.light._state)"
              options="{fieldMappings: {switch: 'pseudoSwitch'}}"></ti-light>
```

## Options

All components can be configured in behavior and appearance via options, e.g.

```
<ti-thermostat options="{maximumSetpointChange: 4, units: 'F'}" ...
```


# Thermostat

```
<ti-thermostat state="component._state"
                   change="portal.callActorService(component, 'setState', component._state)"></ti-thermostat>
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

## State Fields

* **setpoint**
* **temperature**

## Functions

* **change**

## Options

* **maximumSetpointChange** maximal value the setpoint can changed by in one gesture
* **units**, string with e.g. F or °C

## UI

<p align="center"><a href="./doc/images/thermostat.png"><img src="./doc/images/thermostat.png" width="50%" height="50%"></a></p>

# Jalousie

```
<ti-jalousie state="component._state" change="portal.callActorService(component, 'setState', component._state)"
                   up="portal.callActorService(component, 'up', component._state)"
                   down="portal.callActorService(component, 'down', component._state)"></ti-jalousie>
```

*state* must contain the fields *percentage* and *rotation*.

Changes to the state object are only detected if the reference is changes, i.e.

```
this._state = {position: this._state.position, rotation: 90};
```

as opposed to

```
this._state.rotation = 90;
```

## State Fields

* **position**, integer between 0 and 100
* **rotation** integer between 0 and 90 indicating degree of rotation, 0 being closed

## Functions

* **change**
* **up**
* **down**

## UI

Rotation can be adjusted with a pan gesture.

<p align="center"><a href="./doc/images/jalousie.png"><img src="./doc/images/jalousie.png" width="50%" height="50%"></a></p>

# Light

```
<ti-light state="component._state"
                   change="portal.callActorService(component, 'setState', component._state)"></ti-thermostat>
```

## State Fields

* **switch**, boolean for switch state
* **power** current power consumption

## Functions

* **change**

## UI

Users can click everywhere in the component to toggle the light state.

<p align="center"><a href="./doc/images/light.png"><img src="./doc/images/light.png" width="50%" height="50%"></a></p>

# Dimmer

```
<ti-dimmer state="component._state"
                   change="portal.callActorService(component, 'setState', component._state)"></ti-dimmer>
```

## State Fields

* **switch**, boolean for switch state
* **brightness**, boolean for switch state
* **power** current power consumption

## Functions

* **change**

## UI

Users can click everywhere in the component to toggle the light state. Light will be switched on in the brightness adjusted via the slider.

<p align="center"><a href="./doc/images/dimmer.png"><img src="./doc/images/dimmer.png" width="50%" height="50%"></a></p>

# Switch

To represent an on/off plug or switch which can also optionally measure/display power consumption.

```
<ti-switch state="component._state"
                   change="portal.callActorService(component, 'setState', component._state)"></ti-switch>
```

## State Fields

* **switch**, boolean for switch state
* **power** current power consumption

## Functions

* **change**

## UI

<p align="center"><a href="./doc/images/switch.png"><img src="./doc/images/switch.png" width="50%" height="50%"></a></p>

# Temperature Sensor

```
<ti-temperature-sensor state="component._state"
                   change="portal.callActorService(component, 'setState', component._state)"></ti-temperature-sensor>
```

## State Fields

* **temperature**, temperature value

## Functions

* **change**

## UI

<p align="center"><a href="./doc/images/temperature-sensor.png"><img src="./doc/images/temperature-sensor.png" width="50%" height="50%"></a></p>

# Motion Sensor

```
<ti-motion-sensor state="component._state"
                   change="portal.callActorService(component, 'setState', component._state)"></ti-motion-sensor>
```

## State Fields

* **motion**, boolean indicating whether any motion is detected
* **ticks** measured tick counts correlated with movements

## Functions

* **change**

## UI

<p align="center"><a href="./doc/images/motion-sensor.png"><img src="./doc/images/motion-sensor.png" width="50%" height="50%"></a></p>

# Humidity Sensor

## State Fields

* **humidity**, integer in percent

## Functions

* **change**

## UI

<p align="center"><a href="./doc/images/humidity-sensor.png"><img src="./doc/images/humidity-sensor.png" width="50%" height="50%"></a></p>

# Combining UI Components

You can easily combine plugins like

```
<ti-temperature-sensor state="component._state"></ti-temperature-sensor>
<ti-humidity-sensor state="component._state"></ti-humidity-sensor>
```

assuming that the **component** provides the state fields **temperature** and **humidity**,
resulting in a UI like

<p align="center"><a href="./doc/images/multi-sensor.png"><img src="./doc/images/multi-sensor.png" width="50%" height="50%"></a></p>

against a single Device Plugin UI.
