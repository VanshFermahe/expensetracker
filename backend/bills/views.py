# bills/views.py

from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.utils import timezone
from datetime import date, timedelta
from django.db import models

from .models import Bill,Notification
from .serializers import BillSerializer, UserRegisterSerializer,NotificationSerializer
from django_filters.rest_framework import DjangoFilterBackend
from datetime import timedelta
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken

# ----------------------------
# User Registration API
# ----------------------------
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from rest_framework.decorators import action
from django.contrib.auth.hashers import make_password
from .serializers import UserRegisterSerializer

class RegisterViewSet(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # generate token for new user
        refresh = RefreshToken.for_user(user)

        return Response({
            "user": serializer.data,
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        }, status=status.HTTP_201_CREATED)



def create_due_notifications():
    """
    Check all unpaid bills whose due date is within the next 5 days
    (from today to 5 days from today) and create notifications for each user.
    """
    today = timezone.now().date()
    threshold = today + timedelta(days=5)

    # Select unpaid bills whose due_date is >= today AND <= threshold
    upcoming_bills = Bill.objects.filter(
        paid=False,
        due_date__gte=today,        # due date is today or later
        due_date__lte=threshold     # due date within next 5 days
    )

    for bill in upcoming_bills:
        message = f"Reminder: Your bill '{bill.name}' of amount {bill.amount} is due on {bill.due_date}"

        # Avoid duplicate notifications for same bill
        Notification.objects.get_or_create(
            user=bill.user,
            bill=bill,
            message=message
        )





# ----------------------------
# Bill CRUD + Actions
# ----------------------------
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from .models import Bill
from .serializers import BillSerializer

class BillViewSet(viewsets.ModelViewSet):
    serializer_class = BillSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]

    filterset_fields = ['type', 'paid']
    search_fields = ['name', 'notes']

    def get_queryset(self):
        """
        Returns all bills for the logged-in user (paid + unpaid)
        """
        return Bill.objects.filter(user=self.request.user).order_by('due_date')

    def perform_create(self, serializer):
        # Automatically assign the logged-in user as the bill owner
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['patch'])
    def mark_paid(self, request, pk=None):
        """
        Mark a specific bill as paid
        """
        bill = self.get_object()
        if bill.paid:
            return Response({'detail': 'Bill already marked paid.'}, status=400)
        
        bill.paid = True
        bill.paid_at = timezone.now()
        bill.save()
        return Response(BillSerializer(bill).data, status=200)

    @action(detail=False, methods=['get'])
    def unpaid(self, request):
        """
        Returns all unpaid bills for the logged-in user
        """
        unpaid_bills = Bill.objects.filter(user=request.user, paid=False).order_by('due_date')
        serializer = BillSerializer(unpaid_bills, many=True)
        return Response(serializer.data, status=200)

    @action(detail=False, methods=['get'])
    def paid(self, request):
        """
        Returns all paid bills for the logged-in user
        """
        paid_bills = Bill.objects.filter(user=request.user, paid=True).order_by('-paid_at')
        serializer = BillSerializer(paid_bills, many=True)
        return Response(serializer.data, status=200)



class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        # Total, paid, unpaid bills
        total = Bill.objects.filter(user=user).count()
        paid = Bill.objects.filter(user=user, paid=True).count()
        unpaid = total - paid

        # Upcoming bills in next 5 days
        upcoming_threshold = date.today() + timedelta(days=5)
        upcoming = Bill.objects.filter(
            user=user,
            due_date__lte=upcoming_threshold,
            paid=False
        ).order_by('due_date')

        # Total amounts
        total_amount_due = Bill.objects.filter(user=user, paid=False).aggregate(total=models.Sum('amount'))['total'] or 0
        total_amount_paid = Bill.objects.filter(user=user, paid=True).aggregate(total=models.Sum('amount'))['total'] or 0

        data = {
            'total_bills': total,
            'paid_bills': paid,
            'unpaid_bills': unpaid,
            'upcoming_bills': BillSerializer(upcoming, many=True).data,
            'total_amount_due': total_amount_due,
            'total_amount_paid': total_amount_paid,
        }

        return Response(data)


class NotificationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Generate notifications for bills due in <5 days
        create_due_notifications()

        # Fetch notifications for logged-in user
        notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)