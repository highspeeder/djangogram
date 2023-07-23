from django.contrib import admin
from django.urls import path
from content.views import Main, UploadFeed
from django.conf.urls.static import static
from .settings import MEDIA_ROOT, MEDIA_URL

urlpatterns = [
    path("admin/", admin.site.urls),
    path("main/", Main.as_view()),
    path('content/upload/', UploadFeed.as_view()),
]

urlpatterns += static(MEDIA_URL, document_root=MEDIA_ROOT)
