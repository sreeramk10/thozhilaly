from django.db import models
import uuid, random
from django.db.utils import IntegrityError
from django_ckeditor_5.fields import CKEditor5Field

# Create your models here.


class Magazine(models.Model):
    id = models.CharField(max_length=20, primary_key=True, editable=False)
    title = models.CharField(max_length=200, verbose_name="Title")
    cover_image = models.ImageField(
        upload_to="magazine/coverImage/",
        null=True,
        blank=True,
        verbose_name="Cover Image",
    )
    description = models.TextField(verbose_name="Description")
    content = CKEditor5Field("Content", config_name="extends")
    is_published = models.BooleanField(default=False, verbose_name="Is Published")
    created_at = models.DateTimeField(auto_now_add=True)
    issued_at = models.DateField(null=True, blank=True, verbose_name="Issued At")
    pdf = models.FileField(
        upload_to="magazine/pdf/", null=True, blank=True, verbose_name="PDF"
    )
    page_count = models.IntegerField(null=True, blank=True, verbose_name="Page Count")
    slug = models.SlugField(
        max_length=200, unique=True, null=True, blank=True, verbose_name="Slug"
    )

    class Meta:
        verbose_name = "Magazine"
        verbose_name_plural = "Magazine"

    """
    Generate a unique ID for the Department with increased randomness and collision handling.
    """

    def __generate_id(self):
        new_id = f"MAG{uuid.uuid4().hex[:8].upper()}{random.randint(100, 999)}"
        while True:
            try:
                Magazine.objects.get(id=new_id)
            except IntegrityError:
                return new_id

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self.__generate_id()
        super(Magazine, self).save(*args, **kwargs)
