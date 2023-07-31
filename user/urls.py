from django.urls import path
from .views import Login, Signup, Logout, UploadProfile

urlpatterns = [
    path('login/', Login.as_view()),
    path('signup/', Signup.as_view()),
    path('logout/', Logout.as_view()),
    path('profile/upload/', UploadProfile.as_view()),
]
