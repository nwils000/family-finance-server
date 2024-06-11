from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import (
  TokenObtainPairView,
  TokenRefreshView,
)
from app_family_finance.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('profile/', get_profile),
    path('create-user/', create_user),
    path('create-responsibility/', create_responsibility),
    path('refresh/', TokenRefreshView.as_view()),
    path('token/', TokenObtainPairView.as_view()),
]
