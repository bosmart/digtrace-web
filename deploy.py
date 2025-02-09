import os
import socket
import subprocess
import time

deploying_for = 'BU'
image_name_bsl_angularplyviewer = 'nexus.domain.bluestar-software.co.uk:8444/bu/angularplyviewer:1.0.1'
image_name_bsl_sshservice = 'nexus.domain.bluestar-software.co.uk:8444/bu/apidigtrace_ssh_service_ubuntu18.04:latest'
image_name_bsl_web = 'nexus.domain.bluestar-software.co.uk:8444/bu/web:1.0.1'
image_name_bsl_nginx = 'nexus.domain.bluestar-software.co.uk:8444/bu/nginx:1.0.1'
print('DigTraceWeb Test Deployment')

print(
    '!!!Please write a secrete key in the env/.env file and KEEEP IT SECRET!, without this the site will NOT WORK! (only for testing you can input the key in this interactive console app)')


def create_yml():
    image_name_bsl_angularplyviewer = 'nexus.domain.bluestar-software.co.uk:8444/bu/angularplyviewer:1.0.1'
    image_name_bsl_sshservice = 'nexus.domain.bluestar-software.co.uk:8444/bu/apidigtrace_ssh_service_ubuntu18.04:latest'
    image_name_bsl_web = 'nexus.domain.bluestar-software.co.uk:8444/bu/web:1.0.1'
    image_name_bsl_nginx = 'nexus.domain.bluestar-software.co.uk:8444/bu/nginx:1.0.1'
    user_input = ''
    user_input = input('use default image names? Y/n')
    if user_input == 'n' or user_input == 'N':
        image_name_bsl_angularplyviewer = input('write the angularplyviewer image name')
        image_name_bsl_sshservice = input('write the sshservice image name')
        image_name_bsl_web = input('write the web image name')
        image_name_bsl_nginx = input('write the nginx name')

    file_content_bsl = ["version: '2.3'\n", '\n', 'services:\n', '  web:\n', '    restart: always\n', '    env_file:\n',
                        '      - env/.env\n', '    build: .\n',
                        '    image: ' + image_name_bsl_web + '\n',
                        '    command: bash -c "gunicorn ResearchImpact.wsgi:application --bind 0.0.0.0:8000"\n',
                        '    hostname: server\n',
                        '    container_name: researchimpact\n', '    volumes:\n',
                        '      - static_volume:/researchImpact/staticfiles\n',
                        '      - media_volume:/researchImpact/mediafiles\n', '    expose:\n', '      - 8000\n',
                        '    extra_hosts:\n',
                        '      - "dockerhost:172.20.0.1"\n', '  nginx:\n', '    restart: always\n',
                        '    build: ./nginx\n',
                        '    image: ' + image_name_bsl_nginx + '\n',
                        '    volumes:\n', '      - static_volume:/researchImpact/staticfiles\n', '    ports:\n',
                        '      - 8081:80\n',
                        '  sshservice:\n', '    restart: always\n',
                        '    image: ' + image_name_bsl_sshservice + '\n',
                        '    networks:\n', '      default:\n', '        ipv4_address: 172.20.0.5\n', '    volumes:\n',
                        '      - sshservice_jobfiles_volume:/apidigtrace/JobFiles\n',
                        '      - sshservice_db_volume:/apidigtrace/DBMSapi\n',
                        '      - sshservice_lib_volume:/apidigtrace/lib/Unix\n',
                        '    expose:\n', '      - 22\n', '    ports:\n', "      - '2223:22'\n", '  angularplyviewer:\n',
                        '    restart: always\n', '    build: ./angularplyviewer\n', '    env_file:\n',
                        '      - env/.env\n',
                        '    command: /bin/sh -c "sed -i \'s|apiUrl\\:\\"\\"|apiUrl\\:\'\\\'$${DJANGO_URL}\\\'\'|g\' usr/share/nginx/html/main.ad123b683d8027b265c0.js && nginx -g \\"daemon off\\"\\;"\n',
                        '    image: ' + image_name_bsl_angularplyviewer + '\n',
                        '    container_name: angularplyviewer_container\n', '\n', '    expose:\n', '      - 4200\n',
                        '    tty: true\n',
                        '#    entrypoint: entrypoint.sh\n', '    ports:\n', "      - '8082:80'\n", 'networks:\n',
                        '  default:\n',
                        '    ipam:\n', '      driver: default\n', '      config:\n', '      - subnet: 172.20.0.0/16\n',
                        '        gateway: 172.20.0.1\n', 'volumes:\n', '  static_volume:\n', '  media_volume:\n',
                        '  sshservice_jobfiles_volume:\n', '  sshservice_db_volume:\n', '  sshservice_lib_volume:\n',
                        '\n', '\n']
    file_content_bu = ["version: '2.3'\n", '\n', 'services:\n', '  web:\n', '    restart: always\n', '    env_file:\n',
                       '      - env/.env\n', '    build: .\n', '    image: web:develop_bu\n',
                       '    command: bash -c "gunicorn ResearchImpact.wsgi:application --bind 0.0.0.0:8000"\n',
                       '    hostname: server\n',
                       '    container_name: researchimpact\n', '    volumes:\n',
                       '      - static_volume:/researchImpact/staticfiles\n',
                       '      - media_volume:/researchImpact/mediafiles\n', '    expose:\n', '      - 8000\n',
                       '    extra_hosts:\n',
                       '      - "dockerhost:172.20.0.1"\n', '    depends_on:\n', '      - db\n', '    links:\n',
                       '      - db:db\n',
                       '  nginx:\n', '    restart: always\n', '    build: ./nginx\n', '    image: nginx:develop_bu\n',
                       '    volumes:\n',
                       '      - static_volume:/researchImpact/staticfiles\n', '    ports:\n', '      - 8081:80\n',
                       '#    expose:\n',
                       '#      - 1337\n', '  sshservice:\n', '    restart: always\n', '    build: ./apidigtrace\n',
                       '    image: sshservice:develop_bu\n', '    networks:\n', '      default:\n',
                       '        ipv4_address: 172.20.0.5\n',
                       '    volumes:\n', '      - sshservice_jobfiles_volume:/apidigtrace/JobFiles\n',
                       '      - sshservice_db_volume:/apidigtrace/DBMSapi\n',
                       '      - sshservice_lib_volume:/apidigtrace/lib/Unix\n',
                       '    expose:\n', '      - 22\n', '    ports:\n', "      - '2223:22'\n", '  angularplyviewer:\n',
                       '    restart: always\n', '    build: ./angularplyviewer\n',
                       '    image: angular_digtrace:develop_bu\n',
                       '    container_name: angularplyviewer_container\n',
                       '    command: /bin/sh -c "sed -i \'s|apiUrl\\:\\"\\"|apiUrl\\:\'\\\'$${DJANGO_URL}\\\'\'|g\' usr/share/nginx/html/main.ad123b683d8027b265c0.js && nginx -g \\"daemon off\\"\\;"\n',
                       '    env_file:\n', '      - env/.env\n', '#    volumes:\n',
                       '#      - media_volume:/researchImpact/mediafiles\n',
                       '    expose:\n', '      - 4200\n', '    ports:\n', "      - '8082:80'\n", '  db:\n',
                       '    restart: always\n',
                       '    image: postgres\n', '    environment:\n', '      - POSTGRES_PASSWORD:password\n',
                       '      - POSTGRES_HOST_AUTH_METHOD=trust\n', '    volumes:\n',
                       '      - db_data_volume:/var/lib/postgresql/data\n',
                       'networks:\n', '  default:\n', '    ipam:\n', '      driver: default\n', '      config:\n',
                       '      - subnet: 172.20.0.0/16\n', '        gateway: 172.20.0.1\n', 'volumes:\n',
                       '  static_volume:\n',
                       '  media_volume:\n', '  sshservice_jobfiles_volume:\n', '  sshservice_db_volume:\n',
                       '  sshservice_lib_volume:\n',
                       '  db_data_volume:\n', '\n']

    file = open('docker-compose.yml', 'w')

    user_input = input('deploy for Bournemouth University or Bluestar Software Ltd. ? BU/BSL')
    if user_input == 'BU' or user_input == 'bu':
        file.writelines(file_content_bu)
        deploying_for = 'BU'

    elif user_input == 'BSL' or user_input == 'bsl':
        file.writelines(file_content_bsl)
        deploying_for = 'BSL'

    else:
        print('valid options are BU or BSL')
        exit(1)

    file.close()


