from django.contrib import admin
from django.urls import path, include
from content.views import Main
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path("admin/", admin.site.urls),
    path('', Main.as_view()),
    path('content/', include('content.urls')),
    path('user/', include('user.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
