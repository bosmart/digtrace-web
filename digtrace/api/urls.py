from django.urls import path
from digtrace.api.views import *
from digtrace.api.views.job_views import *

urlpatterns = [
    # User Login and Registration API
    path('user/login/', UserLoginAPIView.as_view()),
    path('user/register/', UserRegistrationAPIView.as_view()),
    path('user/reset-password/', ResetPasswordAPIView.as_view()),
    path('user/change-password/', PasswordUpdateAPIView.as_view()),
    path('user/profile/', UserProfileAPIView.as_view()),

    # Job API
    path('job/list/', JobListAPIView.as_view()),
    path('job/create/', JobCreateAPIView.as_view()),
    path('job/<int:job_id>/details/', JobDetailsAPIView.as_view()),
    path('job/<int:job_id>/update/', JobUpdateAPIView.as_view()),
    path('job/<int:job_id>/delete/', JobDeleteAPIView.as_view()),
    path('job/<int:job_id>/submit/', JobSubmitAPIView.as_view()),
    path('job/<int:job_id>/group-jobs/', AssociateJobListAPIView.as_view()),

    # Image Collection CRUD API
    path('image-collection/list/', ImageCollectionListAPIView.as_view()),
    path('image-collection/create/', ImagesCollectionCreateAPIView.as_view()),
    path('image-collection/<int:image_collection_id>/update/', ImageCollectionUpdateAPIView.as_view()),
    path('image-collection/<int:image_collection_id>/details/', ImageCollectionDetailsAPIView.as_view()),
    path('image-collection/<int:image_collection_id>/delete/', ImageCollectionDeleteAPIView.as_view()),

    # Image API URLs
    path('image-collection/<int:image_collection_id>/image/add/', ImageAddAPIView.as_view()),
    path('image-collection/image/<int:image_id>/delete/', ImageDeleteAPIView.as_view()),

    # PLY File API URLs
    path('ply-file/<int:file_id>/download/', PLYFileDownloadAPIView.as_view())
]
