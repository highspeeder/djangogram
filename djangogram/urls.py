from django.contrib import admin
from django.urls import path
from .views import Sub

urlpatterns = [
    path("admin/", admin.site.urls),
    path("main/", Sub.as_view())
]
