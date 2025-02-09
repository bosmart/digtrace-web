from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
import unicodedata
from django.utils.text import capfirst
from django.contrib.auth import (
    authenticate, get_user_model, password_validation,
)
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from user.models import CustomUser

UserModel = get_user_model()


def validateEmail(email):
    try:
        validate_email(email)
        return True
    except ValidationError:
        return False


class UsernameField(forms.CharField):
    def to_python(self, value):
        return unicodedata.normalize('NFKC', super().to_python(value))

    def widget_attrs(self, widget):
        attrs = super().widget_attrs(widget)
        attrs['autocapitalize'] = 'none'
        return attrs


class EmailField(forms.CharField):
    def to_python(self, value):
        return unicodedata.normalize('NFKC', super().to_python(value))

    def widget_attrs(self, widget):
        attrs = super().widget_attrs(widget)
        attrs['autocapitalize'] = 'none'
        return attrs


class UsernameEmailField(forms.CharField):
    def to_python(self, value):
        return unicodedata.normalize('NFKC', super().to_python(value))

    def widget_attrs(self, widget):
        attrs = super().widget_attrs(widget)
        attrs['label'] = ('Username/label')
        attrs['autocapitalize'] = 'none'

        return attrs


class UserCreationForm(forms.ModelForm):
    # A form for creating new users. Includes all the required
    # fields, plus a repeated password.
    """
       A form that creates a user, with no privileges, from the given username and
       password.
       """
    error_messages = {
        'password_mismatch': ("The two password fields didn't match."),
    }
    password1 = forms.CharField(
        label=("Password"),
        strip=False,
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}),
        help_text=password_validation.password_validators_help_text_html(),
    )
    password2 = forms.CharField(
        label=("Password confirmation"),
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}),
        strip=False,
        help_text=("Enter the same password as before, for verification."),
    )

    class Meta:
        model = CustomUser
        fields = ("username", "email", 'institute', 'first_name', 'last_name',)
        field_classes = {'username': UsernameField, 'email': EmailField}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self._meta.model.USERNAME_FIELD in self.fields:
            self.fields[self._meta.model.USERNAME_FIELD].widget.attrs.update({
                'autocomplete': 'username',
                'autofocus': True,
            })
        if self._meta.model.EMAIL_FIELD in self.fields:
            self.fields[self._meta.model.EMAIL_FIELD].widget.attrs.update({
                'autocomplete': 'email',
                'autofocus': True,
            })

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError(
                self.error_messages['password_mismatch'],
                code='password_mismatch',
            )
        return password2

    def _post_clean(self):
        super()._post_clean()
        # Validate the password after self.instance is updated with form data
        # by super().
        password = self.cleaned_data.get('password2')
        if password:
            try:
                password_validation.validate_password(password, self.instance)
            except forms.ValidationError as error:
                self.add_error('password2', error)

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField(
        label=("Password"),
        help_text=(
            "Raw passwords are not stored, so there is no way to see this "
            "user's password, but you can change the password using "
            "<a href=\"{}\">this form</a>."
        ),
    )

    class Meta:
        model = CustomUser
        fields = '__all__'
        field_classes = {'username': UsernameField}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        password = self.fields.get('password')
        if password:
            password.help_text = password.help_text.format('../password/')
        user_permissions = self.fields.get('user_permissions')
        if user_permissions:
            user_permissions.queryset = user_permissions.queryset.select_related('content_type')

    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the
        # field does not have access to the initial value
        return self.initial.get('password')


class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('email', 'is_active', 'is_staff')
    list_filter = ('email',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_staff',)}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2')}
         ),
    )
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()


class AuthenticationForm(forms.Form):
    """
    Base class for authenticating users. Extend this to get a form that accepts
    username/password logins.
    """
    username_email = UsernameEmailField(label=("Username/Email"), widget=forms.TextInput(
        attrs={'autocomplete': 'username/email', 'autofocus': True}))

    password = forms.CharField(
        label=("Password"),
        strip=False,
        widget=forms.PasswordInput(attrs={'autocomplete': 'current-password'}),
    )

    error_messages = {
        'invalid_login': (
            "Please enter a correct username or email and password. Note that both "
            "fields may be case-sensitive."
        ),
        'inactive': ("This account is inactive."),
    }

    def __init__(self, request=None, *args, **kwargs):
        """
        The 'request' parameter is set for custom auth use by subclasses.
        The form data comes in via the standard 'data' kwarg.
        """
        self.request = request
        self.user_cache = None
        super().__init__(*args, **kwargs)

        # Set the max length and label for the "username" field.
        self.username_field = UserModel._meta.get_field(UserModel.USERNAME_FIELD)
        self.email_field = UserModel._meta.get_field(UserModel.EMAIL_FIELD)

        self.fields['username_email'].max_length = self.username_field.max_length or 254
        if self.fields['username_email'].label is None:
            self.fields['username_email'].label = capfirst(self.username_field.verbose_name)

    def clean(self):
        username_email = self.cleaned_data.get('username_email')
        password = self.cleaned_data.get('password')

        if username_email is not None and password:
            if validateEmail(username_email):
                self.user_cache = authenticate(self.request, email=username_email, password=password)
            else:
                self.user_cache = authenticate(self.request, username=username_email, password=password)

            if self.user_cache is None:
                raise self.get_invalid_login_error()
            else:
                self.confirm_login_allowed(self.user_cache)

        return self.cleaned_data

    def confirm_login_allowed(self, user):
        """
        Controls whether the given User may log in. This is a policy setting,
        independent of end-user authentication. This default behavior is to
        allow login by active users, and reject login by inactive users.
        If the given user cannot log in, this method should raise a
        ``forms.ValidationError``.
        If the given user may log in, this method should return None.
        """
        if not user.is_active:
            raise forms.ValidationError(
                self.error_messages['inactive'],
                code='inactive',
            )

    def get_user(self):
        return self.user_cache

    def get_invalid_login_error(self):
        return forms.ValidationError(
            self.error_messages['invalid_login'],
            code='invalid_login',
            params={'username': self.username_field.verbose_name},
        )
