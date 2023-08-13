from django.test import TestCase
from django.contrib.auth.hashers import make_password
from user.models import User


# Create your tests here.
class UserTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        User.objects.create(
            email='test_login@test.com',
            nickname='testnickname',
            name='testname',
            password=make_password('testpassword'),
            profile_image='default_profile.png',
        )

    def test(self):
        self.assertEqual(1, 1)

    def test_signup(self):
        response = self.client.post('/user/signup/', data=dict(
            email="test_signup@test.com",
            nickname="1",
            name="2",
            password="3"
        ))
        self.assertEqual(response.status_code, 200)

        user = User.objects.filter(email="test_signup@test.com").first()
        self.assertEqual(user.nickname, "1")
        self.assertEqual(user.name, "2")
        self.assertTrue(user.check_password("3"))

    def test_login(self):
        response = self.client.post('/user/login/', data=dict(
            email='test_login@test.com',
            password='testpassword',
        ))
        self.assertEqual(response.status_code, 200)
