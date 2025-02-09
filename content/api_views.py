from rest_framework.response import Response
from rest_framework.views import APIView

from content.serializers import ContentSerializer
from content.views import ContentBaseView
from digtrace.api.views.api_base_view import BaseResponse


class ContentAPIView(APIView, BaseResponse, ContentBaseView):
    permission_classes = []
    authentication_classes = []

    def get(self, request, *args, **kwargs):
        response_data = self.response_data
        content = self.get_content(kwargs)

        if content:
            response_data['data'] = ContentSerializer(content).data

            return Response(response_data, response_data['code'])

        response_data = self.response_400_bad_request_with_errors("You have given a wrong slug")
        return Response(response_data, response_data['code'])
