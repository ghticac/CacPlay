from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny # Añadimos estas
from .models import Contenido, Calificacion, Favorito
from .serializers import ContenidoSerializer
from django.db.models import Q

class ContenidoViewSet(viewsets.ModelViewSet):
    queryset = Contenido.objects.all()
    serializer_class = ContenidoSerializer

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['titulo', 'descripcion', 'proveedor']
    ordering_fields = ['fecha_publicacion', 'creado']

    # --- 1. HOME ---
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def home(self, request):
        hero = Contenido.objects.filter(tipo='video', activo=True).order_by('-creado').first()
        novedades = Contenido.objects.filter(activo=True).order_by('-creado')[:12]
        eventos = Contenido.objects.filter(categoria='eventos', activo=True).order_by('-creado')[:12]
        podcasts = Contenido.objects.filter(tipo='podcast', activo=True).order_by('?')[:12]

        data = {
            "hero": ContenidoSerializer(hero, context={'request': request}).data if hero else None,
            "novedades": ContenidoSerializer(novedades, many=True, context={'request': request}).data,
            "eventos": ContenidoSerializer(eventos, many=True, context={'request': request}).data,
            "podcasts": ContenidoSerializer(podcasts, many=True, context={'request': request}).data,
        }
        return Response(data)

    # --- 2. DETALLE ---
    def retrieve(self, request, *args, **kwargs):
        contenido = self.get_object()
        
        # AJUSTE: Incrementamos el límite a 50 para habilitar el scroll histórico en el frontend
        relacionados = Contenido.objects.filter(
            tipo=contenido.tipo, activo=True
        ).exclude(id=contenido.id).order_by('-creado')[:50]

        data = {
            "contenido": ContenidoSerializer(contenido, context={'request': request}).data,
            "relacionados": ContenidoSerializer(relacionados, many=True, context={'request': request}).data
        }
        return Response(data)

    # --- 3. CALIFICAR ---
    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def calificar(self, request, pk=None):
        contenido = self.get_object()
        puntuacion = request.data.get('puntuacion')
        try:
            puntuacion = int(puntuacion)
            if not (1 <= puntuacion <= 5): raise ValueError()
        except (ValueError, TypeError):
            return Response({"error": "Puntuación inválida"}, status=400)

        Calificacion.objects.create(contenido=contenido, puntuacion=puntuacion)
        return Response({
            "mensaje": "Calificación guardada",
            "rating_promedio": contenido.rating_promedio,
            "total_votos": contenido.total_votos
        }, status=status.HTTP_201_CREATED)

    # --- 4. MI LISTA ---
    @action(detail=False, methods=['get'], url_path='mi-lista', permission_classes=[IsAuthenticated])
    def mi_lista(self, request):
        # Al usar IsAuthenticated, DRF manejará el 401 automáticamente si el token falla
        favoritos_ids = Favorito.objects.filter(user=request.user).values_list('contenido_id', flat=True)
        contenidos = Contenido.objects.filter(id__in=favoritos_ids, activo=True)
        serializer = ContenidoSerializer(contenidos, many=True, context={'request': request})
        return Response(serializer.data)

    # --- 5. TOGGLE FAVORITO ---
    @action(detail=True, methods=['post'], url_path='toggle-favorito', permission_classes=[IsAuthenticated])
    def toggle_favorito(self, request, pk=None):
        contenido = self.get_object()
        user = request.user
        favorito_existente = Favorito.objects.filter(user=user, contenido=contenido).first()

        if favorito_existente:
            favorito_existente.delete()
            return Response({"favorito": False, "mensaje": "Quitado"}, status=200)
        else:
            Favorito.objects.create(user=user, contenido=contenido)
            return Response({"favorito": True, "mensaje": "Agregado"}, status=201)