from django.contrib import admin
from app_family_finance.models import *


class ProfileAdmin(admin.ModelAdmin):
  pass
class ResponsibilityAdmin(admin.ModelAdmin):
  pass
class FamilyAdmin(admin.ModelAdmin):
  pass




admin.site.register(Family, FamilyAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Responsibility, ResponsibilityAdmin)
