from django.shortcuts import render
from django.forms import modelformset_factory
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import HttpResponseRedirect, JsonResponse, StreamingHttpResponse
from rest_framework.parsers import JSONParser
from rest_framework.decorators import parser_classes, permission_classes
from rest_framework import permissions
from django.views.decorators.csrf import csrf_exempt, csrf_protect
import os
from rest_framework import generics

from rest_framework.decorators import authentication_classes
from django.http import HttpResponseForbidden
from django.core import paginator
import sys
from django.core.files.uploadhandler import FileUploadHandler, MemoryFileUploadHandler, TemporaryFileUploadHandler
from django.core.exceptions import ValidationError
from django.utils import timezone
import uuid
from django.views.generic.list import MultipleObjectMixin
from .form import ImagesForm, ImagesMetaInfoUpdateForm, ImagesAddForm, JobForm
from .models import UserImagesCollection, Images, Job, JobFile, JobMeta, JobGroup
from django.views.generic.edit import FormView
from django.views.generic import ListView, DetailView, View
from django.views.generic.edit import UpdateView, DeleteView, CreateView
from django.urls import reverse, reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic.base import TemplateResponseMixin
from django.contrib.auth import REDIRECT_FIELD_NAME, login
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import redirect
from django.contrib.postgres.search import SearchVector
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.utils import json
from django.http import HttpResponse
from django.utils.text import slugify
import os
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from digtrace.ply_maipulation import rotate90, autoRotateCreatePanel, interpolate, interpolate3D, autoRotate, mirror, \
    depthChart, contour, statistics
# from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework import viewsets, permissions
from .serializers import JobListSerializer, FileSerializer
from django.utils.encoding import smart_bytes, smart_str
from django.http import FileResponse
from rest_framework import viewsets, renderers
from rest_framework.decorators import action
# Create your views here.
from django.http import Http404


def plyview(request, path=''):
    return render(request, 'digtrace/plyview.html')


def home(request):
    return render(request, 'digtrace/home.html')


def about(request):
    return render(request, 'digtrace/about.html')


# @login_required
# def image_upload(request):
#     ImageFormSet = modelformset_factory(Images,
#                                         form=ImageForm, extra=2)
#     # 'extra' means the number of photos that you can upload   ^
#     if request.method == 'POST':
#
#         userImagesCollectionForm = UserImagesCollectionForm(request.POST)
#         formset = ImageFormSet(request.POST, request.FILES,
#                                queryset=Images.objects.none())
#
#         if userImagesCollectionForm.is_valid() and formset.is_valid():
#             userImagesCollectionForm_form = userImagesCollectionForm.save(commit=False)
#             userImagesCollectionForm_form.user = request.user
#             userImagesCollectionForm_form.save()
#
#             for form in formset.cleaned_data:
#                 # this helps to not crash if the user
#                 # do not upload all the photos
#                 if form:
#                     image = form['image']
#                     photo = Images(post=userImagesCollectionForm_form, image=image)
#                     photo.save()
#             messages.success(request, "Yeeew, check it out on the home page!")
#             return HttpResponseRedirect("/")
#         else:
#             print(userImagesCollectionForm.errors, formset.errors)
#     else:
#         userImagesCollectionForm = UserImagesCollectionForm()
#         formset = ImageFormSet(queryset=Images.objects.none())
#     return render(request, 'digtrace/imageUpload.html',
#                   {'userImagesCollectionForm': userImagesCollectionForm, 'formset': formset})
#
# def my_view_1(request):
#     # replace upload handlers. This depends on FILE_UPLOAD_HANDLERS setting. Below code handles the default in Django 1.10
#     request.upload_handlers = [CustomMemoryFileUploadHandler(request), CustomTemporaryFileUploadHandler(request)]
#     return ImageColCreateView(request)
class ImageValidate:
    def __init__(self):
        pass

    def are_valid_images(self, images):
        try:
            from PIL import Image
            from PIL import JpegImagePlugin
            JpegImagePlugin._getmp = lambda x: None
        except ImportError:
            print('import error', sys.exc_info()[0])
            raise
        for im in images:
            try:
                img = Image.open(im)
                if img.format not in ('BMP', 'PNG', 'JPEG'):
                    return {'valid': False, 'image': im}
            except:
                return {'valid': False, 'image': im}
        return {'valid': True}
        # raise ValidationError("Unsupport image type. Please upload bmp, png or jpeg")

    def get_depth(self, folder_file_names):

        temp_dict_len = {}
        folder_file_names_listed = {}
        for key in folder_file_names:
            splited_temp = folder_file_names[key].split('/')
            folder_file_names_listed[key] = splited_temp
            temp_len = len(splited_temp)
            if temp_len > 3:
                return {'err': 'depth_exceeded', 'ignore_list': None, 'all_two': None,
                        'base_len': None}, folder_file_names_listed
            else:
                temp_dict_len[key] = temp_len

        three_found = False
        two_found = False
        one_found = False
        ignore_list = []
        base_len = 0

        for key in folder_file_names:
            if temp_dict_len[key] == 3:
                three_found = True
            elif temp_dict_len[key] == 2:
                two_found = True
            elif temp_dict_len[key] == 1:
                one_found = True

        for key in folder_file_names:
            if temp_dict_len[key] == 3:
                three_found = True
                base_len = 3
            elif temp_dict_len[key] == 2:
                two_found = True
                if three_found:
                    ignore_list.append(key)
            elif temp_dict_len[key] == 1:
                one_found = True
                if three_found or two_found:
                    ignore_list.append(key)

        if base_len < 3:
            if two_found:
                base_len = 2
            elif one_found and not two_found:
                base_len = 1
        return {'err': None, 'ignore_list': ignore_list, 'base_len': base_len}, folder_file_names_listed

        # if one_found and three_found or two_found:
        #     return {'err': None, 'ignore_list': ignore_list, 'all_two': False, 'all_three': False, 'base_len': base_len}
        #
        # if three_found and two_found:
        #     return {'err': None, 'ignore_list': ignore_list, 'all_two': False, 'all_three': False, 'base_len': base_len}
        # elif two_found:
        #     return {'err': None, 'ignore_list': None, 'all_two': True, 'all_three': False, 'base_len': base_len}
        # elif three_found:
        #     return {'err': None, 'ignore_list': None, 'all_two': True, 'all_three': True, 'base_len': base_len}


