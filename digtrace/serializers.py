from .models import Job, UserImagesCollection
from rest_framework import serializers


class UserImagesCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserImagesCollection
        fields = ('id', 'title', 'date_uploaded')


class JobListSerializer(serializers.ModelSerializer):
    userImagesCollection = UserImagesCollectionSerializer(many=True, read_only=True)

    class Meta:
        model = Job
        fields = ('job_name', 'job_status', 'job_date_created', 'id', 'userImagesCollection')


#
# class QuestionDetailPageSerializer(serializers.ModelSerializer):
#     was_published_recently = serializers.BooleanField(read_only=True)
#     choice_set = QuestionChoiceSerializer(read_only=True, many=True)
#
#     class Meta:
#         model = Job
#         fields = '__all__'

class FileSerializer(serializers.Serializer):
    file = serializers.FileField()