def create_env():
    if not os.path.isdir('env'):
        os.mkdir('env')
    user_input = input('please enter a secret key (long, complex, unusual)')
    SECRET_KEY = user_input
    user_input = input('run in debug mode (ONLY VALID FOR TEST DEPLOYMENTS)? y/N')
    if user_input == 'y' or user_input == 'Y':
        user_input = ''
        DEBUG = 'TRUE'
    else:
        DEBUG = 'FALSE'

    user_input = input('use default db config? Y/n')
    if user_input == 'y' or user_input == 'Y' or user_input == '':
        user_input = ''
        user_input = input('deploy for Bournemouth University or Bluestar Software Ltd. ? BU/BSL')
        if user_input == 'BU' or user_input == 'bu':
            DB_USER = 'postgres'
            DB_HOST = 'db'
            DB_PORT = '5432'
            DB_PASSWORD = 'password'
            DB_NAME = 'postgres'
        elif user_input == 'BSL' or user_input == 'bsl':
            DB_USER = 'postgres'
            DB_HOST = 'digtracetest'
            DB_PORT = '5432'
            DB_PASSWORD = 'password'
            DB_NAME = 'test'
        else:
            print('valid options are BU or BSL')
            exit(1)
        user_input = ''


    elif user_input == 'n' or user_input == 'N':
        DB_NAME = input('please input db name')
        user_input = ''

        DB_USER = input('please input db user name')
        user_input = ''

        DB_HOST = input('please input db host name')
        user_input = ''

        DB_PORT = input('please input db port')
        user_input = ''

        DB_PASSWORD = input('please input db password')
        user_input = ''

    else:
        print('invalid input!')
        exit(1)
    file_content = ['DEBUG=' + DEBUG + '\n', 'SECRET_KEY=' + SECRET_KEY + '\n',
                    'DB_ENGINE=django.db.backends.postgresql\n', 'DB_NAME=' + DB_NAME + '\n',
                    'DB_USER=' + DB_USER + '\n', 'DB_HOST=' + DB_HOST + '\n', 'DB_PORT=' + DB_PORT + '\n',
                    'DB_PASSWORD=' + DB_PASSWORD + '\n',
                    'HOST1_NAME=172.20.0.5\n', 'HOST1_USER_NAME=root\n', 'HOST1_PASSWORD=akandakanda\n',
                    'HOST1_DIR=/apidigtrace/JobFiles/\n', 'HOST1_MAX_INSTANCES_ALLOWED=1\n', 'HOST1_RETRY=10\n',
                    'HOST1_PYTHON_INTERPRETER=/usr/bin/python3.6\n', 'HOST1_API_PATH=/apidigtrace/\n',
                    'HOST1_PORT=22\n',
                    'NUMBER_OF_RETRY_FOR_SENDING_FAILED_JOBS=5\n',
                    'NUMBER_OF_RETRY_FOR_SENDING_FAILED_DUE_TO_FAILED_RECEIVER_JOBS=5\n',
                    'MAX_JOB_ASSIGNER_ALLOWER=3\n',
                    'MAX_JOB_PROCESSING_CHECKING_ALLOWED=5\n', 'MAX_JOB__STATUS_RECIVER_ALLOWED=5\n',
                    'MAX_JOB_FILE_RECIVER_ALLOWED=1\n', 'JOB_STATUS_CHECK_SLEEP_SEC= 1\n',
                    'DELETION_EVENT_TIME_HOUR=23\n',
                    'DELETION_EVENT_TIME_MINUTE=59\n', 'DELETE_REMOTE_FILES_EXPIRY_PERIOD_SEC=10\n',
                    'DJANGO_URL=\n', 'PLY_VIEWER_URL=\n', 'PLY_VIEWER_URL_IP=\n']

    file = open('env/.env', 'w')
    file.writelines(file_content)
    file.close()


