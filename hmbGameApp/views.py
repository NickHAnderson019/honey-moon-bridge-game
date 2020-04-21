from django.shortcuts import render

# Create your views here.

def home(request):
    return render(request, 'hmbGameApp/home.html')


def game(request):
    return render(request, 'hmbGameApp/game.html')
