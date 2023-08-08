import os
from uuid import uuid4
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User
from django.contrib.auth.hashers import make_password
from djangogram.settings import MEDIA_ROOT
import logging

is_singup = False
logger = logging.getLogger(__name__)


class Signup(APIView):
    def get(self, request):
        is_singup = True
        return render(request, "user/singup.html", {'is_singup': is_singup})

    def post(self, request):
        email = request.POST['email']
        nickname = request.POST['nickname']
        name = request.POST['name']
        password = request.POST['password']

        User.objects.create(email=email,
                            nickname=nickname,
                            name=name,
                            password=make_password(password),
                            profile_image='default_profile.png')

        return Response(status=200)


class Login(APIView):
    def get(self, request):
        is_singup = False
        return render(request, "user/login.html", {'is_singup': is_singup})

    def post(self, request):
        email = request.POST['email']
        password = request.POST['password']

        user = User.objects.filter(email=email).first()

        if user is None:
            return Response(status=404, data=dict(message='회원정보가 잘못되었습니다.'))

        if user.check_password(password):
            # 세션 or 쿠키에 정보를 넣는다.
            request.session['email'] = email
            return Response(status=200)
        else:
            return Response(status=404, data=dict(message='회원정보가 잘못되었습니다.'))


class Logout(APIView):
    def get(self, request):
        request.session.flush()
        is_singup = False
        return render(request, "user/login.html", {'is_singup': is_singup})


class UploadProfile(APIView):
    def post(self, request):
        file = request.FILES['file']
        email = request.POST['email']

        user = User.objects.filter(email=email).first()

        # 기존 프로필 이미지 삭제
        delete_file_path = os.path.join(MEDIA_ROOT, user.profile_image)
        logger.info('기존 프로필 이미지 경로 : ' + delete_file_path)
        if 'default_profile.png' not in delete_file_path:
            os.remove(delete_file_path)

        # media에 이미지 저장
        uuid_name = uuid4().hex
        save_path = os.path.join(MEDIA_ROOT, uuid_name)

        with open(save_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)

        print("이미지저장됨." + uuid_name)

        # DB에 저장
        user.profile_image = uuid_name
        user.save()

        return Response(status=200)
