from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Contenido, Calificacion, Favorito
from .serializers import ContenidoSerializer
from django.db.models import Q

class ContenidoViewSet(viewsets.ModelViewSet):
    queryset = Contenido.objects.all()
    serializer_class = ContenidoSerializer

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['titulo', 'descripcion', 'proveedor']
    ordering_fields = ['fecha_publicacion', 'creado']

    def get_queryset(self):
        """
        Permite el filtrado por 'seccion' a través de QueryParams:
        Ejemplo: /api/contenidos/?seccion=del_libro_a_tu_oido
        """
        queryset = Contenido.objects.filter(activo=True)
        seccion = self.request.query_params.get('seccion', None)

        if seccion:
            queryset = queryset.filter(seccion=seccion)

        return queryset

    # --- 1. HOME ---
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def home(self, request):
        # Excluimos 'exclusivo' del home público para evitar fugas de contenido VIP
        base_queryset = Contenido.objects.filter(activo=True).exclude(seccion='exclusivo')

        hero = base_queryset.filter(tipo='video').order_by('-creado').first()
        novedades = base_queryset.order_by('-creado')[:1000]
        eventos = base_queryset.filter(categoria='eventos').order_by('-creado')[:1000]
        podcasts = base_queryset.filter(tipo='podcast').order_by('?')[:1000]

        data = {
            "hero": ContenidoSerializer(hero, context={'request': request}).data if hero else None,
            "novedades": ContenidoSerializer(novedades, many=True, context={'request': request}).data,
            "eventos": ContenidoSerializer(eventos, many=True, context={'request': request}).data,
            "podcasts": ContenidoSerializer(podcasts, many=True, context={'request': request}).data,
        }
        return Response(data)

    # --- 2. SECCIÓN DEL LIBRO A TU OÍDO ---
    @action(detail=False, methods=['get'], url_path='del-libro-a-tu-oido', permission_classes=[AllowAny])
    def del_libro_a_tu_oido(self, request):
        contenidos = Contenido.objects.filter(seccion='del_libro_a_tu_oido', activo=True).order_by('-creado')
        serializer = ContenidoSerializer(contenidos, many=True, context={'request': request})
        return Response(serializer.data)

    # --- 3. SECCIÓN EXCLUSIVA (VIP) ---
    @action(detail=False, methods=['get'], url_path='exclusivo', permission_classes=[AllowAny])
    def exclusivo(self, request):
        # 💡 Asegúrate de que 'exclusivo' sea exacto al valor configurado en el modelo/admin (choices)
        contenidos = Contenido.objects.filter(seccion='exclusivo', activo=True).order_by('-creado')
        serializer = ContenidoSerializer(contenidos, many=True, context={'request': request})
        return Response(serializer.data)

    # --- 4. DETALLE ---
    def retrieve(self, request, *args, **kwargs):
        contenido = self.get_object()
        
        relacionados = Contenido.objects.filter(
            tipo=contenido.tipo, activo=True
        ).exclude(id=contenido.id).exclude(seccion='exclusivo').order_by('-creado')[:50]

        data = {
            "contenido": ContenidoSerializer(contenido, context={'request': request}).data,
            "relacionados": ContenidoSerializer(relacionados, many=True, context={'request': request}).data
        }
        return Response(data)

    # --- 5. CALIFICAR ---
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

    # --- 6. MI LISTA ---
    @action(detail=False, methods=['get'], url_path='mi-lista', permission_classes=[IsAuthenticated])
    def mi_lista(self, request):
        favoritos_ids = Favorito.objects.filter(user=request.user).values_list('contenido_id', flat=True)
        contenidos = Contenido.objects.filter(id__in=favoritos_ids, activo=True)
        serializer = ContenidoSerializer(contenidos, many=True, context={'request': request})
        return Response(serializer.data)

    # --- 7. TOGGLE FAVORITO ---
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