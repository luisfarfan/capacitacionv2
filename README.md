### Installation

Se requiere [python 3.5.3](https://www.python.org/downloads/release/python-353/).

Luego de instalar python3 y asegurarse de colocar el python como variable de entorno, entrar al CMD  y instalar VIRTUALENV:
```sh
$ pip install virtualenv
```

Luego de instalar virtualenv, crear tu entorno virtual:
```sh
$ cd /path/etc/
$ virtualenv env_name
```
Luego, activar tu entorno virtual, entrando a la carpeta donde se creo el entorno:
```sh
$ /path/etc/env_name/Scripts/activate
```

Una vez el entorno virtual este activo, y el proyecto este clonado, entrar a la ruta del proyecto, y en el CMD digitar:

```sh
$ pip install -r requirements.txt
```

Una vez todo instalado, procedemos a levantar el proyecto:
```sh
$ python manage.py [TUIP]:[PUERTO]
```

Y Listo