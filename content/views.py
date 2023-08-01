from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Feed, Reply, Like
from djangogram.settings import MEDIA_ROOT
import os
from uuid import uuid4
from user.models import User


class Main(APIView):
    def get(self, request):
        feed_object_list = Feed.objects.all().order_by('-id')

        logined_email = request.session.get('email', None)
        print('로그인한 사용자 =', logined_email)

        if logined_email is None:
            return render(request, 'user/login.html')

        feed_list = []
        for feed in feed_object_list:
            reply_list = []
            user = User.objects.filter(email=logined_email).first()

            if user is None:
                return render(request, 'user/login.html')

            feed_reply_object_list = Reply.objects.filter(feed_id=feed.id)

            for reply in feed_reply_object_list:
                commented_user = User.objects.filter(email=reply.email).first()

                reply_list.append(dict(reply_content=reply.reply_content,
                                       nickname=commented_user.nickname
                                       ))

            feed_list.append(dict(id=feed.id,
                                  image=feed.image,
                                  content=feed.content,
                                  like_count=feed.like_count,
                                  profile_image=user.profile_image,
                                  nickname=user.nickname,
                                  reply_list=reply_list,
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


class UploadReply(APIView):
    def post(self, request):
        feed_id = request.POST.get('feed_id', None)
        reply_content = request.POST.get('reply_content', None)
        email = request.session.get('email', None)

        Reply.objects.create(
            feed_id=feed_id, reply_content=reply_content, email=email)

        return Response(status=200)
