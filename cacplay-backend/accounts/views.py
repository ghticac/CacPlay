from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import EmailTokenObtainSerializer
from .models import Usuario
import requests

class LoginView(APIView):
    permission_classes = [] 

    def post(self, request):
        serializer = EmailTokenObtainSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class WordPressSSOView(APIView):
    permission_classes = [] 

    def post(self, request):
        code = request.data.get('code')
        
        if not code or "<?php" in code:
            return Response({"error": "Código SSO no válido"}, status=status.HTTP_400_BAD_REQUEST)

        # Endpoint de la API REST que crearemos en WordPress
        wp_url = "https://cuentadealtocosto.org/wp-json/cac-sso/v1/verify"
        
        try:
            # --- MOCK CONTROLADO PARA PRUEBAS LOCALES ---
            if code == "DEBUG_MODE_ON":
                user_data = {
                    "success": True, 
                    "email": "usuario.test@cuentadealtocosto.org",
                    "first_name": "Usuario",
                    "last_name": "SSO",
                    "rol_wp": "vip"
                }
            else:
                # 1. Validación REAL contra la API REST de WordPress
                wp_response = requests.post(
                    wp_url, 
                    json={"code": code}, 
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                if wp_response.status_code != 200:
                    return Response(
                        {"error": "Respuesta no autorizada o código expirado en WordPress"}, 
                        status=status.HTTP_401_UNAUTHORIZED
                    )

                user_data = wp_response.json()

            if not user_data.get('success'):
                return Response(
                    {"error": user_data.get('message', 'Sesión de WordPress inválida')}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )

            # 2. Sincronización Automática: Buscar o crear/actualizar usuario en Django
            user, created = Usuario.objects.update_or_create(
                email=user_data['email'],
                defaults={
                    'username': user_data['email'],
                    'first_name': user_data.get('first_name', ''),
                    'last_name': user_data.get('last_name', ''),
                    'rol': user_data.get('rol_wp', 'registrado') # Asigna o actualiza el rol
                }
            )

            # 3. Generación de tokens JWT para Angular
            refresh = RefreshToken.for_user(user)

            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "email": user.email,
                "rol": user.rol
            }, status=status.HTTP_200_OK)

        except requests.exceptions.Timeout:
            return Response({"error": "Tiempo de espera agotado al conectar con WordPress"}, status=status.HTTP_504_GATEWAY_TIMEOUT)
        except requests.exceptions.RequestException as e:
            return Response({"error": f"Error de conexión con el servidor de WordPress: {str(e)}"}, status=status.HTTP_502_BAD_GATEWAY)
        except Exception as e:
            return Response({"error": f"Error interno en la sincronización SSO: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PerfilView(APIView):
    authentication_classes = [JWTAuthentication] 
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "email": user.email,
            "rol": user.rol,
            "telefono": user.telefono,
            "entidad": user.entidad
        })