def create_entrypoint():
    print('generating entry point file for web')
    file = open('entrypoint.sh', 'wb')
    content =  [b'#!/bin/sh\n', b'\n', b'if [ "$DATABASE" = "postgres" ]\n', b'then\n', b'    echo "Waiting for postgres..."\n',
     b'\n', b'    while ! nc -z $SQL_HOST $SQL_PORT; do\n', b'      sleep 0.1\n', b'    done\n', b'\n',
     b'    echo "PostgreSQL started"\n', b'fi\n', b'\n', b'exec "$@"']
    file.writelines(content)
    file.close()


user_input = input('generate docker-compose.yml (needed for first time usage)? y/N')
if user_input == 'y' or user_input == 'Y':
    user_input = ''
    print('generating yml file....')
    create_yml()
user_input = input('generate environement file (needed for first time usage)? y/N')
if user_input == 'y' or user_input == 'Y':
    user_input = ''
    print('generating environment file.... (you can also change it directly on the env/.env file)')
    create_env()

user_input = input('generate entrypoint.sh file (needed for first time usage)? y/N')
if user_input == 'y' or user_input == 'Y':
    user_input = ''
    print('generating entrypoint file.... (you can also change it directly on the env/.env file)')
    create_entrypoint()

user_input = input('would you like to build the containers? y/N')
if user_input == 'y' or user_input == 'Y':
    user_input = ''
    user_input = input('build djangosite?  y/N ')
    if user_input == 'y' or user_input == 'Y':
        os.system('docker-compose build web')
    user_input = ''
    user_input = input('build angular frontend site?  y/N ')
    if user_input == 'y' or user_input == 'Y':
        user_input = ''
        os.system('docker-compose build angularplyviewer')
    user_input = ''
    user_input = input('build db?  y/N ')
    if user_input == 'y' or user_input == 'Y':
        user_input = ''
        os.system('docker-compose build db')
    user_input = ''
    user_input = input('build sshservice \(this will take long long... time\)?  y/N ')
    if user_input == 'y' or user_input == 'Y':
        user_input = ''
        print('building sshservice...')
        os.system('docker-compose build sshservice')


