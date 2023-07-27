from django.shortcuts import render
from rest_framework.views import APIView

is_singup = False


class Login(APIView):
    def get(self, request):
        is_singup = False
        return render(request, "user/login.html", {'is_singup': is_singup})

    def post(self, request):
        # TODO 로그인
        pass


class Signup(APIView):
    def get(self, request):
        is_singup = True
        return render(request, "user/singup.html", {'is_singup': is_singup})

    def post(self, request):
        # TODO 회원가입
        pass
