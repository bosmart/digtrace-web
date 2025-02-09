from django import forms
from .models import UserImagesCollection, Images, Job
from django.core.exceptions import ValidationError


#
# class UserImagesCollectionModelForm(forms.ModelForm):
#     # title = forms.CharField(max_length=128,required=True)
#     # body = forms.CharField(max_length=500, label="Images Description.")
#
#     class Meta:
#         model = UserImagesCollection
#         # fields = ('title', 'body',)
#         # exclude = ('user',)
#
#     def __init__(self, *args, **kwargs):
#         user = kwargs.pop('user', '')
#         super(UserImagesCollectionModelForm, self).__init__(*args, **kwargs)
#         self.fields['user'] = forms.ModelChoiceField(queryset=user.objects.filter(owner=user))
# class ImagesModelForm(forms.ModelForm):
#     # title = forms.CharField(max_length=128,required=True)
#     # body = forms.CharField(max_length=500, label="Images Description.")
#
#     class Meta:
#         model = Images
#         fields = ('title', 'description',)
#         # exclude = ('user',)
#
#     def __init__(self, *args, **kwargs):
#         UserImagesCollection = kwargs.pop('UserImagesCollection', '')
#
#         super(ImagesModelForm, self).__init__(*args, **kwargs)
#         self.fields['userImages'] = forms.ModelChoiceField(queryset=UserImagesCollection.objects.filter(owner=UserImagesCollection))
#
#
# class ImageForm(forms.Form):
#     image = forms.ImageField(label='Image', widget=forms.ClearableFileInput(attrs={'multiple': True}))
#     class Meta:
#         # model = Images
#         fields = ('image', )
#
class ImagesAddForm(forms.Form):
    # title = forms.CharField(max_length=128,required=True)
    # description = forms.CharField(max_length=500, label="Images Description.", required=False)
    image_field = forms.ImageField(label='image_field', widget=forms.ClearableFileInput(attrs={'multiple': True}))


class ImagesMetaInfoUpdateForm(forms.Form):
    title = forms.CharField(max_length=128, required=True)
    description = forms.CharField(max_length=500, label="Images Description.", required=False)

    def clean_title(self):
        title = self.cleaned_data['title']
        if UserImagesCollection.objects.filter(title=title).exists():
            raise ValidationError("Image project with this Title already exists.")
        return title
    # image_field = forms.ImageField(label='Image', widget=forms.ClearableFileInput(attrs={'multiple': True}))

    # def clean(self):
    #     cleaned_data = super().clean()
    #     title = cleaned_data.get("title")
    #
    #     if title in Images.objects.get(title=title):
    #         # Only do something if both fields are valid so far.
    #
    #             raise forms.ValidationError(
    #                 "Another image project with this title already exists!"
    #             )


class ImagesForm(forms.Form):
    title = forms.CharField(max_length=128, required=False)
    description = forms.CharField(max_length=500, label="Images Description.", required=False)

    # image_field = forms.ImageField(label='Images', widget=forms.ClearableFileInput(attrs={'multiple': True}))
    # directories = forms.CharField(label='directories', max_length=256, required=False)

    def clean_title(self):
        title = self.cleaned_data['title']
        if UserImagesCollection.objects.filter(title=title).exists():
            raise ValidationError("Image project with this Title already exists.")
        return title

    # def validate_unique(self):
    #
    #     if self.title in Images.objects.get(title=title):
    #         # Only do something if both fields are valid so far.
    #
    #         raise forms.ValidationError(
    #             "Another image project with this title already exists!"
    #         )
    # class Meta:
    #     fields = ('title', 'body',)
    # class Meta:
    #     # model = Images
    #     fields = ('image',)


class JobForm(forms.ModelForm):
    class Meta:
        model = Job
        fields = (
            'job_name', 'job_description', 'userImagesCollection', 'gen_model', 'force_focal_len_calc', 'focal_len',
            'surface_recon', 'surface_recon_depth', 'surface_recon_colour',
            'poisson_recon_sample_per_node', 'poisson_recon_density', 'ssd_recon_degree',
            'surface_trim', 'surface_trim_trim_threshold', 'surface_trim_polygon_mesh', 'surface_trim_smooth',
            'job_note', 'job_priority',
        )
        labels = {
            "userImagesCollection": "Image Project"
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user')
        super(JobForm, self).__init__(*args, **kwargs)
        self.fields['userImagesCollection'].queryset = UserImagesCollection.objects.filter(user=user)

    #
    # def __init__(self, *args, **kwargs):
    #     super().__init__(*args, **kwargs)
    #     self.fields['userImagesCollection'].queryset = UserImagesCollection.objects.filter(user= self.instance.user)
