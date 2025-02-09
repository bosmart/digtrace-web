from rest_framework import serializers

from content.models import Content, ContentPage


class ContentPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentPage
        fields = ('page_number', 'text')


class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content
        fields = ('slug', 'title')

    def to_representation(self, instance):
        data = super(ContentSerializer, self).to_representation(instance)
        pages = instance.pages.all()

        data.update({
            "total_page": len(pages),
            "pages": ContentPageSerializer(pages, many=True).data,
        })

        return data
