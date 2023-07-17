from django.shortcuts import render
from rest_framework.views import APIView
from .models import Feed


# Create your views here.
class Main(APIView):
    def get(self, request):
        print("get호출")
        feed_list = Feed.objects.all().order_by('-id')
        return render(request, 'djangogram/main.html', context={'feeds': feed_list})
