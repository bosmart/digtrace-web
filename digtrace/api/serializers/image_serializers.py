from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from digtrace.models import Images, UserImagesCollection


class ImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField('get_image_url')
    image_thumbnail = serializers.SerializerMethodField('get_image_thumbnail_url')

    class Meta:
        model = Images
        fields = ('id', 'image', 'image_thumbnail')

    @staticmethod
    def get_image_url(obj):
        try:
            return obj.image.url
        except FileNotFoundError:
            return ''

    @staticmethod
    def get_image_thumbnail_url(obj):
        try:
            return obj.image_thumbnail.url
        except FileNotFoundError:
            return ''


class UserImagesCollectionSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField('get_images')

    class Meta:
        model = UserImagesCollection
        fields = ('id', 'title', 'date_uploaded', 'images')

    @staticmethod
    def get_images(obj):
        images = obj.images_set.all()[:12]
        return ImageSerializer(images, many=True).data


class UserImagesCollectionJobDetailsSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField('get_images')

    class Meta:
        model = UserImagesCollection
        fields = ('id', 'title', 'date_uploaded', 'images')

    @staticmethod
    def get_images(obj):
        images = obj.images_set.all()[:6]
        return ImageSerializer(images, many=True).data

    def to_representation(self, instance):
        data = super(UserImagesCollectionJobDetailsSerializer, self).to_representation(instance)
        images = instance.images_set.all()

        if images.count() > 6:
            data['has_more_images'] = True
        else:
            data['has_more_images'] = False

        return data


class UserImagesCollectionDetailsSerializer(UserImagesCollectionSerializer):
    class Meta:
        model = UserImagesCollection
        fields = ('id', 'title', 'description', 'date_uploaded')


class UserImagesCollectionTitleDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserImagesCollection
        fields = ('id', 'title', 'description')


class UserImagesCollectionCreateUpdateSerializer(serializers.ModelSerializer):
    title = serializers.CharField(max_length=128, required=False)
    description = serializers.CharField(max_length=500, required=False)

    class Meta:
        model = UserImagesCollection
        fields = ('title', 'description')

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop("user")
        super(UserImagesCollectionCreateUpdateSerializer, self).__init__(*args, **kwargs)

    # def validate(self, data):
    #     title = data.get('title', '')
    #
    #     if self.instance:
    #         if UserImagesCollection.objects.filter(user=self.user, title=title).exclude(id=self.instance.id).exists():
    #             raise serializers.ValidationError({"title": "Image project with this Title already exists."})
    #     else:
    #         if UserImagesCollection.objects.filter(user=self.user, title=title).exists():
    #             raise serializers.ValidationError({"title": "Image project with this Title already exists."})
    #
    #     return data


class UserImagesCollectionSimpleSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField('get_title')

    class Meta:
        model = UserImagesCollection
        fields = ('id', 'title', 'date_uploaded')

    def __init__(self, *args, **kwargs):

        # selected and add_selected_key added for job update
        self.selected = kwargs.pop('selected', False)
        self.add_selected_key = kwargs.pop('add_selected_key', False)

        super(UserImagesCollectionSimpleSerializer, self).__init__(*args, **kwargs)

    @staticmethod
    def get_title(obj):
        return f"{obj.title}, date: {obj.date_uploaded}"

    def to_representation(self, obj):
        data = super(UserImagesCollectionSimpleSerializer, self).to_representation(obj)

        if self.add_selected_key:

            if self.selected:
                data['selected'] = True
            else:
                data['selected'] = False

        return data
