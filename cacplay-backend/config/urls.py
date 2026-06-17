from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from core.views import health
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('', RedirectView.as_view(url='/admin/', permanent=True)),

    path('admin/', admin.site.urls),

    # APIs
    path('api/health/', health, name='health'),
    path('api/', include('contenidos.urls')),
    path('api/', include('accounts.urls')),

    # JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
