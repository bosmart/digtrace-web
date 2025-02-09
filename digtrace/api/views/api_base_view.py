import abc
from requests import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication


class BaseResponse:
    """ All response codes are added here as property and static method """

    @property
    def response_data(self):
        return {
            "code": status.HTTP_200_OK,
            "message": "Success",
            "errors": None,
            "total_items": None,
            "total_page_count": None,
            "current_page_number": None,
            "previous_page": None,
            "next_page": None,
            "data": []
        }

    @property
    def response_204_no_content(self):
        response_data = self.response_data

        response_data.update({
            "code": status.HTTP_204_NO_CONTENT,
            "message": "NO CONTENT"
        })

        return response_data

    @property
    def response_203_non_authoritative_information(self):
        response_data = self.response_data

        response_data.update({
            'code': status.HTTP_203_NON_AUTHORITATIVE_INFORMATION,
            'message': "NON AUTHORITATIVE INFORMATION",
        })

        return response_data

    @property
    def response_403_forbidden(self):
        response_data = self.response_data

        response_data.update({
            "code": status.HTTP_403_FORBIDDEN,
            "message": "FORBIDDEN",
            "errors": ["Permission Denied"]
        })

        return response_data

    @staticmethod
    def response_201_created_with_data(data):
        response_data = BaseResponse().response_data

        response_data.update({
            'code': status.HTTP_201_CREATED,
            'message': "CREATED",
            'data': data
        })

        return response_data

    @staticmethod
    def response_400_bad_request_with_errors(errors):
        response_data = BaseResponse().response_data
        response_data.update({
            "code": status.HTTP_400_BAD_REQUEST,
            "message": "BAD REQUEST",
            "errors": errors,
        })

        response_data = BaseResponse.check_data_and_append(response_data, errors)

        return response_data

    @staticmethod
    def response_404_not_found_with_errors(errors):
        response_data = BaseResponse().response_data

        response_data.update({
            "code": status.HTTP_404_NOT_FOUND,
            "message": "NOT FOUND",
            "errors": errors,
        })

        response_data = BaseResponse.check_data_and_append(response_data, errors)

        return response_data

    @staticmethod
    def check_data_and_append(response_data, errors):

        if isinstance(errors, dict):
            response_data["errors"] = errors

        elif not isinstance(errors, list):
            response_data["errors"] = [errors]

        return response_data


""" ======================   API Base View   ========================= """


class APIBaseView(APIView, BaseResponse):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)

    # context = {
    #     "code": status.HTTP_200_OK,
    #     "message": "Success",
    #     "errors": None,
    #     "total_items": None,
    #     "total_page_count": None,
    #     "current_page_number": None,
    #     "previous_page": None,
    #     "next_page": None,
    #     "data": None
    # }

    def get(self, request, *args, **kwargs):
        return Response()

    def post(self, request):
        pass

    def put(self, request):
        pass

    def delete(self, request):
        pass

    @staticmethod
    def normalize_errors(errors):
        normalize_errors = []

        if 'non_field_errors' in errors.keys():
            for error in errors['non_field_errors']:
                normalize_errors.append(error)
        else:
            return errors
        return normalize_errors
