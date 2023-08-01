from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Feed
from djangogram.settings import MEDIA_ROOT
import os
from uuid import uuid4
from user.models import User


class Main(APIView):
    def get(self, request):
        feed_object_list = Feed.objects.all().order_by('-id')

        logined_email = request.session.get('email', None)
        user = User.objects.filter(email=logined_email).first()

        print('로그인한 사용자 =', logined_email)

        if logined_email is None:
            return render(request, 'user/login.html')

        if user is None:
            return render(request, 'user/login.html')

        feed_list = []

        for feed in feed_object_list:
            feed_list.append(dict(image=feed.image,
                                  content=feed.content,
                                  like_count=feed.like_count,
                                  profile_image=user.profile_image,
                                  nickname=user.nickname,
                                  ))

        return render(request, 'content/main.html', context={
            'feeds': feed_list,
            'user': user
        })


class UploadFeed(APIView):
    def post(self, request):
        # media에 이미지 저장
        file = request.FILES['file']
        uuid_name = uuid4().hex
        save_path = os.path.join(MEDIA_ROOT, uuid_name)
        with open(save_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)

        print("이미지저장됨." + uuid_name)

        image = uuid_name
        content = request.data.get('content')
        email = request.session.get('email', None)

        Feed.objects.create(image=image, content=content,
                            email=email, like_count=0)

        return Response(status=200)


class Profile(APIView):
    def get(self, request):
        logined_email = request.session.get('email', None)

        print('로그인한 사용자 =', logined_email)

        if logined_email is None:
            return render(request, 'user/login.html')

        user = User.objects.filter(email=logined_email).first()

        if user is None:
            return render(request, 'user/login.html')

        return render(request, 'content/profile_main.html', context={
            'user': user
        })
