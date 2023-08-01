from django.db import models


# Create your models here.
class Feed(models.Model):
    content = models.TextField()  # 글내용
    image = models.TextField()  # 피드이미지
    email = models.EmailField(default='')  # 이메일
    like_count = models.IntegerField()  # 좋아요 수
