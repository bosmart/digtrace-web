from django.contrib.auth import authenticate
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenViewBase

from ResearchImpact.test_settings import EMAIL_HOST_USER, ANGULAR_PROJECT_ROOT_URL, CHANGE_PASSWORD_ENDPOINT
from digtrace.api.serializers import UserRegistrationSerializer, UserLoginSerializer, PasswordSerializer, \
    EmailSerializer
from digtrace.api.views.api_base_view import BaseResponse, APIBaseView
from user.models import CustomUser


class UserLoginAPIView(TokenViewBase):
    serializer_class = UserLoginSerializer
    token_serializer_class = TokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid(raise_exception=False):
            # authenticating user by valid username and password
            user = authenticate(**serializer.validated_data)

            response_data = {
                "code": status.HTTP_200_OK,
                "message": "User successfully authenticated",
                "id": user.id,
                "username": user.username,
                "token": self.get_token(user)
            }

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            response_data = {
                "code": status.HTTP_401_UNAUTHORIZED,
                "message": "Unauthorized",
                "errors": serializer.errors
            }

            return Response(response_data, status=status.HTTP_401_UNAUTHORIZED)

    def get_token(self, user):
        token = self.token_serializer_class().get_token(user)

        return {
            "refresh": str(token),
            "access": str(token.access_token)
        }


class UserRegistrationAPIView(APIView, BaseResponse):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response()

    def post(self, request):
        registration_serializer = UserRegistrationSerializer(data=request.data)

        if registration_serializer.is_valid():
            user = registration_serializer.create(registration_serializer.validated_data)

            user_data = {
                'id': user.id,
                'name': user.get_full_name(),
                'email': user.email
            }

            response_data = self.response_201_created_with_data(user_data)
        else:
            response_data = self.response_400_bad_request_with_errors(registration_serializer.errors)

        return Response(response_data, response_data['code'])


class ResetPasswordAPIView(APIView, BaseResponse):
    permission_classes = []
    authentication_classes = []
    serializer_class = EmailSerializer

    def post(self, request, *args, **kwargs):
        response_data = self.response_data

        url = ANGULAR_PROJECT_ROOT_URL + CHANGE_PASSWORD_ENDPOINT
        email_serializer = self.serializer_class(data=request.data)

        if email_serializer.is_valid(raise_exception=False):

            recipient_mail = email_serializer.data.get("email", "")
            user, token = self.get_user_and_jwt_token(recipient_mail)

            if user and token:
                # to send the password reset mail
                self.send_reset_password_link(user, recipient_mail, url, token)

                response_data["message"] = "A password reset link successfully sent to your mail."
            else:
                response_data = self.response_400_bad_request_with_errors("No user found with the email address!")
        else:
            response_data = self.response_400_bad_request_with_errors("The email is not valid.")

        return Response(response_data, response_data['code'])

    @staticmethod
    def send_reset_password_link(user, recipient_mail, main_url, token):
        # link = f'<a href="{main_url + token}">click here</a>'
        link = main_url + token

        subject = "Reset Password Mail"
        body = "Dear {name}, you have requested for a reset password link." \
               "Please checkout the link below to reset your password." \
               "\n\nPassword reset link - {link}" \
               " \n\n Thank you for being with us." \
               "\n\n - Digtrace Team".format(name=user.first_name, link=link)

        return send_mail(subject, body, EMAIL_HOST_USER, recipient_list=[recipient_mail], fail_silently=False)

    @staticmethod
    def get_user_and_jwt_token(user_email):
        try:
            user = CustomUser.objects.get(email=user_email)
            token = TokenObtainPairSerializer().get_token(user)
            return user, str(token.access_token)

        except CustomUser.DoesNotExist:
            return False, False


""" ================ Password Change View ================== """


class PasswordUpdateAPIView(APIBaseView):

    def post(self, request, *args, **kwargs):
        user = request.user
        serializer = PasswordSerializer(data=request.data)

        if user and serializer.is_valid(raise_exception=False):
            password = serializer.validated_data['password']
            user.set_password(password)
            user.save()

            response_data = self.response_data
            response_data['message'] = "Password updated successfully"
        else:
            response_data = self.response_400_bad_request_with_errors(
                "The password and retype-password are not same")

        return Response(response_data, response_data['code'])


""" ================ Password Change View ================== """


class UserProfileAPIView(APIBaseView):

    def get(self, request, *args, **kwargs):
        response_data = self.response_data
        response_data['data'] = UserRegistrationSerializer(request.user).data

        return Response(response_data, response_data['code'])

