from rest_framework import status
from rest_framework.test import APITestCase, APISimpleTestCase

from .common_methods import *


class TestUserRegistrationAPIView(APITestCase):

    def setUp(self) -> None:
        self.register_url = '/api/user/register/'

        self.register_data = {
            "username": "joyonto",
            "email": "joyonto@gmail.com",
            "first_name": "Jayanta",
            "last_name": "Roy",
            "password": "django123",
            "institute": "Dhaka International University"
        }

    def test_user_registration(self):
        # sending the post request with user information
        response = self.client.post(self.register_url, self.register_data)

        # checking the response
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CustomUser.objects.get(username=self.register_data['username']).email,
                         self.register_data['email'])
        self.assertEqual(response.data['message'], "User has been registered successfully")

    def test_user_registration_failed(self):
        # creating user before sending the request
        create_user(self.register_data)

        # sending post request with exist user information
        response = self.client.post(self.register_url, self.register_data)

        # checking the status code and data
        self.assertEqual(response.status_code, status.HTTP_406_NOT_ACCEPTABLE)


class TestUserLoginAPIVIew(APITestCase):

    def setUp(self) -> None:
        self.login_url = '/api/user/login/'

        self.login_credential = {
            "username": "joyonto",
            "password": "django123"
        }

        user_info = {
            "username": "joyonto",
            "email": "joyonto@gmail.com",
            "first_name": "Jayanta",
            "last_name": "Roy",
            "password": "django123",
            "institute": "Dhaka International University"
        }

        # creating user
        create_user(user_info)

    def test_user_login_success(self):
        # sending post request to the login url
        response = self.client.post(self.login_url, self.login_credential)

        # checking the response status and data
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue({'status', 'message', 'token'} <= response.data.keys())
        self.assertTrue({'refresh', 'access'} <= response.data['token'].keys())

    def test_user_login_failed(self):
        # sending post request to the login url
        response = self.client.post(self.login_url, {"username": None, "password": None})

        # checking the response code and data
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['message'], "User not found!")

