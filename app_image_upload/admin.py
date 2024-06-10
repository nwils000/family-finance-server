from django.contrib import admin
from app_image_upload.models import *


class ProfileAdmin(admin.ModelAdmin):
  pass




admin.site.register(Profile, ProfileAdmin)