def _get_three_image_coll_dict(splited_folder_file_name_dict, depth_info_dict):
    dict_UserImagesCollection_info = {}
    root_folder_name = None
    for key in splited_folder_file_name_dict:
        if key not in depth_info_dict['ignore_list']:
            if splited_folder_file_name_dict[key][1] in dict_UserImagesCollection_info:
                dict_UserImagesCollection_info[splited_folder_file_name_dict[key][1]] = \
                    dict_UserImagesCollection_info[
                        splited_folder_file_name_dict[
                            key][1]] + [
                        splited_folder_file_name_dict[key][
                            2]]
                if root_folder_name is None:
                    root_folder_name = splited_folder_file_name_dict[key][0]

            else:
                dict_UserImagesCollection_info[splited_folder_file_name_dict[key][1]] = [
                    splited_folder_file_name_dict[key][2]]
    return dict_UserImagesCollection_info, root_folder_name


def _get_two_image_coll_dict(splited_folder_file_name_dict, depth_info_dict):
    dict_UserImagesCollection_info = {}
    root_folder_name = None

    for key in splited_folder_file_name_dict:
        if key not in depth_info_dict['ignore_list']:
            if splited_folder_file_name_dict[key][0] in dict_UserImagesCollection_info:
                dict_UserImagesCollection_info[splited_folder_file_name_dict[key][0]] = \
                    dict_UserImagesCollection_info[
                        splited_folder_file_name_dict[
                            key][0]] + [
                        splited_folder_file_name_dict[key][
                            1]]
                if root_folder_name is None:
                    root_folder_name = splited_folder_file_name_dict[key][0]
            else:
                dict_UserImagesCollection_info[splited_folder_file_name_dict[key][0]] = [
                    splited_folder_file_name_dict[key][1]]
                root_folder_name = splited_folder_file_name_dict[key][0]

    return dict_UserImagesCollection_info, root_folder_name


class ImageColCreateView(LoginRequiredMixin, FormView):
    form_class = ImagesForm
    template_name = 'digtrace/imageUpload.html'  # Replace with your template.
    success_url = reverse_lazy('digtrace-images')  # Replace with your URL or reverse().
    pk = None

    # def form_valid(self, form):
    #     """
    #     The user has provided valid credentials (this was checked in AuthenticationForm.is_valid()). So now we
    #     can log him in.
    #     """
    #     LoginRequiredMixin. = self.request.user
    #     return super ().form_valid(form)

    def post(self, request, *args, **kwargs):

        form_class = self.get_form_class()
        form = self.get_form(form_class)
        folder_file_names = request.POST['directories']
        folder_file_names = json.loads(folder_file_names)

        images = request._files.getlist('file_field')
        for i in range(len(images)):
            images[i].name = str(i) + '_' + images[i].name

        for key in folder_file_names:
            temp_list_file_dirs = folder_file_names[key].split('/')
            del temp_list_file_dirs[-1]
            folder_file_names[key] = '/'.join(temp_list_file_dirs) + '/' + key

        if len(images) == 0:
            messages.error(request, 'No file or folder selected!')
            return render(request, 'digtrace/imageUpload.html', {'form': form_class})

        image_validate_obj = ImageValidate()
        validation_images = image_validate_obj.are_valid_images(images)
        if not validation_images['valid']:
            messages.error(request,
                           'Could not identify the image format for file:' + folder_file_names[validation_images[
                               'image']._name] + ', please upload only BMP, PNG, or JPEG format images')
            return render(request, 'digtrace/imageUpload.html', {'form': form_class})
        else:
            if form.is_valid():
                # imagesForm= ImagesForm.save(commit=False)
                # selected_user_defined_code = form.cleaned_data.get('user_defined_code')

                # userImagesCollectionModelForm=UserImagesCollectionModelForm()
                # request.POST['title']
                # request.POST['description']

                depth_info_dict, splited_folder_file_name_dict = image_validate_obj.get_depth(folder_file_names)
                self.depth_info_dict = depth_info_dict
                self.base_len = depth_info_dict['base_len']

                if depth_info_dict['base_len'] == 1:
                    if len(request.POST['title']) == 0:
                        title = 'Untitled image project uploaded on: ' + str(
                            timezone.datetime.now())
                    else:
                        title = request.POST['title']

                    userImagesCollection = UserImagesCollection.objects.create(user=request.user,
                                                                               title=title,
                                                                               description=request.POST['description'])
                    for image in images:
                        photo = Images.objects.create(userImagesCollection=userImagesCollection, image=image)
                        photo.save()
                    userImagesCollection.save()
                    self.pk = userImagesCollection.pk
                    return self.form_valid(form)

                elif depth_info_dict['base_len'] == 3:
                    list_user_image_collection = []
                    dict_UserImagesCollection_info, root_folder_name = _get_three_image_coll_dict(
                        splited_folder_file_name_dict, depth_info_dict)

                    for key in dict_UserImagesCollection_info:
                        title = key
                        if len(request.POST['title']) == 0:
                            title = key

                        else:
                            title = request.POST['title'] + '_' + key

                        userImagesCollection = UserImagesCollection.objects.create(user=request.user,
                                                                                   title=title,
                                                                                   description=request.POST[
                                                                                       'description'])
                        # temp_images = [name(t) = t for t in fun_list]

                        img_dict = {}
                        for img in images:
                            img_dict[img.name] = img

                        for image_file_name in dict_UserImagesCollection_info[key]:
                            photo = Images.objects.create(userImagesCollection=userImagesCollection,
                                                          image=img_dict[image_file_name])
                            photo.save()
                        userImagesCollection.save()
                        list_user_image_collection.append(userImagesCollection)
                        self.pk = userImagesCollection.pk
                    if len(request.POST['title']) > 0:
                        job = Job.objects.create(user=request.user,
                                                 job_name=request.POST['title'] + '_' + root_folder_name)
                        for userImagesCollection in list_user_image_collection:
                            job.userImagesCollection.add(userImagesCollection)
                        job.save()
                        self.pk = job.pk

                    else:
                        job = Job.objects.create(user=request.user, job_name=root_folder_name)
                        for userImagesCollection in list_user_image_collection:
                            job.userImagesCollection.add(userImagesCollection)
                        job.save()
                        self.pk = job.pk
                    if len(self.depth_info_dict['ignore_list']) > 0:
                        messages.warning(request,
                                         'Warning: could not map some file(s) and folder(s), the following file(s) are ignored: ' + ', '.join(
                                             self.depth_info_dict['ignore_list']))


                elif depth_info_dict['base_len'] == 2:
                    list_user_image_collection = []
                    dict_UserImagesCollection_info, root_folder_name = _get_two_image_coll_dict(
                        splited_folder_file_name_dict, depth_info_dict)
                    if len(request.POST['title']) == 0:
                        title = root_folder_name
                    else:
                        title = request.POST['title'] + '_' + root_folder_name

                    userImagesCollection = UserImagesCollection.objects.create(user=request.user,
                                                                               title=title,
                                                                               description=request.POST[
                                                                                   'description'])
                    for image in images:
                        photo = Images.objects.create(userImagesCollection=userImagesCollection, image=image)
                        photo.save()
                    userImagesCollection.save()
                    list_user_image_collection.append(userImagesCollection)
                    self.pk = userImagesCollection.pk
                    if len(request.POST['title']) > 0:
                        job = Job.objects.create(user=request.user,
                                                 job_name=request.POST['title'] + '_' + root_folder_name)
                        for userImagesCollection in list_user_image_collection:
                            job.userImagesCollection.add(userImagesCollection)
                        job.save()
                        self.pk = job.pk

                    else:
                        job = Job.objects.create(user=request.user, job_name=root_folder_name)

                        for userImagesCollection in list_user_image_collection:
                            job.userImagesCollection.add(userImagesCollection)
                        job.save()
                        self.pk = job.pk
                    if len(self.depth_info_dict['ignore_list']) > 0:
                        messages.warning(request,
                                         'Warning: could not map some file(s) and folder(s), the following file(s) are ignored:' + ''.join(
                                             self.depth_info_dict['ignore_list']))
                return self.form_valid(form)
            else:
                return self.form_invalid(form)

    def get_success_url(self):
        # print(self.pk)
        if self.base_len == 1:
            return reverse('digtrace-images-detail', kwargs={'pk': self.pk})
        else:

            return reverse('digtrace-job-detail', kwargs={'pk': self.pk})

    # <a class="btn btn-outline-secondary" href= "{%  url 'digtrace-images_detail' UserImagesCollection.id %}"> Cancel </a>


