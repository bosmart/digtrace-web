from user.models import CustomUser


def create_user(data):
    # creating user
    user = CustomUser.objects.create(**data)
    user.set_password(data['password'])
    user.save()
