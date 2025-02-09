from django.urls import path, include
from . import views
from rest_framework import routers
from django.views.generic import TemplateView
from django.conf import settings

from .api import urls

router = routers.DefaultRouter(trailing_slash=False)
# router.register(r'test_api/', views.dimitri_ply_manipulation)
# router.register('localhost:4200', views.JobFilesListView)

urlpatterns = [
    # all api urls included here
    path('api/', include(urls)),

    path('', views.home, name='digtrace-home'),
    path('about/', views.about, name='digtrace-about'),
    # path('image_upload/', views.image_upload, name='digtrace-image_upload'),
    path('images/upload/', views.ImageColCreateView.as_view(), name='digtrace-images-upload'),
    path('images/', views.ImageColListView.as_view(template_name='digtrace/imagesCollectionListPaginated.html'),
         name='digtrace-images'),
    # path('images/<int:pk>/', views.ImageColDetailView.as_view(template_name='digtrace/imagesCollectionDetail.html'),
    #      name='digtrace-images-detail'),
    path('images/<int:pk>/',
         views.ImageColDetailViewPaginated.as_view(template_name='digtrace/imagesCollectionDetailPaginated.html'),
         name='digtrace-images-detail'),
    ##### image show view here
    #
    path('images/render/<int:pk>/',
         views.ImageRenderView.as_view(), name='digtrace-image-render'),
    path('images/render_thumbnail/<int:pk>/',
         views.ImageThumbnailRenderView.as_view(), name='digtrace-image-thumbnail-render'),

    path('images/<int:pk>/update/',
         views.ImageColUpdateMetaInfoUpdate.as_view(template_name='digtrace/imagesMetaUpdate.html'),
         name='digtrace-images-detail-update'),
    path('images/<int:pk>/delete/',
         views.ImageColDeleteView.as_view(template_name='digtrace/imagesConfirmDelete.html'),
         name='digtrace-images-detail-delete'),
    path('images/<int:pk>/images_add/',
         views.ImagesAdd.as_view(),
         name='digtrace-images-add'),
    path('images/image_delete/<int:pk>/',
         views.ImageDeleteView.as_view(template_name='digtrace/imageSingleConfirmDelete.html'),
         name='digtrace-image-delete'),
    path('jobs_create/',
         views.JobCreateView.as_view(template_name='digtrace/jobCreate.html'),
         name='digtrace-job_create'),

    path('jobs_create/<int:pk>/',
         views.JobCreateViewFromImage.as_view(template_name='digtrace/jobCreate.html'),
         name='digtrace-job_create-from_images'),

    path('jobs/',
         views.JobListView.as_view(template_name='digtrace/jobListPaginated.html'),
         name='digtrace-jobs'),
    path('jobs_group/<int:pk>/',
         views.JobListAssociatedView.as_view(template_name='digtrace/jobList.html'),
         name='digtrace-jobs-group'),

    path('jobs/<int:pk>/', views.JobDetailView.as_view(template_name='digtrace/jobDetail.html'),
         name='digtrace-job-detail'),

    path('jobs/<int:pk>/delete/',
         views.JobDeleteView.as_view(template_name='digtrace/jobSingleConfirmDelete.html'), name='digtrace-job-delete'),
    path('jobs/<int:pk>/update/',
         views.JobUpdateView.as_view(template_name='digtrace/jobUpdate.html'), name='digtrace-job-update'),
    path('jobs/<int:pk>/submit/',
         views.JobSubmit.as_view(template_name='digtrace/jobSubmit.html'), name='digtrace-job-submit'),

    path('api/', include(router.urls)),
    path('test_api/', views.RestView.as_view()),
    # path('test_api/', views.dimitri_ply_manipulation)api/get_jobs',APIJobPlyGet
    path('api/get_jobs/', views.APIJobList.as_view()),
    path('api/get_ply_file/', views.APIJobPlyGet.as_view()),

    # path('ply/', views.plyview, name='digtrace-ply'), #TODO: ask dimitri to test
    path('ply/', TemplateView.as_view(template_name="digtrace/iframePLYview.html",
                                      extra_context={'PLY_VIEWER_URL': settings.PLY_VIEWER_URL}), name='digtrace-ply'),
    # TODO: ask dimitri to test

    # path('images/JobFiles/<slug:slug>', views.plyview, name='digtrace-ply-direct-view'),

    # path('ply<path:path>', views.plyview, name='digtrace-ply-direct-view'),

    path('jobs/files/<int:pk>/',
         views.JobFilesListView.as_view(template_name='digtrace/jobFileListPaginated.html'),
         name='digtrace-job-files'),
    path('jobs/files/',
         views.JobFilesListView.as_view(template_name='digtrace/jobFileListPaginated.html'),
         name='digtrace-job-files-all'),
    path('jobs/images/files/<int:pk>',
         views.JobFilesImagesListView.as_view(template_name='digtrace/jobFileList.html'),
         name='digtrace-job-files-images'),

    ####working
    path('jobs/files/<int:pk>/delete/',
         views.JobFileDeleteView.as_view(template_name='digtrace/jobfileSingleConfirmDelete.html'),
         name='digtrace-job-files-delete'),

    # path('jobs/files/<int:pk>',views.PlyRedirectView.as_view(), name='digtrace-ply-redirect'),

    # path('ply/<int:pk>/', views.JobFileDetailView.as_view(template_name='digtrace/iframePLYviewDetail.html'),
    #      name='digtrace-ply-detail-iframe'),

    path('jobs/files/<int:pk>/download/',
         views.JobFileDownloadView.as_view(),
         name='digtrace-job-files-download')

    #
    # path('jobs/<int:pk>/files/',
    #      views.JobFilesListView.as_view(template_name='digtrace/jobFileList.html'),
    #      name='digtrace-job-files'),

    # path('<int:pk>/images_update/', views.UpdateImageColListView.as_view(), name='digtrace-images'),

    # path('signin/', views.signin, name='coreapp-signin'),

]
