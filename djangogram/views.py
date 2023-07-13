from django.shortcuts import render
from rest_framework.views import APIView


class Sub(APIView):
    def get(self, request):
        print('get으로 호출')

        post1 = {
            "user": "dummy",
            "postImage": "https://source.unsplash.com/random/1",
            "likes": 21,
            "timestamp": "12시간",
        }

        post2 = {
            "user": "dummy",
            "postImage": "https://source.unsplash.com/random/2",
            "likes": 100,
            "timestamp": "1일",
        }

        post3 = {
            "user": "dummy",
            "postImage": "https://source.unsplash.com/random/3",
            "likes": 215,
            "timestamp": "2일",
        }

        posts = [post1, post2, post3]

        return render(request, 'djangogram/main.html', {'posts': posts})

    def post(self, request):
        print('Post로 호출')
        return render(request, 'djangogram/main.html')
