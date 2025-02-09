from django import forms
from content.models import Content, ContentPage


class ContentPageForm(forms.ModelForm):
    class Meta:
        model = ContentPage
        field = ('page_number', 'text')
