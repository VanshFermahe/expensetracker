from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import Bill
from .sms import send_sms  # you will create this

@shared_task
def send_due_sms_notifications():
    today = timezone.now().date()
    threshold = today + timedelta(days=3)

    upcoming_bills = Bill.objects.filter(
        paid=False,
        due_date__lte=threshold
    )

    for bill in upcoming_bills:
        message = f"Reminder: Your bill '{bill.name}' of ₹{bill.amount} is due on {bill.due_date}."

        if bill.user.mobile_no:
            send_sms(bill.user.mobile_no, message)

    return f"{upcoming_bills.count()} SMS sent."
