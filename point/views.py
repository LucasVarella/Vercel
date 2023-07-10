from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.http import JsonResponse
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from .models import Point, Correction
from django.core.paginator import Paginator

from datetime import datetime, timedelta
import calendar

import json

#Login
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

#Cache


@csrf_exempt
def login_view(request):
    
    if request.method == "POST":
        
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        
        # Attempt to sign user in
        username = body["username"]
        password = body["password"]
        
        if username == "" or password == "":
            # return render(request, "point/login.html", {
            #     "msg": "Fill in the Username and Password."
            # })
            return JsonResponse({"msg": "Fill in the Username and Password."})
            
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            # return HttpResponseRedirect(reverse("index"))
            return JsonResponse({"msg": "successful"})
        else:
            # return render(request, "point/login.html", {
            #     "msg": "Invalid username and/or password."
            # })
            return JsonResponse({"msg": "Invalid username and/or password."})
    else:
        user = request.user
        if user.is_authenticated == False:
            return render(request, "point/login.html")
        else:
            return HttpResponseRedirect(reverse("index"))

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login_view"))

@csrf_exempt
def index(request):
    
    if request.method == "GET":
        
        if request.user.is_authenticated == False:
            return render(request, "point/login.html")
        else:
            date = datetime.now()
            points = Point.objects.filter(day = date.day, month = date.month, year = date.year)
            
            types = {"E":False, "P":False, "R": False, "Q": False}
            
            x = slice(5)
            for point in points:
                types[point.type] = point.time[x]
                    
            week_points = []
            for i in range(0,8):
                d = datetime.today() - timedelta(days=i)
                points = Point.objects.filter(day = d.day, month = d.month, year = d.year)
                
                points_type = {"E":False, "P":False, "R": False, "Q": False, "DAY": str(d.day).zfill(2) , "MONTH": calendar.month_name[d.month], "DATE": d.date, "NAME": calendar.day_name[calendar.weekday(d.year,d.month,d.day)] }
                for point in points:
                    points_type[point.type] = point
                    
                week_points.append(points_type)
                
            return render(request, "point/index.html", {"page": "index", "date_time_now": datetime.now(), "types": types, "week_points": week_points})
    
    if request.method == "POST":
        
        if request.user.is_authenticated == False:
            return JsonResponse({'status': 'make a login first, brother! ;)'})
        
        else:
            body_unicode = request.body.decode('utf-8')
            body = json.loads(body_unicode)
            type = body['type']
            
            date = datetime.now()
            
            str_time = str(date.time())
            x = slice(8)
            time = str_time[x]
            
            if type == 'R':
                pause_point = Point.objects.filter(user= request.user, day= date.day, month= date.month, year = date.year, type= 'P')
                if len(pause_point) > 0:
                    point = Point(user= request.user, time= time, day=date.day, month = date.month, year = date.year , type=type)
                    point.save()
                    return JsonResponse({'status': 'successful'})
                else:
                    return JsonResponse({'msg': 'You dont have pause to return ', })
                
            if type == 'Q':
                entry_point = Point.objects.filter(user= request.user, day= date.day, month= date.month, year = date.year, type= 'E')
                if len(entry_point) > 0:
                    point = Point(user= request.user, time= time, day=date.day, month = date.month, year = date.year , type=type)
                    point.save()
                    return JsonResponse({'status': 'successful'})
                else:
                    return JsonResponse({'msg': 'You dont entry to quit', })
            
            point = Point(user= request.user, time= time, day=date.day, month = date.month, year = date.year , type=type)
            point.save()
            return JsonResponse({'status': 'successful'})
    
def bank(request):
    if request.user.is_authenticated == False:
        return render(request, "point/login.html")
    else:
        return render(request, "point/bank.html", {"page": "bank"})

@csrf_exempt
def correction(request):
    if request.user.is_authenticated == False:
        return render(request, "point/login.html")

    if request.method == "GET":
        corrections = reversed(Correction.objects.filter(user = request.user))
        
        return render(request, "point/correction.html", { "corrections": corrections, "page": "correction"})
    
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    if request.method == "POST":
        
        date = body['date']
        type = body['type']
        correct_time = body['correctTime']
        motive = body['motive']
        department = body['department']
    
        # date_post = datetime.strptime(date, "%d/%m/%y")
        # date_now = datetime.strptime(datetime.now().date, "%d/%m/%y")
        
        # if date_post <=date_now:
        correction = Correction(time= correct_time, type= type, user= request.user, day=date[8:10], month= date[5:7], year= date[0:4], motive=motive, department=department)
        correction.save()
        return JsonResponse({'status': 'successful'})
        
        # else:
        #     return JsonResponse({'status': 'error', 'msg': 'No way to send correction for future data'})

    if request.method == "PUT":
        id = body['id']
        correction_del = Correction.objects.get(id=id)
        correction_del.delete()
        return JsonResponse({'status': 'successful',})
        
def sheet(request):
    if request.user.is_authenticated == False:
        return render(request, "point/login.html")
    else:
        return render(request, "point/sheet.html", {"page": "sheet"})