class CustomMemoryFileUploadHandler(MemoryFileUploadHandler):
    def new_file(self, *args, **kwargs):
        args = (args[0], args[1].replace('/', '-').replace('\\', '-')) + args[2:]
        super(CustomMemoryFileUploadHandler, self).new_file(*args, **kwargs)


class CustomTemporaryFileUploadHandler(TemporaryFileUploadHandler):
    def new_file(self, *args, **kwargs):
        args = (args[0], args[1].replace('/', '-').replace('\\', '-')) + args[2:]
        super(CustomTemporaryFileUploadHandler, self).new_file(*args, **kwargs)


class ImageColUpdateMetaInfoUpdate(UserPassesTestMixin, LoginRequiredMixin, UpdateView):
    model = UserImagesCollection
    fields = ['title', 'description']
    success_url = reverse_lazy('digtrace-images')  # Replace with your URL or reverse().
    pk = None

    def test_func(self):
        images_meta_info = self.get_object()
        if self.request.user == images_meta_info.user:
            self.pk = images_meta_info.id
            return True
        return False

    def get_success_url(self):
        # print(self.pk)
        return reverse('digtrace-images-detail', kwargs={'pk': self.pk})

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)


class ImagesAdd(UserPassesTestMixin, LoginRequiredMixin, FormView):
    form_class = ImagesAddForm
    template_name = 'digtrace/imagesAdd.html'
    # fields = ['image_field']
    success_url = reverse_lazy('digtrace-images')  # Replace with your URL or reverse().
    # def test_func(self):
    #     images = self.get_object()
    #     if self.request.user == images.user:
    #         return True
    #     return False
    #
    # def form_valid(self, form):
    #     form.instance.user = self.request.user
    #     return super().form_valid(form)
    # def get_queryset(self):
    #     qs = self.model.objects.get(pk=self.kwargs['pk'])
    #     return qs
    pk = None

    # def form_valid(self, form):
    #     """
    #     The user has provided valid credentials (this was checked in AuthenticationForm.is_valid()). So now we
    #     can log him in.
    #     """
    #     LoginRequiredMixin. = self.request.user
    #     return super ().form_valid(form)
    def test_func(self):
        userImagesCollection = UserImagesCollection.objects.get(pk=self.kwargs['pk'])
        if self.request.user == userImagesCollection.user:
            return True
        return False

    def post(self, request, *args, **kwargs):

        form_class = self.get_form_class()
        form = self.get_form(form_class)
        images = request.FILES.getlist('image_field')
        if form.is_valid():

            # imagesForm= ImagesForm.save(commit=False)
            # selected_user_defined_code = form.cleaned_data.get('user_defined_code')

            # userImagesCollectionModelForm=UserImagesCollectionModelForm()
            # request.POST['title']
            # request.POST['description']
            # userImagesCollection=UserImagesCollection.objects.create(user=request.user,
            #                                                                 title=request.POST['title'],
            #                                                                 description=request.POST['description'])
            self.pk = self.kwargs['pk']
            userImagesCollection = UserImagesCollection.objects.get(pk=self.pk)

            for image in images:
                photo = Images.objects.create(userImagesCollection=userImagesCollection, image=image)
                photo.save()
            # userImagesCollection.save()
            self.pk = userImagesCollection.pk
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    def get_success_url(self):
        # print(self.pk)
        return reverse('digtrace-images-detail', kwargs={'pk': self.pk})


class ImageColListView(LoginRequiredMixin, ListView):
    model = UserImagesCollection
    context_object_name = 'UserImagesCollection'
    paginate_by = 7

    def get_queryset(self):
        self.filter_text = ', newest first'
        self.filter_prev_old_first = False
        self.order_by_prev_field = 'Image Upload Date'
        self.search_box_text_found = False
        self.search = None
        self.search_box_text = 'Search....'
        self.Q_filter = self.model.objects.filter(user=self.request.user)

        if 'search_box' in self.request.GET:
            if self.request.GET['search_box'] != '':
                self.search_box_text_found = True
                self.search = SearchVector('title',
                                           'description')
                self.search_box_text = self.request.GET['search_box']
                self.Q_filter = self.Q_filter.annotate(search=self.search).filter(search=self.search_box_text)

        # qs = self.Q_filter.order_by('-job_date_created')

        order_text = '-'
        if 'time_order' in self.request.GET:
            if self.request.GET['time_order'].strip(' ').replace(' ', '') == 'OldFirst':
                order_text = ''

                self.filter_prev_old_first = True

        if 'filter' in self.request.GET:
            if self.request.GET['filter'].strip(' ').replace(' ', '') == 'ImageUploadDate':
                self.filter_text = 'Ordered by Image Upload Date' + self.filter_text
                self.order_by_prev_field = 'Image Upload Date'
                return self.Q_filter.order_by(
                    order_text + 'date_uploaded')
            else:
                self.filter_text = 'Ordered by Image Upload Date' + self.filter_text

                return self.Q_filter.order_by(
                    order_text + 'date_uploaded')

        else:
            self.filter_text = 'Ordered by Image Upload Date' + self.filter_text
            return self.Q_filter.order_by(order_text + 'date_uploaded')

    def get_context_data(self, **kwargs):
        context = super(ImageColListView, self).get_context_data(**kwargs)  # get the default context data
        context['filter_text'] = self.filter_text  # add extra field to the context
        context['filter_prev_old_first'] = self.filter_prev_old_first
        context['order_by_prev_field'] = self.order_by_prev_field
        context['search_prev_field'] = self.search_box_text
        return context


