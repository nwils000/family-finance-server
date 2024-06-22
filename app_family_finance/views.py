from django.utils import timezone
from decimal import Decimal
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .models import *
from .serializers import *
from datetime import timedelta, datetime
import calendar
import random

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
  user = request.user
  profile = user.profile
  today = timezone.localdate()
  family = profile.family
  
  day_of_week = today.isoweekday()
  day_of_month = today.day
  day_of_year_today = today.timetuple().tm_yday

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
        
    family.last_allowance_date = today
    family.save()
    
  for account in family.financial_accounts.all():
    process_interest = False
    
    if account.interest_period_type == 'Weekly' and day_of_week == account.interest_day:
      process_interest = True
    elif account.interest_period_type == 'Monthly' and day_of_month == account.interest_day:
      process_interest = True
    elif account.interest_period_type == 'Yearly' and day_of_year_today == account.interest_day:
      process_interest = True

    if process_interest and account.last_interest_paid_date != today:

      for investment in account.investments.all():   

        if account.account_type == 'investment': 

          change = random.choice(['gain', 'loss'])
          if change == 'gain':
  
            potential_gain = investment.amount_invested * (account.potential_gain / 100)
            investment.returns += potential_gain

          else:  
            potential_loss = investment.amount_invested * (account.potential_loss / 100)
            investment.returns -= potential_loss

        else:
          interest_earned = investment.amount_invested * (account.interest_rate / 100)
          investment.returns += interest_earned

        investment.save()
          
      account.last_interest_paid_date = today
      account.save()

  serializer = ProfileSerializer(profile, many=False)
  return Response(serializer.data)

