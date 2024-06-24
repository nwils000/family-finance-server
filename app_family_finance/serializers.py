from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']


class ResponsibilitySeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResponsibilitySeries
        fields = '__all__'

class ResponsibilitySerializer(serializers.ModelSerializer):
    series = ResponsibilitySeriesSerializer()
    class Meta:
        model = Responsibility
        fields = '__all__'

class IndividualInvestmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndividualInvestment
        fields = '__all__'
        read_only_fields = ['child_profile']

class ProfileSimpleSerializer(serializers.ModelSerializer):
    user = UserSerializer() 
    responsibilities = ResponsibilitySerializer(many=True) 
    investments = IndividualInvestmentSerializer(many=True)

    class Meta:
        model = Profile
        fields = ['id', 'user', 'first_name', 'last_name', 'parent', 'responsibilities', 'total_money', 'investments']  

class FamilySerializer(serializers.ModelSerializer):
    members = ProfileSimpleSerializer(many=True)  

    class Meta:
        model = Family
        fields = '__all__'  

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    responsibilities = ResponsibilitySerializer(many=True) 
    family = FamilySerializer()  
    investments = IndividualInvestmentSerializer(many=True)


    class Meta:
        model = Profile
        fields = '__all__'

class StoreItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = StoreItem
        fields = '__all__'

class PurchaseSerializer(serializers.ModelSerializer):
    child_name = serializers.CharField(source='profile.first_name')
    item_name = serializers.CharField(source='item.name')
    price = serializers.DecimalField(source='item.price', max_digits=6, decimal_places=2)

    class Meta:
        model = Purchase
        fields = '__all__'

class FinancialAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialAccount
        fields = '__all__'
        read_only_fields = ['family']

