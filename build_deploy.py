import os
import socket

main_js = open('angularplyviewer/dist/digtracepro/main.js','r')
counter = 0
content = main_js.readlines()


user_input = input('use default host name/ip for django site host server?: Y/n')

if user_input =='' or 'y' or 'Y':
    user_input = input('use default host name: Y/n')
    if user_input == '' or 'y' or 'Y':
        django_api = socket.gethostname()
        print('using django api for this host name: '+django_api)
    elif user_input == 'n' or 'N':
        host_name = socket.gethostname()
        django_api = socket.gethostbyname(host_name)
        print('using ip for the django site: '+django_api)
elif user_input == 'n' or 'N':
    django_api = input('please enter the ip without http://')


user_input = input('use default host port for Django site host server?: Y/n')
if user_input =='' or 'y' or 'Y':
    django_api_port = '8081'
    print('using django api for this ip: ' + django_api_port)


elif user_input == 'n' or 'N':
    django_api_port = input('enter the port for the django site host server')



if django_api == '' or django_api_port  == '':
    print('did not get ip or port')
    exit(0)


for line in content:
    content[counter] = line.replace('_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].apiUrl', '\'http://'+django_api+':'+django_api_port+ '\'')
    counter = counter+1

# open('angularplyviewer/dist/digtracepro/main.js','w').writelines(content)
