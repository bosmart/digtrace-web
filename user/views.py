from django.shortcuts import render, redirect

from user.form import UserCreationForm
from django.contrib import messages
from django.http import *
from django.shortcuts import render_to_response, redirect
from django.contrib.auth.decorators import login_required


def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'{username}, you have successfully signed up!')
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'user/register.html', {'form': form})


@login_required
def profile(request):
    return render(request, 'user/profile.html')
