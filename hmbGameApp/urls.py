from django.urls import path, include
from . import views

app_name='hmbGameApp'

urlpatterns = [
    path('singleplayer/', views.game, name='game'),
    path('multiplayer/', views.mpgame, name='mpgame'),
]
