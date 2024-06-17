from django.db import models
from django.contrib.auth.models import User
import uuid

class Family(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    invitation_code = models.CharField(max_length=10, unique=True, blank=True)
    allowance_period_type = models.CharField(max_length=10, default='Weekly', choices=(('Weekly', 'Weekly'), ('Monthly', 'Monthly')))
    allowance_day = models.IntegerField(default=1)
    last_allowance_date = models.DateField(null=True, blank=True)
    price_per_difficulty_point = models.DecimalField(max_digits=6, decimal_places=2, default=1.00)

    def __str__(self):
        return self.name

    def generate_invitation_code(self):
        while True:
            code = uuid.uuid4().hex[:10].upper()
            if not Family.objects.filter(invitation_code=code).exists():
                return code

    def save(self, *args, **kwargs):
        if not self.invitation_code:
            self.invitation_code = self.generate_invitation_code()
        super(Family, self).save(*args, **kwargs)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    parent = models.BooleanField()
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name='members')
    total_money = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({'Parent' if self.parent else 'Child'})"

class Responsibility(models.Model):
    class Difficulty(models.IntegerChoices):
        TOO_EASY = 0
        SUPER_EASY = 1
        EASY = 2
        MEDIUM = 3
        HARD = 4
        VERY_HARD = 5
        EXTREME = 6
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='responsibilities')
    title = models.CharField(max_length=50)
    description = models.TextField()
    date = models.DateField()
    completed = models.BooleanField(default=False)
    verified = models.BooleanField(default=False)
    difficulty = models.IntegerField(choices=Difficulty.choices, default=Difficulty.TOO_EASY)

    def __str__(self):
        return f"{self.id} - {self.title}"

class StoreItem(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    family = models.ForeignKey(Family, related_name='store_items', on_delete=models.CASCADE)
    approved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - ${self.price}"
    
class Purchase(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='purchases')
    item = models.ForeignKey(StoreItem, on_delete=models.CASCADE, related_name='purchases')
    date = models.DateTimeField(auto_now_add=True)
    approved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.profile.first_name} purchased {self.item.name} on {self.date}"
    
class FinancialAccount(models.Model):
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name='financial_accounts')
    account_type = models.CharField(max_length=20, choices=(('savings', 'Savings'), ('investment', 'Investment'), ('loan', 'Loan')))
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    interest_rate = models.DecimalField(max_digits=4, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.account_type.title()} Account - {self.family.name}"
    
class IndividualInvestment(models.Model):
    financial_account = models.ForeignKey(FinancialAccount, on_delete=models.CASCADE, related_name='investments')
    child_profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='investments')
    amount_invested = models.DecimalField(max_digits=10, decimal_places=2)
    returns = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Investment by {self.child_profile.user.username} in {self.financial_account.account_type}"