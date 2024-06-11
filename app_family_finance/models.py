from django.db import models
from django.contrib.auth.models import User
import uuid

class Family(models.Model):
  name = models.CharField(max_length=100, unique=True)
  description = models.TextField(blank=True, null=True)
  invitation_code = models.CharField(max_length=10, unique=True, blank=True)

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

  def __str__(self):
      return f"{self.first_name} {self.last_name} ({'Parent' if self.parent else 'Child'})"
 
class Responsibility(models.Model):
  profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='responsibilities')
  title = models.CharField(max_length=50)
  date = models.DateField()