from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class BasePagination(PageNumberPagination):

    # override the response_method of parent_class for custom response
    def response(self, data):
        return {
            'code': status.HTTP_200_OK,
            'message': 'Okay',
            'errors': None,
            'total_items': self.page.paginator.count,
            'total_page_count': self.page.paginator.num_pages,
            'current_page_number': self.page.number,
            'previous_page': self.get_previous_link(),
            'next_page': self.get_next_link(),
            'data': data
        }


class JobListPagination(BasePagination):
    # page_size indicates the number of item on each page
    page_size = 10

    def get_paginated_response(self, data):
        return Response(self.response(data))


class UserImagesCollectionPagination(BasePagination):
    # page_size indicates the number of item on each page
    page_size = 10

    def get_paginated_response(self, data):
        return Response(self.response(data))


class ImagePagination(BasePagination):
    # page_size indicates the number of item on each page
    page_size = 18

    def get_paginated_response(self, data):
        return Response(self.response(data))


class AssociateJobsPagination(BasePagination):
    # page_size indicates the number of item on each page
    page_size = 10

    def get_paginated_response(self, data):
        return Response(self.response(data))
