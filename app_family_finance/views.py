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
      parent=request.data.get('parent', False)  
  )

  profile_serialized = ProfileSerializer(profile)
  return Response(profile_serialized.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_responsibility(request):
  profile = request.user.profile
  title = request.data.get('title')
  date = request.data.get('date')
  responsibility = Responsibility.objects.create(profile=profile, title=title, date=date)
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
  profile = request.user.profile
  res_id = request.data.get('id')
  responsibility = profile.responsibilities.get(id=res_id)
  responsibility.delete()
  responsibilities = profile.responsibilities.all()
  serializer = ResponsibilitySerializer(responsibilities, many=True)
  return Response(serializer.data)
