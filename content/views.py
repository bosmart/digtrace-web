from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.views import View

from content.models import Content, ContentPage


class ContentBaseView(View):
    @staticmethod
    def get_content(kwargs):
        content_slug = kwargs.get('content_slug', None)

        try:
            return Content.objects.get(slug=content_slug)
        except Content.DoesNotExist:
            return False


class ContentView(ContentBaseView):
    template_name = 'content.html'

    def get(self, request, *args, **kwargs):
        content = self.get_content(kwargs)

        if content:
            return render(request, self.template_name, {'content': content})

        return HttpResponseRedirect(reverse('digtrace-home'), kwargs)


class ContentUpdateView(ContentBaseView):
    template_name = 'content_update.html'

    def get(self, request, *args, **kwargs):
        content = self.get_content(kwargs)
        page_number = kwargs.get('page_number', None)

        if content and page_number and request.user.is_superuser:
            try:
                page = ContentPage.objects.get(content=content, page_number=page_number)

                data = {
                    'content': content,
                    'page': page
                }
                return render(request, self.template_name, data)

            except ContentPage.DoesNotExist:
                pass

        return HttpResponseRedirect(reverse('digtrace-home'), kwargs)

    def post(self, request, *args, **kwargs):
        content = self.get_content(kwargs)
        page_number = request.POST.get('page_number', None)

        if content and page_number and request.user.is_superuser:
            title = request.POST.get('title', '')
            content_text = request.POST.get('text', '')

            content.title = title
            content.save()

            try:
                content_page = ContentPage.objects.get(content=content, page_number=page_number)
                content_page.text = content_text
                content_page.save()
            except ContentPage.DoesNotExist:
                pass

            return render(request, 'content.html', {'content': content})

        return HttpResponseRedirect(reverse('digtrace-home'), kwargs)

        # return HttpResponseRedirect(reverse('content_view'), args=(content_type,))


class ContentPageAddView(ContentBaseView):

    def get(self, request, *args, **kwargs):
        content = self.get_content(kwargs)

        if content and request.user.is_superuser:
            page_number = content.pages.all().last().page_number + 1
            page = ContentPage.objects.create(content=content, page_number=page_number, text='')
            kwargs['page_number'] = page.page_number

            return HttpResponseRedirect(reverse('content_update', kwargs=kwargs))

        return HttpResponseRedirect(reverse('digtrace-home'))


class ContentPageDeleteView(ContentBaseView):

    def get(self, request, *args, **kwargs):
        page_number = kwargs.get('page_number', None)
        content = self.get_content(kwargs)
        try:
            content_page = ContentPage.objects.get(page_number=page_number)

            if content_page and request.user.is_superuser:
                content_page.delete()
                pages = ContentPage.objects.filter(content=content, page_number__gt=page_number)

                for page in pages:
                    page.page_number -= 1
                    page.save()

                return HttpResponseRedirect(reverse('content_view', kwargs={'content_slug': content.slug}))

        except ContentPage.DoesNotExist:
            pass

        return HttpResponseRedirect(reverse('digtrace-home'))
