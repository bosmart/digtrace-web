from django.contrib.auth.mixins import UserPassesTestMixin
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from django.http import FileResponse
from django.utils.text import slugify
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from digtrace.api.views import APIBaseView, BaseResponse
from digtrace.api.paginations import JobListPagination, AssociateJobsPagination
from digtrace.api.serializers.job_serializers import *
from digtrace.models import JobGroup, JobFile

""" ================   Job List  ====================== """


class JobListAPIView(APIBaseView, ListAPIView):
    serializer_class = JobListSerializer
    pagination_class = JobListPagination

    def get(self, request, *args, **kwargs):
        order_by_field = self.get_order_by_field(request)
        search_query, search_vector = self.get_search_text_and_vector(request)

        jobs = Job.objects.select_related('user').prefetch_related('userImagesCollection').filter(user=request.user)

        if search_query and search_vector:
            jobs = jobs.annotate(search=search_vector).filter(search=search_query)

        if order_by_field:
            self.queryset = jobs.order_by(order_by_field).distinct()
        else:
            self.queryset = jobs.distinct()

        return self.list(request, *args, **kwargs)

    @staticmethod
    def get_order_by_field(request):
        # to get absolute database field by query-params
        absolute_field_dict = {
            'job-update-date': 'job_date_updated',
            'job-creation-date': 'job_date_created',
            'image-upload-date': 'userImagesCollection__date_uploaded'
        }

        order_by = request.GET.get('order-by', 'job-update-date')
        sort_by = request.GET.get('sort-by', 'recent')

        try:
            # retrieving the absolute database field
            order_by_field = absolute_field_dict[order_by]
        except KeyError:
            order_by_field = 'job_date_updated'

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
                'job_name',
                'job_description',
                'userImagesCollection__title',
                'userImagesCollection__description'
            )

            search_query = SearchQuery(search_text)
            return search_query, search_vector

        return False, False


""" ================   Job Create  ====================== """


class JobCreateAPIView(APIBaseView):
    serializer_class = JobSerializer
    data_serializer_class = JobDataSerializer

    def get(self, request, *args, **kwargs):
        # retrieving the image collections
        image_collections = UserImagesCollection.objects.select_related('user').filter(user=request.user)

        # retrieving model fields
        data = self.data_serializer_class().data

        # initializing the images collections to job data
        data['userImagesCollection'] = UserImagesCollectionSimpleSerializer(image_collections, many=True).data

        # initializing response data
        response_data = self.response_data
        response_data['data'] = data

        return Response(response_data, response_data['code'])

    def post(self, request):
        # initializing data to serializer
        job_serializer = self.serializer_class(user=request.user, data=request.data)

        if job_serializer.is_valid(raise_exception=False):
            # creating job instance
            job = job_serializer.save()

            job_data = {
                "job_id": job.id,
                "job_name": job.job_name
            }

            response_data = self.response_201_created_with_data(job_data)
        else:
            response_data = self.response_400_bad_request_with_errors(self.normalize_errors(job_serializer.errors))

        return Response(response_data, response_data['code'])


""" ====================   Job Update  ==========================  """


class JobUpdateAPIView(APIBaseView):
    serializer_class = JobSerializer
    data_serializer_class = JobDataSerializer

    def get(self, request, *args, **kwargs):
        response_data = self.response_data
        job_id = kwargs.get('job_id', None)

        try:
            job = Job.objects.select_related('user').prefetch_related('userImagesCollection').get(id=job_id)

            if job.user == request.user:
                response_data['data'] = self.data_serializer_class(job).data
            else:
                response_data = self.response_403_forbidden

        except Job.DoesNotExist:
            response_data = self.response_404_not_found_with_errors('No job found with the given id')

        return Response(response_data, response_data['code'])

    def post(self, request, *args, **kwargs):
        response_data = self.response_data
        job_id = kwargs.get('job_id', None)

        try:
            job = Job.objects.select_related('user').prefetch_related('userImagesCollection').get(id=job_id)

            job_serializer = self.serializer_class(data=request.data, instance=job)

            if job.user == request.user:

                if job_serializer.is_valid(raise_exception=False):
                    # updating the job by given data
                    job = job_serializer.save()

                    # initializing the updated job data
                    response_data['data'] = self.serializer_class(job).data
                else:
                    response_data = self.response_400_bad_request_with_errors(self.normalize_errors(job_serializer.errors))
            else:
                response_data = self.response_403_forbidden

        except Job.DoesNotExist:
            response_data = self.response_404_not_found_with_errors('No job found with the given id')

        return Response(response_data, response_data['code'])


""" ====================   Job Details  ==========================  """


class JobDetailsAPIView(APIBaseView):

    def get(self, request, *args, **kwargs):
        response_data = self.response_data
        job_id = kwargs.get('job_id', None)

        try:
            job = Job.objects.select_related('user').prefetch_related('userImagesCollection').get(id=job_id)

            if job.user == request.user:
                job_serializer = JobDetailsSerializer(job)

                data = job_serializer.data
                data['ply_files'] = JobSubmitAPIView.get_ply_files_path(job)

                response_data['data'] = data
            else:
                response_data = self.response_403_forbidden

        except Job.DoesNotExist:
            response_data = self.response_404_not_found_with_errors('No job found with the given id')

        return Response(response_data, response_data['code'])


""" ===================    Job  Delete   ========================== """


