from django.db import models
from django.db.models import Q


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Course(TimestampedModel):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    description_html = models.TextField(blank=True)
    cover_file = models.FileField(upload_to="courses/covers/", null=True, blank=True)
    category = models.CharField(max_length=120, blank=True)
    tags = models.JSONField(default=list, blank=True)
    price_cop = models.PositiveIntegerField(default=0)
    draft_content = models.JSONField(default=dict, blank=True)
    published_content = models.JSONField(default=dict, blank=True)
    promo_media = models.ForeignKey("CourseMedia", null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.title


class CourseMedia(TimestampedModel):
    class Kind(models.TextChoices):
        VIDEO = "video", "Video"

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="media")
    kind = models.CharField(max_length=20, choices=Kind.choices, default=Kind.VIDEO)
    file = models.FileField(upload_to="courses/media/")
    original_name = models.CharField(max_length=255, blank=True)
    mime_type = models.CharField(max_length=120, blank=True)
    size_bytes = models.BigIntegerField(default=0)

    def __str__(self) -> str:
        return self.original_name or f"{self.kind}:{self.id}"


class PatientCourseProgress(TimestampedModel):
    patient = models.ForeignKey("Patient", on_delete=models.CASCADE, related_name="course_progress")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="patient_progress")
    state = models.JSONField(default=dict, blank=True)

    class Meta:
        unique_together = ("patient", "course")


class Therapist(TimestampedModel):
    name = models.CharField(max_length=200)
    title = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    specialties = models.JSONField(default=list, blank=True)
    modality = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=120, blank=True)
    price_from_cop = models.PositiveIntegerField(default=0)
    session_duration_minutes = models.PositiveIntegerField(default=0)
    photo_file = models.FileField(upload_to="therapists/photos/", null=True, blank=True)
    cv_file = models.FileField(upload_to="therapists/cv/", null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.name


class Patient(TimestampedModel):
    first_name = models.CharField(max_length=120)
    last_name = models.CharField(max_length=120, blank=True)
    document_number = models.CharField(max_length=40, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=30, blank=True)
    occupation = models.CharField(max_length=160, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=40, blank=True)
    city = models.CharField(max_length=120, blank=True)
    address = models.CharField(max_length=200, blank=True)
    preferred_contact_method = models.CharField(max_length=30, blank=True)
    referral_source = models.CharField(max_length=160, blank=True)
    emergency_contact_name = models.CharField(max_length=200, blank=True)
    emergency_contact_phone = models.CharField(max_length=40, blank=True)
    reason_for_consultation = models.TextField(blank=True)
    medical_history = models.TextField(blank=True)
    medications = models.TextField(blank=True)
    allergies = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    username = models.CharField(max_length=120, unique=True, null=True, blank=True)
    password_hash = models.CharField(max_length=256, blank=True)
    portal_welcome_title = models.CharField(max_length=200, blank=True)
    portal_welcome_message = models.TextField(blank=True)
    portal_accent_color = models.CharField(max_length=20, blank=True)
    intake_completed = models.BooleanField(default=False)
    intake_answers = models.JSONField(default=dict, blank=True)
    intake_summary = models.TextField(blank=True)
    intake_submitted_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        full = f"{self.first_name} {self.last_name}".strip()
        return full or self.first_name


class Service(TimestampedModel):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    description_html = models.TextField(blank=True)
    price_cop = models.PositiveIntegerField(default=0)
    duration_minutes = models.PositiveIntegerField(default=0)
    modality = models.CharField(max_length=40, blank=True)
    audience = models.TextField(blank=True)
    includes = models.TextField(blank=True)
    benefits = models.TextField(blank=True)
    booking_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.title


class Appointment(TimestampedModel):
    class Status(models.TextChoices):
        SCHEDULED = "scheduled", "Scheduled"
        CANCELLED = "cancelled", "Cancelled"
        COMPLETED = "completed", "Completed"

    title = models.CharField(max_length=200)
    start_at = models.DateTimeField()
    end_at = models.DateTimeField()
    patient = models.ForeignKey(Patient, null=True, blank=True, on_delete=models.SET_NULL, related_name="appointments")
    service = models.ForeignKey(Service, null=True, blank=True, on_delete=models.SET_NULL, related_name="appointments")
    therapist = models.ForeignKey(Therapist, null=True, blank=True, on_delete=models.SET_NULL, related_name="appointments")
    client_name = models.CharField(max_length=200, blank=True)
    client_email = models.EmailField(blank=True)
    client_phone = models.CharField(max_length=60, blank=True)
    client_age = models.PositiveSmallIntegerField(null=True, blank=True)
    emergency_contact_name = models.CharField(max_length=200, blank=True)
    emergency_contact_phone = models.CharField(max_length=60, blank=True)
    reason = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SCHEDULED)

    def __str__(self) -> str:
        return self.title


class Talk(TimestampedModel):
    class Format(models.TextChoices):
        ONLINE = "online", "Online"
        PRESENTIAL = "presential", "Presential"

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    topic = models.CharField(max_length=120, blank=True)
    speaker = models.CharField(max_length=200, blank=True)
    organizer = models.CharField(max_length=200, blank=True)
    modality = models.CharField(max_length=120, blank=True)
    start_at = models.DateTimeField(null=True, blank=True)
    end_at = models.DateTimeField(null=True, blank=True)
    format = models.CharField(max_length=20, choices=Format.choices, default=Format.ONLINE)
    audience = models.CharField(max_length=120, blank=True)
    participants_count = models.PositiveIntegerField(default=0)
    agenda = models.JSONField(default=list, blank=True)
    video_file = models.FileField(upload_to="talks/videos/", null=True, blank=True)
    featured_video_file = models.FileField(upload_to="talks/featured/", null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.title


class TalkRegistration(TimestampedModel):
    talk = models.ForeignKey(Talk, on_delete=models.CASCADE, related_name="registrations")
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="talk_registrations")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["talk", "patient"], name="uniq_talk_patient_registration"),
        ]

    def __str__(self) -> str:
        return f"{self.talk_id}:{self.patient_id}"


