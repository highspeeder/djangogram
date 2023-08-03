from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Feed, Reply, Like, Bookmark
from djangogram.settings import MEDIA_ROOT
import os
from uuid import uuid4
from user.models import User


class Main(APIView):
    def get(self, request):
        feed_object_list = Feed.objects.all().order_by('-id')
        logined_email = request.session.get('email', None)

        if logined_email is None:
            return render(request, 'user/login.html')

        user = User.objects.filter(email=logined_email).first()

        if user is None:
            return render(request, 'user/login.html')

        feed_list = []
        for feed in feed_object_list:
            # 현재 피드에 대한 댓글 가져오기
            reply_list = []
            feed_reply_object_list = Reply.objects.filter(feed_id=feed.id)

            for reply in feed_reply_object_list:
                commented_user = User.objects.filter(email=reply.email).first()

                reply_list.append(dict(reply_content=reply.reply_content,
                                       nickname=commented_user.nickname
                                       ))

            # 현재 피드에 대한 좋아요 수 가져오기
            like_count = Like.objects.filter(
                feed_id=feed.id, is_like=True).count()

            # 현재 접속중인 유저가 이 피드에 좋아요를 눌렀는지 확인
            is_liked = Like.objects.filter(
                feed_id=feed.id, email=logined_email, is_like=True).exists()

            # 현재 접속중인 유저가 이 피드에 북마크를 눌렀는지 확인
            is_marked = Bookmark.objects.filter(
                feed_id=feed.id, email=logined_email, is_marked=True).exists()

            # 데이터 하나의 리스트에 합치기
            feed_list.append(dict(id=feed.id,
                                  image=feed.image,
                                  content=feed.content,
                                  like_count=like_count,
                                  profile_image=user.profile_image,
                                  nickname=user.nickname,
                                  reply_list=reply_list,
                                  is_liked=is_liked,
                                  is_marked=is_marked,
                                  ))

        return render(request, 'content/main.html', context={
            'feeds': feed_list,
            'user': user
        })


class UploadFeed(APIView):
    def post(self, request):
        file = request.FILES['file']
        uuid_name = uuid4().hex
        save_path = os.path.join(MEDIA_ROOT, uuid_name)

        with open(save_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)

        print("이미지저장됨." + uuid_name)

        Feed.objects.create(image=uuid_name,
                            content=request.data.get('content'),
                            email=request.session.get('email', None))

        return Response(status=200)


class Profile(APIView):
    def get(self, request):
        logined_email = request.session.get('email', None)

        if logined_email is None:
            return render(request, 'user/login.html')

        user = User.objects.filter(email=logined_email).first()

        if user is None:
            return render(request, 'user/login.html')

        feed_list = Feed.objects.filter(email=logined_email)
        bookmark_list = list(Bookmark.objects.filter(
            email=logined_email, is_marked=True).values_list('feed_id', flat=True))
        bookmark_feed_list = Feed.objects.filter(id__in=bookmark_list)

        return render(request, 'content/profile_main.html', context={
            'user': user,
            'feed_list': feed_list,
            'bookmark_feed_list': bookmark_feed_list,
        })


class UploadReply(APIView):
    def post(self, request):
        Reply.objects.create(
            feed_id=request.POST.get('feed_id', None),
            reply_content=request.POST.get('reply_content', None),
            email=request.session.get('email', None))

        return Response(status=200)


class ToggleLike(APIView):
    def post(self, request):
        feed_id = request.POST.get('feed_id', None)
        favorite_text = request.POST.get('favorite_text', False)
        email = request.session.get('email', None)

        if favorite_text == 'favorite_border':
            is_like = False
        else:
            is_like = True

        Like.objects.update_or_create(feed_id=feed_id, email=email,
                                      defaults={
                                          'is_like': is_like
                                      })

        like_count = Like.objects.filter(feed_id=feed_id, is_like=True).count()

        return Response(status=200, data={'like_count': like_count})


class ToggleBookmark(APIView):
    def post(self, request):
        feed_id = request.POST.get('feed_id', None)
        bookmark_text = request.POST.get('bookmark_text', False)
        email = request.session.get('email', None)

        if bookmark_text == 'bookmark_border':
            is_marked = False
        else:
            is_marked = True

        Bookmark.objects.update_or_create(feed_id=feed_id, email=email,
                                          defaults={
                                              'is_marked': is_marked
                                          })

        return Response(status=200)
