from django.urls import path
from .views import UploadFeed, Profile, Main, UploadReply, ToggleLike, ToggleBookmark
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('upload/', UploadFeed.as_view()),
    path('profile/', Profile.as_view()),
    path("main/", Main.as_view()),
    path('reply/', UploadReply.as_view()),
    path('like/', ToggleLike.as_view()),
    path('bookmark/', ToggleBookmark.as_view()),
]

urlpatterns += static(settings.MEDIA_URL,
                      document_root=settings.MEDIA_ROOT)