@api_view(['POST'])
@permission_classes([])
def create_user(request):
  family_hub_name = request.data.get('family_hub_name')
  invitation_code = request.data.get('family_hub_invitation_code')

  if invitation_code:
    try:
      family = Family.objects.get(invitation_code=invitation_code)
    except Family.DoesNotExist:
      return Response({'message': 'Invalid invitation code'}, status=404)
  elif family_hub_name:

    family = Family.objects.create(name=family_hub_name)
  else:
    return Response({'message': 'Either family hub name or invitation code is required'}, status=400)

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
    start_date_str = request.data.get('date')
    start_date = timezone.datetime.strptime(start_date_str, '%Y-%m-%d').date()
    description = request.data.get('description')
    difficulty = request.data.get('difficulty')
    verified = request.data.get('verified')
    repeat_info = request.data.get('repeat')

    repeat_days = repeat_info.get('details', [])
    type_of_repeat = repeat_info.get('type')

    series = ResponsibilitySeries.objects.create(
        title=title,
        start_date=start_date,
        repeat_type=type_of_repeat,
        repeat_days=','.join(map(str, repeat_days))
    )

    responsibilities = []
    dates_to_create = []

    if type_of_repeat == 'none':
        dates_to_create.append(start_date)
    elif type_of_repeat == 'weekly':
        weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        repeat_days = [weekdays.index(day) for day in repeat_days]
        for day in repeat_days:
            next_date = start_date
            while next_date.weekday() != day:
                next_date += timedelta(days=1)
            end_date = start_date + timedelta(days=365)
            while next_date <= end_date:
                dates_to_create.append(next_date)
                next_date += timedelta(days=7)
    elif type_of_repeat == 'monthly':
        repeat_days = [int(day) for day in repeat_days]
        for day in repeat_days:
            month = start_date.month
            year = start_date.year
            if day > calendar.monthrange(year, month)[1]:
                day = calendar.monthrange(year, month)[1] 
            next_date = start_date.replace(day=day)
            end_date = start_date + timedelta(days=365)
            while next_date <= end_date:
                last_day_of_month = calendar.monthrange(next_date.year, next_date.month)[1]
                if day > last_day_of_month:
                    next_date = datetime(next_date.year, next_date.month, last_day_of_month).date()
                else:
                    next_date = datetime(next_date.year, next_date.month, day).date()
                dates_to_create.append(next_date)
                if next_date.month == 12:
                    next_date = datetime(next_date.year + 1, 1, day).date()
                else:
                    month = next_date.month + 1
                    year = next_date.year
                    last_day_of_month = calendar.monthrange(year, month)[1]
                    if day > last_day_of_month:
                        next_date = datetime(year, month, last_day_of_month).date()
                    else:
                        next_date = datetime(year, month, day).date()

    dates_to_create = sorted(list(set(dates_to_create)))
    is_single_instance = len(dates_to_create) == 1  

    for responsibility_date in dates_to_create:
        responsibility = Responsibility.objects.create(
            profile=profile,
            title=title,
            date=responsibility_date,
            description=description,
            difficulty=difficulty,
            verified=verified,
            series=series,
            single=is_single_instance  
        )
        responsibilities.append(responsibility)

    serialized_responsibilities = ResponsibilitySerializer(responsibilities, many=True)
    return Response(serialized_responsibilities.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_responsibility_series(request):
  profile = Profile.objects.get(id=request.data['profile_id'])
  series_id = request.data.get('series_id')
  series = ResponsibilitySeries.objects.get(id=series_id)
  series.title = request.data.get('title', series.title)
  series.start_date = timezone.datetime.strptime(request.data.get('start_date', series.start_date.strftime('%Y-%m-%d')), '%Y-%m-%d').date()
  series.repeat_type = request.data.get('repeat', {}).get('type', series.repeat_type)
  series.repeat_days = ','.join(map(str, request.data.get('repeat', {}).get('details', series.repeat_days.split(','))))
  series.save()

  series.responsibilities.all().delete()

  start_date = series.start_date
  end_date = start_date + timedelta(days=365)
  type_of_repeat = series.repeat_type
  dates_to_create = []

  if type_of_repeat == 'weekly':
    weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    repeat_days = [weekdays.index(day.strip()) for day in series.repeat_days.split(',')]
    for day in repeat_days:
      next_date = start_date
      while next_date.weekday() != day:
        next_date += timedelta(days=1)
      while next_date <= end_date:
        dates_to_create.append(next_date)
        next_date += timedelta(days=7)
  elif type_of_repeat == 'monthly':
    repeat_days = [int(day.strip()) for day in series.repeat_days.split(',')]
    for day in repeat_days:
      year = start_date.year
      month = start_date.month
      if day > calendar.monthrange(year, month)[1]:
        day = calendar.monthrange(year, month)[1]
      next_date = datetime(year, month, day).date()
      while next_date <= end_date:
        dates_to_create.append(next_date)
        if next_date.month == 12:
          next_date = datetime(next_date.year + 1, 1, day).date()
        else:
          month = next_date.month + 1
          year = next_date.year
          if day > calendar.monthrange(year, month)[1]:
            day = calendar.monthrange(year, month)[1]
          next_date = datetime(year, month, day).date()

  dates_to_create = sorted(list(set(dates_to_create)))

  responsibilities = []
  for responsibility_date in dates_to_create:
    if responsibility_date >= start_date:
      responsibility = Responsibility.objects.create(
        profile=profile,
        title=series.title,
        date=responsibility_date,
        description=request.data.get('description'),
        difficulty=request.data.get('difficulty'),
        verified=request.data.get('verified'),
        series=series,
        single = False
      )
      responsibilities.append(responsibility)

  serialized_responsibilities = ResponsibilitySerializer(responsibilities, many=True)
  return Response(serialized_responsibilities.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def complete_responsibility_series(request):
  profile = Profile.objects.get(id=request.data['profile_id'])
  series = ResponsibilitySeries.objects.get(id=request.data['series_id'])
  completed_status = True

  responsibilities = series.responsibilities.all()
  for responsibility in responsibilities:
    responsibility.completed = completed_status
    responsibility.completion_date = timezone.now() if completed_status else None
    responsibility.save()

  serializer = ResponsibilitySerializer(responsibilities, many=True)
  return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def approve_whole_series(request):
  series_id = request.data.get('series_id')
  series = ResponsibilitySeries.objects.get(id=series_id)
  profile = Profile.objects.get(id=request.data['profile_id'])

  series.title = request.data.get('title', series.title)
  series.start_date = timezone.datetime.strptime(request.data.get('start_date', series.start_date.strftime('%Y-%m-%d')), '%Y-%m-%d').date()
  series.repeat_type = request.data.get('repeat', {}).get('type', series.repeat_type)
  series.repeat_days = ','.join(map(str, request.data.get('repeat', {}).get('details', series.repeat_days.split(','))))
  series.save()

  series.responsibilities.all().delete()
  start_date = series.start_date
  end_date = start_date + timedelta(days=365)
  type_of_repeat = series.repeat_type
  dates_to_create = []

  if type_of_repeat == 'weekly':
    weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    repeat_days = [weekdays.index(day.strip()) for day in series.repeat_days.split(',')]
    for day in repeat_days:
      next_date = start_date
      while next_date.weekday() != day:
        next_date += timedelta(days=1)
      while next_date <= end_date:
        dates_to_create.append(next_date)
        next_date += timedelta(days=7)
  elif type_of_repeat == 'monthly':
    repeat_days = [int(day.strip()) for day in series.repeat_days.split(',')]
    for day in repeat_days:
      year = start_date.year
      month = start_date.month
      if day > calendar.monthrange(year, month)[1]:
        day = calendar.monthrange(year, month)[1]
      next_date = datetime(year, month, day).date()
      while next_date <= end_date:
        dates_to_create.append(next_date)
        if next_date.month == 12:
          next_date = datetime(next_date.year + 1, 1, day).date()
        else:
          month = next_date.month + 1
          year = next_date.year
          if day > calendar.monthrange(year, month)[1]:
            day = calendar.monthrange(year, month)[1]
          next_date = datetime(year, month, day).date()

  for responsibility_date in dates_to_create:
    if responsibility_date >= start_date:
      responsibility = Responsibility.objects.create(
        profile=profile,
        title=series.title,
        date=responsibility_date,
        description=request.data.get('description', ""),
        difficulty=request.data.get('difficulty', 1),
        verified=True, 
        series=series,
        single=False
      )

  return Response({'message': 'All responsibilities updated and verified successfully'})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_responsibility_series(request):
  series_id = request.data.get('series_id')
  
  series = ResponsibilitySeries.objects.get(id=series_id)
  series.delete()
  return Response({"message": "ResponsibilitySeries deleted successfully"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_responsibilities(request):
  profile = request.user.profile

  responsibilities = profile.responsibilities.all().order_by('date') 
  serializer = ResponsibilitySerializer(responsibilities, many=True)
  return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_responsibility(request):
  
  
  profile = Profile.objects.get(id=request.data['profile_id'])
  res_id = request.data.get('id')
  
  responsibility = profile.responsibilities.get(id=res_id)
  
  responsibility.delete()
  responsibilities = profile.responsibilities.all().order_by('date') 
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
  responsibility.title = request.data['title']
  responsibility.description = request.data['description']
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
  responsibilities = profile.responsibilities.all().order_by('date') 
  serializer = ResponsibilitySerializer(responsibilities, many=True)
  return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_allowance_period(request):
  profile = request.user.profile
  period_type = request.data.get('period_type')  
  
  allowance_day = int(request.data.get('allowance_day'))  

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
    store_items = profile.family.store_items.all().order_by('price') 
    serializer = StoreItemSerializer(store_items, many=True)
    return Response(serializer.data)
  else:
    item = StoreItem.objects.create(
      name=request.data.get('name'),
      price=request.data.get('price'),
      family=request.user.profile.family
    )
    store_items = profile.family.store_items.all().order_by('price') 
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
  store_items = profile.family.store_items.all().order_by('price') 
  serializer = StoreItemSerializer(store_items, many=True)
  return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_store_items(request):
  profile = request.user.profile

  store_items = profile.family.store_items.all().order_by('price') 
  serializer = StoreItemSerializer(store_items, many=True)
  return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_store_items(request):
  profile = request.user.profile

  item_id = request.data.get('item_id')
  item = StoreItem.objects.get(id=item_id)
  item.delete()
  store_items = profile.family.store_items.all().order_by('price') 
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
  store_items = profile.family.store_items.all().order_by('price') 
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
  if not request.user.profile.parent:
    return Response({"error": "Only parents can access this information."})

  account_types = FinancialAccount.ACCOUNT_TYPE_CHOICES 
  return Response({"account_types": account_types})

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_account(request):
  account = FinancialAccount.objects.get(id=request.data.get('id'), family=request.user.profile.family)
  
  if not request.user.profile.parent:
    return Response({"error": "Only parents can update accounts."})
  
  account.interest_period_type=request.data.get('interest_period_type')
  account.interest_day=request.data.get('interest_day')
  account.family=request.user.profile.family
  account.account_type=request.data.get('account_type')
  account.interest_rate=request.data.get('interest_rate')
  
  account.save()
  serializer = FinancialAccountSerializer(account)
  return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_account(request):
  if not request.user.profile.parent:
    return Response({"error": "Only parents can create accounts."})

  account_type = request.data.get('account_type')
  interest_rate = request.data.get('interest_rate')
  interest_period_type = request.data.get('interest_period_type')
  interest_day = request.data.get('interest_day')
  family = request.user.profile.family

  account_data = {
    'family': family,
    'account_type': account_type,
    'interest_rate': interest_rate,
    'interest_period_type': interest_period_type,
    'interest_day': interest_day
  }

  if account_type == 'Investment':
    potential_gain = request.data.get('potential_gain')
    potential_loss = request.data.get('potential_loss')
    account_data['potential_gain'] = potential_gain
    account_data['potential_loss'] = potential_loss

  account = FinancialAccount.objects.create(**account_data)
  serializer = FinancialAccountSerializer(account)
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
def delete_account(request):   
  account = FinancialAccount.objects.get(id=request.data.get('id'), family=request.user.profile.family)

  if not request.user.profile.parent:
    return Response({"error": "Only parents can delete accounts."})
  
  account.delete()
  return Response({"message": "Account deleted successfully."})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def invest_money(request):
  account = FinancialAccount.objects.get(
    id=request.data.get('account_id'), family=request.user.profile.family
  )
  amount = request.data.get('amount')

  if amount is None:
    return Response({"error": "Amount is required."})
  amount = Decimal(amount)  

  total_money = Decimal(request.user.profile.total_money)  

  if total_money < amount:
    return Response({"error": "Insufficient funds."})

  try:
    investment = IndividualInvestment.objects.get(
      financial_account=account, child_profile=request.user.profile
    )
    total_money -= amount
    request.user.profile.total_money = total_money 
    request.user.profile.save()
    investment.amount_invested += amount  
    investment.save()
    return Response({"message": "Existing investment updated successfully."})

  except IndividualInvestment.DoesNotExist:
    investment = IndividualInvestment.objects.create(
      financial_account=account,
      child_profile=request.user.profile,
      amount_invested=amount,
    )
    total_money -= amount
    request.user.profile.total_money = total_money 
    request.user.profile.save()
    return Response({"message": "New investment created successfully."})
  
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def cash_out(request):
  investment_id = request.data.get('id')

  investment = IndividualInvestment.objects.get(id=investment_id)

  investment.child_profile.total_money += (investment.amount_invested + investment.returns)
  investment.child_profile.save()
  investment.delete()
  return Response({'message': 'Cash-out successful!'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_investments(request): 
  investments = IndividualInvestment.objects.filter(child_profile=request.user.profile)
  serializer = IndividualInvestmentSerializer(investments, many=True)
  return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_difficulty_point_value(request):
  profile = request.user.profile
  family_id = profile.family.id
  family = Family.objects.get(id=family_id)

  family.price_per_difficulty_point = request.data.get('price')
  family.save()

  return Response({'message': 'Updated difficulty value successfully!'})