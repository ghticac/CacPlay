from rest_framework import serializers
from rest_framework.authtoken.models import Token  # <-- Cambiamos JWT por el Token de tu imagen
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Usuario


class EmailJWTTokenObtainSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username = attrs.get(self.username_field)

        if username and '@' in username:
            try:
                attrs[self.username_field] = Usuario.objects.get(email__iexact=username).username
            except Usuario.DoesNotExist:
                pass

        data = super().validate(attrs)
        data['email'] = self.user.email
        data['rol'] = self.user.rol
        return data

class EmailTokenObtainSerializer(serializers.Serializer):
    # Definimos 'username' como el campo que recibirá el correo desde Angular
    username = serializers.CharField() 
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        # Usamos el método oficial de Django para autenticar
        # Esto verifica usuario, contraseña y si está activo
        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError("Credenciales inválidas")

        # AQUÍ ESTÁ LA MAGIA: 
        # Buscamos el token que ya existe en la base de datos (el de tu imagen)
        # o creamos uno nuevo si el usuario no tiene.
        token, created = Token.objects.get_or_create(user=user)

        # Retornamos la estructura que el frontend necesita
        return {
            "token": token.key,  # Este es el valor 'a19415bd...' que viste en el admin
            "email": user.email,
            "rol": user.rol
        }
