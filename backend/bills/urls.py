from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BillViewSet, RegisterViewSet, DashboardView,NotificationView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'bills', BillViewSet, basename='bills')


urlpatterns = [
    path('auth/register/', RegisterViewSet.as_view(), name='auth_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('notifications/', NotificationView.as_view(), name='notifications'),
    path('', include(router.urls)),
]