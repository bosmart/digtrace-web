#!/bin/bash

#if [ "$DATABASE" = "postgres" ]
#then
#    echo "Waiting for postgres..."
#
#    while ! nc -z $SQL_HOST $SQL_PORT; do
#      sleep 0.1
#    done
#
#    echo "PostgreSQL started"
#fi
python manage.py makemigrations user
python manage.py makemigrations digtrace
python manage.py makemigrations content
python manage.py migrate
python manage.py collectstatic --no-input
python manage.py createadmin
python manage.py createcontents

exec "$@"
