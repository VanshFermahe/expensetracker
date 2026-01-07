

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser, Bill
from django.utils.translation import gettext_lazy as _

class CustomUserAdmin(BaseUserAdmin):
    ordering = ('email',)
    list_display = ('email', 'name', 'mobile_no', 'is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('name', 'mobile_no')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'mobile_no', 'password1', 'password2', 'is_staff', 'is_active'),
        }),
    )
    search_fields = ('email', 'name')

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Bill)
