from django.views.generic import TemplateView

class WelcomePage(TemplateView):
    template_name = 'logged_in_page.html'

class ThanksPage(TemplateView):
    template_name = 'logged_out_page.html'

class HomePage(TemplateView):
    template_name = "home.html"