class ImageColDeleteView(UserPassesTestMixin, LoginRequiredMixin, DeleteView):
    model = UserImagesCollection
    context_object_name = 'UserImagesCollection'
    success_url = reverse_lazy('digtrace-images')

    def test_func(self):
        images_meta_info = self.get_object()
        if self.request.user == images_meta_info.user:
            return True
        return False

    def get_queryset(self):
        return self.model.objects.filter(user=self.request.user)

        # ordering = ['-date_uploaded']


class ImageDeleteView(UserPassesTestMixin, LoginRequiredMixin, DeleteView):
    model = Images
    context_object_name = 'Images'
    # success_url = reverse('digtrace-images_detail', kwargs=self.kwargs['pk'])
    reverse_id = None

    def get_success_url(self):
        # print(self.pk)
        return reverse('digtrace-images-detail', kwargs={'pk': self.reverse_id})

    def test_func(self):
        userImagesCollection = self.model.objects.select_related('userImagesCollection').get(
            id=self.kwargs['pk']).userImagesCollection
        if self.request.user == userImagesCollection.user:
            return True
        return False

    # def test_func(self):
    #     images_meta_info = self.get_object()
    #     if self.request.user == images_meta_info.user:
    #         return True
    #     return False

    def get_queryset(self):
        object = self.model.objects.filter(id=self.kwargs['pk'])
        self.reverse_id = self.model.objects.select_related('userImagesCollection').get(
            id=self.kwargs['pk']).userImagesCollection_id
        return object
        # ordering = ['-date_uploaded']


class ImageColDetailViewPaginated(LoginRequiredMixin, DetailView, MultipleObjectMixin):
    model = UserImagesCollection
    context_object_name = 'UserImagesCollection'
    paginate_by = 18

    def get_context_data(self, **kwargs):
        object_list = Images.objects.filter(userImagesCollection=self.get_object())
        context = super(ImageColDetailViewPaginated, self).get_context_data(object_list=object_list, **kwargs)
        return context

    def get_queryset(self):

        self.filter_text = ', newest first'
        self.filter_prev_old_first = False
        self.order_by_prev_field = 'Job Update Date'
        self.search_box_text_found = False
        self.search = None
        self.search_box_text = ''
        self.Q_filter = self.model.objects.filter(user=self.request.user)

        if 'search_box' in self.request.GET:
            if self.request.GET['search_box'] != '':
                self.search_box_text_found = True
                self.search = SearchVector(
                    'title',
                    'description')
                self.search_box_text = self.request.GET['search_box']
                self.Q_filter = self.Q_filter.annotate(search=self.search).filter(search=self.search_box_text)

        # qs = self.Q_filter.order_by('-job_date_created')

        order_text = '-'
        if 'time_order' in self.request.GET:
            if self.request.GET['time_order'].strip(' ').replace(' ', '') == 'OldFirst':
                order_text = ''
                self.filter_text = ', oldest first'
                self.filter_prev_old_first = True

        if 'filter' in self.request.GET:
            if self.request.GET['filter'].strip(' ').replace(' ', '') == 'ImageUploadDate':
                self.filter_text = 'Ordered by Image Upload Date' + self.filter_text
                self.order_by_prev_field = 'Image Upload Date'

                return self.Q_filter.order_by(order_text + 'date_uploaded')


            else:
                self.filter_text = 'Ordered by Job last Updated Date' + self.filter_text
                self.order_by_prev_field = 'Job Update Date'

                if self.search is not None:
                    return self.Q_filter.order_by(order_text + 'job_date_updated')
                else:
                    return self.Q_filter.order_by(order_text + 'job_date_updated')

        else:
            self.filter_text = 'Ordered by Job last Updated Date' + self.filter_text
            if self.search is None:
                return self.Q_filter.order_by(order_text + 'job_date_updated')
            else:
                return self.Q_filter.order_by(order_text + 'job_date_updated')


class ImageColDetailView(LoginRequiredMixin, DetailView):
    model = UserImagesCollection
    context_object_name = 'UserImagesCollection'

    def get_queryset(self):
        return self.model.objects.filter(user=self.request.user)

        # ordering = ['-date_uploaded']


class JobCreateView(LoginRequiredMixin, CreateView):
    model = Job
    form_class = JobForm
    success_url = reverse_lazy('digtrace-jobs')
    pk = None

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super(JobCreateView, self).form_valid(form)

    def get_form_kwargs(self):
        kwargs = super(JobCreateView, self).get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs

    def get_success_url(self):
        # print(self.pk)
        return reverse('digtrace-job-detail', kwargs={'pk': self.object.pk})

    # fields = [
    #           'job_name','job_description','gen_model','force_focal_len_calc','focal_len','surface_recon','surface_recon_depth',
    #           'poisson_recon_sample_per_node', 'poisson_recon_density', 'ssd_recon_degree',
    #           'surface_trim','surface_trim_trim_threshold','surface_trim_polygon_mesh', 'surface_trim_smooth',
    #            'job_note', 'job_priority',
    #           ]
    #