class Testimonial(TimestampedModel):
    patient = models.ForeignKey(Patient, null=True, blank=True, on_delete=models.SET_NULL, related_name="testimonials")
    name = models.CharField(max_length=200)
    title = models.CharField(max_length=200, blank=True)
    quote = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["patient"], condition=Q(patient__isnull=False), name="uniq_testimonial_patient"),
        ]

    def __str__(self) -> str:
        return self.name


class TestimonialLike(TimestampedModel):
    testimonial = models.ForeignKey(Testimonial, on_delete=models.CASCADE, related_name="likes")
    patient = models.ForeignKey(Patient, null=True, blank=True, on_delete=models.SET_NULL, related_name="testimonial_likes")
    client_id = models.CharField(max_length=64, null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["testimonial", "client_id"], condition=Q(client_id__isnull=False), name="uniq_testimonial_client_like"),
            models.UniqueConstraint(fields=["testimonial", "patient"], condition=Q(patient__isnull=False), name="uniq_testimonial_patient_like"),
        ]

    def __str__(self) -> str:
        return f"{self.testimonial_id}:{self.patient_id or self.client_id}"


class Story(TimestampedModel):
    title = models.CharField(max_length=200)
    content = models.TextField()
    image_file = models.FileField(upload_to="stories/images/", null=True, blank=True)
    author = models.CharField(max_length=200, blank=True)
    category = models.CharField(max_length=100, blank=True)
    tags = models.JSONField(default=list, blank=True)
    patient = models.ForeignKey(Patient, null=True, blank=True, on_delete=models.SET_NULL, related_name="stories")
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.title


class ForumTopic(TimestampedModel):
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    description_html = models.TextField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    image_file = models.FileField(upload_to="forum/images/", null=True, blank=True)
    is_pinned = models.BooleanField(default=False)
    is_locked = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(Patient, null=True, blank=True, on_delete=models.SET_NULL, related_name="forum_topics")

    def __str__(self) -> str:
        return self.title


class ForumReply(TimestampedModel):
    topic = models.ForeignKey(ForumTopic, on_delete=models.CASCADE, related_name="replies")
    content = models.TextField()
    content_html = models.TextField(blank=True)
    author_name = models.CharField(max_length=200)
    patient = models.ForeignKey(Patient, null=True, blank=True, on_delete=models.SET_NULL, related_name="forum_replies")
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return f"Reply by {self.author_name} on {self.topic.title}"


class MembershipPlan(TimestampedModel):
    """Configurable membership plan (monthly, annual, etc.)"""
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    price_cop = models.PositiveIntegerField(default=280000, help_text="Monthly price COP")
    price_usd = models.PositiveIntegerField(default=70, help_text="Monthly price USD")
    price_eur = models.PositiveIntegerField(default=70, help_text="Monthly price EUR")
    annual_price_cop = models.PositiveIntegerField(default=2800000, help_text="Annual price COP")
    annual_price_usd = models.PositiveIntegerField(default=700, help_text="Annual price USD")
    annual_price_eur = models.PositiveIntegerField(default=700, help_text="Annual price EUR")
    monthly_discount_percent = models.PositiveSmallIntegerField(default=0)
    annual_discount_percent = models.PositiveSmallIntegerField(default=0)
    sessions_per_month = models.PositiveSmallIntegerField(default=3)
    # Sessions breakdown stored as JSON: [{"name": "Hipnoanálisis", "count": 1, "description": "..."}]
    sessions_breakdown = models.JSONField(default=list, blank=True)
    # Benefits stored as JSON list of strings
    benefits = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.name


class MembershipSubscription(TimestampedModel):
    """A patient's active membership subscription."""
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        PAUSED = "paused", "Paused"
        CANCELLED = "cancelled", "Cancelled"
        EXPIRED = "expired", "Expired"

    class PaymentMethod(models.TextChoices):
        TRANSFER = "transfer", "Transferencia Bancaria"
        CASH = "cash", "Efectivo"
        OTHER = "other", "Otro"

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="memberships")
    plan = models.ForeignKey(MembershipPlan, on_delete=models.PROTECT, related_name="subscriptions")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    payment_method = models.CharField(max_length=20, choices=PaymentMethod.choices, default=PaymentMethod.TRANSFER)
    starts_at = models.DateField()
    ends_at = models.DateField(null=True, blank=True)
    sessions_used = models.PositiveSmallIntegerField(default=0)
    notes = models.TextField(blank=True)

    def __str__(self) -> str:
        return f"{self.patient} · {self.plan} ({self.status})"


class SiteSettings(models.Model):
    """Singleton model for site-wide configuration (MercadoPago, etc.)"""
    mercadopago_public_key = models.CharField(max_length=512, blank=True, help_text="MercadoPago Public Key (starts with APP_USR-...)")
    mercadopago_access_token = models.CharField(max_length=512, blank=True, help_text="MercadoPago Access Token")
    mercadopago_enabled = models.BooleanField(default=False)
    site_name = models.CharField(max_length=200, blank=True, default="ConexiónLuz")
    support_email = models.EmailField(blank=True)
    support_whatsapp = models.CharField(max_length=40, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self) -> str:
        return "Site Settings"

    @classmethod
    def get(cls) -> 'SiteSettings':
        obj, _ = cls.objects.get_or_create(id=1)
        return obj
