from django.contrib import admin

from .models import Appointment, Course, CourseMedia, Patient, Service, Talk, TalkRegistration, Testimonial, TestimonialLike, Therapist


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "status", "price_cop", "is_active", "updated_at")
    list_filter = ("status", "is_active")
    search_fields = ("title", "slug")


@admin.register(CourseMedia)
class CourseMediaAdmin(admin.ModelAdmin):
    list_display = ("course", "kind", "original_name", "size_bytes", "mime_type", "updated_at")
    list_filter = ("kind",)
    search_fields = ("original_name",)


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ("title", "start_at", "end_at", "status", "patient", "service", "updated_at")
    list_filter = ("status",)
    search_fields = ("title", "notes")


@admin.register(Therapist)
class TherapistAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "title",
        "price_from_cop",
        "session_duration_minutes",
        "modality",
        "location",
        "is_active",
        "updated_at",
        "photo_file",
        "cv_file",
    )
    list_filter = ("is_active",)
    search_fields = ("name", "title")


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("title", "price_cop", "duration_minutes", "modality", "is_active", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("title",)


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = (
        "first_name",
        "last_name",
        "document_number",
        "username",
        "gender",
        "email",
        "phone",
        "city",
        "is_active",
        "updated_at",
    )
    list_filter = ("is_active",)
    search_fields = ("first_name", "last_name", "document_number", "username", "gender", "email", "phone", "city")


@admin.register(Talk)
class TalkAdmin(admin.ModelAdmin):
    list_display = ("title", "topic", "speaker", "format", "start_at", "end_at", "participants_count", "is_active", "updated_at")
    list_filter = ("format", "is_active")
    search_fields = ("title", "speaker", "topic")


@admin.register(TalkRegistration)
class TalkRegistrationAdmin(admin.ModelAdmin):
    list_display = ("talk", "patient", "created_at")
    search_fields = ("talk__title", "patient__first_name", "patient__last_name", "patient__username", "patient__email")


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("name", "patient", "rating", "is_active", "updated_at")
    list_filter = ("is_active", "rating")
    search_fields = ("name", "patient__first_name", "patient__last_name", "patient__username", "patient__email", "title")


@admin.register(TestimonialLike)
class TestimonialLikeAdmin(admin.ModelAdmin):
    list_display = ("testimonial", "patient", "client_id", "created_at")
    search_fields = ("testimonial__name", "testimonial__title", "patient__first_name", "patient__last_name", "patient__username", "patient__email", "client_id")
