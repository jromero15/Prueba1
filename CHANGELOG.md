---
website: gitlab.geovisor.com.co/Servinformacion/FrontEndBase
---

# FrontEndBase

## 0.0.9 (2017-09-14T16:50:00Z)

### New
- added `vendor:lazylibs` task for lazy libs on demand
- added Dtables lazy config
- new controller and view example for `dataTable`
- Module `FileUploadController` V. 0.3
- new controller `uploadController`
- angular-datatables V. 0.5.6
- awesome modal for upload files
- view using datatables and file upload
- added `angular-file-upload` module and route

### Fix
- set default credentials to `false` (api.hydra.js)
- now using avatar and menu, some bug fixeds (navbar.html)
- examples now using a special folder
- remove `bodyClass`
- update changelog doc

### Deprecated
- `cartoDbController` are removed from future versions, in flavour of `CartoDB` service


## 0.0.8 (2017-08-23T00:41:57Z)

### New
- awesome `GeoRef.service` service using Angular 1.x
- new config for `geocoder`, `massive`, and `assisted`
- update function massiveGeo
- remove deprecated functions `returnResponse`, `resultRequest`
- added `selectpicker` directive
- new constant `GEO_SETTINGS`

### Fix
- Hydra now validate and accept external uri, and headers
- validate `data` and `options` (api.hydra.js)
- remove ugly bad commit from giylab fork
- fix ident issues
- added changelog
- fix `customHeaders`, new param `credentials`, added  `Accept` to `headers.patch` (api.hydra.js)
- validate confirmText and cancelText (alerts.service.js)
- refactor module GeoRef, now uses GEO_SETTINGS, credentials, fix geoAssisted method (georref.service.js )
- better README.md
- several bug fixeds


## 0.0.7 release (2017-06-04T15:14:16Z)

### New
- remove gulp-autoprefixer
- controller for `app`
- added modal with streetview, buttons for draw routes
- added css class for panorama
- new functions `markerClick`, `car_route`, `walk_route`, `subway_route`, `infoMarker` for info over modal (basemap.controller.js)
- news libraries for `Gmaps` `drawing`, `places`, `visualization` (Index.html)
- remove `csscomb`
- added `USER_SESSION` constants (ore.constants.js)
- FullCalendar V. 3.0.1

### Fix
- update ng-idle to V. 1.3.2
- new controller for `CartoDB` Api
- fix task lazylibs, now using folder under `src/libs/lazylibs`
- updated to new names, now using **FrontEndBase**
- reorganized code, validate options (`info`, `success`, `warning`, `danger`) in alerts.service.js
- fix functions `streetView`, `addMarker` now receive function 'clickOnMarker', for callback (Anuket)
- basemap.html now contains `themap` div for google maps
- app.html now uses `hideNavBar` instead `app.uri != '/login'"`
- remove unused imports, fix navbar style

### Deprecated
- `bodyClass` are removed from future versions


## 0.0.6 (2017-05-10T14:48:26Z)

### New
- added flags images to 18n module
- view for basemap
- @media queries support for basemap
- added folder_exclude_patterns (ST config file project)
- new Controller for maps

### Fix
- remove unused tags, added meta, change ng-app (index.html)
- added `name` and `description` on bower.json and package.json
- Anuket, and GMaps as lazyload modules
- how to in README.md
- change colors for navbar, login and footer
- loginController go to default to `app.basemap`
- remove cities, now using $.notify, check objects with params to the Run method (Anuket)
- setCenter on init, new fn clearMap, use removePolylines on drawRoute (Anuket)
- image default for login

### Deprecated
- `csscomb` and `gulp-autoprefixer` files, are removed from future versions


## 0.0.5 (2017-05-08T16:38:07Z)

### New
- `stateChangeStart` on method
- `notify service`, Create a notifications that fade out automatically.
- app yaml configuration file for **GAE**
- `alerts service` using sweetalert2 plugin
- sweetalert2 V. 5.3.5

### Fix
- added 'uri' hide navbar when login
- notify service
- fix http status, now handle 401, 500, 503 on Hydra factory
- urlRouterProvider `otherwise` now go to login page
- some styles for navbar and logo
- implements notify service in controllers
- notify now autoclose caused by delay on 'timer' event


## 0.0.4 (2017-04-07T14:34:45Z)

### New
- Bootstrap-datetimejs V. 4.17.37
- Bootstrap V. 3.3.5
- Jasny Bootstrap V. 3.1.3
- Bootstrap Notify  V. 3.1.3
- perfect-scrollbar v0.6.13
- added vendor css styles
- glyphicons halflings fonts
- favicon
- fontawesome V. 4.7
- loginController
- create a awesome login view

### Fix
- jQuery, Material lib and plugins as thirdparty libs
- remove unused styles and tags
- fix paths on gulp tasks
- setBackgroundImage fucntion now handle image background
- reident some views


## 0.0.3 (2017-04-03T20:01:31Z)

### New
- gmaps V. 0.4.25
- new taks using gulp (webserver, prod, watch, vendor:libs etc.)
- create awesome dashboard using cards
- thirdparty, styles config (vendor.json)
- admin panel
- news controllers (adminController, dashController, profilesController)

### Fix
- style for logo banner
- css class `cursor` rename to `cursor-pointer`
- navbar
- fix name for styles, fix ident
- now use jQuery V. 3.1.1
- use angular.min.js V. 1.5.11
- remove fonts and styles


## 0.0.2 (2017-03-27T18:54:13Z)

### New
- config for building apps
- config `php.ini` for Google App Engine (A.K.A. GAE)
- config vendor for build `vendor.js`
- fuction `settingsRun`
- config  `DT_OPTIONS` for datatables
- module `lazyload`, `fastclick`, `GMaps`
- Hydra factory `Api Rest`
- Notify service
- `ng-enter` and `showtab` directive
- Anuket V. 2.0.2


## 0.0.1 (2017-03-24T17:12:40Z)

### New
- initial packages
- configuration for bower, jshint, csslint
- editor config
- bower config file


## Initial app (2017-03-24T17:07:19Z)

### New
- added **angularJS 1.5.8**
- added **momentJS 2.16.0**
- added **oclazyload 1.0.9**
- added **datatables 1.10.12**
- added **fastclick 1.0.6**

Sistema base para desarrollo de aplicaciones web usando AngularJS. (codename: **Maya**)
