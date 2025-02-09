import json
from digtrace.api.utils import *

from django.contrib.postgres.search import SearchVector, SearchQuery
from django.utils import timezone
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from digtrace.api.paginations import UserImagesCollectionPagination, ImagePagination
from digtrace.api.serializers import UserImagesCollectionSerializer, UserImagesCollectionDetailsSerializer, \
    UserImagesCollectionCreateUpdateSerializer, UserImagesCollectionTitleDescriptionSerializer, ImageSerializer
from digtrace.api.views import APIBaseView
from digtrace.api.views.job_views import JobSubmitAPIView
from digtrace.models import UserImagesCollection, Images, Job, JobFile
from digtrace.views import ImageValidate, _get_three_image_coll_dict, _get_two_image_coll_dict

""" ===================== Image Collection List API View  ======================== """


class ImageCollectionListAPIView(APIBaseView, ListAPIView):
    serializer_class = UserImagesCollectionSerializer
    pagination_class = UserImagesCollectionPagination

    def get(self, request, *args, **kwargs):
        order_by_field = self.get_order_by_field(request)
        search_query, search_vector = self.get_search_text_and_vector(request)

        image_collections = UserImagesCollection.objects.select_related('user').prefetch_related('images_set').filter(user=request.user)

        if search_query and search_vector:
            image_collections = image_collections.annotate(search=search_vector).filter(search=search_query)

        if order_by_field:
            self.queryset = image_collections.order_by(order_by_field).distinct()
        else:
            self.queryset = image_collections.distinct()

        return self.list(self, request, *args, **kwargs)

    @staticmethod
    def get_order_by_field(request):
        absolute_field_dict = {
            'image-upload-date': 'date_uploaded'
        }

        order_by = request.GET.get('order-by', 'image-upload-date')
        sort_by = request.GET.get('sort-by', 'recent')

        try:
            # retrieving the absolute database field
            order_by_field = absolute_field_dict[order_by]
        except KeyError:
            order_by_field = 'date_uploaded'

        if 'search-text' in request.GET and 'sort-by' not in request.GET:
            pass

        elif sort_by == 'recent':
            order_by_field = f'-{order_by_field}'

        return order_by_field

    @staticmethod
    def get_search_text_and_vector(request):
        search_text = request.GET.get('search-text', '').strip()

        if search_text != '':
            search_vector = SearchVector(
                'title',
                'description'
            )

            search_query = SearchQuery(search_text)
            return search_query, search_vector

        return False, False


""" ===================== Image Collection Details API View  ======================== """


