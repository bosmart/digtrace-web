from django.core.exceptions import ValidationError
from rest_framework import serializers
from digtrace.api.utils import job_status_messages

from digtrace.models import Job, UserImagesCollection, Images, JobMeta
from digtrace.api.serializers import UserImagesCollectionJobDetailsSerializer, ImageSerializer, \
    UserImagesCollectionSimpleSerializer


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = (
            'job_name', 'job_description', 'gen_model', 'userImagesCollection', 'force_focal_len_calc', 'focal_len',
            'surface_recon', 'surface_recon_depth', 'surface_recon_colour',
            'poisson_recon_sample_per_node', 'poisson_recon_density', 'ssd_recon_degree',
            'surface_trim', 'surface_trim_trim_threshold', 'surface_trim_polygon_mesh', 'surface_trim_smooth',
            'job_note', 'job_priority',
        )

    def __init__(self, *args, **kwargs):
        self.instance = kwargs.get('instance', None)
        self.user = kwargs.pop('user', None)

        super(JobSerializer, self).__init__(*args, **kwargs)

    def validate(self, attrs):
        # Image-collections popped from the attributes
        userImagesCollections = attrs.pop('userImagesCollection', None)

        if self.user:
            # assigning the user to attributes
            attrs['user'] = self.user

        if self.instance and not self.user:
            # to execute the model's clean() for validation
            instance = self.instance.update(**attrs)
            instance.clean()
        else:
            instance = Job(**attrs)
            instance.clean()

        # re-assigning the Image-Collections to attributes
        attrs['userImagesCollection'] = userImagesCollections
        return attrs


class JobDataSerializer(serializers.ModelSerializer):
    userImagesCollection = serializers.SerializerMethodField('get_image_collections')

    class Meta:
        model = Job
        fields = (
            'job_name', 'job_description', 'gen_model', 'userImagesCollection', 'force_focal_len_calc', 'focal_len',
            'surface_recon', 'surface_recon_depth', 'surface_recon_colour',
            'poisson_recon_sample_per_node', 'poisson_recon_density', 'ssd_recon_degree',
            'surface_trim', 'surface_trim_trim_threshold', 'surface_trim_polygon_mesh', 'surface_trim_smooth',
            'job_note', 'job_priority',
        )

    @staticmethod
    def get_image_collections(obj):
        # retrieving the job imagesCollection
        job_image_collections = obj.userImagesCollection.all()
        job_image_collections_data = UserImagesCollectionSimpleSerializer(job_image_collections, many=True,
                                                                          add_selected_key=True, selected=True).data

        # retrieving another imageCollections created by the job's user
        another_image_collections = UserImagesCollection.objects.select_related('user').filter(user=obj.user
                                                                        ).exclude(id__in=job_image_collections)
        another_image_collection_data = UserImagesCollectionSimpleSerializer(another_image_collections, many=True,
                                                                             add_selected_key=True).data

        # print(job_image_collections_data)
        # print("\n\n", another_image_collection_data)

        return job_image_collections_data + another_image_collection_data


# class JobListSerializer(serializers.ModelSerializer):
#     userImagesCollection = UserImagesCollectionSerializer(many=True, read_only=True)
#
#     class Meta:
#         model = Job
#         fields = ('job_name', 'job_status', 'job_date_created', 'id', 'userImagesCollection')

class JobMetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobMeta
        fields = ('host_job_status', 'host_job_queue')


class JobDetailsSerializer(serializers.ModelSerializer):
    userImagesCollection = UserImagesCollectionJobDetailsSerializer(many=True, read_only=True)

    class Meta:
        model = Job
        fields = '__all__'

    def to_representation(self, obj):
        data = super(JobDetailsSerializer, self).to_representation(obj)

        try:
            data['job_status_message'] = job_status_messages[obj.job_status]
        except KeyError:
            pass

        try:
            job_meta = obj.jobmeta
            data['job_meta'] = True
            data.update(JobMetaSerializer(job_meta).data)
        except:
            data['job_meta'] = False

        return data


class JobListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ('id', 'job_name', 'job_status', 'job_date_created', 'job_date_updated')

    def to_representation(self, obj):
        data = super(JobListSerializer, self).to_representation(obj)

        # retrieving all imagesCollection id as list
        image_collections_id = obj.userImagesCollection.values_list('id', flat=True)

        # retrieving the images, filtering by the imageCollection id list
        images = Images.objects.select_related('userImagesCollection'
                                               ).filter(userImagesCollection__id__in=image_collections_id)[:12]

        # assigning the images to the serializer data
        data['images'] = ImageSerializer(images, many=True).data

        return data


class AssociateJobListSerializer(serializers.ModelSerializer):
    userImagesCollection = UserImagesCollectionJobDetailsSerializer(many=True, read_only=True)

    class Meta:
        model = Job
        fields = ('id', 'job_name', 'job_status', 'job_date_created', 'job_date_updated', 'userImagesCollection')

    def to_representation(self, obj):
        data = super(AssociateJobListSerializer, self).to_representation(obj)

        try:
            data['job_status_message'] = job_status_messages[obj.job_status]
        except KeyError:
            pass

        return data
