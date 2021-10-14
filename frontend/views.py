from django.shortcuts import render
from decouple import config


def list(request):
    return render(
        request, 'frontend/list.html', 
        context={'SITE_URL': config('SITE_URL')})
    