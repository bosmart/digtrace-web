from sys import stdout

from django.core.management.base import BaseCommand
from content.models import Content, ContentPage


class Command(BaseCommand):
    help = 'Create all contents'

    def handle(self, *args, **kwargs):
        contents = {
            "about": "About",
            "terms-conditions": "Terms and Conditions",
            "privacy-policy": "Privacy & Policy",
            "contacts": "Contacts"
        }

        for slug, title in contents.items():
            content = self.create_content(self, slug, title)
            self.create_first_page(self, content)

        self.stdout.write(self.style.SUCCESS("\n\nAll Contents Created Successfully"))

    @staticmethod
    def create_content(self_, slug, title):
        try:
            content = Content.objects.get(slug=slug)
            stdout.write(self_.style.SUCCESS(f"\n\n\"{content.title}\" already created."))

        except Content.DoesNotExist:
            content = Content.objects.create(slug=slug, title=title)
            stdout.write(self_.style.SUCCESS(f"\n\n\"{content.title}\" created successfully."))

        return content

    @staticmethod
    def create_first_page(self_, content):
        try:
            page = ContentPage.objects.get(content=content, page_number=1)
            stdout.write(self_.style.SUCCESS(f"\nFirst Page of \"{content.title}\" already created"))

        except ContentPage.DoesNotExist:
            content_text = f"<h1>This is {content.title} page. </h1> \n\n <h6>Please, replace the text with exact " \
                           f"text.</h6> "
            ContentPage.objects.create(content=content, page_number=1, text=content_text)
            stdout.write(self_.style.SUCCESS(f"\nFirst Page of \"{content.title}\" created successfully"))