class JobCreateViewFromImage(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = Job
    form_class = JobForm
    success_url = reverse_lazy('digtrace-jobs')
    pk = None

    def get_initial(self):
        requested_userImagesCollection = UserImagesCollection.objects.get(pk=self.kwargs['pk'])
        if requested_userImagesCollection.user == self.request.user:
            return {'userImagesCollection': requested_userImagesCollection}

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super(JobCreateViewFromImage, self).form_valid(form)

    def get_form_kwargs(self):
        kwargs = super(JobCreateViewFromImage, self).get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs

    def test_func(self):
        requested_userImagesCollection = UserImagesCollection.objects.get(pk=self.kwargs['pk'])

        if requested_userImagesCollection.user == self.request.user:
            return True
        else:
            return False

    def get_success_url(self):
        # print(self.pk)

        return reverse('digtrace-job-detail', kwargs={'pk': self.object.pk})


class JobListView(LoginRequiredMixin, ListView):
    model = Job
    context_object_name = 'Job'
    paginate_by = 7

    def get_queryset(self):

        self.filter_text = ', newest first'
        self.filter_prev_old_first = False
        self.order_by_prev_field = 'Job Update Date'
        self.search_box_text_found = False
        self.search = None
        self.search_box_text = 'Search....'
        self.Q_filter = self.model.objects.filter(user=self.request.user)

        if 'search_box' in self.request.GET:
            if self.request.GET['search_box'] != '':
                self.search_box_text_found = True
                self.search = SearchVector('job_name',
                                           'job_description',
                                           'userImagesCollection__title',
                                           'userImagesCollection__description')
                self.search_box_text = self.request.GET['search_box']
                self.Q_filter = self.Q_filter.annotate(search=self.search).filter(search=self.search_box_text)

        # qs = self.Q_filter.order_by('-job_date_created')

        order_text = '-'
        if 'time_order' in self.request.GET:
            if self.request.GET['time_order'].strip(' ').replace(' ', '') == 'OldFirst':
                order_text = ''
                self.filter_text = ', oldest first'
                self.filter_prev_old_first = True

        if 'filter' in self.request.GET:
            if self.request.GET['filter'].strip(' ').replace(' ', '') == 'ImageUploadDate':
                self.filter_text = 'Ordered by Image Upload Date' + self.filter_text
                self.order_by_prev_field = 'Image Upload Date'

                return self.Q_filter.order_by(
                    order_text + 'userImagesCollection__date_uploaded')

            elif self.request.GET['filter'].strip(' ').replace(' ', '') == 'JobCreationDate':
                self.filter_text = 'Ordered by Job Creation Date' + self.filter_text
                self.order_by_prev_field = 'Job Creation Date'

                return self.Q_filter.order_by(
                    order_text + 'job_date_created')
            else:
                self.filter_text = 'Ordered by Job last Updated Date' + self.filter_text
                self.order_by_prev_field = 'Job Update Date'

                return self.Q_filter.order_by(order_text + 'job_date_updated')

        else:
            self.filter_text = 'Ordered by Job last Updated Date' + self.filter_text
            return self.Q_filter.order_by(order_text + 'job_date_updated')

    def get_context_data(self, **kwargs):

        context = super(JobListView, self).get_context_data(**kwargs)  # get the default context data
        context['filter_text'] = self.filter_text  # add extra field to the context
        context['filter_prev_old_first'] = self.filter_prev_old_first
        context['order_by_prev_field'] = self.order_by_prev_field
        context['search_prev_field'] = self.search_box_text
        return context


class JobListAssociatedView(LoginRequiredMixin, ListView):
    model = Job
    context_object_name = 'Job'

    def get_queryset(self):
        qs = self.model.objects.filter(user=self.request.user)

        qs = qs.filter(job_group_id=self.model.objects.get(id=self.kwargs['pk']).job_group_id).exclude(
            is_group_job_head=True)
        print(qs)
        return qs

    ordering = ['-date_uploaded']


class JobDetailView(LoginRequiredMixin, DetailView):
    model = Job
    context_object_name = 'Job'

    fields = (
        'job_name', 'job_description', 'job_status', 'userImagesCollection', 'gen_model', 'force_focal_len_calc',
        'focal_len',
        'surface_recon', 'surface_recon_depth',
        'poisson_recon_sample_per_node', 'poisson_recon_density', 'ssd_recon_degree',
        'surface_trim', 'surface_trim_trim_threshold', 'surface_trim_polygon_mesh', 'surface_trim_smooth',
        'job_note', 'job_priority',
    )

    def test_do_nothing(self):
        pass

    def get_queryset(self):
        return self.model.objects.filter(user=self.request.user)


class AuthorMixin(object):
    def get_queryset(self):
        return super(AuthorMixin, self).get_queryset().filter(author=self.request.user)


class JobFilesImagesListView(LoginRequiredMixin, AuthorMixin, ListView):
    model = JobFile
    context_object_name = 'JobFile'

    fields = (
        'job', 'userImagesCollection', 'file_name', 'file',
    )

    def get_queryset(self):
        return self.model.objects.filter(
            userImagesCollection=UserImagesCollection.objects.get(pk=self.kwargs['pk'])).filter(
            user=self.request.user).order_by('-job__job_date_updated')


class JobFilesListView(LoginRequiredMixin, AuthorMixin, ListView):
    model = JobFile
    context_object_name = 'JobFile'
    paginate_by = 5

    fields = (
        'job', 'userImagesCollection', 'file_name', 'file',
    )

    #
    def get_queryset(self):
        self.filter_text = ', newest first'
        self.filter_prev_old_first = False
        self.order_by_prev_field = 'Job Update Date'
        self.search_box_text_found = False
        self.search = None
        self.search_box_text = 'Search....'
        self.Q_filter = self.model.objects.filter(user=self.request.user)

        if 'search_box' in self.request.GET:
            if self.request.GET['search_box'] != '':
                self.search_box_text_found = True
                self.search = SearchVector('job__job_name',
                                           'job__job_description',
                                           'userImagesCollection__title',
                                           'userImagesCollection__description', 'file_name')
                self.search_box_text = self.request.GET['search_box']
                self.Q_filter = self.Q_filter.annotate(search=self.search).filter(search=self.search_box_text)

        if 'pk' in self.kwargs:
            return self.Q_filter.filter(job__id=self.kwargs['pk']).order_by('-job__job_date_updated')
        else:
            order_text = '-'
            if 'time_order' in self.request.GET:
                if self.request.GET['time_order'].strip(' ').replace(' ', '') == 'OldFirst':
                    order_text = ''
                    self.filter_text = ', oldest first'
                    self.filter_prev_old_first = True

            if 'filter' in self.request.GET:
                if self.request.GET['filter'].strip(' ').replace(' ', '') == 'ImageUploadDate':
                    self.filter_text = 'Ordered by Image Upload Date' + self.filter_text
                    self.order_by_prev_field = 'Image Upload Date'

                    return self.model.objects.filter(user=self.request.user).order_by(
                        order_text + 'userImagesCollection__date_uploaded')
                elif self.request.GET['filter'].strip(' ').replace(' ', '') == 'JobCreationDate':
                    self.filter_text = 'Ordered by Job Creation Date' + self.filter_text
                    self.order_by_prev_field = 'Job Creation Date'

                    return self.Q_filter.order_by(
                        order_text + 'job__job_date_created')
                else:
                    self.filter_text = 'Ordered by Job last Updated Date' + self.filter_text
                    self.order_by_prev_field = 'Job Update Date'

                    if self.search is not None:
                        return self.Q_filter.order_by(order_text + 'job__job_date_updated')
                    else:
                        return self.Q_filter.order_by(order_text + 'job__job_date_updated')

            else:
                self.filter_text = 'Ordered by Job last Updated Date' + self.filter_text
                if self.search is None:
                    return self.Q_filter.order_by(order_text + 'job__job_date_updated')
                else:
                    return self.Q_filter.order_by(order_text + 'job__job_date_updated')

    def get_context_data(self, **kwargs):

        context = super(JobFilesListView, self).get_context_data(**kwargs)  # get the default context data
        context['filter_text'] = self.filter_text  # add extra field to the context
        context['filter_prev_old_first'] = self.filter_prev_old_first
        context['order_by_prev_field'] = self.order_by_prev_field
        context['search_prev_field'] = self.search_box_text

        return context

    # def test_func(self):
    #     job_file = self.get_object()
    #     if self.request.user == job_file.user:
    #         return True
    #     return False


from django.views.generic.detail import DetailView
from django.http import FileResponse


class JobFileDownloadView(UserPassesTestMixin, LoginRequiredMixin, DetailView):
    model = JobFile

    def get(self, request, *args, **kwargs):

        model_obj = self.model.objects.get(pk=self.kwargs['pk'])
        response = FileResponse(model_obj.file, content_type="application/octet-strea")
        # file_name = slugify(model_obj.userImagesCollection.date_uploaded.strftime(
        #     '%d-%m-%y') + '_' + model_obj.job.job_name + '_' + model_obj.userImagesCollection.title)
        if model_obj.userImagesCollection is not None:
            file_name = slugify(model_obj.userImagesCollection.date_uploaded.strftime(
                '%d-%m-%y') + '_' + model_obj.job.job_name + '_' + model_obj.userImagesCollection.title)
        else:
            file_name = slugify(model_obj.job.job_name)

        if 'surface' in model_obj.file_name or 'Surface' in model_obj.file_name:
            file_name = file_name + '_s.ply'
            response['Content-Disposition'] = 'attachment; filename="%s"' % file_name
        elif 'Trimmed' in model_obj.file_name or 'trimmed' in model_obj.file_name:
            file_name = file_name + '_st.ply'
            response['Content-Disposition'] = 'attachment; filename="%s"' % file_name
        else:
            file_name = file_name + '.ply'
            response['Content-Disposition'] = 'attachment; filename="%s"' % file_name
        return response

    def get_queryset(self):
        return self.model.objects.filter(user=self.request.user)

    # def test_func(self):
    #     userImagesCollection = self.model.objects.filter(user=self.request.user)
    #     if self.request.user == userImagesCollection.user:
    #         return True
    #     return False

    def test_func(self):
        job_file = self.get_object()
        if self.request.user == job_file.user:
            return True
        return False


class ImageThumbnailRenderView(UserPassesTestMixin, LoginRequiredMixin, DetailView):
    model = Images

    def get(self, request, *args, **kwargs):
        # model_obj = self.model.objects.get(pk=self.kwargs['pk'])
        model_obj = self.get_object()

        response = FileResponse(model_obj.image_thumbnail, content_type="image/jpeg")
        return response

    # def get_queryset(self):
    #     return self.model.objects.filter(user=self.request.user)

    def test_func(self):
        image = self.get_object()
        if self.request.user == image.userImagesCollection.user:
            return True
        return False


class ImageRenderView(UserPassesTestMixin, LoginRequiredMixin, DetailView):
    model = Images

    def get(self, request, *args, **kwargs):
        # model_obj = self.model.objects.get(pk=self.kwargs['pk'])
        model_obj = self.get_object()
        response = FileResponse(model_obj.image, content_type="image/jpeg")
        return response

    # def get_queryset(self):
    #     return self.model.objects.filter(user=self.request.user)

    def test_func(self):
        image = self.get_object()
        if self.request.user == image.userImagesCollection.user:
            return True
        return False

    # def test_func(self):
    #     userImagesCollection = self.model.objects.filter(user=self.request.user)
    #     if self.request.user == userImagesCollection.user:
    #         return True
    #     return False
    #
    # def test_func(self):
    #     image = self.get_object()
    #     if self.request.user == image.user:
    #         return True
    #     return False


# class SomeFileDownloadView(BaseFileDownloadView):
#     model = JobFile


@staff_member_required
class JobMetaDetailView(LoginRequiredMixin, DetailView):
    model = JobMeta
    context_object_name = 'JobMeta'


class JobDeleteView(UserPassesTestMixin, LoginRequiredMixin, DeleteView):
    model = Job
    context_object_name = 'Job'
    success_url = reverse_lazy('digtrace-jobs')
    reverse_id = None

    def get_queryset(self):
        # if (self.model.objects.get(id=self.kwargs['pk']).is_group_job_head):
        #      messages.warning(self.request, 'There are other associated Jobs with this Job, deleting this will result in deleting all the associated jobs')
        #
        return self.model.objects.filter(user=self.request.user)

    # def test_func(self):
    #     userImagesCollection = self.model.objects.filter(user=self.request.user)
    #     if self.request.user == userImagesCollection.user:
    #         return True
    #     return False

    def test_func(self):
        job = self.get_object()
        if self.request.user == job.user:
            if (self.model.objects.get(id=self.kwargs['pk']).is_group_job_head):
                messages.warning(self.request,
                                 'This is a group Job, Deleting this job will result in DELETING all the associated jobs!!!')

            return True
        return False

    def delete(self, request, *args, **kwargs):
        """
        Call the delete() method on the fetched object and then redirect to the
        success URL.
        """
        self.object = self.get_object()
        if self.object.is_group_job_head:
            JobGroup.objects.filter(id=self.object.job_group_id).delete()

        success_url = self.get_success_url()
        self.object.delete()

        return HttpResponseRedirect(success_url)

    # ordering = ['-date_uploaded']


class JobUpdateView(UserPassesTestMixin, LoginRequiredMixin, UpdateView):
    model = Job
    success_url = reverse_lazy('digtrace-jobs')  # Replace with your URL or reverse().
    pk = None
    fields = (
        'job_name', 'job_description', 'userImagesCollection', 'gen_model', 'force_focal_len_calc', 'focal_len',
        'surface_recon', 'surface_recon_depth',
        'poisson_recon_sample_per_node', 'poisson_recon_density', 'ssd_recon_degree',
        'surface_trim', 'surface_trim_trim_threshold', 'surface_trim_polygon_mesh', 'surface_trim_smooth',
        'job_note', 'job_priority',
    )

    def test_func(self):
        job = self.get_object()
        if self.request.user == job.user:
            self.pk = job.id
            return True
        return False

    def get_success_url(self):
        # print(self.pk)
        return reverse('digtrace-job-detail', kwargs={'pk': self.pk})

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)


