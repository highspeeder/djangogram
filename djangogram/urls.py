from django.contrib import admin
from django.urls import path
from content.views import Main

urlpatterns = [
    path("admin/", admin.site.urls),
    path("main/", Main.as_view())
]
