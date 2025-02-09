from django.contrib import admin
from .models import Images, UserImagesCollection, Job, JobMeta, JobFile, JobGroup

admin.site.register(Images)
admin.site.register(UserImagesCollection)
admin.site.register(Job)
admin.site.register(JobMeta)
admin.site.register(JobFile)
admin.site.register(JobGroup)

# Register your models here.