class JobSubmit(UserPassesTestMixin, LoginRequiredMixin, UpdateView):
    model = Job
    success_url = reverse_lazy('digtrace-jobs')  # Replace with your URL or reverse().
    pk = None
    fields = ('job_submit',)

    def get_initial(self):

        job = self.get_object()
        if len(job.userImagesCollection.all()) > 1:
            messages.warning(self.request,
                             'There are multiple jobs associated with this job, submitting this will result in '
                             + str(len(job.userImagesCollection.all())) + ' other jobs submission')

    def form_valid(self, form):
        request = self.request
        # form_class = self.get_form_class()
        # form = self.get_form(form_class)
        if not 'job_submit' in request.POST:
            messages.error(self.request, 'Please check the \'Job Submit\' and then click on \'Submit Job\'')
            return self.form_invalid(form)

        value = request.POST['job_submit']
        if form.is_valid():

            if value == 'on':

                job = self.get_object()
                if job.job_submit:
                    messages.error(request, 'This Job has already been submitted!')
                    return redirect('digtrace-job-detail', pk=job.id)
                elif job.userImagesCollection is None:
                    messages.error(request, 'There are no Image project(s) associated with this job!')

                else:
                    if len(job.userImagesCollection.all()) == 1:
                        job.job_submit = True
                        self.pk = job.pk
                        job.save()
                    else:
                        if len(job.userImagesCollection.all()) > 1:
                            job_group = JobGroup.objects.create(user=job.user)
                            job_group.save()
                            job.is_group_job_head = True
                            job.job_group = job_group
                            job.job_submit = True
                            job.save()
                            self.pk = job.pk

                            # job_group.user = instance.user
                            counter = 1
                            for image_coll in job.userImagesCollection.all():
                                obj = Job.objects.get(pk=job.pk)
                                obj.pk = None
                                obj.job_submit = False
                                obj.is_group_job_head = False
                                obj.job_group = job_group
                                # obj.job_name = 'sub_job_' +str(counter)+'_'+obj.job_name
                                obj.job_name = obj.job_name

                                obj.save()
                                obj.userImagesCollection.add(image_coll)
                                obj.save()
                                obj.job_submit = True
                                obj.save()
                                counter += 1

            return redirect('digtrace-job-detail', pk=self.pk)
        else:
            return self.form_invalid(form)

    def test_func(self):
        job = self.get_object()
        if self.request.user == job.user:
            self.pk = job.id
            return True
        return False

    def get_success_url(self):
        # print(self.pk)
        return reverse('digtrace-job-detail', kwargs={'pk': self.pk})

    # def form_valid(self, form):
    #     form.instance.user = self.request.user
    #     return super().form_valid(form)
    #

    # def dimitri_ply_manipulation(info):
    #     ...
    #     '''here goes my mian logic to process the image.'''
    #     ...
    #     return x,y,w,h


