# Digtrace 
###### To run this project on development mode

### clone this repository 

`git clone https://github.com/muniminvento/digtrace_marcin.git`

### install python3.6 if not exist
```
sudo add-apt-repository ppa:jonathonf/python-3.6
sudo apt-get update
sudo apt-get install python3.6
```
### Install dependencies
```
sudo apt-get install python3-dev
sudo apt-get install libffi6 libffi-dev
```

### Install virtualenv

`sudo apt install virtualenv`

### create virtual venv

`virtualenv venv -p python3.6`

### Activate virtual environment

`source venv/bin/activate`

### Go to the project directory
`cd digtrace_marcin/`

### Install requirements

`pip install -r requirements.txt`


### Create Postgres Database and Migrate

`python manage.py migrate`

### Create superuser

`python manage.py createsuperuser`


### Finally, run the project

`python manage.py runserver`

#
# Dockerization of Digtrace

#### If Docker doesn't exist on your machine, you can follow the [Digital Ocean's tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04) to install docker. 

### Clone the repository
$ ```git clone https://github.com/muniminvento/digtrace_marcin.git```

### Go to the project directory.

$ ```cd digtrace_marcin/```

#### Before running the docker commands, please update the following ip addresses according to your host ip address on .env file.
```
DJANGO_URL=http://127.0.0.1:8081
PLY_VIEWER_URL=http://127.0.0.1:8082
PLY_VIEWER_URL_IP=127.0.0.1
```

### The services included on docker-compose.yml-
``` 
web                       //django backend
angularplyviewer          //angular frontend
sshservice                //ML ply generator.
postgres
nginx
```

### SSHService
##### At first, you have to run the 'sshservice'. So, please download the '[sshservice.zip](https://drive.google.com/file/d/10uLNgK2zFlocC_lin1l79c879EnPDC4E/view)' file and try the following commands -
##### After downloading the file, unzip it.
$ ```unzip sshservice.zip```   `// you will get a sshservice.tar file`
##### Then load the sshservice
$ ```docker load < sshservice.tar```

##### If you are in another directory, please go to the project directory again where the `docker-compose.yml` file exists and run the following command -

$ ```docker-compose up -d sshservice```


##### After running the ssshservice, you must have to run the following commands -

$ ```docker-compose exec sshservice bash -c "cp -a /clibsources/PoissonRecon/Bin/Linux/. /apidigtrace/lib/Unix/"```

$ ```docker-compose exec sshservice bash -c "cp -a /clibsources/CMVS-PMVS/OutputLinux/main/. /apidigtrace/lib/Unix/"```

$ ```docker-compose exec sshservice bash -c "cp -a /clibsources/openMVG/openMVG_Build/Linux-x86_64-RELEASE/. /apidigtrace/lib/Unix/"```

$ ```docker-compose exec sshservice bash -c "python3 /apidigtrace/DBMSapi/intial_status_or_update_as_idle.py"```

### To run the other services -
```
docker-compose up web                
docker-compose up angularplyviewer
```
##### Press Ctrl+C to stop the process and run again with detach mode.
```
docker-compose up -d web                
docker-compose up -d angularplyviewer
```
#### To run all the services by a single command, try -
$ ```docker-compose up -d```

### To visit the sites on browser -
```
http://<host_ip_address>:8081  // Django-Backend
http://<host_ip_address>:8082  // Angular Ply Viewer
```
### Admin Credentials -
```
http://<host_ip_address>:8081/admin/

username: admin
password: digtrace321#
```

#
### Extra Commands

#### To run with detach mode add '-d'
$ ```docker-compose up -d```

#### To run a particular service
$ ```docker-compose up <service_name>` or `docker-compose up -d <service_name>```

#### To check the running containers
$ ```docker ps` or `docker container ls```

#### To stop and remove all containers 
$ ```docker-compose down``` `//for all the services included on docker-compose.yml`

#### To stop a particular container
$ ```docker container stop <container_id>```
#### To start a particular container
$ ```docker container start <container_id>```