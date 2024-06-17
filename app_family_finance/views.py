from django.utils import timezone
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .models import *
from .serializers import *

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
  user = request.user
  profile = user.profile
  today = timezone.localdate()
  yesterday = today - timezone.timedelta(days=1)

  family = profile.family
  day_of_week = today.isoweekday()
  day_of_month = today.day

  # Determine if today is the correct allowance day
  process_weekly = family.allowance_period_type == 'Weekly' and day_of_week == family.allowance_day
  process_monthly = family.allowance_period_type == 'Monthly' and day_of_month == family.allowance_day

  if (process_weekly or process_monthly) and (family.last_allowance_date != today):
    eligible_children = family.members.filter(parent=False)
    for child in eligible_children:     
      if family.last_allowance_date:
        responsibilities = child.responsibilities.filter(
          completed=True, 
          verified=True,
          date__gte=family.last_allowance_date, 
          date__lt=today
        )
      else:
        responsibilities = child.responsibilities.filter(
          completed=True, 
          verified=True,
          date__lt=today
        )

      total_difficulty_points = sum(resp.difficulty for resp in responsibilities)
      allowance = total_difficulty_points * family.price_per_difficulty_point
      child.total_money += allowance
      child.save()

    # Update last allowance date to today
    family.last_allowance_date = today
    family.save()

  serializer = ProfileSerializer(profile, many=False)
  return Response(serializer.data)

