"""ResearchImpact URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from user import views as user_views
from user import login as user_login_views
from django.contrib.auth import views as auth_views
from django.conf import settings
from django.conf.urls.static import static
# from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token
from django.views.generic import TemplateView
from rest_framework_simplejwt import views as jwt_views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('digtrace.urls')),
    path('register/', user_views.register, name='register'),
    path('login/', user_login_views.LoginView.as_view(template_name='user/login.html'), name='login'),
    path('confirm_logout/', TemplateView.as_view(template_name='user/logout_confirmation.html'), name='pre_logout'),

    path('logout/', auth_views.LogoutView.as_view(template_name='user/logout.html'), name='logout'),
    path('profile/', user_views.profile, name='profile'),

    path('api-token-auth/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api-token-refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # path('api-token-auth/', obtain_jwt_token, name='token_obtain_pair'),
    # path('api-token-refresh/', refresh_jwt_token, name='token_refresh'),
    # path('api-token-auth/', obtain_jwt_token),
    # path('api-token-refresh/', refresh_jwt_token),

    # content urls
    path('digtrace/', include('content.urls')),
]
#
if settings.DEBUG:
    # TODO: only for development, use https://docs.djangoproject.com/en/2.2/howto/static-files/ for deployment
    urlpatterns += [
                       # ... the rest of your URLconf goes here ...
                   ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    #
    urlpatterns += [
                       # ... the rest of your URLconf goes here ...
                   ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