class APIJobList(generics.ListAPIView):
    model = Job
    print('test')
    print('test')
    serializer_class = JobListSerializer

    def get_queryset(self):
        return Job.objects.filter(user=self.request.user)


class PassthroughRenderer(renderers.BaseRenderer):
    """
        Return data as-is. View should supply a Response.
    """
    media_type = ''
    format = ''

    def render(self, data, accepted_media_type=None, renderer_context=None):
        return data


class APIJobPlyGet(APIView):
    permission_classes = [IsAuthenticated, ]

    print('test APIJobPlyGet called')
    """
    Provides basic CRUD functions for the User model
    """

    # model = Job
    # print('test')
    # print('test')
    # serializer_class = JobListSerializer
    @csrf_exempt
    def get(self, request, *args, **kwargs):
        filtered_job = JobFile.objects.select_related().filter(job=request.GET['job'])
        try:
            model_obj = filtered_job.get(file_name='surfaced.ply')
        except:
            raise Http404

        response = FileResponse(model_obj.file, content_type="application/octet-strea")

        # response = Response(data = smart_str(model_obj.file.file),headers={'Content-Disposition':'attachment','fileName':'test.ply'})
        #
        # response = HttpResponse(content_type="application/octet-strea")
        # # response['Content-Disposition'] = 'attachment; filename="somefilename.ply"'
        # f= model_obj.file.open('rb')
        # response.write(f)
        # # f.close()

        # file_handle = model_obj.file.open()
        #
        # # send file
        # response = FileResponse(file_handle, content_type='whatever')
        # response['Content-Length'] = model_obj.file.size
        # response['Content-Disposition'] = 'attachment; filename="%s"' % model_obj.file.name
        response = StreamingHttpResponse(model_obj.file, content_type="application/octet-strea")

        return response

        # response = Response(smart_str(model_obj.file.open('rb')))

        # response = FileResponse(model_obj.file, content_type="application/octet-strea")
        # response = Response(model_obj.file.open('rb'))
        # response = FileResponse(model_obj.file, content_type="application/octet-strea")
        # response = Response(response)

        # if model_obj.userImagesCollection is not None:
        #     file_name = slugify(model_obj.userImagesCollection.date_uploaded.strftime(
        #         '%d-%m-%y') + '_' + model_obj.job.job_name + '_' + model_obj.userImagesCollection.title)
        # else:
        #     file_name = slugify(model_obj.job.job_name + '_' + request.GET['job'])
        #
        #
        #
        # if 'surface' in model_obj.file_name or 'Surface' in model_obj.file_name:
        #     file_name = file_name +'_s.ply'
        #     response['Content-Disposition'] = 'attachment; filename="%s"' % file_name
        # elif 'Trimmed' in model_obj.file_name or 'trimmed' in model_obj.file_name:
        #     file_name = file_name +'_st.ply'
        #     response['Content-Disposition'] = 'attachment; filename="%s"' % file_name
        # else:
        #     file_name = file_name + '.ply'
        #     response['Content-Disposition'] = 'attachment; filename="%s"'%file_name
        return response

    def get_queryset(self):
        return Job.objects.filter(user=self.request.user)


