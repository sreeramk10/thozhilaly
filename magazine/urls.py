from magazine.views import *
from django.urls import path

# URLConf
urlpatterns = [
    path('', index, name='index'),
    path('archive/', archive, name='archive_list'),
    path('magazine/<slug:slug>/', magazine_detail, name='magazine_detail'),
    path('magazine/<slug:slug>/download/', download_pdf, name='download_pdf'),
    path("developers/", developers, name="developers"),
]