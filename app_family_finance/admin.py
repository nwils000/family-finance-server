from django.contrib import admin
from app_family_finance.models import *


class ProfileAdmin(admin.ModelAdmin):
  pass
class ResponsibilityAdmin(admin.ModelAdmin):
  pass
class FamilyAdmin(admin.ModelAdmin):
  pass
class PurchaseAdmin(admin.ModelAdmin):
  pass
class IndividualInvestmentAdmin(admin.ModelAdmin):
  pass
class FinancialAccountAdmin(admin.ModelAdmin):
  pass



admin.site.register(FinancialAccount, FinancialAccountAdmin)
admin.site.register(IndividualInvestment, IndividualInvestmentAdmin)
admin.site.register(Purchase, PurchaseAdmin)
admin.site.register(Family, FamilyAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Responsibility, ResponsibilityAdmin)