user_input = input('would you like to pull the containers? y/N')
if user_input == 'y' or user_input == 'Y':
    print('... replacing docker-compose.yml without build context (the old content is available in the docker-compose-old.yml file)')
    file = open('docker-compose.yml','r')
    contents = file.readlines()
    contents_old = contents

    for i in range(len(contents)-1,-1,-1):
        if 'build' in contents[i]:
            del contents[i]
    file.close()
    open('docker-compose.yml','w').writelines(contents)
    open('docker-compose-old.yml','w').writelines(contents_old)



    user_input = ''
    user_input = input('pull djangosite?  y/N ')
    if user_input == 'y' or user_input == 'Y':
        os.system('docker pull '+image_name_bsl_web)
    user_input = ''
    user_input = input('pull angular frontend site?  y/N ')
    if user_input == 'y' or user_input == 'Y':
        user_input = ''
        os.system('docker pull '+image_name_bsl_angularplyviewer)
    user_input = ''
    user_input = input('pull db?  y/N ')
    if user_input == 'y' or user_input == 'Y':
        user_input = ''
        os.system('docker-compose pull db')
    user_input = ''
    user_input = input('pull sshservice ?  y/N ')
    if user_input == 'y' or user_input == 'Y':
        user_input = ''
        os.system('docker pull '+image_name_bsl_sshservice)


os.system('docker-compose down')

print('starting docker containers ...')
test = subprocess.Popen(["docker-compose", "up", "angularplyviewer"], stdout=subprocess.PIPE)
time.sleep(10)
print('waiting 10 sec for the container to load')
print('Loading main.js file from the angularplyviewer docker container')

dir_path = os.path.dirname(os.path.realpath(__file__))
# if not os.path.isdir(dir_path + '/temp/'):
#     os.mkdir(dir_path + '/temp/')
#
# os.system('docker cp angularplyviewer_container:/usr/share/nginx/html/main.js ' + dir_path + '/temp/')
#
# main_js = open(dir_path + '/temp/main.js', 'r')
# counter = 0
# content = main_js.readlines()
HTTP_django = 'http://'
user_input = input('use 1) HTTP or 2)HTTPS for host name/ip for django site host server?: 1/2')
if user_input == '1':
    HTTP_django = 'http://'
elif user_input == '2':
    HTTP_django = 'https://'

HTTP_angular = 'http://'
user_input = input('use 1) HTTP or 2)HTTPS for host name/ip for angular site host server?: 1/2')
if user_input == '1':
    HTTP_angular = 'http://'
elif user_input == '2':
    HTTP_angular = 'https://'

user_input = input('use default host name/ip for django site host server?: Y/n ')

if user_input == '' or user_input == 'y' or user_input == 'Y':
    user_input = input('use default host name: Y/n ')
    if user_input == '' or user_input == 'y' or user_input == 'Y':
        django_api = socket.gethostname().lower()
        django_api_ip = socket.gethostbyname(django_api)
        print('using django api for this host name: ' + django_api)
    elif user_input == 'n' or user_input == 'N':
        host_name = socket.gethostname().lower()
        django_api = socket.gethostbyname(host_name)
        django_api_ip = django_api
        print('using ip for the django site: ' + django_api)
elif user_input == 'n' or user_input == 'N':
    django_api = input('please enter the ip without http://')

user_input = input('use default host port for Django site host server?: Y/n ')
if user_input == '' or user_input == 'y' or user_input == 'Y':
    django_api_port = '8081'
    print('using django port: ' + django_api_port)


elif user_input == 'n' or user_input == 'N':
    django_api_port = input('enter the port for the django site host server')

if django_api == '' or django_api_port == '':
    print('did not get ip or port')
    exit(0)
