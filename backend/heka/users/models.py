from re import M
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self,email, is_expert, password=None):
        if not email:
            raise ValueError("Email required!")
        
        user = self.model(
            email = self.normalize_email(email),
            is_expert = is_expert
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password):
        user = self.create_user(
            email=self.normalize_email(email),
            password = password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    email = models.EmailField(verbose_name="email", max_length = 60, unique = True)
    username = models.CharField(max_length=30, null=True, unique=True) 
    date_joined = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length = 255)
    age = models.IntegerField(null=True)
    is_admin = models.BooleanField(default=False)
    is_expert = models.BooleanField(default=False)
 
    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
    
    def has_permission(self, permission, obj=None):
        return self.