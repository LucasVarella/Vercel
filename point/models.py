from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField()
    
    def count():
        pass
    
class Point(models.Model):
    TYPE_CHOICES = (
        ("E", "Entry"),
        ("P", "Pause"),
        ("R", "Return"),
        ("Q", "Quit")
    )
    
    time = models.CharField(max_length=5, blank=False, default='99:99')
    day = models.CharField(blank=False, default=0, max_length=2)
    month = models.CharField(blank=False, default=0, max_length=2)
    year = models.CharField(max_length=4, blank =False, default='2023')
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, null=False)
    type = models.CharField(max_length=1, choices=TYPE_CHOICES, blank=False, null=False)
    
    def __str__(self):
        return (f"{self.type} - {self.day} - {self.user}")

class Correction(models.Model):
    TYPE_CHOICES = (
        ("E", "Entry"),
        ("P", "Pause"),
        ("R", "Return"),
        ("Q", "Quit")
    )
    
    STATUS_CHOICES = (
        ("P","Pending"),
        ("A","Approved"),
        ("R","Refused"),
    )
    
    time = models.CharField(max_length=5, blank=False, default='99:99')
    day = models.CharField(blank=False, default="0", max_length=2)
    month = models.CharField(blank=False, default="0", max_length=2)
    year = models.CharField(max_length=4, blank =False, default='2023')
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, null=False)
    type = models.CharField(max_length=1, choices=TYPE_CHOICES, blank=False, null=False)
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, blank=False, null=False, default="P")
    motive = models.CharField(default="", max_length=100)
    department = models.CharField(default="", max_length=100)