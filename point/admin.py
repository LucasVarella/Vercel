from django.contrib import admin
from .models import User, Point, Correction

class UserAdmin(admin.ModelAdmin):
    list_display = ('id','username','email')
    
class PointAdmin(admin.ModelAdmin):
    list_display = ('id','user','type', 'time', 'day', 'month', 'year')
    
class CorrectionAdmin(admin.ModelAdmin):
    list_display = ('id','user','type', 'time', 'day', 'month', 'year')
    
admin.site.register(User, UserAdmin)
admin.site.register(Point, PointAdmin)
admin.site.register(Correction, CorrectionAdmin)