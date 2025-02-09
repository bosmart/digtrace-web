from django.db import models
from django.contrib.auth import get_user_model
from django.template.defaultfilters import slugify
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill
from django.utils import timezone
from imagekit.models import ProcessedImageField
from PIL import Image
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.db.models.signals import post_save, pre_save
from django.forms.models import model_to_dict
from digtrace.queue_management import JobAssigner, JobProcessor, JobStatusReceiver, JobFilesReceiver, jobDeleteRemote
import os


class UserImagesCollectionManager(models.Manager):

    def create_userImagesCollectionManager(self, user, title, description):
        userImagesCollection = self.create(user=user, title=title, description=description)
        return userImagesCollection


#

class UserImagesCollection(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    title = models.CharField(max_length=128, unique=False)
    description = models.CharField(max_length=500)
    date_uploaded = models.DateTimeField(('date uploaded'), default=timezone.now)
    objects = UserImagesCollectionManager()

    class Meta:
        verbose_name = ('Image project')
        verbose_name_plural = ('Image projects')

    def __str__(self):
        return '%s,date: %s' % (self.title, self.date_uploaded)
    # def __str__(self):
    #     return f'{self.user} prof'


# def get_image_filename(instance, filename):
#     title = instance.post.title #### this is not correct
#     slug = slugify(title)
#     return "post_images/%s-%s" % (slug, filename)

class ImagesManager(models.Manager):
    def create_ImagesManagerManager(self, userImagesCollection, image):
        images = self.create(UserImagesCollection=userImagesCollection, image=image)
        return images

    # def get_queryset(self):
    #     return super(ImagesManager, self).get_queryset().filter(status=True)
#
# def get_thumbnail():
#
#     SIZE = (315, 320)
#
#     im = Image.open(image_path)
#     im.convert('RGB')
#     im.thumbnail(SIZE, Image.ANTIALIAS)
#     im.save(thumb_path, 'JPEG', quality=80)


class Images(models.Model):
    userImagesCollection = models.ForeignKey(UserImagesCollection, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='images/',
                              verbose_name='Image')
    image_thumbnail = ImageSpecField(source='image',
                                     processors=[ResizeToFill(150, 150)],
                                     format='JPEG',
                                     options={'quality': 90})

    status = models.BooleanField(default=True)

    objects = ImagesManager()

    class Meta:
        verbose_name = ('Image')
        verbose_name_plural = ('Images')


#
# @receiver(post_delete, sender=UserImagesCollection)
# def submission_delete(sender, instance, **kwargs):
#     instance.image.delete(False)
#     if instance.image:
#         if os.path.isfile(instance.image.path):
#             os.remove(instance.image.path)


# @receiver(post_delete, sender=Images)
# def submission_delete_images(sender, instance, **kwargs):
#     instance.image.delete(False)
#     if instance.image:
#         if os.path.isfile(instance.image.path):
#             os.remove(instance.image.path)

# instance.image_thumbnail.delete(False)

class JobGroup(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)

    # userImagesCollection = models.ManyToManyField(UserImagesCollection, blank=True,
    #                                               help_text='Hold control and right-click to select mutiple. '
    #                                                         'To unselect also hold control and right-click')


class Job(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)

    job_name = models.CharField(max_length=128, unique=False, help_text='please provide title for this job')
    job_description = models.CharField(max_length=128, unique=False, blank=True)
    job_group = models.ForeignKey(JobGroup, on_delete=models.CASCADE, blank=True, null=True)

    SEQUENTIAL = 'SEQ'
    GLOBAL = 'GLB'

    GEN_MODEL_CHOICES = [
        (SEQUENTIAL, 'Sequential'),
        (GLOBAL, 'Global'),
    ]

    gen_model = models.CharField(
        max_length=3,
        choices=GEN_MODEL_CHOICES,
        default=GLOBAL,
        blank=False,
    )

    force_focal_len_calc = models.BooleanField(default=True, help_text='Calculate focal length even if '
                                                                       'sensor size exists in the database', )
    focal_len = models.CharField(max_length=100, blank=True, help_text='Only if force focal len calculation is false')

    POISSON_RECON = 'PR'
    SSD_RECON = 'SR'

    RECON_CHOICES = [
        (POISSON_RECON, 'PoissonRecon'),
        (SSD_RECON, 'SSDRecon'),
    ]

    surface_recon = models.CharField(
        max_length=2,
        choices=RECON_CHOICES,
        default=POISSON_RECON,
    )
    surface_recon_depth = models.CharField(max_length=5, default='10')

    surface_recon_colour = models.BooleanField(default=True,
                                               help_text='Whether or not to have colour on the surface recon ply')

    # possion recon params
    poisson_recon_degree = models.CharField(max_length=3, default='1', blank=True,
                                            help_text='Only if PoissonRecon is selected')
    poisson_recon_sample_per_node = models.CharField(max_length=3, default='1.0', blank=True,
                                                     help_text='Only if PoissonRecon is selected')
    poisson_recon_density = models.BooleanField(default=False, blank=True,
                                                help_text='Only if PoissonRecon is selected. Select to output density if you wish to trim')

    # SSD recon params
    ssd_recon_degree = models.CharField(max_length=3, default='2', blank=True, help_text='Only if SSDRecon is selected')

    # surface trimmer params
    surface_trim = models.BooleanField(default=False, blank=True,
                                       help_text='Trim surface? Only valid for Poisson reconstruction with density output')
    surface_trim_trim_threshold = models.CharField(max_length=5, default='0.5', blank=True,
                                                   help_text='Only if Surface trim is selected')
    surface_trim_polygon_mesh = models.BooleanField(default=False, blank=True,
                                                    help_text='Only if Surface trim is selected')
    surface_trim_smooth = models.CharField(max_length=5, default='5', blank=True,
                                           help_text='Only if Surface trim is selected')

    ### meta fields of the model
    # user provided
    job_note = models.CharField(max_length=300, blank=True)
    job_submit = models.BooleanField(default=False)
    is_group_job_head = models.BooleanField(default=False)

    JOB_PRORITY_HIGH = 'H'
    JOB_PRORITY_MID = 'M'
    JOB_PRORITY_LOW = 'L'

    JOB_PRORITY_CHOICES = [
        (JOB_PRORITY_HIGH, 'High'),
        (JOB_PRORITY_MID, 'Mid'),
        (JOB_PRORITY_LOW, 'Low'),

    ]

    job_priority = models.CharField(
        max_length=1,
        choices=JOB_PRORITY_CHOICES,
        default=JOB_PRORITY_MID,
    )

    JOB_STATUS_CREATED = '100'  # job created but not submitted

    JOB_STATUS_SUBMITTED = '101'  # submitted but not assigned to the queue
    JOB_STATUS_SENDING = '102'  # sending i.e. processing the job with images to be sent
    JOB_STATUS_SENT = '200'  # sent to generate ply
    JOB_STATUS_SENDING_FAILED = '501'  # sending falied due to not being able to process/ i.e. compress the job
    JOB_STATUS_SENDING_FAILED_RECEIVER = '502'  # sending failed due to issue(s) in the receiving end
    JOB_STATUS_SENT_BUT_CANNOT_INTIATE_PROCESSOR = '503'
    JOB_STATUS_SENT_BUT_CANNOT_CHECK_STATUS = '504'

    JOB_STATUS_PROCESSOR_INITIATED = '201'
    JOB_STATUS_PROCESSOR_INITIATED_IN_Q = '202'
    JOB_STATUS_PROCESSOR_INITIATED_PROCESSING = '203'

    JOB_STATUS_REQUIRES_ADMIN = '300'  # requires admin for the job
    JOB_STATUS_LOCKED = '301'  # job locked
    JOB_STATUS_RETURNED_UNSUCCESSFUL = '601'  # the receiving end has returned the job but it was not successful
    JOB_STATUS_RETURNED_UNKNOWN = '602'  # the receiving end returned unknown code
    JOB_STATUS_RECEIVING_FILES_FAILED = '603'

    JOB_STATUS_TIMEOUT = '701'  # job timed out
    JOB_STATUS_TOO_LARGE = '702'  # the job size is too large to process for the receiver

    JOB_STATUS_SUCCESSFUL = '222'  # job successful
    JOB_STATUS_SUCCESSFUL_PARTIAL = '221'  # not successful in one or more image projects
    JOB_STATUS_RECEIVING_FILES = '223'
    JOB_STATUS_FILE_RECEIVED = '224'

    JOB_STATUS_RESUBMIT = '300'
    JOB_STATUS_CANCEL = '400'
    JOB_STATUS_CANCELED = '401'

    JOB_STATUS_CHOICES = [
        (JOB_STATUS_CREATED, 'job created but not submitted'),
        (JOB_STATUS_SUBMITTED, 'submitted but not assigned to the queue'),
        (JOB_STATUS_SENDING, 'sending i.e. processing the job with images to be sent'),
        (JOB_STATUS_SENT, 'sent to generate ply'),
        (JOB_STATUS_SENDING_FAILED, 'sending falied due to not being able to process i.e. compress the job'),
        (JOB_STATUS_SENDING_FAILED_RECEIVER, 'sending failed due to issue(s) at the receiving end'),
        (JOB_STATUS_SENT_BUT_CANNOT_INTIATE_PROCESSOR, 'Couldn\'t initiated the processor'),
        (JOB_STATUS_SENT_BUT_CANNOT_CHECK_STATUS, 'Cannot check status'),
        (JOB_STATUS_PROCESSOR_INITIATED, 'Initiated the processor or successfully submitted to the queue'),
        (JOB_STATUS_PROCESSOR_INITIATED_IN_Q, 'In the queue'),
        (JOB_STATUS_PROCESSOR_INITIATED_PROCESSING, 'Currently being processed'),

        (JOB_STATUS_REQUIRES_ADMIN, 'requires admin for the job'),
        (JOB_STATUS_LOCKED, 'job locked'),
        (JOB_STATUS_RETURNED_UNSUCCESSFUL, 'the receiving end has returned the job but it was not successful'),
        (JOB_STATUS_RETURNED_UNKNOWN, 'the receiving end returned unknown code'),
        (JOB_STATUS_TIMEOUT, 'job timed out'),
        (JOB_STATUS_TOO_LARGE, 'the job size is too large to process for the receiver'),
        (JOB_STATUS_SUCCESSFUL, 'job successful '),
        (JOB_STATUS_SUCCESSFUL_PARTIAL, 'job successful in one or more'
                                        ' but unsuccessful in one or more image projects'),
        (JOB_STATUS_RECEIVING_FILES, 'job successful'
                                     ' and receiving files'),
        (JOB_STATUS_FILE_RECEIVED, 'job successful'
                                   ' and received files'),
        (JOB_STATUS_RECEIVING_FILES_FAILED, 'job successful'
                                            ' but failed to receive files'),

        (JOB_STATUS_CANCELED, 'job canceled'),
        (JOB_STATUS_RESUBMIT, 'job resubmit with a new instance'),
        (JOB_STATUS_CANCEL, 'job cancel request'),
        (JOB_STATUS_CANCELED, 'job canceled'),

    ]

    job_status = models.CharField(
        max_length=3,
        choices=JOB_STATUS_CHOICES,
        default=JOB_STATUS_CREATED,
        help_text='Danger! Not meant to be modified by the user or admin. '
                  'Admin can only modify only if it is absolutely necessary!'
    )

    userImagesCollection = models.ManyToManyField(UserImagesCollection, blank=True,
                                                  help_text='Hold control and right-click to select mutiple. '
                                                            'To unselect also hold control and right-click')

    # not provided by the user
    job_date_created = models.DateTimeField(('date created'), auto_now_add=True)
    job_date_updated = models.DateTimeField(('date created'), auto_now=True)
    job_queue_number = models.IntegerField(blank=True, null=True)
    job_finished = models.BooleanField(default=False)

    __original_job_submit = None

    objects = models.Manager()

    def __init__(self, *args, **kwargs):
        super(Job, self).__init__(*args, **kwargs)
        self.__original_job_submit = self.job_submit

    def __str__(self):
        return '%s, status: %s' % (self.job_name, self.job_status)

    def clean(self):
        from django.core.exceptions import ValidationError
        # Don't allow draft entries to have a pub_date.
        job_status = int(self.job_status)

        if self.job_submit and not UserImagesCollection.objects.filter(job__id=self.id):
            raise ValidationError('Job \'%s\' requires Image project(s) to submit' % (self.job_name))

        if job_status > 100 and not self.job_submit != self.__original_job_submit:
            raise ValidationError('Job \'%s\' has already been submitted, please check the status of the job'
                                  ' you can also create a new job by copying this \'%s\' job from the menu'
                                  % (self.job_name, self.job_name))
        if self.ssd_recon_degree is not '2' and self.ssd_recon_degree is not '3':
            raise ValidationError('Only SSD recon B-Splines of degree 2 or 3 are '
                                  'supported. You have selected  \'%s\'' % (self.ssd_recon_degree))
        if self.surface_trim and self.surface_recon == 'SR':
            raise ValidationError('Only Poisson reconstruction supports surface trim')
        if self.surface_trim and not self.poisson_recon_density:
            raise ValidationError('Surface trim requires density for Poisson reconstruction')

        # if self.job_submit and not UserImagesCollection.objects.filter(job__id=self.id):
        #     raise ValidationError('Job \'%s\' requires Image project(s) to submit' % (self.job_name))

        # Set the pub_date for published items if it hasn't been set already.

    def update(self, **kwargs):
        for key in kwargs:
            setattr(self, key, kwargs[key])
        return self
    #
    # @staticmethod
    # def post_save(sender, **kwargs):
    #     instance = kwargs.get('instance')
    #     created = kwargs.get('created')
    #     if instance.job_submit:
    #         pass


def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/JobFiles/user_<id>/<filename>
    return 'JobFiles/user_{0}/{1}/{2}'.format(instance.user.id, instance.id, filename)


class JobFileManager(models.Manager):

    def create_jobFile(self, user, job, userImagesCollection, file_name, file):
        jobFile = self.create(user=user, job=job, userImagesCollection=userImagesCollection, file_name=file_name,
                              file=file)
        return jobFile


#

# class JobGroup(models.Model):


class JobFile(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    userImagesCollection = models.ForeignKey(UserImagesCollection, on_delete=models.SET_NULL, null=True)
    file_name = models.CharField(max_length=100)
    file = models.FileField(upload_to='JobFiles/')

    objects = JobFileManager()

    # def filename(self):
    #     return self.file.name + 'test'

    def __str__(self):
        return 'job: %s, file name: %s' % (self.job, self.file_name)

    @property
    def download_url(self):
        print('property callsed')
        try:
            key = self.file.file.key
            headers = None
            response_headers = {
                'response-content-disposition': 'attachment; filename="{}"'.format(self.file_name),
            }
            return key.generate_url(expires_in=120 * 24 * 60 * 60, headers=headers, response_headers=response_headers)
        except AttributeError:
            return self.file.url


@receiver(post_delete, sender=JobFile)
def submission_delete(sender, instance, **kwargs):
    instance.file.delete(False)


class JobMeta(models.Model):
    job = models.OneToOneField(Job, on_delete=models.CASCADE, primary_key=True)
    host_id = models.IntegerField(blank=True, null=True)
    host_job_folder_name = models.CharField(max_length=500, blank=True, null=True)
    host_job_pk = models.IntegerField(blank=True, null=True)
    host_job_queue = models.CharField(max_length=500, blank=True, null=True)

    host_job_status = models.CharField(max_length=500, blank=True, null=True)
    datetime_processing_started = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.job.job_name


def submit_job_signal(sender, instance, **kwargs):
    # if len(instance.userImagesCollection.all()) > 1 and int(instance.job_status) <= 100 and not
    # instance.is_group_job_head: instance.is_group_job_head = True job_group = JobGroup.objects.create(user =
    # instance.user) instance.job_group = job_group instance.save()
    #
    #
    #     # job_group.user = instance.user
    #     job_group.save()
    #     for image_coll in instance.userImagesCollection.all():
    #         obj = Job.objects.get(pk=instance.pk)
    #         obj.pk = None
    #         obj.job_group = job_group
    #         obj.job_name = 'sub_' + obj.job_name
    #         obj.save()
    #         obj.userImagesCollection.add(image_coll)

    if not instance.is_group_job_head:
        if instance.job_submit and int(instance.job_status) <= 100 and not instance.is_group_job_head:

            instance.job_status = '101'
            instance.save()

            try:

                from digtrace.api_setttings import MAX_JOB_ASSIGNER_ALLOWER, MAX_JOB_PROCESSING_CHECKING_ALLOWED
                if JobAssigner.alive_instances <= MAX_JOB_ASSIGNER_ALLOWER:
                    jobAssignerObj = JobAssigner()
                    jobAssignerObj.poke_me_after_job_submitted()
                    del jobAssignerObj
                # from digtrace import api_con

                # object_api_submit_job =  api_con.submitJob(instance)
                # object_api_submit_job.prepare_names_job()
                # object_api_submit_job.open_connections()
                # target_host_connection = object_api_submit_job.get_target_host_connection()
                # object_api_submit_job.transfer_job()
                # object_api_submit_job.insert_to_remote_db()
                #
                # status = object_api_submit_job.check_remote_processor_status()
                #
                # if str(status[0], 'utf').split()[0] == 'idle':
                #     print('idle')
                #
                #
                #
                # instance.job_status = '200'
                #
                #
                # instance.save()

            except:
                instance.job_status = '501'
                instance.save()

            try:
                from digtrace.api_setttings import MAX_JOB_PROCESSING_CHECKING_ALLOWED
                if JobProcessor.alive_instances <= MAX_JOB_PROCESSING_CHECKING_ALLOWED:
                    JobProcessorObj = JobProcessor()
                    JobProcessorObj.request_processor(instance)
                    del JobProcessorObj


            except:
                instance.job_status = '503'
                instance.save()

        if instance.job_status == '201':

            from digtrace.api_setttings import MAX_JOB__STATUS_RECIVER_ALLOWED
            if JobStatusReceiver.alive_instances <= MAX_JOB__STATUS_RECIVER_ALLOWED:
                JobReceiverObj = JobStatusReceiver()
                JobReceiverObj.update_jobs_threaded()
                # del JobReceiverObj

            print('triggered')

        if instance.job_status == '222':

            from digtrace.api_setttings import MAX_JOB_FILE_RECIVER_ALLOWED
            if JobFilesReceiver.alive_instances <= MAX_JOB_FILE_RECIVER_ALLOWED:
                JobFilesReceiverObj = JobFilesReceiver()
                JobFilesReceiverObj.get_job_files_threaded()
                del JobFilesReceiverObj

        if instance.job_status == '224':

            if not jobDeleteRemote.is_alive:
                jobDeleteRemoteObj = jobDeleteRemote()
                jobDeleteRemoteObj.delete_request_threaded()
                del jobDeleteRemoteObj

    #
    #
    #
    #
    #         print('triggered')


# def group_job_pre_signal(sender, instance, **kwargs):
#     instance_temp =  instance
#     if len( instance.UserImagesCollection):
#         for image_coll in instance.UserImagesCollection:
#             Job.objects.create(
#                 instance.
#
#
#             )


post_save.connect(submit_job_signal, sender=Job)
# post_delete.connect(submission_delete_images, sender=Images)
# pre_save.connect(group_job_pre_signal,sender=Job)
