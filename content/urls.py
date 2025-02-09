from django.urls import path

from content.api_views import ContentAPIView
from content.views import ContentView, ContentUpdateView, ContentPageAddView, ContentPageDeleteView

urlpatterns = [
    path('<str:content_slug>/', ContentView.as_view(), name='content_view'),
    path('<str:content_slug>/add-page/', ContentPageAddView.as_view(), name='content_page_add'),
    path('<str:content_slug>/page/<int:page_number>/update/', ContentUpdateView.as_view(), name='content_update'),
    path('<str:content_slug>/page/<int:page_number>/delete/', ContentPageDeleteView.as_view(), name='content_delete'),

    # API views
    path('api/<str:content_slug>/', ContentAPIView.as_view(), name='content_api_view')
    # path('page/add/', ContentPageAddView.as_view(), name='content_create_updated'),
    # path('page/<int:page_number>/update/', ContentPageUpdateView.as_view(), name='content_create_updated'),
]