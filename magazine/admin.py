from django.contrib import admin
from magazine.models import Magazine
from django.utils import timezone
from django.utils.html import format_html, html_safe

# Register your models here.
admin.site.site_header = "THOZHILALY"
admin.site.site_title = "THOZHILALY"


@admin.register(Magazine)
class MagazineAdmin(admin.ModelAdmin):
    
    class Media:
        css = {
            "all": ("css/admin/custom_admin.css",)
        }
    
    def image_preview(self, obj):
        if not obj.cover_image:
            return "No Image Uploaded"
        return format_html('<img src="{}" width="500" />', obj.cover_image.url)
    
    def shortern_title(self, obj):
        if len(obj.title) > 40:
            return f"{obj.title[:40]}..."
        return obj.title

    def make_published(self, request, queryset):
        queryset.update(is_published=True)
        queryset.update(issued_at=timezone.now().date())

    def make_unpublished(self, request, queryset):
        queryset.update(is_published=False)
        queryset.update(issued_at=None)
    list_display_links = ["shortern_title"]
    list_display = ["shortern_title", "is_published", "created_at", "issued_at"]
    search_fields = ["title"]
    actions = ["make_published", "make_unpublished"]
    list_filter = ["is_published", "created_at", "issued_at",]
    readonly_fields = ["created_at", "issued_at",'slug', "image_preview"]
    list_per_page = 10
    fieldsets = (
        (
            None,
            {
                "fields": ("title", "image_preview",  "cover_image","description", "content"),
            },
        ),
        ("Publish the content", {"fields": ("is_published", "issued_at")}),
    )
