# FrontEndBase
Sistema base para desarrollo de aplicaciones web usando AngularJS. (codename: **Maya**)


## Versión estable
Puedes descargar la versión estable del proyecto [por aquí](http://gitlab.geovisor.com.co/Servinformacion/FrontEndBase/repository/archive.zip?ref=master), ó revisa los lanzamientos mas recientes, [por aquí](http://gitlab.geovisor.com.co/Servinformacion/FrontEndBase/tags)


## Listado de Cambios

El listado completo de cambios (changelog), [por aquí](CHANGELOG.md)

## Requisitos
- [nodejs](https://nodejs.org/en/) Version 4.3.1 ó compatible
- [npm](https://www.npmjs.com/) Version 2.14.12 ó compatible
- [Gulp](http://gulpjs.com/) Version 1.2.2 (**CLI**) 3.9.1 ó superior
- [Bower](http://bower.io/) Version  1.8.0 ó superior

Para el desarrollo y construcción se utiliza [**Gulp**](http://gulpjs.com/) y se manejan las dependecias con [**Bower.**](http://bower.io/)
Todo lo anterior se ejecuta sobre **[NodeJS](http://nodejs.org/)**.

Para construir el proyecto con **Gulp** y administrar dependencias con **Bower**. Se necesita lo siguiente:

A fin de utilizar **Gulp** necesitará tener instalado **Node.js**
También asegurese que ha instalado [**NPM**](https://www.npmjs.org/).

Usted puede comprobar si estos están instalados correctamente mediante la apertura de una Terminal (Linux o Mac) o Símbolo del sistema (Windows)
e introduciendo el comando: **node --version** y **npm --version** Estos comandos deben ser algo similar a "**v4.3.1**" y "**2.14.12**", respectivamente, como numero de versiones minima.

Una vez que ha instalado estos programas, usted necesita obtener **Gulp** y **Bower**. Usted puede lograr esto mediante la ejecución de los siguientes comandos:

```sh
$ sudo npm install -g bower gulp-cli
```


## Instalación de este repositorio
Clonar este repositorio y alojarlo en una carpeta conveniente.

    git clone git@gitlab.geovisor.com.co:Servinformacion/FrontEndBase.git


### Instalar dependencias del proyecto
```sh
$ npm install
$ bower install
```


### Construir usando Gulp

```sh
$ gulp build
```


### Iniciar el servidor web

```sh
$ gulp webserver
```

* El comando anterior, ejecutará un servidor web local, disponible en **http://localhost:9876/**

## Cambiar el puerto por defecto
El puerto donde se ejecuta el servidor local es el **9876**, si se desea cambiarlo, ubique el archivo **gulpfile.js** en  **la carpeta raíz del proyecto,** y cambie el valor de la variable **server_port**


> Tenga en cuenta que los comandos anteriores se deben ejecutar desde **la carpeta raíz del proyecto.**


## Despliegue del proyecto

> No olvidar configurar correctamente el archivo **app.yaml** ubicado en **la carpeta raíz del proyecto,** antes de realizar el despliegue.


### Usando gulp

```sh
$ gulp deploy
```


### Desde la linea de comandos

```sh
$ gulp update-yaml update-phpini
$ cd dist
```

```sh
$ appcfg.py update ./
```


## Soporte de curl (PHP)

> Revisar el archivo **php.ini** (si aplica) ubicado en **la carpeta raíz del proyecto.** 

```php
google_app_engine.enable_functions = "phpversion, php_sapi_name, php_uname, getmypid"
google_app_engine.enable_curl_lite = "1"
```


## Acerca de **gulpfile.js**
El archivo **gulpfile.js** ubicado en  **la carpeta raíz del proyecto,** contiene las **tareas** para construir y gestionar el proyecto, asi como un servidor web local para la realizacion de pruebas.


* Editor recomendado [SublimeText 3](http://www.sublimetext.com/3)

Si se está susando  [SublimeText](http://www.sublimetext.com) como editor, puede agregar esta configuracion al archivo **.sublime-project** para mejorar la experiencia de uso del editor.

```json
 {
    "folders":
    [
        {
            "folder_exclude_patterns":
            [
                ".gcloud",
                "node_modules",
                "bower_components",
                "test",
                "dist",
            ]
        }
    ]
 }
```

>*La configuracion anterior exluye de busquedas e indexacion, las carpetas descritas.*


## Estructura del Proyecto (Propuesta)
```text
/
├── bower_components
├── dist
│   ├── css
│   ├── fonts
│   ├── images
│   └── js
│   ├── libs
│   └── views
│   └── index.html
├── node_modules
├── src
│   ├── images
│   ├── js
│   ├── libs
│   ├── partials
│   ├── styles
│   └── views
│   └── index.html
└── test
├── app.yaml
├── bower.json
├── config.json
├── gulpfile.js
├── package.json
├── php.ini
├── README.md
├── vendor.json
├── .gitignore
├── .gcloud
├── .git
```

>Para más información acerca de la estructura aquí propuesta, recomendamos leer la [guía de estilo de desarrollo](gitlab.geovisor.com.co/Servinformacion/Guias-de-estilo-Desarrollo).


## Crear carpetas para el Proyecto (via terminal)

```sh
$ mkdir -pv ./{,src/{images,js,libs,partials,styles,views},test}
$ mkdir -pv ./{,dist/{css,fonts,images,js,libs,shared}}
```


> El folder **Test** se utiliza para archivos de pruebas y adicionalmente el folder **.gcloud** si se usa [Google Cloud Platform](https://cloud.google.com/)


## Como Contribuir
Recomendamos leer la [guía de estilo de desarrollo.](http://gitlab.geovisor.com.co/Servinformacion/Guias-de-estilo-Desarrollo)

Para cualquier duda, comentario, sugerencia ó aporte, dirigete a la seccion de [issues.](http://gitlab.geovisor.com.co/Servinformacion/FrontEndBase/issues)
Antes de abrir un issue nuevo, revisa los ya existentes en busca de una solución (posiblemente ya planteada) para el problema que se te presenta.


# Contacto

> **Carlos Giovanni Parada, Director de Tecnología y Operaciones.**

email: *giovanni [at] servinformacion [dot] com*
