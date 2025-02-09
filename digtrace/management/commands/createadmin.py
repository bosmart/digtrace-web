from sys import stdout

from django.core.management.base import BaseCommand
from content.models import Content, ContentPage
from user.models import CustomUser


class Command(BaseCommand):
    help = 'Create Admin'

    def handle(self, *args, **kwargs):
        admin_data = {
            "username": "admin",
            "email": "admin@gmail.com",
            "password": "digtrace321#",
            "first_name": "Admin",
            "last_name": "Admin",
            "institute": "Digtrace"
        }

        if not CustomUser.objects.filter(username='admin').exists():
            CustomUser.objects.create_superuser(**admin_data)
            self.stdout.write(self.style.SUCCESS("\n\nAdmin Created Successfully"))
        else:
            self.stdout.write(self.style.SUCCESS("\n\nAdmin Already Created"))