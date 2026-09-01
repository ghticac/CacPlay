from django.db import models
from django.db.models import Avg
from django.conf import settings


class Contenido(models.Model):

    TIPO_CHOICES = [
        ('video', 'Video'),
        ('podcast', 'Podcast'),
        ('libro', 'Libro'),
    ]

    PROVEEDOR_CHOICES = [
        ('youtube', 'YouTube'),
        ('spotify', 'Spotify'),
        ('cloudflare', 'Cloudflare Stream'),
        ('otro', 'Otro'),
    ]

    CATEGORIA_CHOICES = [
        ('novedades', 'Novedades'),
        ('eventos', 'Eventos'),
        ('podcast', 'Podcast'),
        ('exclusivo', 'Exclusivo'),
    ]

    SECCION_CHOICES = [
        ('cac_contigo', 'La CAC Contigo'),
        ('un_dia_con', 'Un día con'), 
        ('del_libro_a_tu_oido', 'Del libro a tu oído'),
        ('exclusivo', 'Exclusivo')  # Esta opción es para contenido que no se muestra en la web
        
    ]

    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)

    tipo = models.CharField(
        max_length=20,
        choices=TIPO_CHOICES
    )

    proveedor = models.CharField(
        max_length=30,
        choices=PROVEEDOR_CHOICES
    )

    categoria = models.CharField(
        max_length=30,
        choices=CATEGORIA_CHOICES,
        blank=True,
        null=True
    )

    seccion = models.CharField(
        max_length=50,
        choices=SECCION_CHOICES,
        blank=True,
        null=True
    )

    url_externa = models.URLField()

    thumbnail = models.URLField(
        blank=True,
        null=True
    )

    destacado = models.BooleanField(default=False)

    fecha_publicacion = models.DateField(
        null=True,
        blank=True
    )

    activo = models.BooleanField(default=True)

    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.titulo
    
    @property
    def rating_promedio(self):
        # Esto busca todas las calificaciones de este contenido y saca el promedio
        promedio = self.calificaciones.aggregate(Avg('puntuacion'))['puntuacion__avg']
        return round(promedio, 1) if promedio else 0.0

    @property
    def total_votos(self):
        return self.calificaciones.count()

class Calificacion(models.Model):

    contenido = models.ForeignKey(
        Contenido,
        on_delete=models.CASCADE,
        related_name='calificaciones'
    )

    puntuacion = models.IntegerField()

    creado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.contenido.titulo} - {self.puntuacion}"
    
class Favorito(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='mis_favoritos'
    )
    contenido = models.ForeignKey(
        Contenido, 
        on_delete=models.CASCADE,
        related_name='favoritado_por'
    )
    creado = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Esto evita que un usuario guarde el mismo video dos veces
        unique_together = ('user', 'contenido')
        verbose_name = 'Favorito'
        verbose_name_plural = 'Favoritos'

    def __str__(self):
        return f"{self.user.email} - {self.contenido.titulo}"