class RestView(APIView):
    permission_classes = ()
    authentication_classes = ()

    # permission_classes = [IsAuthenticated,]
    @csrf_exempt
    @parser_classes([JSONParser])
    def post(self, data_json):
        print('function with rest called')

        try:
            content = data_json.data
            method = content['method']
            data = content.get('data', 0)
            xyzi = content.get('xyzi', 0)
            xAxis = content.get('xAxis', 0)
            yAxis = content.get('yAxis', 0)
            zAxis = content.get('zAxis', 0)
            precision = content.get('precision', 1)
            scale = content.get('scale', 1)
            multiplier = content.get('multiplier', 1)
            landmarks = content.get('landmarks', 0)
            landmarks1 = content.get('landmarks1', 0)
            landmarks2 = content.get('landmarks2', 0)
            line = content.get('line', False)
            triangle = content.get('triangle', False)
            circle = content.get('circle', False)
            transformation = content.get('transformation', 0)
            models = content.get('models', False)
            contourLines = content.get('contourLines', 0)

            if method:
                if method == "rotate90":

                    return JsonResponse(rotate90(data, precision), safe=False)
                elif method == "autoRotateCreatePanel":
                    response = JsonResponse(autoRotateCreatePanel(data), safe=False)

                    return response
                elif method == "interpolate":

                    return JsonResponse(interpolate(data, precision, "linear", None, None, False, multiplier),
                                        safe=False)
                elif method == "interpolate3D":
                    return JsonResponse(interpolate3D(data), safe=False)
                elif method == "autoRotate":
                    response = JsonResponse(autoRotate(data, precision), safe=False)

                    return response
                elif method == "mirror":
                    return JsonResponse(mirror(data), safe=False)
                elif method == "depthChart":
                    return JsonResponse(depthChart(data, landmarks), safe=False)
                elif method == "contour":
                    return JsonResponse(
                        contour(data, xyzi, landmarks1, landmarks2, line, triangle, circle, transformation,
                                contourLines), safe=False)
                elif method == "statistics":
                    return JsonResponse(statistics(models, precision, scale), safe=False)
                else:
                    return "Unknown Command"
            else:
                return "No Command"

            # return JsonResponse("Result:" + y, safe=False)
        except ValueError as e:
            return Response(e.args[0], status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
@parser_classes([JSONParser])
def dimitri_ply_manipulation(data_json):
    # print('function with rest called')

    try:
        content = data_json.data
        method = content['method']
        data = content.get('data', 0)
        xyzi = content.get('xyzi', 0)
        xAxis = content.get('xAxis', 0)
        yAxis = content.get('yAxis', 0)
        zAxis = content.get('zAxis', 0)
        precision = content.get('precision', 1)
        scale = content.get('scale', 1)
        multiplier = content.get('multiplier', 1)
        landmarks = content.get('landmarks', 0)
        landmarks1 = content.get('landmarks1', 0)
        landmarks2 = content.get('landmarks2', 0)
        line = content.get('line', False)
        triangle = content.get('triangle', False)
        circle = content.get('circle', False)
        transformation = content.get('transformation', 0)
        models = content.get('models', False)
        contourLines = content.get('contourLines', 0)

        if method:
            if method == "rotate90":

                return JsonResponse(rotate90(data, precision), safe=False)
            elif method == "autoRotateCreatePanel":
                response = JsonResponse(autoRotateCreatePanel(data), safe=False)

                return response
            elif method == "interpolate":

                return JsonResponse(interpolate(data, precision, "linear", None, None, False, multiplier), safe=False)
            elif method == "interpolate3D":
                return JsonResponse(interpolate3D(data), safe=False)
            elif method == "autoRotate":
                response = JsonResponse(autoRotate(data, precision), safe=False)

                return response
            elif method == "mirror":
                return JsonResponse(mirror(data), safe=False)
            elif method == "depthChart":
                return JsonResponse(depthChart(data, landmarks), safe=False)
            elif method == "contour":
                return JsonResponse(
                    contour(data, xyzi, landmarks1, landmarks2, line, triangle, circle, transformation, contourLines),
                    safe=False)
            elif method == "statistics":
                return JsonResponse(statistics(models, precision, scale), safe=False)
            else:
                return "Unknown Command"
        else:
            return "No Command"

        # return JsonResponse("Result:" + y, safe=False)
    except ValueError as e:
        return Response(e.args[0], status.HTTP_400_BAD_REQUEST)


class PlyRedirectView(UserPassesTestMixin, LoginRequiredMixin, View):
    pk = None
    jobFile = None

    def test_func(self):
        self.jobFile = JobFile.objects.get(pk=self.kwargs['pk'])
        if self.request.user == self.jobFile.user:
            return True
        return False

    def get(self, request, pk):
        self.pk = pk

        print('test')

        return HttpResponseRedirect('http://127.0.0.1:4200/' + os.path.basename(self.jobFile.file.url))


#
# class JobFileDetailView(UserPassesTestMixin, LoginRequiredMixin, DetailView):
#     model = JobFile
#     context_object_name = 'JobFile'
#     pk = None
#     iframe_url = None
#     #
#     # fields = (
#     #     'job_file.job.job_name ', 'job_file.userImagesCollection.title','iframe_url',
#     # )
#     def url_open_iframe(self):
#
#         self.iframe_url = "http://127.0.0.1:4200/" + os.path.basename(self.model.objects.get(pk=self.pk).file.url)
#
#     def get_context_data(self, **kwargs):
#         context = super(JobFileDetailView, self).get_context_data(**kwargs)
#         context['url_iframe'] = "http://127.0.0.1:4200/" + os.path.basename(self.model.objects.get(pk=self.pk).file.url)
#         return context
#
#
#     def test_func(self):
#         jobFile = self.get_object()
#         if self.request.user == jobFile.user:
#             self.pk = jobFile.id
#             self.url_open_iframe()
#             return True
#         return False
#
#
#
#     def get_queryset(self):
#         return self.model.objects.filter(user=self.request.user)
#
#


class JobFileDeleteView(UserPassesTestMixin, LoginRequiredMixin, DeleteView):
    model = JobFile
    context_object_name = 'JobFile'
    success_url = reverse_lazy('digtrace-job-files')
    reverse_id = None

    # Add support for browsers which only accept GET and POST for now.

    def post(self, request, *args, **kwargs):
        return self.delete(request, *args, **kwargs)

    def get_queryset(self):
        object = self.model.objects.filter(pk=self.kwargs['pk'])
        self.reverse_id = object.get(pk=self.kwargs['pk']).job_id

        return object

    # def test_func(self):
    #     userImagesCollection = self.model.objects.filter(user=self.request.user)
    #     if self.request.user == userImagesCollection.user:
    #         return True
    #     return False

    def test_func(self):
        job_file = self.model.objects.get(pk=self.kwargs['pk'])
        if self.request.user == job_file.user:
            return True
        return False

    def get_success_url(self):
        # print(self.pk)
        return reverse('digtrace-job-files', kwargs={'pk': self.reverse_id})