class ImageCollectionDetailsAPIView(APIBaseView, ListAPIView):
    model = UserImagesCollection
    serializer_class = ImageSerializer
    pagination_class = ImagePagination

    def get(self, request, *args, **kwargs):
        response_data = self.response_data
        image_collection_id = kwargs.get('image_collection_id', None)

        try:
            # retrieving the image collection
            image_collection = self.model.objects.select_related('user').prefetch_related('images_set'
                                                                                          ).get(id=image_collection_id)

            if image_collection.user == request.user:
                # initializing response data
                self.queryset = image_collection.images_set.all().order_by('id')

                # initializing image_collection to serializer
                kwargs['image_collection'] = image_collection
            else:
                response_data = self.response_403_forbidden
                return Response(response_data, response_data['code'])

        except UserImagesCollection.DoesNotExist:
            # initializing response data
            response_data = self.response_404_not_found_with_errors('No image collection found with the given id!')
            return Response(response_data, response_data['code'])

        return self.list(self, request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        # override the list method to customize the response data
        response = super().list(request, args, kwargs)

        try:
            image_collection = kwargs['image_collection']
            # to get serialize data
            image_collection_data = UserImagesCollectionDetailsSerializer(image_collection).data

            # initializing image_collection_data to response
            response.data['data'] = {
                'image_collection_data': image_collection_data,
                'images': response.data['data'],
                'ply_file_jobs': self.get_ply_files(image_collection)
            }
        except:
            pass

        return response

    @staticmethod
    def get_ply_files(image_collection):
        jobFiles = JobFile.objects.select_related('job', 'userImagesCollection'
                                                  ).filter(userImagesCollection=image_collection)
        jobs = []

        if jobFiles:
            jobList = []
            for file in jobFiles:
                jobList.append(file.job)

            jobList = set(jobList)

            for job in jobList:
                job_data = {
                    'job_id': job.id,
                    'job_name': job.job_name,
                    'date_created': convert_date_time(job.job_date_created),
                    'date_updated': convert_date_time(job.job_date_updated),
                    'ply_files': ImageCollectionDetailsAPIView.get_only_ply_files(image_collection, job, jobFiles)
                }
                jobs.append(job_data)

        return jobs

    @staticmethod
    def get_only_ply_files(image_collection, job, jobFiles):
        ply_files = []
        files = jobFiles.filter(userImagesCollection=image_collection, job=job)

        for file in files:
            ply_files.append({
                'id': file.id,
                'title': file.file_name,
                'path': f'/api/ply-file/{file.id}/download/'
            })

        return ply_files


""" ===================== Image Collection Create API View  ======================== """


class ImagesCollectionCreateAPIView(APIBaseView):
    serializer_class = UserImagesCollectionCreateUpdateSerializer
    parser_classes = [MultiPartParser]

    def post(self, request):
        response_data = self.response_201_created_with_data([])
        response_data['errors'] = []

        # to get images and folder_file_names from request
        images, folder_file_names = self.get_data(request)

        print("\nfolder File names =>", folder_file_names)
        print("\nimages=>", images)

        if images[0] == '' or len(images) == 0:
            error_message = 'No file or folder selected!'
            self.set_response_as_400_bad_request(response_data, error_message)
            return Response(response_data, response_data['code'])

        for index, image in enumerate(images):
            image.name = f'{index}_{image.name}'

        for key in folder_file_names:
            temp_list_file_dirs = folder_file_names[key].split('/')
            del temp_list_file_dirs[-1]
            folder_file_names[key] = '/'.join(temp_list_file_dirs) + '/' + key

        image_validate_obj = ImageValidate()
        validation_images = image_validate_obj.are_valid_images(images)

        if not validation_images['valid']:

            file_name = folder_file_names[validation_images['image'].name]
            error_message = f"Could not identify the image format for file: {file_name}," \
                            f" please upload only BMP, PNG, or JPEG format images "
            self.set_response_as_400_bad_request(response_data, error_message)

            return Response(response_data, response_data['code'])

        else:
            # initializing data on image collection serializer
            image_collection_serializer = self.serializer_class(user=request.user, data=request.data)

            if image_collection_serializer.is_valid(raise_exception=False):
                print("serializer valid")

                # print("Image Depth =>", image_validate_obj.get_depth(folder_file_names))
                depth_info_dict, split_folder_file_name_dict = image_validate_obj.get_depth(folder_file_names)
                depth_info_dict = depth_info_dict
                base_len = depth_info_dict['base_len']

                if base_len == 1:
                    print(1)

                    if len(request.POST['title']) == 0:
                        title = 'Untitled image project uploaded on: ' + str(
                            timezone.datetime.now())
                        print(2)
                    else:
                        title = request.POST['title']

                    userImagesCollection = UserImagesCollection.objects.create(user=request.user,
                                                                               title=title,
                                                                               description=request.POST['description'])
                    for image in images:
                        photo = Images.objects.create(userImagesCollection=userImagesCollection, image=image)
                        photo.save()

                    userImagesCollection.save()
                    # self.pk = userImagesCollection.pk

                    return Response(response_data, response_data['code'])

                elif base_len == 3:
                    print(3)

                    list_user_image_collection = []
                    dict_UserImagesCollection_info, root_folder_name = _get_three_image_coll_dict(
                        split_folder_file_name_dict, depth_info_dict)

                    for key in dict_UserImagesCollection_info:
                        title = key
                        # if len(request.POST['title']) == 0:
                        #     title = key
                        #
                        # else:
                        #     title = request.POST['title'] + '_' + key

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

                        # initializing image-collection_name and id to response data
                        # self.append_image_collection_to_response_data(userImagesCollection, response_data)

                    if len(request.POST['title']) > 0:
                        print(4)
                        job_name = request.POST['title'] + '_' + root_folder_name
                        # adding the image-collections to job
                        self.create_job_and_add_image_collections(request.user, job_name,
                                                                  list_user_image_collection, response_data)

                    else:
                        print(5)
                        # adding the image-collections to job
                        self.create_job_and_add_image_collections(request.user, root_folder_name,
                                                                  list_user_image_collection, response_data)

                    if len(depth_info_dict['ignore_list']) > 0:
                        print(6)
                        error_message = "Warning: could not map some file(s) and folder(s), " \
                                        "the following file(s) are ignored: " \
                                        + ", ".join(depth_info_dict['ignore_list'])

                        response_data['errors'].append(error_message)
                        # self.set_response_as_400_bad_request(response_data, error_message)

                elif base_len == 2:
                    print(7)
                    list_user_image_collection = []
                    dict_UserImagesCollection_info, root_folder_name = _get_two_image_coll_dict(
                        split_folder_file_name_dict, depth_info_dict)

                    if len(request.POST['title']) == 0:
                        title = root_folder_name
                    else:
                        title = request.POST['title'] + '_' + root_folder_name

                    userImagesCollection = UserImagesCollection.objects.create(user=request.user, title=title,
                                                                               description=request.POST['description'])

                    for image in images:
                        photo = Images.objects.create(userImagesCollection=userImagesCollection, image=image)
                        photo.save()

                    userImagesCollection.save()
                    list_user_image_collection.append(userImagesCollection)

                    # initializing image-collection_name and id to response data
                    # self.append_image_collection_to_response_data(userImagesCollection, response_data)

                    if len(request.POST['title']) > 0:
                        print(8)
                        job_name = request.POST['title'] + '_' + root_folder_name
                        self.create_job_and_add_image_collections(request.user, job_name, list_user_image_collection,
                                                                  response_data)

                    else:
                        print(9)
                        # adding the image-collections to job
                        self.create_job_and_add_image_collections(request.user, root_folder_name,
                                                                  list_user_image_collection, response_data)

                    if len(depth_info_dict['ignore_list']) > 0:
                        print(10)
                        error_message = 'Warning: could not map some file(s) and folder(s), ' \
                                        'the following file(s) are ignored:' \
                                        + ''.join(depth_info_dict['ignore_list'])

                        response_data['errors'].append(error_message)

                return Response(response_data, response_data['code'])
            else:
                print(11)
                self.set_response_as_400_bad_request(response_data)
                response_data['errors'] = image_collection_serializer.errors

            return Response(response_data, response_data['code'])

    @staticmethod
    def get_data(request):
        images = request.data.getlist('file_field', [''])

        if 'postman' in request.POST:
            directory = request.data.get('directories')
            folder_file_names = {}

            for index, image in enumerate(images):
                folder_file_names[f'{index}_{image}'] = f'{directory}/{image}'
        else:
            folder_file_names = request.POST['directories']
            folder_file_names = json.loads(folder_file_names)

        return images, folder_file_names

    @staticmethod
    def create_job_and_add_image_collections(user, job_name, list_user_image_collection, response_data):
        job = Job.objects.create(user=user, job_name=job_name)

        response_data['data'] = {
            'job_id': job.id,
            'image_collections': []
        }
        for userImagesCollection in list_user_image_collection:
            job.userImagesCollection.add(userImagesCollection)

            response_data['data']['image_collections'].append({
                'id': userImagesCollection.id,
                'title': userImagesCollection.title
            })
        job.save()

    @staticmethod
    def set_response_as_400_bad_request(response_data, error_message=None):
        response_data['code'] = status.HTTP_400_BAD_REQUEST
        response_data['message'] = "BAD REQUEST"

        if error_message:
            response_data['errors'].append(error_message)

        return response_data

    @staticmethod
    def append_image_collection_to_response_data(image_collection, response_data):

        # initializing image-collection_name and id to response data
        response_data['data'].append({
            'id': image_collection.id,
            'title': image_collection.title
        })

        return response_data


""" ===================== Image Collection Update API View  ======================== """


class ImageCollectionUpdateAPIView(APIBaseView):
    data_serializer = UserImagesCollectionTitleDescriptionSerializer
    serializer_class = UserImagesCollectionCreateUpdateSerializer

    def get(self, request, *args, **kwargs):
        response_data = self.response_data
        image_collection_id = kwargs.get('image_collection_id', None)

        try:
            # retrieving the image-collection
            image_collection = UserImagesCollection.objects.select_related('user').get(id=image_collection_id)

            if image_collection.user == request.user:
                # initializing the image-collection's title and description to response data
                response_data['data'] = self.data_serializer(image_collection).data
            else:
                response_data = self.response_403_forbidden

        except UserImagesCollection.DoesNotExist:
            response_data = self.response_404_not_found_with_errors("No image-collection found with the "
                                                                    "image-collection-id")
        return Response(response_data, response_data['code'])

    def put(self, request, *args, **kwargs):
        try:
            image_collection_id = kwargs.get('image_collection_id', None)
            image_collection = UserImagesCollection.objects.select_related('user').get(id=image_collection_id)

        except UserImagesCollection.DoesNotExist:
            response_data = self.response_404_not_found_with_errors("No image-collection found with the "
                                                                    "image-collection-id")

            return Response(response_data, response_data['code'])

        if image_collection.user == request.user:

            # initializing data and instance to serializer
            image_collection_serializer = self.serializer_class(user=request.user,
                                                                data=request.data, instance=image_collection)

            if image_collection_serializer.is_valid(raise_exception=False):
                # updating the image collection
                image_collection_serializer.save()

                response_data = self.response_data
                response_data['data'] = image_collection_serializer.validated_data
            else:
                response_data = self.response_400_bad_request_with_errors(image_collection_serializer.errors)
        else:
            response_data = self.response_403_forbidden

        return Response(response_data, response_data['code'])


""" ===================== Image Collection Delete API View  ======================== """


class ImageCollectionDeleteAPIView(APIBaseView):

    def delete(self, request, *args, **kwargs):
        try:
            image_collection_id = kwargs.get('image_collection_id', None)
            image_collection = UserImagesCollection.objects.select_related('user').get(id=image_collection_id)

            if image_collection.user == request.user:
                image_collection.delete()

                response_data = self.response_204_no_content
            else:
                response_data = self.response_403_forbidden

        except UserImagesCollection.DoesNotExist:
            response_data = self.response_404_not_found_with_errors("No image collection found with the "
                                                                    "image-collection-id!")

        return Response(response_data, response_data['code'])


""" ===================== Image Add API View  ======================== """


class ImageAddAPIView(APIBaseView):

    def post(self, request, *args, **kwargs):

        image_collection_id = kwargs.get('image_collection_id', None)
        images = self.get_images(request)

        try:
            image_collection = UserImagesCollection.objects.select_related('user').get(id=image_collection_id)

            if not images or images == ['']:
                # if images not found
                response_data = self.response_400_bad_request_with_errors("No Image Found!")

            elif image_collection.user == request.user:

                # checking the images are valid or not
                if self.images_are_valid(images):
                    images_data = []

                    for image in images:
                        # creating images
                        image_obj = Images.objects.create(userImagesCollection=image_collection, image=image)
                        image_obj.save()

                        images_data.append({
                            'id': image_obj.id,
                            'image': image_obj.image.path
                        })

                    response_data = self.response_201_created_with_data(images_data)
                else:
                    response_data = self.response_400_bad_request_with_errors("Invalid Image Format!")
            else:
                response_data = self.response_403_forbidden

        except UserImagesCollection.DoesNotExist:
            response_data = self.response_404_not_found_with_errors("Image Collection Not Found!")

        return Response(response_data, response_data['code'])

    @staticmethod
    def images_are_valid(images):
        # the image validator will check the images format
        image_validator = ImageValidate()
        # the validator only allows the following format - ('BMP', 'PNG', 'JPEG')
        return image_validator.are_valid_images(images).get('valid', False)

    @staticmethod
    def get_images(request):
        try:
            return request.data.getlist('images', [])
        except AttributeError:
            return request.data.get('images', [])


""" ===================== Image Delete API View  ======================== """


class ImageDeleteAPIView(APIBaseView):

    def delete(self, request, *args, **kwargs):
        try:
            image_id = kwargs.get('image_id', None)
            image = Images.objects.select_related('userImagesCollection__user').get(id=image_id)

            if image.userImagesCollection.user == request.user:
                # image.status = False
                # image.save()
                image.delete()

                response_data = self.response_204_no_content
            else:
                response_data = self.response_403_forbidden

        except Images.DoesNotExist:
            response_data = self.response_404_not_found_with_errors("No image found with the image_id!")

        return Response(response_data, response_data['code'])
