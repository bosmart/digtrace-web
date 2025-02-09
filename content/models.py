from django.db import models


class Content(models.Model):
    slug = models.CharField(max_length=50, default='')
    title = models.CharField(max_length=100)

    def __str__(self):
        return str(self.title)


class ContentPage(models.Model):
    content = models.ForeignKey(Content, on_delete=models.CASCADE, related_name='pages')
    page_number = models.IntegerField(default=1)
    text = models.TextField(null=True, blank=True)

    def __str__(self):
        return f'{self.content.title} - Page-{int(self.page_number)}'

    class Meta:
        ordering = ['page_number']
