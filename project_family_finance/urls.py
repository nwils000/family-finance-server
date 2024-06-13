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
    path('child-responsibilities/', get_child_responsibilities),
    path('responsibilities/', get_responsibilities),
    path('delete-responsibility/', delete_responsibility),
    path('update-responsibility/', update_responsibility),
    path('approve-responsibility/', approve_responsibility),
    path('complete-responsibility/', complete_responsibility),
    path('set-allowance-period/', set_allowance_period),
    path('refresh/', TokenRefreshView.as_view()),
    path('token/', TokenObtainPairView.as_view()),
]
