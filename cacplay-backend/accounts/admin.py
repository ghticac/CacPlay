from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    # Columnas que se verán en la tabla principal del Dashboard
    list_display = ('email', 'username', 'rol', 'entidad', 'is_staff', 'is_active')
    
    # Filtros laterales rápidos
    list_filter = ('rol', 'is_staff', 'is_superuser', 'is_active')
    
    # Campo por el cual buscar en la barra superior
    search_fields = ('email', 'username', 'entidad')
    ordering = ('email',)

    # Permite editar tus campos personalizados dentro del formulario detallado de Django
    fieldsets = UserAdmin.fieldsets + (
        ('Información de CACPlay', {
            'fields': ('rol', 'telefono', 'entidad')
        }),
    )
    
    # Permite añadir tus campos personalizados al crear un usuario nuevo
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Información de CACPlay', {
            'fields': ('rol', 'telefono', 'entidad')
        }),
    )