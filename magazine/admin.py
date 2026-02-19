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

    def make_featured(self, request, queryset):
        """Set selected magazine as featured"""
        Magazine.objects.filter(is_featured=True).update(is_featured=False)  # Unset all
        queryset.update(is_featured=True)
        self.message_user(request, "Selected magazine set as featured")

    def remove_featured(self, request, queryset):
        """Remove featured status"""
        queryset.update(is_featured=False)
    
    make_featured.short_description = "Set as Featured"
    remove_featured.short_description = "Remove Featured Status"

    list_display_links = ["shortern_title"]
    list_display = ["shortern_title", "is_published", "created_at", "issued_at"]
    search_fields = ["title"]
    actions = ["make_published", "make_unpublished", "make_featured", "remove_featured"]
    list_filter = ["is_published", "created_at", "issued_at",]
    readonly_fields = ["created_at", "issued_at",'slug', "image_preview"]
    list_per_page = 10


    fieldsets = (
        (
            "Content",
            {
                "fields": ("title", "image_preview", "cover_image", "description", "content"),
            },
        ),
        (
            "PDF & Details", 
            {
                "fields": ("pdf", "page_count")
            }
        ),
        (
            "Publishing Options", 
            {
                "fields": ("is_published", "is_featured", "issued_at")
            }
        ),
        (
            "Meta", 
            {
                "fields": ("slug", "created_at"),
                "classes": ("collapse",)
            }
        ),
    )
