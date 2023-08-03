from django.db import models


# Create your models here.
class Feed(models.Model):
    content = models.TextField()  # 글내용
    image = models.TextField()  # 피드이미지
    email = models.EmailField(default='')  # 이메일


class Like(models.Model):
    feed_id = models.IntegerField(default=0)
    email = models.EmailField(default='')
    is_like = models.BooleanField(default=False)


class Reply(models.Model):
    feed_id = models.IntegerField(default=0)
    email = models.EmailField(default='')
    reply_content = models.TextField()


class Bookmark(models.Model):
    feed_id = models.IntegerField(default=0)
    email = models.EmailField(default='')
    is_marked = models.BooleanField(default=False)
