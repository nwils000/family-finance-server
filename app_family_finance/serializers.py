from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']

class ResponsibilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Responsibility
        fields = '__all__'

class ProfileSimpleSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True) 
    responsibilities = ResponsibilitySerializer(many=True) 

    class Meta:
        model = Profile
        fields = ['id', 'user', 'first_name', 'last_name', 'parent', 'responsibilities', 'total_money']  

class FamilySerializer(serializers.ModelSerializer):
    members = ProfileSimpleSerializer(many=True, read_only=True)  

    class Meta:
        model = Family
        fields = '__all__'  

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    responsibilities = ResponsibilitySerializer(many=True) 
    family = FamilySerializer()  

    class Meta:
        model = Profile
        fields = '__all__'