#
# for line in content:
#     content[counter] = line.replace('_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].apiUrl',
#                                     '\'http://' + django_api + ':' + django_api_port + '\'')
#     counter = counter + 1
#
# main_js.close()
# open(dir_path + '/temp/main.js', 'w').writelines(content)
# print('moving file to the angularply viewer container')
# os.system('docker cp ' + dir_path + '/temp/main.js ' + 'angularplyviewer_container:/usr/share/nginx/html/main.js')
# print('removing temp file..')
# os.remove(dir_path + '/temp/main.js')
env_file = open(dir_path + '/env/.env', 'r')
counter = 0
content = env_file.readlines()

user_input = input('use default host name/ip for anglarplyviewer host server?: Y/n ')
if user_input == '' or user_input == 'y' or user_input == 'Y':
    user_input = input('use default host name: Y/n ')
    if user_input == '' or user_input == 'y' or user_input == 'Y':
        anglarplyviewer = socket.gethostname().lower()
        print('using anglarplyviewer api for this host name: ' + anglarplyviewer)
    elif user_input == 'n' or user_input == 'N':
        host_name = socket.gethostname().lower()
        anglarplyviewer = socket.gethostbyname(host_name)
        print('using ip for the anglarplyviewer site: ' + anglarplyviewer)
elif user_input == 'n' or user_input == 'N':
    anglarplyviewer = input('please enter the ip without http://')

user_input = input('use default host port for anglarplyviewer site host server?: Y/n ')
if user_input == '' or user_input == 'y' or user_input == 'Y':
    anglarplyviewer_port = '8082'
    print('using anglarplyviewer api port: ' + anglarplyviewer_port)

elif user_input == 'n' or user_input == 'N':
    anglarplyviewer_port = input('enter the port for the anglarplyviewer site host server')

if anglarplyviewer == '' or anglarplyviewer_port == '':
    print('did not get ip or port')
    exit(0)

counter = 0
for line in content:
    if 'PLY_VIEWER_URL' == content[counter].split('=')[0]:
        content[counter] = 'PLY_VIEWER_URL=' + HTTP_angular + anglarplyviewer + ':' + anglarplyviewer_port + '\n'
    if 'DJANGO_URL' == content[counter].split('=')[0]:
        content[counter] = 'DJANGO_URL=' + HTTP_django + django_api + ':' + django_api_port + '\n'
    if 'PLY_VIEWER_URL_IP' == content[counter].split('=')[0]:
        content[counter] = 'PLY_VIEWER_URL_IP=' + django_api_ip + '\n'
    counter = counter + 1

open(dir_path + '/env/.env', 'w').writelines(content)

print('print successfully added env variables...')

print('restarting containers')
os.system('docker-compose down')
test = subprocess.Popen(["docker-compose", "up"], stdout=subprocess.PIPE)
time.sleep(15)
user_input = input('would you like to migrate db (step necessary if built from the source)? y/n')
if user_input == 'y' or user_input == 'Y':
    user_input = input("remove existing volume DB?, this process cannot be undone! y/N")
    if user_input == 'y' or user_input == 'Y':
        os.system('docker volume rm researchimpact_db_data_volume')
        print('restarting containers')
        os.system('docker-compose down')
        test = subprocess.Popen(["docker-compose", "up"], stdout=subprocess.PIPE)
        print('Please wait .....')
        time.sleep(15)

    user_input = input("remove existing DB image?, this process cannot be undone! y/N")
    if user_input == 'y' or user_input == 'Y':
        os.system('docker image rm postgres')
        print('restarting containers.... please wait')
        os.system('docker-compose down')
        test = subprocess.Popen(["docker-compose", "up"], stdout=subprocess.PIPE)
        print('Please wait 2 mins.....')
        time.sleep(120)

    print('migration in progress..... please wait')
    os.system('docker-compose exec web python3 manage.py makemigrations user')
    time.sleep(5)
    os.system('docker-compose exec web python3 manage.py makemigrations digtrace')
    time.sleep(5)
    os.system('docker-compose exec web python3 manage.py migrate')
    time.sleep(5)
user_input = input('would you like to collect static files (step necessary if built from the source)? y/n')
if user_input == 'y' or user_input == 'Y':
    os.system('docker-compose exec web python3 manage.py collectstatic')

user_input = input('would you like to create a superuser? y/n')
if user_input == 'y' or user_input == 'Y':
    os.system('docker-compose exec web python3 manage.py createsuperuser')

print('restarting containers')
os.system('docker-compose down')
os.system('docker-compose up')
