from django.contrib.auth import authenticate
from django.core.validators import EmailValidator
from rest_framework import serializers, status
from rest_framework.exceptions import ValidationError

from user.models import CustomUser


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, allow_blank=True)
    username_email = serializers.CharField(max_length=254, required=False, allow_blank=True)
    password = serializers.CharField(required=True)

    def validate(self, attrs):
        username = self.get_absolute_username(attrs)
        password = attrs.get("password", '')

        user = CustomUser.objects.filter(username=username)

        if user.exists():
            user = authenticate(username=username, password=password)

            if not user:
                raise ValidationError({
                    "password": "password doesn't match"
                })
        else:
            raise ValidationError({
                "username_email": "User doesn't exist with this username or email"
            })

        return attrs

    @staticmethod
    def get_absolute_username(attrs):
        username_email = attrs.get('username_email', '').strip()
        username = attrs.get("username", '').strip()

        if username_email != '' and UserLoginSerializer.validateEmail(username_email):
            user = CustomUser.objects.filter(email=username_email)

            if user.exists():
                username = user.first().username
                attrs['username'] = username

        elif username_email != '':
            username = username_email
            attrs['username'] = username

        return username

    @staticmethod
    def validateEmail(email):
        email_validator = EmailValidator()

        try:
            email_validator(email)
            return True
        except:
            return False


class UserRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(allow_blank=True, required=False)
    last_name = serializers.CharField(allow_blank=True, required=False)
    institute = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def create(self, validated_data):
        user = CustomUser(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

    def validate(self, data):
        errors = False

        self.error_messages = {}
        if CustomUser.objects.filter(username=data['username']).exists():
            errors = True
            self.error_messages['username'] = f"'{data['username']}' already exists!"

        if CustomUser.objects.filter(email=data['email']).exists():
            errors = True
            self.error_messages['email'] = f"'{data['email']}' already exists!"

        if errors:
            exception = serializers.ValidationError(self.error_messages)
            exception.status_code = status.HTTP_400_BAD_REQUEST
            raise exception

        return data


class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordSerializer(serializers.Serializer):
    password = serializers.CharField(required=True, max_length=50)
    re_password = serializers.CharField(required=True, max_length=50)

    def validate(self, attrs):
        if attrs['password'] != attrs['re_password']:
            raise ValidationError("Both password are not same.")

        return attrs