@api_view(['POST'])
@permission_classes([])
def create_user(request):
  family_hub_name = request.data.get('family_hub_name')
  invitation_code = request.data.get('family_hub_invitation_code')

  if family_hub_name:
    family = Family.objects.get_or_create(name=family_hub_name)
  elif invitation_code:
    family = Family.objects.get(invitation_code=invitation_code)  


  user = User.objects.create(username=request.data.get('username'))
  user.set_password(request.data.get('password'))
  user.save()

  profile = Profile.objects.create(
      user=user,
      first_name=request.data.get('first_name'),
      last_name=request.data.get('last_name'),
      family=family,
      parent=request.data.get('parent')  
  )

  profile_serialized = ProfileSerializer(profile)
  return Response(profile_serialized.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_responsibility(request):
  profile = Profile.objects.get(id=request.data['profile_id'])
  title = request.data.get('title')
  date = request.data.get('date')
  description = request.data.get('description')
  difficulty = request.data.get('difficulty')
  verified = request.data.get('verified')
  print("*********************************************************", verified)
  if profile.parent:
    responsibility = Responsibility.objects.create(profile=profile, verified=verified, title=title, date=date, difficulty=difficulty, description=description)
    responsibility.save()
    responsibility_serialized = ResponsibilitySerializer(responsibility) 
    return Response(responsibility_serialized.data)
  else: 
    responsibility = Responsibility.objects.create(profile=profile, verified=verified, title=title, date=date, difficulty=difficulty, description=description)  
    responsibility.save()
    responsibility_serialized = ResponsibilitySerializer(responsibility) 
    return Response(responsibility_serialized.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_responsibilities(request):
  profile = request.user.profile
  responsibilities = profile.responsibilities.all()
  serializer = ResponsibilitySerializer(responsibilities, many=True)
  return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_responsibility(request):
  profile = Profile.objects.get(id=request.data['profile_id'])
  res_id = request.data.get('id')
  responsibility = profile.responsibilities.get(id=res_id)
  responsibility.delete()
  responsibilities = profile.responsibilities.all()
  serializer = ResponsibilitySerializer(responsibilities, many=True)
  return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_responsibility(request):
  profile = Profile.objects.get(id=request.data['profile_id'])
  res_id = request.data.get('id')
  responsibility = profile.responsibilities.get(id=res_id)
  responsibility.title = request.data['title']
  responsibility.description = request.data['description']
  responsibility.difficulty = request.data['difficulty']
  responsibility.completed = request.data['completed']
  responsibility.save()
  serializer = ResponsibilitySerializer(responsibility, many=False)
  return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def approve_responsibility(request):
  res_id = request.data.get('id')
  responsibility = Responsibility.objects.get(id=res_id)
  responsibility.difficulty = request.data['difficulty']
  responsibility.verified = request.data['verified']
  responsibility.save()
  serializer = ResponsibilitySerializer(responsibility, many=False)
  return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def complete_responsibility(request):
  profile = request.user.profile
  res_id = request.data.get('id')
  responsibility = profile.responsibilities.get(id=res_id)
  responsibility.completed = request.data['completed']
  responsibility.save()
  serializer = ResponsibilitySerializer(responsibility, many=False)
  return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_child_responsibilities(request):
  profile = Profile.objects.get(id=request.query_params['child_id'])
  responsibilities = profile.responsibilities.all()
  serializer = ResponsibilitySerializer(responsibilities, many=True)
  return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_allowance_period(request):
  profile = request.user.profile
  period_type = request.data.get('period_type')  # Weekly or Monthly
  print("**********************************", period_type)
  allowance_day = int(request.data.get('allowance_day'))  # Day of the week 1-7 or day of the month 1-31

  family = profile.family
  family.allowance_period_type = period_type
  family.allowance_day = allowance_day
  family.save()

  return Response({"message": "Allowance period set successfully"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_store_item(request):
  profile = request.user.profile
  if profile.parent:
    item = StoreItem.objects.create(
      name=request.data.get('name'),
      price=request.data.get('price'),
      approved=True,
      family=request.user.profile.family
    )
    store_items = profile.family.store_items.all()
    serializer = StoreItemSerializer(store_items, many=True)
    return Response(serializer.data)
  else:
    item = StoreItem.objects.create(
      name=request.data.get('name'),
      price=request.data.get('price'),
      family=request.user.profile.family
    )
    store_items = profile.family.store_items.all()
    serializer = StoreItemSerializer(store_items, many=True)
    return Response(serializer.data)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_store_item(request):
  item_id = request.data.get('id')  
  profile = request.user.profile
  
  item = StoreItem.objects.get(id=item_id, family=request.user.profile.family)  
  item.name = request.data.get('name')
  item.price = request.data.get('price')
  item.save()
  store_items = profile.family.store_items.all()
  serializer = StoreItemSerializer(store_items, many=True)
  return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_store_items(request):
  profile = request.user.profile

  store_items = profile.family.store_items.all()
  serializer = StoreItemSerializer(store_items, many=True)
  return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_store_items(request):
  profile = request.user.profile

  item_id = request.data.get('item_id')
  item = StoreItem.objects.get(id=item_id)
  item.delete()
  store_items = profile.family.store_items.all()
  serializer = StoreItemSerializer(store_items, many=True)
  return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def approve_store_item(request):
  item_id = request.data.get('id')  
  profile = request.user.profile
  
  item = StoreItem.objects.get(id=item_id, family=request.user.profile.family)  
  item.approved = True
  item.save()
  store_items = profile.family.store_items.all()
  serializer = StoreItemSerializer(store_items, many=True)
  return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def purchase_store_item(request):
  item_id = request.data.get('id')  
  profile = request.user.profile
  
  item = StoreItem.objects.get(id=item_id, family=profile.family)
  if profile.total_money >= item.price: 
    profile.total_money -= item.price
    profile.save()

    Purchase.objects.create(profile=profile, item=item)

    serializer = ProfileSerializer(profile, many=False)
    return Response(serializer.data)
  else:
    return Response({'message': 'Not enough funds'}, status=400)
  
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_unapproved_purchases(request):
    profile = request.user.profile

    unapproved_purchases = Purchase.objects.filter(profile__family=profile.family, approved=False)
    serializer = PurchaseSerializer(unapproved_purchases, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_purchase_approval(request):
  purchase_id = request.data.get('id')
  print("****************************************", purchase_id)
  approved = request.data.get('approved')
  purchase = Purchase.objects.get(id=purchase_id)
  purchase.approved = approved
  purchase.save()
  serializer = PurchaseSerializer(purchase)
  return Response(serializer.data)


# ALL INVESTMENT ACCOUNT LOGIC

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_account_types(request):
    if not request.user.profile.is_parent:
        return Response({"error": "Only parents can access this information."})

    account_types = FinancialAccount.ACCOUNT_TYPE_CHOICES  # Assuming this is defined in your model
    return Response({"account_types": account_types})

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_account(request, pk):
    account = FinancialAccount.objects.get(pk=pk, family=request.user.profile.family)
    
    if not request.user.profile.is_parent:
        return Response({"error": "Only parents can update accounts."})
    
    serializer = FinancialAccountSerializer(account, data=request.data)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_account(request):
    if not request.user.profile.is_parent:
        return Response({"error": "Only parents can create accounts."})
    
    serializer = FinancialAccountSerializer(data=request.data)
    serializer.save(family=request.user.profile.family)
    return Response(serializer.data)
 

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_available_accounts(request):
    if not request.user.profile.family:
        return Response({"error": "User does not belong to any family."})
    
    accounts = FinancialAccount.objects.filter(family=request.user.profile.family)
    serializer = FinancialAccountSerializer(accounts, many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_account(request, pk):   
    account = FinancialAccount.objects.get(pk=pk, family=request.user.profile.family)
    
    if not request.user.profile.is_parent:
        return Response({"error": "Only parents can delete accounts."})
    
    account.delete()
    return Response({"message": "Account deleted successfully."})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def invest_money(request, account_id):
    account = FinancialAccount.objects.get(id=account_id, family=request.user.profile.family)

    amount = request.data.get('amount')  

    if amount is None:
        return Response({"error": "Amount is required."})

    if request.user.profile.total_money < amount:
        return Response({"error": "Insufficient funds."})

    request.user.profile.total_money -= amount
    request.user.profile.save()

    investment, created = IndividualInvestment.objects.get_or_create(
        financial_account=account,
        child_profile=request.user.profile,
        defaults={'amount_invested': amount, 'returns': 0.00}
    )

    if not created:
        investment.amount_invested += amount
        investment.save()

    return Response({"message": "Investment successful."})