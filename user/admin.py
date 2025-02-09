from django.contrib import admin

# Register your models here.

from django.contrib import admin
from django.contrib.auth.models import Group

from user.form import UserAdmin
from user.models import CustomUser

# Now register the new UserAdmin...
admin.site.register(CustomUser, UserAdmin)
# ... and, since we're not using Django's built-in permissions,
# unregister the Group model from admin.
admin.site.unregister(Group)
