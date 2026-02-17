from django.db import models
import uuid, random, bleach
from django.utils.text import slugify

# from django.db.utils import IntegrityError
from django_ckeditor_5.fields import CKEditor5Field
from django.utils import timezone

from magazine.slug import generate_unique_slug

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

    def __str__(self):
        if len(self.title) > 50:
            return f"{self.title[:50]}..."
        return self.title

    """
    Generate a unique ID for the Department with increased randomness and collision handling.
    """

    def __generate_id(self):
        print("Generating ID...................................................dsagasf")
        new_id = f"MAG{uuid.uuid4().hex[:8].upper()}{random.randint(100, 999)}"
        while True:
            try:
                Magazine.objects.get(id=new_id)
            except Magazine.DoesNotExist:
                return new_id

    def change_issued_at(self):
        if self.is_published:
            self.issued_at = timezone.now().date()
        if not self.is_published and self.issued_at is not None:
            self.issued_at = None

    def clean(self):
        self.title = bleach.clean(
            self.title,
            strip=True,
            strip_comments=True,
            # strip_tags=True,
            # strip_scripts=True,
            # strip_style=True,
        )
        self.description = bleach.clean(
            self.description,
            strip=True,
            strip_comments=True,
            # strip_tags=True,
            # strip_scripts=True,
            # strip_style=True,
        )
        self.content = bleach.clean(
            self.content,
            strip=True,
            strip_comments=True,
            # strip_scripts=True,
            tags=[
                "p",
                "br",
                "b",
                "i",
                "u",
                "em",
                "strong",
                "ul",
                "ol",
                "li",
                "a",
                "img",
                "h1",
                "h2",
                "h3",
            ],
            attributes={
                "img": ["src", "alt", "width", "height"],
            }
        )
        return super().clean()

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self.__generate_id()
        if not self.slug:
            if len(self.title) > 50:
                self.slug = generate_unique_slug(self, self.title[:50] , transliterate=True)
            # Choose transliteration or Unicode depending on your use case
            self.slug = generate_unique_slug(self, self.title , transliterate=True)

        self.change_issued_at()
        super(Magazine, self).save(*args, **kwargs)
