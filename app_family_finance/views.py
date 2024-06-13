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

  family = profile.family
  day_of_week = today.isoweekday() # 1 is Monday, 7 is Sunday
  day_of_month = today.day  
  
  process_weekly = family.allowance_period_type == 'Weekly' and day_of_week == family.allowance_day
  process_monthly = family.allowance_period_type == 'Monthly' and day_of_month == family.allowance_day

  if (process_weekly or process_monthly) and (family.last_allowance_date != today):
    eligible_children = family.members.filter(parent=False)
    for child in eligible_children:
      child.total_money += 100  
      child.save()
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
      family, created = Family.objects.get_or_create(name=family_hub_name)
      if not created:
          return Response({'message': 'Family name already exists'})
  elif invitation_code:
      try:
          family = Family.objects.get(invitation_code=invitation_code)  
      except Family.DoesNotExist:
          return Response({'message': 'Invitation code does not exist'})
  else:
      return Response({'message': 'Either family hub name or invitation code is required'})

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
  verified = request.data.get('verified')
  print("*********************************************************", verified)
  if profile.parent:
    responsibility = Responsibility.objects.create(profile=profile, verified=verified, title=title, date=date, description=description)
    responsibility.save()
    responsibility_serialized = ResponsibilitySerializer(responsibility) 
    return Response(responsibility_serialized.data)
  else: 
    responsibility = Responsibility.objects.create(profile=profile, verified=verified, title=title, date=date, description=description)  
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
  allowance_day = int(request.data.get('allowance_day'))  # Day of the week 1-7 or day of the month 1-31

  family = profile.family
  family.allowance_period_type = period_type
  family.allowance_day = allowance_day
  family.save()

  return Response({"message": "Allowance period set successfully"})