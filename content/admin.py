from django.contrib import admin

from content.models import Content, ContentPage

admin.site.register([Content, ContentPage])
