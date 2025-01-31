from httplib2 import Response
from rest_framework.test import APITestCase, APIRequestFactory
from rest_framework.test import force_authenticate
from django.urls import reverse
from rest_framework import status
from .views import CreatePostAPIView, UpdatePostAPIView, DeletePostAPIView, FetchPostAPIView
from. views import CreateCommentAPIView, UpdateCommentAPIView, DeleteCommentAPIView, FetchCommentAPIView
from .views import PostUpvoteAPIView, PostDownvoteAPIView, CommentUpvoteAPIView, CommentDownvoteAPIView
from .views import ListPostsAPIView, ListCommentsOfPostsAPIView

from django.contrib.auth import get_user_model
from users.models import User, UserManager

from .models import Post, Comment

from django.conf.urls import url

class PostTestCase(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.create_view = CreatePostAPIView.as_view()
        self.update_view = UpdatePostAPIView.as_view()
        self.url = '/api/post/create-post'
        self.data = {
            "email": "selen@gmail.com",
            "username": "selen",
            "password": "12345",
            "is_expert": False
        }
        self.post_data = {
            "category" : "Pregnancy",
            "title"    : "Sleep during pregnancy",
            "body"     : "I'm a 4 months pregnant. I have terrible insomnia in recent days. What do you recommend me \
                          to cure it?"
        }
        self.test_user = User.objects.create(**self.data)
        self.test_post = Post.objects.create(**self.post_data, creator = self.test_user)
    
    def test_create_post(self):
        data = {
            "category" : "Pregnancy",
            "title"    : "Sleep during pregnancy",
            "body"     : "I'm a 4 months pregnant. I have terrible insomnia in recent days. What do you recommend me \
                          to cure it?"
        }
        request = self.factory.post(self.url, data, format="json")
        force_authenticate(request, user=self.test_user)
        response = self.create_view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_post(self):
        self.post_data["title"] = "How should I sleep during pregnancy?"
        url_ = '/api/post/update/' + self.test_post.slug + '/'
        kwargs = {"slug" : self.test_post.slug}
        request = self.factory.post( url_,  data=self.post_data,  format="json")
        force_authenticate(request, user=self.test_user)
        response = self.update_view(request, **kwargs)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.post_data["title"], response.data["title"] )
    
    def test_delete_post(self):
        url_ = '/api/post/delete/' + self.test_post.slug + '/'
        kwargs = {"slug" : self.test_post.slug}
        request = self.factory.post( url_,  data=self.post_data,  format="json")
        force_authenticate(request, user=self.test_user)
        response = DeletePostAPIView.as_view()(request, **kwargs)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Post.objects.filter(creator=self.test_user))

