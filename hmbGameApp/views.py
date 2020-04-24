from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.

def home(request):
    return render(request, 'hmbGameApp/home.html')

# @login_required(login_url='/accounts/login/')
def mpgame(request):
    return render(request, 'hmbGameApp/mpgame.html')


def game(request):
    return render(request, 'hmbGameApp/game.html')