class JobDeleteAPIView(APIBaseView):

    def delete(self, request, *args, **kwargs):
        try:
            job_id = kwargs.get('job_id', None)
            job = Job.objects.select_related('user').get(id=job_id)

            if job.user == request.user:
                job.delete()

                response_data = self.response_204_no_content
            else:
                response_data = self.response_403_forbidden

        except Job.DoesNotExist:
            response_data = self.response_404_not_found_with_errors('No job found with the given id')

        return Response(response_data, response_data['code'])

    # def is_deletable(self, job, force_delete=False):
    #     if self.request.user == job.user:
    #         if force_delete:
    #             return True
    #
    #         if job.is_group_job_head:
    #             # if the job has group head, a warning message will be sent
    #             self.context["warning"] = "This is a group Job, Deleting this job will result in DELETING all the " \
    #                                       "associated jobs! "
    #             return False
    #         return True
    #     return False


""" ====================== Job Submit ====================== """


class JobSubmitAPIView(APIBaseView):
    serializer_class = JobSerializer

    def get(self, request, *args, **kwargs):
        response_data = self.response_data
        try:
            job = Job.objects.prefetch_related('userImagesCollection').get(id=kwargs.get('job_id', None))

            if job.user == request.user:
                image_collections = job.userImagesCollection.all()

                if len(image_collections) > 1:
                    response_data['errors'] = ['There are multiple jobs associated with this job, submitting this will '
                                               'result in ' + str(len(image_collections)) + ' other jobs submission']
                response_data['data'] = {
                    'job_submit': job.job_submit
                }
            else:
                response_data = self.response_403_forbidden

        except Job.DoesNotExist:
            response_data = self.response_404_not_found_with_errors([])
            return Response(response_data, response_data['code'])

        return Response(response_data, response_data['code'])

    def post(self, request, *args, **kwargs):
        job_submit = request.data.get('job_submit', False)
        job_id = request.data.get('job_id', None)

        if not job_submit:
            response_data = self.response_400_bad_request_with_errors(
                "Please check the 'Job Submit' and then click on 'Submit Job'")
            return Response(response_data, response_data['code'])

        try:
            job = Job.objects.select_related('user').prefetch_related('userImagesCollection').get(id=job_id)
            data = self.serializer_class(job).data
            serializer = self.serializer_class(data=data, instance=job)

            if request.user != job.user:
                response_data = self.response_403_forbidden

            elif not serializer.is_valid(raise_exception=False):
                response_data = self.response_400_bad_request_with_errors(self.normalize_errors(serializer.errors))

            elif job.job_submit:
                response_data = self.response_400_bad_request_with_errors('This Job has already been submitted!')
                response_data['data'] = self.get_ply_files_path(job)

            elif job.userImagesCollection is None:
                response_data = self.response_404_not_found_with_errors(
                    'There are no Image project(s) associated with this job!')
            else:
                response_data = self.response_data
                image_collections = job.userImagesCollection.all()

                if len(image_collections) == 1:
                    job.job_submit = True
                    job.save()

                elif len(image_collections) > 1:
                    job_group = JobGroup.objects.create(user=job.user)
                    job_group.save()
                    job.is_group_job_head = True
                    job.job_group = job_group
                    job.job_submit = True
                    job.save()

                    # job_group.user = instance.user
                    counter = 1
                    for image_coll in image_collections:
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
                        # counter += 1
                else:
                    response_data = self.response_404_not_found_with_errors("The job has no image collection")

        except Job.DoesNotExist:
            response_data = self.response_404_not_found_with_errors("No job found with the job id")

        return Response(response_data, response_data['code'])

    @staticmethod
    def get_ply_files_path(job):
        PLYFiles = JobFile.objects.select_related('job').filter(job=job)
        ply_files = []

        for file in PLYFiles:
            try:
                file_data = {
                    'id': file.id,
                    'title': file.file_name,
                    'path': f'/api/ply-file/{file.id}/download/'
                }
                ply_files.append(file_data)
            except:
                pass

        return ply_files


""" ===================== Associate Job View ==================== """


class AssociateJobListAPIView(APIBaseView, ListAPIView):
    model = Job
    serializer_class = AssociateJobListSerializer
    pagination_class = AssociateJobsPagination
    ordering = ['-date_uploaded']

    def get(self, request, *args, **kwargs):
        job_id = kwargs.get('job_id', None)

        try:
            job = self.model.objects.prefetch_related('user').get(id=job_id)

            if job.user != request.user:
                response_data = self.response_403_forbidden
                return Response(response_data, response_data['code'])

            if job.is_group_job_head:
                self.queryset = self.model.objects.prefetch_related('userImagesCollection').filter(
                                        job_group=job.job_group, is_group_job_head=False).order_by('-job_date_updated')
            else:
                self.queryset = []

        except Job.DoesNotExist:
            response_data = self.response_404_not_found_with_errors("Job not found with the job id!")
            return Response(response_data, response_data['code'])

        return self.list(request, *args, **kwargs)


""" ===================== PLY File Download View ==================== """


class PLYFileDownloadAPIView(APIView, BaseResponse):
    permission_classes = ()
    authentication_classes = ()
    model = JobFile

    def get(self, request, *args, **kwargs):
        try:
            file_id = kwargs['file_id']
            model_obj = self.model.objects.select_related('job', 'userImagesCollection').get(id=file_id)

        except KeyError or JobFile.DoesNotExist:
            response_data = self.response_404_not_found_with_errors([])
            return Response(response_data, response_data['code'])

        # if model_obj.user == request.user:
        # if both user are same
        response = FileResponse(model_obj.file, content_type="application/octet-strea")

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

        # else:
        #     response_data = self.response_403_forbidden
        #     return Response(response_data, response_data['code'])
