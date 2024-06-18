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
    path('create-store-item/', create_store_item),
    path('update-store-item/', update_store_item),
    path('get-store-items/', get_store_items),
    path('delete-store-items/', delete_store_items),
    path('approve-store-item/', approve_store_item),
    path('purchase-store-item/', purchase_store_item),
    path('list-unnaproved-purchases/', list_unapproved_purchases),
    path('approve-purchase/', update_purchase_approval),
    path('list-account-types/', list_account_types),
    path('update-account/', update_account),
    path('create-account/', create_account),
    path('view-available-accounts/', view_available_accounts),
    path('delete-account/', delete_account),
    path('invest-money/', invest_money),
    path('cash-out/', cash_out),
    path('view-investments/', view_investments),
    path('refresh/', TokenRefreshView.as_view()),
    path('token/', TokenObtainPairView.as_view()),
]

 
