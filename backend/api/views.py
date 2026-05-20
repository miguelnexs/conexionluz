import json
from datetime import datetime, timedelta
from typing import Any, Optional

from django.http import HttpRequest, HttpResponse, JsonResponse
from django.http.multipartparser import MultiPartParser, MultiPartParserError
from django.core.signing import BadSignature, SignatureExpired, TimestampSigner
from django.contrib.auth.hashers import check_password, make_password
from django.db import IntegrityError, transaction
from django.db.models import Avg, Count, ProtectedError, Sum
from django.utils.dateparse import parse_date
from django.utils.dateparse import parse_datetime
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import Appointment, Course, CourseMedia, ForumReply, ForumTopic, MembershipPlan, MembershipSubscription, Patient, PatientCourseProgress, Service, SiteSettings, Story, Talk, TalkRegistration, Testimonial, TestimonialLike, Therapist


def _json_error(message: str, status: int = 400) -> JsonResponse:
    return JsonResponse({"ok": False, "error": message}, status=status)


def _parse_json_body(request: HttpRequest) -> dict[str, Any]:
    if not request.body:
        return {}
    try:
        value = json.loads(request.body.decode("utf-8"))
    except Exception:
        return {}
    return value if isinstance(value, dict) else {}


def _parse_multipart(request: HttpRequest):
    try:
        parser = MultiPartParser(request.META, request, request.upload_handlers)
        data, files = parser.parse()
        return data, files
    except MultiPartParserError:
        return None, None


def _parse_bool(value: Any, default: bool = False) -> bool:
    if isinstance(value, bool):
        return value
    if value is None:
        return default
    if isinstance(value, int):
        return value != 0
    if isinstance(value, str):
        v = value.strip().lower()
        if v in ("true", "1", "yes", "y", "on"):
            return True
        if v in ("false", "0", "no", "n", "off", ""):
            return False
        return default
    return default


def _normalize_username(value: Any) -> str:
    return str(value or "").strip().lower()


def _is_valid_username(value: str) -> bool:
    if not value:
        return False
    if len(value) < 3 or len(value) > 120:
        return False
    for ch in value:
        if ch.isalnum():
            continue
        if ch in ("_", ".", "-"):
            continue
        return False
    return True


def _dt_to_iso(value: Optional[datetime]) -> Optional[str]:
    if value is None:
        return None
    return value.isoformat()


def _file_to_url(request: HttpRequest, file_field) -> Optional[str]:
    try:
        if not file_field:
            return None
        return request.build_absolute_uri(file_field.url)
    except Exception:
        return None


def _course_to_dict(course: Course) -> dict[str, Any]:
    return {
        "id": course.id,
        "title": course.title,
        "slug": course.slug,
        "description": course.description,
        "descriptionHtml": course.description_html,
        "coverUrl": None,
        "promoMediaId": course.promo_media_id,
        "promoVideoUrl": None,
        "category": course.category,
        "tags": course.tags,
        "priceCOP": course.price_cop,
        "draftContent": course.draft_content,
        "publishedContent": course.published_content,
        "status": course.status,
        "isActive": course.is_active,
        "createdAt": _dt_to_iso(course.created_at),
        "updatedAt": _dt_to_iso(course.updated_at),
    }


def _therapist_to_dict(therapist: Therapist) -> dict[str, Any]:
    return {
        "id": therapist.id,
        "name": therapist.name,
        "title": therapist.title,
        "description": therapist.description,
        "specialties": therapist.specialties,
        "modality": therapist.modality,
        "location": therapist.location,
        "priceFromCOP": therapist.price_from_cop,
        "sessionDurationMinutes": therapist.session_duration_minutes,
        "photoUrl": None,
        "cvUrl": None,
        "isActive": therapist.is_active,
        "createdAt": _dt_to_iso(therapist.created_at),
        "updatedAt": _dt_to_iso(therapist.updated_at),
    }


def _service_to_dict(service: Service) -> dict[str, Any]:
    return {
        "id": service.id,
        "title": service.title,
        "description": service.description,
        "descriptionHtml": service.description_html,
        "priceCOP": service.price_cop,
        "durationMinutes": service.duration_minutes,
        "modality": service.modality,
        "audience": service.audience,
        "includes": service.includes,
        "benefits": service.benefits,
        "bookingUrl": service.booking_url,
        "isActive": service.is_active,
        "createdAt": _dt_to_iso(service.created_at),
        "updatedAt": _dt_to_iso(service.updated_at),
    }


def _talk_to_dict(talk: Talk) -> dict[str, Any]:
    return {
        "id": talk.id,
        "title": talk.title,
        "description": talk.description,
        "topic": talk.topic,
        "speaker": talk.speaker,
        "organizer": talk.organizer,
        "modality": talk.modality,
        "startAt": _dt_to_iso(talk.start_at),
        "endAt": _dt_to_iso(talk.end_at),
        "format": talk.format,
        "audience": talk.audience,
        "participants": talk.participants_count,
        "agenda": talk.agenda or [],
        "videoUrl": None,
        "featuredVideoUrl": None,
        "isActive": talk.is_active,
        "createdAt": _dt_to_iso(talk.created_at),
        "updatedAt": _dt_to_iso(talk.updated_at),
    }


def _sync_talk_participants(talk_id: int) -> int:
    count = TalkRegistration.objects.filter(talk_id=talk_id).count()
    Talk.objects.filter(id=talk_id).update(participants_count=count)
    return count


def _talk_status(talk: Talk) -> str:
    if talk.start_at is None:
        return "future"
    now = timezone.now()
    return "future" if talk.start_at >= now else "past"


def _testimonial_to_dict(testimonial: Testimonial) -> dict[str, Any]:
    likes_count = int(getattr(testimonial, "likes_count", 0) or 0)
    return {
        "id": testimonial.id,
        "patientId": testimonial.patient_id,
        "name": testimonial.name,
        "title": testimonial.title,
        "quote": testimonial.quote,
        "rating": testimonial.rating,
        "likesCount": likes_count,
        "isActive": testimonial.is_active,
        "createdAt": _dt_to_iso(testimonial.created_at),
        "updatedAt": _dt_to_iso(testimonial.updated_at),
    }


def _story_to_dict(request, story: Story) -> dict[str, Any]:
    return {
        "id": story.id,
        "title": story.title,
        "content": story.content,
        "imageUrl": _file_to_url(request, story.image_file) if story.image_file else None,
        "author": story.author,
        "category": story.category,
        "tags": story.tags,
        "patientId": story.patient_id,
        "isActive": story.is_active,
        "createdAt": _dt_to_iso(story.created_at),
        "updatedAt": _dt_to_iso(story.updated_at),
    }


def _appointment_to_dict(appt: Appointment) -> dict[str, Any]:
    return {
        "id": appt.id,
        "title": appt.title,
        "startAt": _dt_to_iso(appt.start_at),
        "endAt": _dt_to_iso(appt.end_at),
        "status": appt.status,
        "patientId": appt.patient_id,
        "serviceId": appt.service_id,
        "clientName": appt.client_name,
        "clientEmail": appt.client_email,
        "clientPhone": appt.client_phone,
        "clientAge": appt.client_age,
        "emergencyContactName": appt.emergency_contact_name,
        "emergencyContactPhone": appt.emergency_contact_phone,
        "reason": appt.reason,
        "notes": appt.notes,
        "createdAt": _dt_to_iso(appt.created_at),
        "updatedAt": _dt_to_iso(appt.updated_at),
    }


def _patient_to_dict(patient: Patient) -> dict[str, Any]:
    return {
        "id": patient.id,
        "firstName": patient.first_name,
        "lastName": patient.last_name,
        "documentNumber": patient.document_number,
        "birthDate": patient.birth_date.isoformat() if patient.birth_date else None,
        "gender": patient.gender,
        "occupation": patient.occupation,
        "email": patient.email,
        "phone": patient.phone,
        "city": patient.city,
        "address": patient.address,
        "preferredContactMethod": patient.preferred_contact_method,
        "referralSource": patient.referral_source,
        "emergencyContactName": patient.emergency_contact_name,
        "emergencyContactPhone": patient.emergency_contact_phone,
        "reasonForConsultation": patient.reason_for_consultation,
        "medicalHistory": patient.medical_history,
        "medications": patient.medications,
        "allergies": patient.allergies,
        "notes": patient.notes,
        "username": patient.username,
        "hasPassword": bool(patient.password_hash),
        "portalWelcomeTitle": patient.portal_welcome_title,
        "portalWelcomeMessage": patient.portal_welcome_message,
        "portalAccentColor": patient.portal_accent_color,
        "intakeCompleted": patient.intake_completed,
        "intakeAnswers": patient.intake_answers,
        "intakeSummary": patient.intake_summary,
        "intakeSubmittedAt": _dt_to_iso(patient.intake_submitted_at),
        "isActive": patient.is_active,
        "createdAt": _dt_to_iso(patient.created_at),
        "updatedAt": _dt_to_iso(patient.updated_at),
    }


def _patient_portal_to_dict(patient: Patient) -> dict[str, Any]:
    has_sub = patient.memberships.filter(status=MembershipSubscription.Status.ACTIVE).exists()
    return {
        "id": patient.id,
        "firstName": patient.first_name,
        "lastName": patient.last_name,
        "email": patient.email,
        "phone": patient.phone,
        "portalWelcomeTitle": patient.portal_welcome_title,
        "portalWelcomeMessage": patient.portal_welcome_message,
        "portalAccentColor": patient.portal_accent_color,
        "intakeCompleted": patient.intake_completed,
        "intakeSummary": patient.intake_summary,
        "hasActiveSubscription": has_sub,
    }


def _auth_signer() -> TimestampSigner:
    return TimestampSigner(salt="patient-auth")


def _issue_patient_token(patient_id: int) -> str:
    return _auth_signer().sign(str(patient_id))


def _get_patient_from_token(request: HttpRequest) -> Optional[Patient]:
    header = request.headers.get("Authorization", "")
    if not header:
        header = request.META.get("HTTP_AUTHORIZATION", "")
    if not header.lower().startswith("bearer "):
        return None
    token = header.split(" ", 1)[1].strip()
    if not token:
        return None
    try:
        value = _auth_signer().unsign(token, max_age=60 * 60 * 24 * 30)
        patient_id = int(value)
    except (BadSignature, SignatureExpired, ValueError):
        return None
    try:
        return Patient.objects.get(id=patient_id, is_active=True)
    except Patient.DoesNotExist:
        return None


def _clamp_int(value: Any, min_value: int, max_value: int) -> int:
    try:
        v = int(value)
    except Exception:
        v = min_value
    return max(min_value, min(max_value, v))


def _intake_level(value: int) -> str:
    if value <= 4:
        return "low"
    if value <= 8:
        return "moderate"
    return "high"


def _compute_intake_summary(answers: dict[str, Any]) -> tuple[dict[str, Any], str]:
    stress = _clamp_int(answers.get("stress"), 0, 3)
    anxiety = _clamp_int(answers.get("anxiety"), 0, 3)
    mood = _clamp_int(answers.get("mood"), 0, 3)
    sleep = _clamp_int(answers.get("sleep"), 0, 3)
    energy = _clamp_int(answers.get("energy"), 0, 3)
    focus = _clamp_int(answers.get("focus"), 0, 3)
    total = stress + anxiety + mood + sleep + energy + focus
    level = _intake_level(total)
    insights = {
        "stress": stress,
        "anxiety": anxiety,
        "mood": mood,
        "sleep": sleep,
        "energy": energy,
        "focus": focus,
        "total": total,
        "level": level,
        "goal": str(answers.get("goal", "") or "").strip(),
    }
    level_es = {"low": "bajo", "moderate": "moderado", "high": "alto"}[level]
    summary = f"Evaluación inicial (autorreporte). Nivel global: {level_es}. Puntaje: {total}/18."
    goal = insights["goal"]
    if goal:
        summary = f"{summary} Objetivo: {goal}"
    return insights, summary


def _count_course_content(content: Any) -> dict[str, int]:
    if not isinstance(content, dict):
        return {"sections": 0, "items": 0, "videos": 0, "html": 0, "quizzes": 0, "questions": 0}
    sections = content.get("sections")
    if not isinstance(sections, list):
        return {"sections": 0, "items": 0, "videos": 0, "html": 0, "quizzes": 0, "questions": 0}
    counts = {"sections": 0, "items": 0, "videos": 0, "html": 0, "quizzes": 0, "questions": 0}
    counts["sections"] = len([s for s in sections if isinstance(s, dict)])
    for s in sections:
        if not isinstance(s, dict):
            continue
        items = s.get("items")
        if not isinstance(items, list):
            continue
        for it in items:
            if not isinstance(it, dict):
                continue
            counts["items"] += 1
            t = it.get("type")
            if t == "video":
                counts["videos"] += 1
            elif t == "html":
                counts["html"] += 1
            elif t == "quiz":
                counts["quizzes"] += 1
                quiz = it.get("quiz")
                if isinstance(quiz, dict):
                    qs = quiz.get("questions")
                    if isinstance(qs, list):
                        counts["questions"] += len([q for q in qs if isinstance(q, dict)])
    return counts


@csrf_exempt
@require_http_methods(["GET"])
def health(_: HttpRequest) -> JsonResponse:
    return JsonResponse({"ok": True})


def _admin_signer() -> TimestampSigner:
    return TimestampSigner(salt="admin-auth")


def _issue_admin_token() -> str:
    return _admin_signer().sign("admin")


def _get_admin_from_token(request: HttpRequest) -> bool:
    header = request.headers.get("Authorization", "")
    if not header:
        header = request.META.get("HTTP_AUTHORIZATION", "")
    if not header.lower().startswith("bearer "):
        return False
    token = header.split(" ", 1)[1].strip()
    if not token:
        return False
    try:
        value = _admin_signer().unsign(token, max_age=60 * 60 * 24 * 30)
        return value == "admin"
    except (BadSignature, SignatureExpired, ValueError):
        return False


@csrf_exempt
@require_http_methods(["POST"])
def admin_login(request: HttpRequest) -> JsonResponse:
    import os
    body = _parse_json_body(request)
    username = str(body.get("username", "")).strip()
    password = str(body.get("password", "")).strip()

    valid_username = os.environ.get("ADMIN_USERNAME", "conexionluz")
    valid_password = os.environ.get("ADMIN_PASSWORD", "Govinda09")

    if username != valid_username or password != valid_password:
        return _json_error("Credenciales incorrectas", status=401)

    token = _issue_admin_token()
    return JsonResponse({"ok": True, "data": {"token": token, "username": valid_username}})


@csrf_exempt
@require_http_methods(["GET"])
def dashboard(_: HttpRequest) -> JsonResponse:
    return JsonResponse(
        {
            "ok": True,
            "data": {
                "courses": Course.objects.filter(is_active=True).count(),
                "therapists": Therapist.objects.filter(is_active=True).count(),
                "services": Service.objects.filter(is_active=True).count(),
                "talks": Talk.objects.filter(is_active=True).count(),
                "testimonials": Testimonial.objects.filter(is_active=True).count(),
                "stories": Story.objects.filter(is_active=True).count(),
            },
        }
    )


@csrf_exempt
@require_http_methods(["GET"])
def analytics(_: HttpRequest) -> JsonResponse:
    # Basic counts
    sessions_total = Appointment.objects.count()
    patients_total = Patient.objects.filter(is_active=True).count()
    requests_total = TalkRegistration.objects.count()
    satisfaction = Testimonial.objects.filter(is_active=True).aggregate(Avg("rating")).get("rating__avg") or 0
    
    # Appointments by service
    by_service = Service.objects.annotate(count=Count("appointments")).values("title", "count").order_by("-count")[:5]
    service_distribution = {item["title"]: item["count"] for item in by_service}
    
    # Growth (last 6 months)
    now = timezone.now()
    growth_labels = []
    growth_data = []
    for i in range(5, -1, -1):
        month_start = (now - timedelta(days=i * 30)).replace(day=1, hour=0, minute=0, second=0)
        # simplistic month calculation
        next_month = (month_start + timedelta(days=32)).replace(day=1)
        count = Patient.objects.filter(created_at__gte=month_start, created_at__lt=next_month).count()
        growth_labels.append(month_start.strftime("%b"))
        growth_data.append(count)

    return JsonResponse(
        {
            "ok": True,
            "data": {
                "sessions": sessions_total,
                "patients": patients_total,
                "requests": requests_total,
                "satisfaction": round(float(satisfaction), 1),
                "serviceDistribution": service_distribution,
                "growth": {
                    "labels": growth_labels,
                    "data": growth_data
                }
            },
        }
    )


@csrf_exempt
@require_http_methods(["GET", "POST"])
def courses(request: HttpRequest) -> JsonResponse:
    if request.method == "GET":
        items = Course.objects.all().order_by("-updated_at")
        return JsonResponse(
            {
                "ok": True,
                "data": [
                    _course_to_dict(c)
                    | {
                        "coverUrl": _file_to_url(request, c.cover_file),
                        "promoVideoUrl": _file_to_url(request, c.promo_media.file) if c.promo_media_id else None,
                    }
                    for c in items
                ],
            }
        )

    body = _parse_json_body(request)
    title = str(body.get("title", "")).strip()
    slug = str(body.get("slug", "")).strip()
    if not title or not slug:
        return _json_error("title and slug are required")
    description = str(body.get("description", "")).strip()
    description_html = str(body.get("descriptionHtml", "")).strip()
    price_cop = int(body.get("priceCOP", 0) or 0)
    status = str(body.get("status", Course.Status.DRAFT))
    is_active = _parse_bool(body.get("isActive", True), True)
    category = str(body.get("category", "")).strip()
    tags_raw = body.get("tags") or []
    tags: list[str] = []
    if isinstance(tags_raw, list):
        tags = [str(x).strip() for x in tags_raw if str(x).strip()]
    elif isinstance(tags_raw, str):
        tags = [x.strip() for x in tags_raw.split(",") if x.strip()]
    draft_content = body.get("draftContent") if isinstance(body.get("draftContent"), dict) else {}

    course = Course.objects.create(
        title=title,
        slug=slug,
        description=description,
        description_html=description_html,
        category=category,
        tags=tags,
        price_cop=max(0, price_cop),
        draft_content=draft_content,
        status=status if status in Course.Status.values else Course.Status.DRAFT,
        is_active=is_active,
    )
    return JsonResponse(
        {
            "ok": True,
            "data": _course_to_dict(course)
            | {"coverUrl": _file_to_url(request, course.cover_file), "promoVideoUrl": None},
        },
        status=201,
    )


@csrf_exempt
@require_http_methods(["GET"])
def course_stats(_: HttpRequest) -> JsonResponse:
    total = Course.objects.count()
    active = Course.objects.filter(is_active=True).count()
    published = Course.objects.filter(status=Course.Status.PUBLISHED).count()
    draft = Course.objects.filter(status=Course.Status.DRAFT).count()
    with_promo = Course.objects.filter(promo_media__isnull=False).count()

    media_count = CourseMedia.objects.count()
    media_size_bytes = int(CourseMedia.objects.aggregate(total=Sum("size_bytes")).get("total") or 0)
    avg_price = float(Course.objects.aggregate(avg=Avg("price_cop")).get("avg") or 0)

    categories = Course.objects.exclude(category="").values_list("category", flat=True).distinct()
    category_count = categories.count()

    tags_set: set[str] = set()
    draft_counts = {"sections": 0, "items": 0, "videos": 0, "html": 0, "quizzes": 0, "questions": 0}
    published_counts = {"sections": 0, "items": 0, "videos": 0, "html": 0, "quizzes": 0, "questions": 0}

    for c in Course.objects.all().only("tags", "draft_content", "published_content"):
        if isinstance(c.tags, list):
            for t in c.tags:
                ts = str(t).strip()
                if ts:
                    tags_set.add(ts)
        dc = _count_course_content(c.draft_content)
        pc = _count_course_content(c.published_content)
        for k in draft_counts:
            draft_counts[k] += dc.get(k, 0)
            published_counts[k] += pc.get(k, 0)

    last_updated = Course.objects.order_by("-updated_at").values_list("updated_at", flat=True).first()

    return JsonResponse(
        {
            "ok": True,
            "data": {
                "total": total,
                "active": active,
                "published": published,
                "draft": draft,
                "withPromoVideo": with_promo,
                "mediaCount": media_count,
                "mediaSizeBytes": media_size_bytes,
                "avgPriceCOP": avg_price,
                "categoryCount": category_count,
                "uniqueTagsCount": len(tags_set),
                "draftContent": draft_counts,
                "publishedContent": published_counts,
                "lastUpdatedAt": _dt_to_iso(last_updated),
            },
        }
    )


@csrf_exempt
@require_http_methods(["GET", "PUT", "PATCH", "DELETE"])
def course_detail(request: HttpRequest, course_id: int) -> JsonResponse:
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return _json_error("not found", status=404)

    if request.method == "GET":
        return JsonResponse(
            {
                "ok": True,
                "data": _course_to_dict(course)
                | {
                    "coverUrl": _file_to_url(request, course.cover_file),
                    "promoVideoUrl": _file_to_url(request, course.promo_media.file) if course.promo_media_id else None,
                },
            }
        )

    if request.method == "DELETE":
        course.delete()
        return JsonResponse({"ok": True})

    uploaded_cover = None
    if request.content_type and request.content_type.startswith("multipart/form-data"):
        body, files = _parse_multipart(request)
        if body is None or files is None:
            return _json_error("invalid multipart body")
        uploaded_cover = files.get("coverFile")
    else:
        body = _parse_json_body(request)

    if "title" in body:
        course.title = str(body.get("title", "")).strip()
    if "slug" in body:
        course.slug = str(body.get("slug", "")).strip()
    if "description" in body:
        course.description = str(body.get("description", "")).strip()
    if "descriptionHtml" in body:
        course.description_html = str(body.get("descriptionHtml", "")).strip()
    if "priceCOP" in body:
        course.price_cop = max(0, int(body.get("priceCOP", 0) or 0))
    if "category" in body:
        course.category = str(body.get("category", "")).strip()
    if "tags" in body:
        tags_raw = body.get("tags") or []
        if isinstance(tags_raw, list):
            course.tags = [str(x).strip() for x in tags_raw if str(x).strip()]
        elif isinstance(tags_raw, str):
            course.tags = [x.strip() for x in tags_raw.split(",") if x.strip()]
        else:
            course.tags = []
    if "draftContent" in body and isinstance(body.get("draftContent"), dict):
        course.draft_content = body.get("draftContent") or {}
    if "publishedContent" in body and isinstance(body.get("publishedContent"), dict):
        course.published_content = body.get("publishedContent") or {}
    if "status" in body:
        status = str(body.get("status", ""))
        if status in Course.Status.values:
            course.status = status
    if "isActive" in body:
        course.is_active = _parse_bool(body.get("isActive"), course.is_active)

    if uploaded_cover is not None:
        filename = str(getattr(uploaded_cover, "name", "")).lower()
        if not filename.endswith((".png", ".jpg", ".jpeg", ".webp")):
            return _json_error("coverFile must be an image (png, jpg, jpeg, webp)")
        course.cover_file = uploaded_cover

    if not course.title or not course.slug:
        return _json_error("title and slug are required")

    course.save()
    return JsonResponse(
        {
            "ok": True,
            "data": _course_to_dict(course)
            | {
                "coverUrl": _file_to_url(request, course.cover_file),
                "promoVideoUrl": _file_to_url(request, course.promo_media.file) if course.promo_media_id else None,
            },
        }
    )


def _course_media_to_dict(request: HttpRequest, media: CourseMedia) -> dict[str, Any]:
    return {
        "id": media.id,
        "courseId": media.course_id,
        "kind": media.kind,
        "originalName": media.original_name,
        "mimeType": media.mime_type,
        "sizeBytes": media.size_bytes,
        "url": _file_to_url(request, media.file),
        "createdAt": _dt_to_iso(media.created_at),
        "updatedAt": _dt_to_iso(media.updated_at),
    }


@csrf_exempt
@require_http_methods(["POST"])
def course_publish(request: HttpRequest, course_id: int) -> JsonResponse:
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return _json_error("not found", status=404)

    course.published_content = course.draft_content or {}
    course.status = Course.Status.PUBLISHED
    course.save()
    return JsonResponse({"ok": True, "data": _course_to_dict(course) | {"coverUrl": _file_to_url(request, course.cover_file)}})


@csrf_exempt
@require_http_methods(["GET", "POST"])
def course_media(request: HttpRequest, course_id: int) -> JsonResponse:
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return _json_error("not found", status=404)

    if request.method == "GET":
        items = CourseMedia.objects.filter(course=course).order_by("-updated_at")
        return JsonResponse({"ok": True, "data": [_course_media_to_dict(request, m) for m in items]})

    if not (request.content_type and request.content_type.startswith("multipart/form-data")):
        return _json_error("multipart/form-data required")

    body, files = _parse_multipart(request)
    if body is None or files is None:
        return _json_error("invalid multipart body")

    uploaded = files.get("file")
    if uploaded is None:
        return _json_error("file is required")

    filename = str(getattr(uploaded, "name", "")).lower()
    if not filename.endswith((".mp4", ".avi", ".mov")):
        return _json_error("file must be a video (mp4, avi, mov)")

    size = int(getattr(uploaded, "size", 0) or 0)
    max_size = 1024 * 1024 * 500
    if size <= 0:
        return _json_error("invalid file size")
    if size > max_size:
        return _json_error("file too large (max 500MB)")

    mime_type = str(getattr(uploaded, "content_type", "") or "").strip()
    media = CourseMedia.objects.create(
        course=course,
        kind=CourseMedia.Kind.VIDEO,
        file=uploaded,
        original_name=str(getattr(uploaded, "name", "") or "")[:255],
        mime_type=mime_type,
        size_bytes=size,
    )
    return JsonResponse({"ok": True, "data": _course_media_to_dict(request, media)}, status=201)


@csrf_exempt
@require_http_methods(["DELETE"])
def course_media_detail(request: HttpRequest, media_id: int) -> JsonResponse:
    try:
        media = CourseMedia.objects.get(id=media_id)
    except CourseMedia.DoesNotExist:
        return _json_error("not found", status=404)

    media.delete()
    return JsonResponse({"ok": True})


@csrf_exempt
@require_http_methods(["POST", "DELETE"])
def course_promo_video(request: HttpRequest, course_id: int) -> JsonResponse:
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return _json_error("not found", status=404)

    if request.method == "DELETE":
        course.promo_media = None
        course.save()
        return JsonResponse({"ok": True, "data": _course_to_dict(course) | {"coverUrl": _file_to_url(request, course.cover_file), "promoVideoUrl": None}})

    if not (request.content_type and request.content_type.startswith("multipart/form-data")):
        return _json_error("multipart/form-data required")

    body, files = _parse_multipart(request)
    if body is None or files is None:
        return _json_error("invalid multipart body")

    uploaded = files.get("file")
    if uploaded is None:
        return _json_error("file is required")

    filename = str(getattr(uploaded, "name", "")).lower()
    if not filename.endswith((".mp4", ".avi", ".mov")):
        return _json_error("file must be a video (mp4, avi, mov)")

    size = int(getattr(uploaded, "size", 0) or 0)
    max_size = 1024 * 1024 * 500
    if size <= 0:
        return _json_error("invalid file size")
    if size > max_size:
        return _json_error("file too large (max 500MB)")

    mime_type = str(getattr(uploaded, "content_type", "") or "").strip()
    media = CourseMedia.objects.create(
        course=course,
        kind=CourseMedia.Kind.VIDEO,
        file=uploaded,
        original_name=str(getattr(uploaded, "name", "") or "")[:255],
        mime_type=mime_type,
        size_bytes=size,
    )
    course.promo_media = media
    course.save()
    return JsonResponse(
        {
            "ok": True,
            "data": _course_to_dict(course)
            | {
                "coverUrl": _file_to_url(request, course.cover_file),
                "promoVideoUrl": _file_to_url(request, media.file),
            },
        },
        status=201,
    )


def _resolve_course_media_urls(request: HttpRequest, course: Course, content: dict[str, Any]) -> dict[str, Any]:
    if not content or not isinstance(content, dict):
        return {}
    media_map: dict[int, str] = {}
    for m in CourseMedia.objects.filter(course=course):
        url = _file_to_url(request, m.file)
        if url:
            media_map[m.id] = url

    sections = content.get("sections")
    if not isinstance(sections, list):
        return content

    for section in sections:
        if not isinstance(section, dict):
            continue
        items = section.get("items")
        if not isinstance(items, list):
            continue
        for item in items:
            if not isinstance(item, dict):
                continue
            if item.get("type") != "video":
                continue
            media_id = item.get("mediaId")
            if isinstance(media_id, int) and not item.get("mediaUrl"):
                url = media_map.get(media_id)
                if url:
                    item["mediaUrl"] = url
    return content


@csrf_exempt
@require_http_methods(["GET"])
def portal_courses(request: HttpRequest) -> JsonResponse:
    patient = _get_patient_from_token(request)
    if patient is None:
        return _json_error("unauthorized", status=401)

    items = Course.objects.filter(is_active=True, status=Course.Status.PUBLISHED).order_by("-updated_at")
    data = []
    for c in items:
        progress = PatientCourseProgress.objects.filter(patient=patient, course=c).first()
        data.append(
            {
                "id": c.id,
                "title": c.title,
                "slug": c.slug,
                "description": c.description,
                "descriptionHtml": c.description_html,
                "coverUrl": _file_to_url(request, c.cover_file),
                "promoVideoUrl": _file_to_url(request, c.promo_media.file) if c.promo_media_id else None,
                "category": c.category,
                "tags": c.tags,
                "priceCOP": c.price_cop,
                "progress": progress.state if progress else {},
            }
        )
    return JsonResponse({"ok": True, "data": data})


@csrf_exempt
@require_http_methods(["GET"])
def public_courses(request: HttpRequest) -> JsonResponse:
    items = Course.objects.filter(is_active=True, status=Course.Status.PUBLISHED).order_by("-updated_at")
    data = []
    for c in items:
        data.append(
            {
                "id": c.id,
                "title": c.title,
                "slug": c.slug,
                "description": c.description,
                "descriptionHtml": c.description_html,
                "coverUrl": _file_to_url(request, c.cover_file),
                "promoVideoUrl": _file_to_url(request, c.promo_media.file) if c.promo_media_id else None,
                "category": c.category,
                "tags": c.tags,
                "priceCOP": c.price_cop,
            }
        )
    return JsonResponse({"ok": True, "data": data})


@csrf_exempt
@require_http_methods(["GET"])
def public_course_detail(request: HttpRequest, slug: str) -> JsonResponse:
    try:
        course = Course.objects.get(slug=slug, is_active=True, status=Course.Status.PUBLISHED)
    except Course.DoesNotExist:
        return _json_error("not found", status=404)

    return JsonResponse(
        {
            "ok": True,
            "data": {
                "id": course.id,
                "title": course.title,
                "slug": course.slug,
                "description": course.description,
                "descriptionHtml": course.description_html,
                "coverUrl": _file_to_url(request, course.cover_file),
                "promoVideoUrl": _file_to_url(request, course.promo_media.file) if course.promo_media_id else None,
                "category": course.category,
                "tags": course.tags,
                "priceCOP": course.price_cop,
            },
        }
    )


@csrf_exempt
@require_http_methods(["GET"])
def portal_course_detail(request: HttpRequest, slug: str) -> JsonResponse:
    patient = _get_patient_from_token(request)
    if patient is None:
        return _json_error("unauthorized", status=401)

    try:
        course = Course.objects.get(slug=slug, is_active=True, status=Course.Status.PUBLISHED)
    except Course.DoesNotExist:
        return _json_error("not found", status=404)

    progress = PatientCourseProgress.objects.filter(patient=patient, course=course).first()
    content = _resolve_course_media_urls(request, course, course.published_content or {})
    return JsonResponse(
        {
            "ok": True,
            "data": {
                "id": course.id,
                "title": course.title,
                "slug": course.slug,
                "description": course.description,
                "descriptionHtml": course.description_html,
                "coverUrl": _file_to_url(request, course.cover_file),
                "promoVideoUrl": _file_to_url(request, course.promo_media.file) if course.promo_media_id else None,
                "category": course.category,
                "tags": course.tags,
                "priceCOP": course.price_cop,
                "content": content,
                "progress": progress.state if progress else {},
            },
        }
    )


@csrf_exempt
@require_http_methods(["PATCH"])
def portal_course_progress(request: HttpRequest, slug: str) -> JsonResponse:
    patient = _get_patient_from_token(request)
    if patient is None:
        return _json_error("unauthorized", status=401)

    try:
        course = Course.objects.get(slug=slug, is_active=True, status=Course.Status.PUBLISHED)
    except Course.DoesNotExist:
        return _json_error("not found", status=404)

    body = _parse_json_body(request)
    state = body.get("state")
    if not isinstance(state, dict):
        return _json_error("state is required")

    progress, _ = PatientCourseProgress.objects.get_or_create(patient=patient, course=course)
    progress.state = state
    progress.save()
    return JsonResponse({"ok": True, "data": {"state": progress.state}})


@csrf_exempt
@require_http_methods(["GET", "POST"])
def therapists(request: HttpRequest) -> JsonResponse:
    if request.method == "GET":
        items = Therapist.objects.all().order_by("-updated_at")
        return JsonResponse(
            {
                "ok": True,
                "data": [
                    _therapist_to_dict(t)
                    | {
                        "photoUrl": _file_to_url(request, t.photo_file),
                        "cvUrl": _file_to_url(request, t.cv_file),
                    }
                    for t in items
                ],
            }
        )

    if request.content_type and request.content_type.startswith("multipart/form-data"):
        body, files = _parse_multipart(request)
        if body is None or files is None:
            return _json_error("invalid multipart body")
        uploaded_photo = files.get("photoFile")
        uploaded_cv = files.get("cvFile")
    else:
        body = _parse_json_body(request)
        uploaded_photo = None
        uploaded_cv = None

    name = str(body.get("name", "")).strip()
    if not name:
        return _json_error("name is required")

    if uploaded_photo is not None:
        filename = str(getattr(uploaded_photo, "name", "")).lower()
        if not filename.endswith((".png", ".jpg", ".jpeg", ".webp")):
            return _json_error("photoFile must be an image (png, jpg, jpeg, webp)")

    if uploaded_cv is not None:
        filename = str(getattr(uploaded_cv, "name", "")).lower()
        if not filename.endswith(".pdf"):
            return _json_error("cvFile must be a PDF")

    specialties_raw = body.get("specialties")
    if isinstance(specialties_raw, list):
        specialties = specialties_raw
    elif isinstance(specialties_raw, str):
        specialties = [s.strip() for s in specialties_raw.split(",") if s.strip()]
    else:
        specialties = []

    try:
        price_from_cop = int(body.get("priceFromCOP", 0) or 0)
    except Exception:
        price_from_cop = 0

    try:
        session_duration_minutes = int(body.get("sessionDurationMinutes", 0) or 0)
    except Exception:
        session_duration_minutes = 0

    therapist = Therapist.objects.create(
        name=name,
        title=str(body.get("title", "")).strip(),
        description=str(body.get("description", "")).strip(),
        specialties=specialties,
        modality=str(body.get("modality", "")).strip(),
        location=str(body.get("location", "")).strip(),
        price_from_cop=max(0, price_from_cop),
        session_duration_minutes=max(0, session_duration_minutes),
        photo_file=uploaded_photo,
        cv_file=uploaded_cv,
        is_active=_parse_bool(body.get("isActive", True), True),
    )
    return JsonResponse(
        {
            "ok": True,
            "data": _therapist_to_dict(therapist)
            | {
                "photoUrl": _file_to_url(request, therapist.photo_file),
                "cvUrl": _file_to_url(request, therapist.cv_file),
            },
        },
        status=201,
    )


@csrf_exempt
@require_http_methods(["GET", "PUT", "PATCH", "DELETE"])
def therapist_detail(request: HttpRequest, therapist_id: int) -> JsonResponse:
    try:
        therapist = Therapist.objects.get(id=therapist_id)
    except Therapist.DoesNotExist:
        return _json_error("not found", status=404)

    if request.method == "GET":
        return JsonResponse(
            {
                "ok": True,
                "data": _therapist_to_dict(therapist)
                | {
                    "photoUrl": _file_to_url(request, therapist.photo_file),
                    "cvUrl": _file_to_url(request, therapist.cv_file),
                },
            }
        )

    if request.method == "DELETE":
        therapist.delete()
        return JsonResponse({"ok": True})

    if request.content_type and request.content_type.startswith("multipart/form-data"):
        body, files = _parse_multipart(request)
        if body is None or files is None:
            return _json_error("invalid multipart body")
        uploaded_photo = files.get("photoFile")
        uploaded_cv = files.get("cvFile")
    else:
        body = _parse_json_body(request)
        uploaded_photo = None
        uploaded_cv = None

    if "name" in body:
        therapist.name = str(body.get("name", "")).strip()
    if "title" in body:
        therapist.title = str(body.get("title", "")).strip()
    if "description" in body:
        therapist.description = str(body.get("description", "")).strip()
    if "specialties" in body and isinstance(body.get("specialties"), list):
        therapist.specialties = body.get("specialties")
    if "specialties" in body and isinstance(body.get("specialties"), str):
        therapist.specialties = [s.strip() for s in str(body.get("specialties", "")).split(",") if s.strip()]
    if "modality" in body:
        therapist.modality = str(body.get("modality", "")).strip()
    if "location" in body:
        therapist.location = str(body.get("location", "")).strip()
    if "priceFromCOP" in body:
        try:
            therapist.price_from_cop = max(0, int(body.get("priceFromCOP", 0) or 0))
        except Exception:
            therapist.price_from_cop = 0
    if "sessionDurationMinutes" in body:
        try:
            therapist.session_duration_minutes = max(0, int(body.get("sessionDurationMinutes", 0) or 0))
        except Exception:
            therapist.session_duration_minutes = 0
    if "isActive" in body:
        therapist.is_active = _parse_bool(body.get("isActive"), therapist.is_active)
    if uploaded_photo is not None:
        filename = str(getattr(uploaded_photo, "name", "")).lower()
        if not filename.endswith((".png", ".jpg", ".jpeg", ".webp")):
            return _json_error("photoFile must be an image (png, jpg, jpeg, webp)")
        therapist.photo_file = uploaded_photo
    if uploaded_cv is not None:
        filename = str(getattr(uploaded_cv, "name", "")).lower()
        if not filename.endswith(".pdf"):
            return _json_error("cvFile must be a PDF")
        therapist.cv_file = uploaded_cv

    if not therapist.name:
        return _json_error("name is required")

    therapist.save()
    return JsonResponse(
        {
            "ok": True,
            "data": _therapist_to_dict(therapist)
            | {
                "photoUrl": _file_to_url(request, therapist.photo_file),
                "cvUrl": _file_to_url(request, therapist.cv_file),
            },
        }
    )


@csrf_exempt
@require_http_methods(["GET", "POST"])
def services(request: HttpRequest) -> JsonResponse:
    if request.method == "GET":
        items = Service.objects.all().order_by("-updated_at")
        return JsonResponse({"ok": True, "data": [_service_to_dict(s) for s in items]})

    body = _parse_json_body(request)
    title = str(body.get("title", "")).strip()
    if not title:
        return _json_error("title is required")

    service = Service.objects.create(
        title=title,
        description=str(body.get("description", "")).strip(),
        description_html=str(body.get("descriptionHtml", "")).strip(),
        price_cop=max(0, int(body.get("priceCOP", 0) or 0)),
        duration_minutes=max(0, int(body.get("durationMinutes", 0) or 0)),
        modality=str(body.get("modality", "")).strip(),
        audience=str(body.get("audience", "")).strip(),
        includes=str(body.get("includes", "")).strip(),
        benefits=str(body.get("benefits", "")).strip(),
        booking_url=str(body.get("bookingUrl", "")).strip(),
        is_active=_parse_bool(body.get("isActive", True), True),
    )
    return JsonResponse({"ok": True, "data": _service_to_dict(service)}, status=201)


@csrf_exempt
@require_http_methods(["GET", "PUT", "PATCH", "DELETE"])
def service_detail(request: HttpRequest, service_id: int) -> JsonResponse:
    try:
        service = Service.objects.get(id=service_id)
    except Service.DoesNotExist:
        return _json_error("not found", status=404)

    if request.method == "GET":
        return JsonResponse({"ok": True, "data": _service_to_dict(service)})

    if request.method == "DELETE":
        service.delete()
        return JsonResponse({"ok": True})

    body = _parse_json_body(request)
    if "title" in body:
        service.title = str(body.get("title", "")).strip()
    if "description" in body:
        service.description = str(body.get("description", "")).strip()
    if "descriptionHtml" in body:
        service.description_html = str(body.get("descriptionHtml", "")).strip()
    if "priceCOP" in body:
        service.price_cop = max(0, int(body.get("priceCOP", 0) or 0))
    if "durationMinutes" in body:
        service.duration_minutes = max(0, int(body.get("durationMinutes", 0) or 0))
    if "modality" in body:
        service.modality = str(body.get("modality", "")).strip()
    if "audience" in body:
        service.audience = str(body.get("audience", "")).strip()
    if "includes" in body:
        service.includes = str(body.get("includes", "")).strip()
    if "benefits" in body:
        service.benefits = str(body.get("benefits", "")).strip()
    if "bookingUrl" in body:
        service.booking_url = str(body.get("bookingUrl", "")).strip()
    if "isActive" in body:
        service.is_active = _parse_bool(body.get("isActive"), service.is_active)

    if not service.title:
        return _json_error("title is required")

    service.save()
    return JsonResponse({"ok": True, "data": _service_to_dict(service)})


@csrf_exempt
@require_http_methods(["GET", "POST"])
def appointments(request: HttpRequest) -> JsonResponse:
    if request.method == "GET":
        qs = Appointment.objects.all().order_by("start_at")
        start_raw = request.GET.get("start")
        end_raw = request.GET.get("end")
        if start_raw and end_raw:
            start_dt = parse_datetime(str(start_raw))
            end_dt = parse_datetime(str(end_raw))
            if start_dt and end_dt:
                if timezone.is_naive(start_dt):
                    start_dt = timezone.make_aware(start_dt, timezone.get_current_timezone())
                if timezone.is_naive(end_dt):
                    end_dt = timezone.make_aware(end_dt, timezone.get_current_timezone())
                qs = qs.filter(start_at__lt=end_dt, end_at__gt=start_dt)
        return JsonResponse({"ok": True, "data": [_appointment_to_dict(a) for a in qs]})

    body = _parse_json_body(request)
    title = str(body.get("title", "")).strip()
    start_dt = parse_datetime(str(body.get("startAt", "")).strip())
    end_dt = parse_datetime(str(body.get("endAt", "")).strip())

    if not title:
        return _json_error("title is required")
    if start_dt is None or end_dt is None:
        return _json_error("startAt and endAt are required (ISO datetime)")
    if timezone.is_naive(start_dt):
        start_dt = timezone.make_aware(start_dt, timezone.get_current_timezone())
    if timezone.is_naive(end_dt):
        end_dt = timezone.make_aware(end_dt, timezone.get_current_timezone())
    if timezone.localtime(start_dt, timezone.get_current_timezone()).weekday() == 6:
        return _json_error("closed on sunday")
    if end_dt <= start_dt:
        return _json_error("endAt must be after startAt")

    if Appointment.objects.filter(status=Appointment.Status.SCHEDULED, start_at__lt=end_dt, end_at__gt=start_dt).exists():
        return _json_error("slot occupied", status=409)

    patient_id = body.get("patientId")
    service_id = body.get("serviceId")
    patient = None
    service = None
    if patient_id is not None:
        try:
            patient = Patient.objects.get(id=int(patient_id))
        except Exception:
            return _json_error("invalid patientId")
    if patient is None:
        patient = _get_patient_from_token(request)
    if service_id is not None:
        try:
            service = Service.objects.get(id=int(service_id))
        except Exception:
            return _json_error("invalid serviceId")

    status = str(body.get("status", Appointment.Status.SCHEDULED)).strip()
    if status not in Appointment.Status.values:
        status = Appointment.Status.SCHEDULED

    client_name = str(body.get("clientName", "")).strip()
    client_email = str(body.get("clientEmail", "")).strip()
    client_phone = str(body.get("clientPhone", "")).strip()
    client_age = body.get("clientAge")
    emergency_contact_name = str(body.get("emergencyContactName", "")).strip()
    emergency_contact_phone = str(body.get("emergencyContactPhone", "")).strip()
    reason = str(body.get("reason", "")).strip()

    if patient is not None:
        if not client_name:
            client_name = f"{patient.first_name} {patient.last_name}".strip()
        if not client_email:
            client_email = patient.email
        if not client_phone:
            client_phone = patient.phone

    appt = Appointment.objects.create(
        title=title,
        start_at=start_dt,
        end_at=end_dt,
        patient=patient,
        service=service,
        client_name=client_name,
        client_email=client_email,
        client_phone=client_phone,
        client_age=int(client_age) if client_age not in (None, "") else None,
        emergency_contact_name=emergency_contact_name,
        emergency_contact_phone=emergency_contact_phone,
        reason=reason,
        notes=str(body.get("notes", "")).strip(),
        status=status,
    )
    return JsonResponse({"ok": True, "data": _appointment_to_dict(appt)}, status=201)


@csrf_exempt
@require_http_methods(["GET", "PUT", "PATCH", "DELETE"])
def appointment_detail(request: HttpRequest, appointment_id: int) -> JsonResponse:
    try:
        appt = Appointment.objects.get(id=appointment_id)
    except Appointment.DoesNotExist:
        return _json_error("not found", status=404)

    if request.method == "GET":
        return JsonResponse({"ok": True, "data": _appointment_to_dict(appt)})

    if request.method == "DELETE":
        appt.delete()
        return JsonResponse({"ok": True})

    body = _parse_json_body(request)
    if "title" in body:
        appt.title = str(body.get("title", "")).strip()
    if "startAt" in body:
        dt = parse_datetime(str(body.get("startAt", "")).strip())
        if dt is None:
            return _json_error("invalid startAt")
        if timezone.is_naive(dt):
            dt = timezone.make_aware(dt, timezone.get_current_timezone())
        appt.start_at = dt
    if "endAt" in body:
        dt = parse_datetime(str(body.get("endAt", "")).strip())
        if dt is None:
            return _json_error("invalid endAt")
        if timezone.is_naive(dt):
            dt = timezone.make_aware(dt, timezone.get_current_timezone())
        appt.end_at = dt
    if "status" in body:
        status = str(body.get("status", "")).strip()
        if status in Appointment.Status.values:
            appt.status = status
    if "notes" in body:
        appt.notes = str(body.get("notes", "")).strip()
    if "clientName" in body:
        appt.client_name = str(body.get("clientName", "")).strip()
    if "clientEmail" in body:
        appt.client_email = str(body.get("clientEmail", "")).strip()
    if "clientPhone" in body:
        appt.client_phone = str(body.get("clientPhone", "")).strip()
    if "clientAge" in body:
        value = body.get("clientAge")
        appt.client_age = int(value) if value not in (None, "") else None
    if "emergencyContactName" in body:
        appt.emergency_contact_name = str(body.get("emergencyContactName", "")).strip()
    if "emergencyContactPhone" in body:
        appt.emergency_contact_phone = str(body.get("emergencyContactPhone", "")).strip()
    if "reason" in body:
        appt.reason = str(body.get("reason", "")).strip()
    if "patientId" in body:
        pid = body.get("patientId")
        if pid in (None, ""):
            appt.patient = None
        else:
            try:
                appt.patient = Patient.objects.get(id=int(pid))
            except Exception:
                return _json_error("invalid patientId")
    if "serviceId" in body:
        sid = body.get("serviceId")
        if sid in (None, ""):
            appt.service = None
        else:
            try:
                appt.service = Service.objects.get(id=int(sid))
            except Exception:
                return _json_error("invalid serviceId")

    if not appt.title:
        return _json_error("title is required")
    if appt.end_at <= appt.start_at:
        return _json_error("endAt must be after startAt")

    if Appointment.objects.filter(status=Appointment.Status.SCHEDULED, start_at__lt=appt.end_at, end_at__gt=appt.start_at).exclude(id=appt.id).exists():
        return _json_error("slot occupied", status=409)

    appt.save()
    return JsonResponse({"ok": True, "data": _appointment_to_dict(appt)})


@csrf_exempt
@require_http_methods(["POST"])
def public_appointments(request: HttpRequest) -> JsonResponse:
    body = _parse_json_body(request)
    start_dt = parse_datetime(str(body.get("startAt", "")).strip())
    end_dt = parse_datetime(str(body.get("endAt", "")).strip())
    if start_dt is None:
        return _json_error("startAt is required (ISO datetime)")
    if timezone.is_naive(start_dt):
        start_dt = timezone.make_aware(start_dt, timezone.get_current_timezone())
    if timezone.localtime(start_dt, timezone.get_current_timezone()).weekday() == 6:
        return _json_error("closed on sunday")

    service = None
    service_id = body.get("serviceId")
    if service_id not in (None, ""):
        try:
            service = Service.objects.get(id=int(service_id))
        except Exception:
            return _json_error("invalid serviceId")

    if end_dt is None:
        minutes = service.duration_minutes if service and service.duration_minutes else 60
        end_dt = start_dt + timedelta(minutes=minutes)
    if timezone.is_naive(end_dt):
        end_dt = timezone.make_aware(end_dt, timezone.get_current_timezone())
    if end_dt <= start_dt:
        return _json_error("endAt must be after startAt")

    if Appointment.objects.filter(status=Appointment.Status.SCHEDULED, start_at__lt=end_dt, end_at__gt=start_dt).exists():
        return _json_error("slot occupied", status=409)

    patient = _get_patient_from_token(request)

    client_name = str(body.get("clientName", "")).strip()
    client_email = str(body.get("clientEmail", "")).strip()
    client_phone = str(body.get("clientPhone", "")).strip()
    client_age = body.get("clientAge")
    emergency_contact_name = str(body.get("emergencyContactName", "")).strip()
    emergency_contact_phone = str(body.get("emergencyContactPhone", "")).strip()
    reason = str(body.get("reason", "")).strip()
    notes = str(body.get("notes", "")).strip()

    if patient is not None:
        display_name = f"{patient.first_name} {patient.last_name}".strip() or patient.first_name
        if not client_name:
            client_name = display_name
        if not client_email:
            client_email = patient.email
        if not client_phone:
            client_phone = patient.phone
        title = display_name
    else:
        title = "Persona anónima"

    if service is not None:
        title = f"{title} · {service.title}"

    appt = Appointment.objects.create(
        title=title[:200],
        start_at=start_dt,
        end_at=end_dt,
        patient=patient,
        service=service,
        client_name=client_name,
        client_email=client_email,
        client_phone=client_phone,
        client_age=int(client_age) if client_age not in (None, "") else None,
        emergency_contact_name=emergency_contact_name,
        emergency_contact_phone=emergency_contact_phone,
        reason=reason,
        notes=notes,
        status=Appointment.Status.SCHEDULED,
    )
    return JsonResponse({"ok": True, "data": _appointment_to_dict(appt)}, status=201)


@csrf_exempt
@require_http_methods(["GET"])
def public_appointments_occupied(request: HttpRequest) -> JsonResponse:
    date_raw = str(request.GET.get("date", "")).strip()
    if not date_raw:
        return _json_error("date is required (YYYY-MM-DD)")
    d = parse_date(date_raw)
    if d is None:
        return _json_error("invalid date")
    if d.weekday() == 6:
        return JsonResponse({"ok": True, "data": {"times": [], "closed": True}})
    tz = timezone.get_current_timezone()
    start_dt = timezone.make_aware(datetime(d.year, d.month, d.day, 0, 0, 0), tz)
    end_dt = start_dt + timedelta(days=1)

    # Broaden search: include everything not cancelled to be safe, and add a small buffer
    qs = Appointment.objects.filter(
        start_at__lt=end_dt + timedelta(minutes=1), 
        end_at__gt=start_dt - timedelta(minutes=1)
    ).exclude(status=Appointment.Status.CANCELLED)
    
    print(f"DEBUG: Querying from {start_dt} to {end_dt}. Found {qs.count()} appointments.")

    times: list[str] = []
    for a in qs:
        start = timezone.localtime(a.start_at, tz)
        end = timezone.localtime(a.end_at, tz)
        
        # Mark all 30-minute slots that overlap with this appointment
        # We start at the beginning of the slot containing the start time
        curr = start.replace(minute=(start.minute // 30) * 30, second=0, microsecond=0)
        while curr < end:
            times.append(f"{curr.hour:02d}:{curr.minute:02d}")
            curr += timedelta(minutes=30)
    
    times = sorted(list(set(times)))
    print(f"DEBUG: Occupied times for {date_raw}: {times}")
    response = JsonResponse({"ok": True, "data": {"times": times}})
    response["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    return response


@csrf_exempt
@require_http_methods(["GET"])
def public_calendar(request: HttpRequest) -> JsonResponse:
    patient = _get_patient_from_token(request)
    if patient is None:
        return _json_error("unauthorized", status=401)

    start_raw = str(request.GET.get("start", "")).strip()
    end_raw = str(request.GET.get("end", "")).strip()
    if start_raw and end_raw:
        start_dt = parse_datetime(start_raw)
        end_dt = parse_datetime(end_raw)
    else:
        start_dt = timezone.now() - timedelta(days=30)
        end_dt = timezone.now() + timedelta(days=120)

    if start_dt is None or end_dt is None:
        return _json_error("invalid start/end")
    if timezone.is_naive(start_dt):
        start_dt = timezone.make_aware(start_dt, timezone.get_current_timezone())
    if timezone.is_naive(end_dt):
        end_dt = timezone.make_aware(end_dt, timezone.get_current_timezone())

    appts = (
        Appointment.objects.select_related("service")
        .filter(patient=patient, start_at__lt=end_dt, end_at__gt=start_dt)
        .order_by("start_at")
    )
    talks_qs = (
        TalkRegistration.objects.select_related("talk")
        .filter(patient=patient, talk__start_at__lt=end_dt, talk__end_at__gt=start_dt, talk__is_active=True)
        .order_by("talk__start_at")
    )

    events: list[dict[str, Any]] = []
    for a in appts:
        events.append(
            {
                "type": "appointment",
                "id": a.id,
                "title": a.title,
                "startAt": _dt_to_iso(a.start_at),
                "endAt": _dt_to_iso(a.end_at),
                "status": a.status,
                "serviceId": a.service_id,
                "serviceTitle": a.service.title if a.service_id else None,
            }
        )
    for r in talks_qs:
        t = r.talk
        events.append(
            {
                "type": "talk",
                "id": t.id,
                "title": t.title,
                "startAt": _dt_to_iso(t.start_at),
                "endAt": _dt_to_iso(t.end_at),
                "topic": t.topic,
                "speaker": t.speaker,
            }
        )

    events.sort(key=lambda x: x.get("startAt") or "")
    return JsonResponse({"ok": True, "data": {"events": events}})


@csrf_exempt
@require_http_methods(["GET", "POST"])
def talks(request: HttpRequest) -> JsonResponse:
    if request.method == "GET":
        qs = Talk.objects.all().annotate(reg_count=Count("registrations")).order_by("-updated_at")
        start_raw = request.GET.get("start")
        end_raw = request.GET.get("end")
        if start_raw and end_raw:
            start_dt = parse_datetime(str(start_raw))
            end_dt = parse_datetime(str(end_raw))
            if start_dt and end_dt:
                if timezone.is_naive(start_dt):
                    start_dt = timezone.make_aware(start_dt, timezone.get_current_timezone())
                if timezone.is_naive(end_dt):
                    end_dt = timezone.make_aware(end_dt, timezone.get_current_timezone())
                qs = qs.filter(start_at__lt=end_dt, end_at__gt=start_dt)
        return JsonResponse(
            {
                "ok": True,
                "data": [
                    _talk_to_dict(t)
                    | {
                        "videoUrl": _file_to_url(request, t.video_file),
                        "featuredVideoUrl": _file_to_url(request, t.featured_video_file),
                        "participants": int(getattr(t, "reg_count", 0) or 0),
                    }
                    for t in qs
                ],
            }
        )

    uploaded_video = None
    uploaded_featured_video = None
    if request.content_type and request.content_type.startswith("multipart/form-data"):
        body, files = _parse_multipart(request)
        if body is None or files is None:
            return _json_error("invalid multipart body")
        uploaded_video = files.get("videoFile")
        uploaded_featured_video = files.get("featuredVideoFile")
    else:
        body = _parse_json_body(request)

    title = str(body.get("title", "")).strip()
    if not title:
        return _json_error("title is required")

    description = str(body.get("description", "")).strip()
    topic = str(body.get("topic", "")).strip()
    speaker = str(body.get("speaker", "")).strip()
    organizer = str(body.get("organizer", "")).strip()
    modality = str(body.get("modality", "")).strip()
    agenda_value = body.get("agenda")
    agenda: list[str] = []
    if agenda_value not in (None, ""):
        if isinstance(agenda_value, list):
            agenda = [str(x).strip() for x in agenda_value if str(x).strip()]
        elif isinstance(agenda_value, str):
            try:
                parsed = json.loads(agenda_value)
            except Exception:
                parsed = None
            if isinstance(parsed, list):
                agenda = [str(x).strip() for x in parsed if str(x).strip()]
            else:
                agenda = [x.strip() for x in agenda_value.splitlines() if x.strip()]
        else:
            agenda = [str(agenda_value).strip()] if str(agenda_value).strip() else []

    start_at_raw = body.get("startAt")
    start_at = parse_datetime(start_at_raw) if isinstance(start_at_raw, str) else None
    end_at_raw = body.get("endAt")
    end_at = parse_datetime(end_at_raw) if isinstance(end_at_raw, str) else None
    if start_at and timezone.is_naive(start_at):
        start_at = timezone.make_aware(start_at, timezone.get_current_timezone())
    if end_at and timezone.is_naive(end_at):
        end_at = timezone.make_aware(end_at, timezone.get_current_timezone())
    if start_at and end_at is None:
        end_at = start_at + timedelta(minutes=60)
    if start_at and end_at and end_at <= start_at:
        return _json_error("endAt must be after startAt")

    fmt = str(body.get("format", Talk.Format.ONLINE))

    def _validate_video(file_obj, field_name: str):
        filename = str(getattr(file_obj, "name", "")).lower()
        if not filename.endswith((".mp4", ".avi", ".mov")):
            return _json_error(f"{field_name} must be a video (mp4, avi, mov)")
        size = int(getattr(file_obj, "size", 0) or 0)
        max_size = 1024 * 1024 * 500
        if size <= 0:
            return _json_error("invalid file size")
        if size > max_size:
            return _json_error("file too large (max 500MB)")
        return None

    video_file = None
    featured_video_file = None
    if uploaded_video is not None:
        err = _validate_video(uploaded_video, "videoFile")
        if err is not None:
            return err
        video_file = uploaded_video
    if uploaded_featured_video is not None:
        err = _validate_video(uploaded_featured_video, "featuredVideoFile")
        if err is not None:
            return err
        featured_video_file = uploaded_featured_video

    talk = Talk.objects.create(
        title=title,
        start_at=start_at,
        end_at=end_at,
        format=fmt if fmt in Talk.Format.values else Talk.Format.ONLINE,
        audience=str(body.get("audience", "")).strip(),
        description=description,
        topic=topic,
        speaker=speaker,
        organizer=organizer,
        modality=modality,
        agenda=agenda,
        video_file=video_file,
        featured_video_file=featured_video_file,
        is_active=_parse_bool(body.get("isActive", True), True),
    )
    return JsonResponse(
        {
            "ok": True,
            "data": _talk_to_dict(talk)
            | {
                "videoUrl": _file_to_url(request, talk.video_file),
                "featuredVideoUrl": _file_to_url(request, talk.featured_video_file),
                "participants": TalkRegistration.objects.filter(talk=talk).count(),
            },
        },
        status=201,
    )


@csrf_exempt
@require_http_methods(["GET", "PUT", "PATCH", "DELETE"])
def talk_detail(request: HttpRequest, talk_id: int) -> JsonResponse:
    try:
        talk = Talk.objects.get(id=talk_id)
    except Talk.DoesNotExist:
        return _json_error("not found", status=404)

    if request.method == "GET":
        return JsonResponse(
            {
                "ok": True,
                "data": _talk_to_dict(talk)
                | {
                    "videoUrl": _file_to_url(request, talk.video_file),
                    "featuredVideoUrl": _file_to_url(request, talk.featured_video_file),
                    "participants": TalkRegistration.objects.filter(talk=talk).count(),
                },
            }
        )

    if request.method == "DELETE":
        talk.delete()
        return JsonResponse({"ok": True})

    uploaded_video = None
    uploaded_featured_video = None
    if request.content_type and request.content_type.startswith("multipart/form-data"):
        body, files = _parse_multipart(request)
        if body is None or files is None:
            return _json_error("invalid multipart body")
        uploaded_video = files.get("videoFile")
        uploaded_featured_video = files.get("featuredVideoFile")
    else:
        body = _parse_json_body(request)

    if "title" in body:
        talk.title = str(body.get("title", "")).strip()
    if "description" in body:
        talk.description = str(body.get("description", "")).strip()
    if "topic" in body:
        talk.topic = str(body.get("topic", "")).strip()
    if "speaker" in body:
        talk.speaker = str(body.get("speaker", "")).strip()
    if "organizer" in body:
        talk.organizer = str(body.get("organizer", "")).strip()
    if "modality" in body:
        talk.modality = str(body.get("modality", "")).strip()
    if "startAt" in body:
        start_at_raw = body.get("startAt")
        dt = parse_datetime(start_at_raw) if isinstance(start_at_raw, str) else None
        if dt and timezone.is_naive(dt):
            dt = timezone.make_aware(dt, timezone.get_current_timezone())
        talk.start_at = dt
    if "endAt" in body:
        end_at_raw = body.get("endAt")
        dt = parse_datetime(end_at_raw) if isinstance(end_at_raw, str) else None
        if dt and timezone.is_naive(dt):
            dt = timezone.make_aware(dt, timezone.get_current_timezone())
        talk.end_at = dt
    if "format" in body:
        fmt = str(body.get("format", ""))
        if fmt in Talk.Format.values:
            talk.format = fmt
    if "audience" in body:
        talk.audience = str(body.get("audience", "")).strip()
    if "agenda" in body:
        value = body.get("agenda")
        agenda: list[str] = []
        if value not in (None, ""):
            if isinstance(value, list):
                agenda = [str(x).strip() for x in value if str(x).strip()]
            elif isinstance(value, str):
                try:
                    parsed = json.loads(value)
                except Exception:
                    parsed = None
                if isinstance(parsed, list):
                    agenda = [str(x).strip() for x in parsed if str(x).strip()]
                else:
                    agenda = [x.strip() for x in value.splitlines() if x.strip()]
            else:
                agenda = [str(value).strip()] if str(value).strip() else []
        talk.agenda = agenda
    if "isActive" in body:
        talk.is_active = _parse_bool(body.get("isActive"), talk.is_active)
    if _parse_bool(body.get("removeVideo"), False):
        talk.video_file = None
    if _parse_bool(body.get("removeFeaturedVideo"), False):
        talk.featured_video_file = None

    def _validate_video(file_obj, field_name: str):
        filename = str(getattr(file_obj, "name", "")).lower()
        if not filename.endswith((".mp4", ".avi", ".mov")):
            return _json_error(f"{field_name} must be a video (mp4, avi, mov)")
        size = int(getattr(file_obj, "size", 0) or 0)
        max_size = 1024 * 1024 * 500
        if size <= 0:
            return _json_error("invalid file size")
        if size > max_size:
            return _json_error("file too large (max 500MB)")
        return None

    if uploaded_video is not None:
        err = _validate_video(uploaded_video, "videoFile")
        if err is not None:
            return err
        talk.video_file = uploaded_video
    if uploaded_featured_video is not None:
        err = _validate_video(uploaded_featured_video, "featuredVideoFile")
        if err is not None:
            return err
        talk.featured_video_file = uploaded_featured_video

    if not talk.title:
        return _json_error("title is required")
    if talk.start_at and talk.end_at and talk.end_at <= talk.start_at:
        return _json_error("endAt must be after startAt")

    talk.save()
    return JsonResponse(
        {
            "ok": True,
            "data": _talk_to_dict(talk)
            | {
                "videoUrl": _file_to_url(request, talk.video_file),
                "featuredVideoUrl": _file_to_url(request, talk.featured_video_file),
                "participants": TalkRegistration.objects.filter(talk=talk).count(),
            },
        }
    )


@csrf_exempt
@require_http_methods(["GET"])
def public_talks(request: HttpRequest) -> JsonResponse:
    patient = _get_patient_from_token(request)
    qs = Talk.objects.filter(is_active=True).annotate(reg_count=Count("registrations")).order_by("start_at", "id")
    items: list[dict[str, Any]] = []
    for t in qs:
        base = _talk_to_dict(t) | {
            "videoUrl": _file_to_url(request, t.video_file),
            "featuredVideoUrl": _file_to_url(request, t.featured_video_file),
            "status": _talk_status(t),
            "participants": int(getattr(t, "reg_count", 0) or 0),
        }
        if patient is not None:
            base["isRegistered"] = TalkRegistration.objects.filter(talk=t, patient=patient).exists()
        else:
            base["isRegistered"] = False
        items.append(base)
    return JsonResponse({"ok": True, "data": items})


@csrf_exempt
@require_http_methods(["POST", "DELETE"])
def public_talk_register(request: HttpRequest, talk_id: int) -> JsonResponse:
    patient = _get_patient_from_token(request)
    if patient is None:
        return _json_error("unauthorized", status=401)

    try:
        talk = Talk.objects.get(id=talk_id, is_active=True)
    except Talk.DoesNotExist:
        return _json_error("not found", status=404)

    with transaction.atomic():
        if request.method == "POST":
            TalkRegistration.objects.get_or_create(talk=talk, patient=patient)
        else:
            TalkRegistration.objects.filter(talk=talk, patient=patient).delete()
        participants = _sync_talk_participants(talk.id)
        is_registered = TalkRegistration.objects.filter(talk=talk, patient=patient).exists()

    return JsonResponse({"ok": True, "data": {"talkId": talk.id, "participants": participants, "isRegistered": is_registered}})


@csrf_exempt
@require_http_methods(["GET"])
def talk_registrations(request: HttpRequest, talk_id: int) -> JsonResponse:
    try:
        Talk.objects.get(id=talk_id)
    except Talk.DoesNotExist:
        return _json_error("not found", status=404)

    qs = TalkRegistration.objects.select_related("patient").filter(talk_id=talk_id).order_by("-created_at")
    data = []
    for r in qs:
        data.append(
            {
                "id": r.id,
                "patientId": r.patient_id,
                "firstName": r.patient.first_name,
                "lastName": r.patient.last_name,
                "email": r.patient.email,
                "phone": r.patient.phone,
                "createdAt": _dt_to_iso(r.created_at),
            }
        )
    return JsonResponse({"ok": True, "data": data})


@csrf_exempt
@require_http_methods(["GET"])
def public_testimonials(request: HttpRequest) -> JsonResponse:
    items = Testimonial.objects.filter(is_active=True).annotate(likes_count=Count("likes")).order_by("-updated_at")
    return JsonResponse({"ok": True, "data": [_testimonial_to_dict(t) for t in items]})


@csrf_exempt
@require_http_methods(["GET", "POST"])
def public_testimonial_me(request: HttpRequest) -> JsonResponse:
    patient = _get_patient_from_token(request)
    if patient is None:
        return _json_error("unauthorized", status=401)

    existing = Testimonial.objects.filter(patient=patient).annotate(likes_count=Count("likes")).first()
    if request.method == "GET":
        return JsonResponse({"ok": True, "data": _testimonial_to_dict(existing) if existing else None})

    body = _parse_json_body(request)
    quote = str(body.get("quote", "")).strip()
    if not quote:
        return _json_error("quote is required")
    title = str(body.get("title", "")).strip()
    rating_raw = body.get("rating", 5)
    try:
        rating = int(rating_raw or 5)
    except Exception:
        return _json_error("invalid rating")
    rating = max(1, min(5, rating))

    name = f"{patient.first_name} {patient.last_name}".strip() or patient.username

    if existing:
        existing.name = name
        existing.title = title
        existing.quote = quote
        existing.rating = rating
        existing.is_active = True
        existing.save()
        return JsonResponse({"ok": True, "data": _testimonial_to_dict(existing)})

    created = Testimonial.objects.create(
        patient=patient,
        name=name,
        title=title,
        quote=quote,
        rating=rating,
        is_active=True,
    )
    return JsonResponse({"ok": True, "data": _testimonial_to_dict(created)}, status=201)


@csrf_exempt
@require_http_methods(["POST", "DELETE"])
def public_testimonial_like(request: HttpRequest, testimonial_id: int) -> JsonResponse:
    client_id = str(request.headers.get("X-Client-Id", "")).strip() or None
    patient = _get_patient_from_token(request)

    if patient is None and not client_id:
        return _json_error("client id required")

    try:
        testimonial = Testimonial.objects.get(id=testimonial_id, is_active=True)
    except Testimonial.DoesNotExist:
        return _json_error("not found", status=404)

    liked = False
    if request.method == "POST":
        if patient is not None:
            obj, _created = TestimonialLike.objects.get_or_create(
                testimonial=testimonial,
                patient=patient,
                defaults={"client_id": client_id},
            )
            if obj.client_id is None and client_id:
                obj.client_id = client_id
                obj.save(update_fields=["client_id"])
            liked = True
        else:
            TestimonialLike.objects.get_or_create(testimonial=testimonial, client_id=client_id)
            liked = True
    else:
        if patient is not None:
            TestimonialLike.objects.filter(testimonial=testimonial, patient=patient).delete()
            liked = False
        else:
            TestimonialLike.objects.filter(testimonial=testimonial, client_id=client_id).delete()
            liked = False

    likes_count = TestimonialLike.objects.filter(testimonial=testimonial).count()
    return JsonResponse({"ok": True, "data": {"testimonialId": testimonial.id, "likesCount": likes_count, "liked": liked}})


@csrf_exempt
@require_http_methods(["GET", "POST"])
def testimonials(request: HttpRequest) -> JsonResponse:
    if request.method == "GET":
        items = Testimonial.objects.all().annotate(likes_count=Count("likes")).order_by("-updated_at")
        return JsonResponse({"ok": True, "data": [_testimonial_to_dict(t) for t in items]})

    body = _parse_json_body(request)
    name = str(body.get("name", "")).strip()
    quote = str(body.get("quote", "")).strip()
    if not name or not quote:
        return _json_error("name and quote are required")

    rating = int(body.get("rating", 5) or 5)
    testimonial = Testimonial.objects.create(
        name=name,
        title=str(body.get("title", "")).strip(),
        quote=quote,
        rating=max(1, min(5, rating)),
        is_active=_parse_bool(body.get("isActive", True), True),
    )
    testimonial.likes_count = 0
    return JsonResponse({"ok": True, "data": _testimonial_to_dict(testimonial)}, status=201)


@csrf_exempt
@require_http_methods(["PUT", "PATCH", "DELETE"])
def testimonial_detail(request: HttpRequest, testimonial_id: int) -> JsonResponse:
    try:
        testimonial = Testimonial.objects.get(id=testimonial_id)
    except Testimonial.DoesNotExist:
        return _json_error("not found", status=404)

    if request.method == "DELETE":
        testimonial.delete()
        return JsonResponse({"ok": True})

    body = _parse_json_body(request)
    if "name" in body:
        testimonial.name = str(body.get("name", "")).strip()
    if "title" in body:
        testimonial.title = str(body.get("title", "")).strip()
    if "quote" in body:
        testimonial.quote = str(body.get("quote", "")).strip()
    if "rating" in body:
        rating = int(body.get("rating", 5) or 5)
        testimonial.rating = max(1, min(5, rating))
    if "isActive" in body:
        testimonial.is_active = _parse_bool(body.get("isActive"), testimonial.is_active)

    if not testimonial.name or not testimonial.quote:
        return _json_error("name and quote are required")

    testimonial.save()
    testimonial.likes_count = TestimonialLike.objects.filter(testimonial=testimonial).count()
    return JsonResponse({"ok": True, "data": _testimonial_to_dict(testimonial)})


@csrf_exempt
@require_http_methods(["GET", "POST"])
def patients(request: HttpRequest) -> JsonResponse:
    if request.method == "GET":
        items = Patient.objects.all().order_by("-updated_at")
        return JsonResponse({"ok": True, "data": [_patient_to_dict(p) for p in items]})

    body = _parse_json_body(request)
    first_name = str(body.get("firstName", "")).strip()
    if not first_name:
        return _json_error("firstName is required")

    birth_date_raw = body.get("birthDate")
    birth_date = parse_date(birth_date_raw) if isinstance(birth_date_raw, str) and birth_date_raw else None

    try:
        patient = Patient.objects.create(
            first_name=first_name,
            last_name=str(body.get("lastName", "")).strip(),
            document_number=str(body.get("documentNumber", "")).strip(),
            birth_date=birth_date,
            gender=str(body.get("gender", "")).strip(),
            occupation=str(body.get("occupation", "")).strip(),
            email=str(body.get("email", "")).strip(),
            phone=str(body.get("phone", "")).strip(),
            city=str(body.get("city", "")).strip(),
            address=str(body.get("address", "")).strip(),
            preferred_contact_method=str(body.get("preferredContactMethod", "")).strip(),
            referral_source=str(body.get("referralSource", "")).strip(),
            emergency_contact_name=str(body.get("emergencyContactName", "")).strip(),
            emergency_contact_phone=str(body.get("emergencyContactPhone", "")).strip(),
            reason_for_consultation=str(body.get("reasonForConsultation", "")).strip(),
            medical_history=str(body.get("medicalHistory", "")).strip(),
            medications=str(body.get("medications", "")).strip(),
            allergies=str(body.get("allergies", "")).strip(),
            notes=str(body.get("notes", "")).strip(),
            username=_normalize_username(body.get("username", "")) or None,
            password_hash=make_password(str(body.get("password", "")).strip()) if str(body.get("password", "")).strip() else "",
            portal_welcome_title=str(body.get("portalWelcomeTitle", "")).strip(),
            portal_welcome_message=str(body.get("portalWelcomeMessage", "")).strip(),
            portal_accent_color=str(body.get("portalAccentColor", "")).strip(),
            is_active=_parse_bool(body.get("isActive", True), True),
        )
    except IntegrityError:
        return _json_error("username already exists")
    return JsonResponse({"ok": True, "data": _patient_to_dict(patient)}, status=201)


@csrf_exempt
@require_http_methods(["GET", "PATCH", "PUT", "DELETE"])
def patient_detail(request: HttpRequest, patient_id: int) -> JsonResponse:
    try:
        patient = Patient.objects.get(id=patient_id)
    except Patient.DoesNotExist:
        return _json_error("not found", status=404)

    if request.method == "GET":
        return JsonResponse({"ok": True, "data": _patient_to_dict(patient)})

    if request.method == "DELETE":
        patient.delete()
        return JsonResponse({"ok": True})

    body = _parse_json_body(request)
    if "firstName" in body:
        patient.first_name = str(body.get("firstName", "")).strip()
    if "lastName" in body:
        patient.last_name = str(body.get("lastName", "")).strip()
    if "documentNumber" in body:
        patient.document_number = str(body.get("documentNumber", "")).strip()
    if "birthDate" in body:
        birth_date_raw = body.get("birthDate")
        patient.birth_date = parse_date(birth_date_raw) if isinstance(birth_date_raw, str) and birth_date_raw else None
    if "gender" in body:
        patient.gender = str(body.get("gender", "")).strip()
    if "occupation" in body:
        patient.occupation = str(body.get("occupation", "")).strip()
    if "email" in body:
        patient.email = str(body.get("email", "")).strip()
    if "phone" in body:
        patient.phone = str(body.get("phone", "")).strip()
    if "city" in body:
        patient.city = str(body.get("city", "")).strip()
    if "address" in body:
        patient.address = str(body.get("address", "")).strip()
    if "preferredContactMethod" in body:
        patient.preferred_contact_method = str(body.get("preferredContactMethod", "")).strip()
    if "referralSource" in body:
        patient.referral_source = str(body.get("referralSource", "")).strip()
    if "emergencyContactName" in body:
        patient.emergency_contact_name = str(body.get("emergencyContactName", "")).strip()
    if "emergencyContactPhone" in body:
        patient.emergency_contact_phone = str(body.get("emergencyContactPhone", "")).strip()
    if "reasonForConsultation" in body:
        patient.reason_for_consultation = str(body.get("reasonForConsultation", "")).strip()
    if "medicalHistory" in body:
        patient.medical_history = str(body.get("medicalHistory", "")).strip()
    if "medications" in body:
        patient.medications = str(body.get("medications", "")).strip()
    if "allergies" in body:
        patient.allergies = str(body.get("allergies", "")).strip()
    if "username" in body:
        patient.username = _normalize_username(body.get("username", "")) or None
    if "password" in body:
        pwd = str(body.get("password", "")).strip()
        if pwd:
            patient.password_hash = make_password(pwd)
    if "portalWelcomeTitle" in body:
        patient.portal_welcome_title = str(body.get("portalWelcomeTitle", "")).strip()
    if "portalWelcomeMessage" in body:
        patient.portal_welcome_message = str(body.get("portalWelcomeMessage", "")).strip()
    if "portalAccentColor" in body:
        patient.portal_accent_color = str(body.get("portalAccentColor", "")).strip()
    if "notes" in body:
        patient.notes = str(body.get("notes", "")).strip()
    if "isActive" in body:
        patient.is_active = _parse_bool(body.get("isActive"), patient.is_active)

    if not patient.first_name:
        return _json_error("firstName is required")

    try:
        patient.save()
    except IntegrityError:
        return _json_error("username already exists")
    return JsonResponse({"ok": True, "data": _patient_to_dict(patient)})


@csrf_exempt
@require_http_methods(["POST"])
def patient_login(request: HttpRequest) -> JsonResponse:
    body = _parse_json_body(request)
    username = _normalize_username(body.get("username", ""))
    password = str(body.get("password", "")).strip()
    if not username or not password:
        return _json_error("username and password are required")

    try:
        patient = Patient.objects.get(username__iexact=username)
    except Patient.DoesNotExist:
        return _json_error("invalid credentials", status=401)

    if not patient.is_active:
        return _json_error("inactive account", status=403)

    if not patient.password_hash or not check_password(password, patient.password_hash):
        return _json_error("invalid credentials", status=401)

    token = _issue_patient_token(patient.id)
    return JsonResponse({"ok": True, "data": {"token": token, "patient": _patient_portal_to_dict(patient)}})


@csrf_exempt
@require_http_methods(["GET", "PATCH"])
def portal_me(request: HttpRequest) -> JsonResponse:
    patient = _get_patient_from_token(request)
    if patient is None:
        return _json_error("unauthorized", status=401)

    if request.method == "GET":
        return JsonResponse({"ok": True, "data": _patient_portal_to_dict(patient)})

    body = _parse_json_body(request)
    if "portalWelcomeTitle" in body:
        patient.portal_welcome_title = str(body.get("portalWelcomeTitle", "")).strip()
    if "portalWelcomeMessage" in body:
        patient.portal_welcome_message = str(body.get("portalWelcomeMessage", "")).strip()
    if "portalAccentColor" in body:
        patient.portal_accent_color = str(body.get("portalAccentColor", "")).strip()
    if "password" in body:
        pwd = str(body.get("password", "")).strip()
        if pwd:
            patient.password_hash = make_password(pwd)

    patient.save()
    return JsonResponse({"ok": True, "data": _patient_portal_to_dict(patient)})


@csrf_exempt
@require_http_methods(["GET", "POST"])
def portal_intake(request: HttpRequest) -> JsonResponse:
    patient = _get_patient_from_token(request)
    if patient is None:
        return _json_error("unauthorized", status=401)

    if request.method == "GET":
        return JsonResponse(
            {
                "ok": True,
                "data": {
                    "completed": patient.intake_completed,
                    "answers": patient.intake_answers,
                    "summary": patient.intake_summary,
                    "submittedAt": _dt_to_iso(patient.intake_submitted_at),
                },
            }
        )

    body = _parse_json_body(request)
    answers_raw = body.get("answers")
    if not isinstance(answers_raw, dict):
        return _json_error("answers is required")

    insights, summary = _compute_intake_summary(answers_raw)
    patient.intake_answers = insights
    patient.intake_summary = summary
    patient.intake_completed = True
    patient.intake_submitted_at = timezone.now()
    patient.save()

    return JsonResponse({"ok": True, "data": {"completed": True, "summary": summary}})



@csrf_exempt
@require_http_methods(["POST"])
def patient_register(request: HttpRequest) -> JsonResponse:
    body = _parse_json_body(request)
    username = _normalize_username(body.get("username", ""))
    password = str(body.get("password", "")).strip()
    first_name = str(body.get("firstName", "")).strip()

    if not first_name:
        return _json_error("firstName is required")
    if not _is_valid_username(username):
        return _json_error("invalid username")
    if len(password) < 8:
        return _json_error("password must be at least 8 characters")

    last_name = str(body.get("lastName", "")).strip()
    email = str(body.get("email", "")).strip()
    phone = str(body.get("phone", "")).strip()
    city = str(body.get("city", "")).strip()

    try:
        patient = Patient.objects.create(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            city=city,
            username=username,
            password_hash=make_password(password),
            portal_welcome_title=f"Hola, {first_name}",
            portal_welcome_message="Bienvenido(a) a tu espacio personal.",
            portal_accent_color="#22c55e",
            is_active=True,
        )
    except IntegrityError:
        return _json_error("username already exists")

    token = _issue_patient_token(patient.id)
    return JsonResponse({"ok": True, "data": {"token": token, "patient": _patient_portal_to_dict(patient)}}, status=201)


@csrf_exempt
@require_http_methods(["GET", "POST"])
def stories(request: HttpRequest) -> JsonResponse:
    if request.method == "GET":
        items = Story.objects.all().order_by("-updated_at")
        return JsonResponse({"ok": True, "data": [_story_to_dict(request, s) for s in items]})

    if not (request.content_type and request.content_type.startswith("multipart/form-data")):
        return _json_error("multipart/form-data required")

    body, files = _parse_multipart(request)
    if body is None or files is None:
        return _json_error("invalid multipart body")

    title = str(body.get("title", b"")).strip()
    content = str(body.get("content", b"")).strip()
    author = str(body.get("author", b"")).strip()
    category = str(body.get("category", b"")).strip()
    tags_raw = body.get("tags")
    tags: list[str] = []
    if tags_raw:
        if isinstance(tags_raw, list):
            tags = [str(x).strip() for x in tags_raw if str(x).strip()]
        elif isinstance(tags_raw, (bytes, str)):
            tags_str = str(tags_raw).strip()
            if tags_str:
                tags = [x.strip() for x in tags_str.split(",") if x.strip()]
    if not title or not content:
        return _json_error("title and content are required")

    patient_id = body.get("patientId")
    patient = None
    if patient_id:
        try:
            patient = Patient.objects.get(id=int(patient_id))
        except (ValueError, Patient.DoesNotExist):
            return _json_error("invalid patientId")

    image_file = files.get("imageFile")

    story = Story.objects.create(
        title=title,
        content=content,
        image_file=image_file,
        author=author,
        category=category,
        tags=tags,
        patient=patient,
        is_active=_parse_bool(body.get("isActive", True), True),
    )
    return JsonResponse({"ok": True, "data": _story_to_dict(request, story)}, status=201)


@csrf_exempt
@require_http_methods(["GET", "PUT", "PATCH", "DELETE"])
def story_detail(request: HttpRequest, story_id: int) -> JsonResponse:
    try:
        story = Story.objects.get(id=story_id)
    except Story.DoesNotExist:
        return _json_error("not found", status=404)

    if request.method == "GET":
        return JsonResponse({"ok": True, "data": _story_to_dict(request, story)})

    if request.method == "DELETE":
        story.delete()
        return JsonResponse({"ok": True})

    image_file = None
    if request.content_type and request.content_type.startswith("multipart/form-data"):
        data, files = _parse_multipart(request)
        if data is None:
            return _json_error("invalid multipart data")
        body = {k: data[k] for k in data}
        image_file = files.get("imageFile")
    else:
        body = _parse_json_body(request)

    if "title" in body:
        story.title = str(body.get("title", "")).strip()
    if "content" in body:
        story.content = str(body.get("content", "")).strip()
    if "author" in body:
        story.author = str(body.get("author", "")).strip()
    if "category" in body:
        story.category = str(body.get("category", "")).strip()
    if "tags" in body:
        raw_tags = str(body.get("tags", ""))
        story.tags = [t.strip() for t in raw_tags.split(",") if t.strip()] if raw_tags.strip() else []
    if "patientId" in body:
        patient_id = body.get("patientId")
        if patient_id:
            try:
                story.patient = Patient.objects.get(id=int(patient_id))
            except (ValueError, Patient.DoesNotExist):
                return _json_error("invalid patientId")
        else:
            story.patient = None
    if "isActive" in body:
        story.is_active = _parse_bool(body.get("isActive"), story.is_active)

    if image_file:
        story.image_file = image_file
    elif _parse_bool(body.get("removeImage"), False):
        story.image_file = None

    if not story.title or not story.content:
        return _json_error("title and content are required")

    story.save()
    return JsonResponse({"ok": True, "data": _story_to_dict(request, story)})


@csrf_exempt
@require_http_methods(["GET"])
def public_stories(request: HttpRequest) -> JsonResponse:
    items = Story.objects.filter(is_active=True).order_by("-updated_at")
    return JsonResponse({"ok": True, "data": [_story_to_dict(request, s) for s in items]})


@csrf_exempt
@require_http_methods(["GET"])
def public_story_detail(request: HttpRequest, story_id: int) -> JsonResponse:
    try:
        story = Story.objects.get(id=story_id, is_active=True)
    except Story.DoesNotExist:
        return _json_error("not found", status=404)
    return JsonResponse({"ok": True, "data": _story_to_dict(request, story)})


def _forum_topic_to_dict(request: HttpRequest, topic: ForumTopic) -> dict[str, Any]:
    return {
        "id": topic.id,
        "title": topic.title,
        "description": topic.description,
        "descriptionHtml": topic.description_html,
        "category": topic.category,
        "imageUrl": _file_to_url(request, topic.image_file),
        "isPinned": topic.is_pinned,
        "isLocked": topic.is_locked,
        "isActive": topic.is_active,
        "createdById": topic.created_by_id,
        "repliesCount": getattr(topic, "replies_count", 0) or 0,
        "createdAt": _dt_to_iso(topic.created_at),
        "updatedAt": _dt_to_iso(topic.updated_at),
    }


def _forum_reply_to_dict(reply: ForumReply) -> dict[str, Any]:
    return {
        "id": reply.id,
        "topicId": reply.topic_id,
        "content": reply.content,
        "contentHtml": reply.content_html,
        "authorName": reply.author_name,
        "patientId": reply.patient_id,
        "isActive": reply.is_active,
        "createdAt": _dt_to_iso(reply.created_at),
        "updatedAt": _dt_to_iso(reply.updated_at),
    }


@csrf_exempt
@require_http_methods(["GET", "POST"])
def forum_topics(request: HttpRequest) -> JsonResponse:
    if request.method == "GET":
        items = ForumTopic.objects.all().annotate(replies_count=Count("replies")).order_by("-is_pinned", "-updated_at")
        return JsonResponse({"ok": True, "data": [_forum_topic_to_dict(request, t) for t in items]})

    if request.content_type and request.content_type.startswith("multipart/form-data"):
        body, files = _parse_multipart(request)
        if body is None or files is None:
            return _json_error("invalid multipart body")
        image_file = files.get("imageFile")
    else:
        body = _parse_json_body(request)
        image_file = None

    title = str(body.get("title", "")).strip()
    if not title:
        return _json_error("title is required")
    description = str(body.get("description", "")).strip()
    description_html = str(body.get("descriptionHtml", "")).strip()
    category = str(body.get("category", "")).strip()
    is_pinned = _parse_bool(body.get("isPinned"), False)
    is_locked = _parse_bool(body.get("isLocked"), False)
    is_active = _parse_bool(body.get("isActive", True), True)

    topic = ForumTopic.objects.create(
        title=title,
        description=description,
        description_html=description_html,
        category=category,
        image_file=image_file,
        is_pinned=is_pinned,
        is_locked=is_locked,
        is_active=is_active,
    )
    return JsonResponse({"ok": True, "data": _forum_topic_to_dict(request, topic)}, status=201)


@csrf_exempt
@require_http_methods(["GET", "PUT", "PATCH", "DELETE"])
def forum_topic_detail(request: HttpRequest, topic_id: int) -> JsonResponse:
    try:
        topic = ForumTopic.objects.annotate(replies_count=Count("replies")).get(id=topic_id)
    except ForumTopic.DoesNotExist:
        return _json_error("not found", status=404)

    if request.method == "GET":
        replies = ForumReply.objects.filter(topic=topic).order_by("created_at")
        return JsonResponse({
            "ok": True,
            "data": _forum_topic_to_dict(request, topic) | {
                "replies": [_forum_reply_to_dict(r) for r in replies],
            },
        })

    if request.method == "DELETE":
        topic.delete()
        return JsonResponse({"ok": True})

    if request.content_type and request.content_type.startswith("multipart/form-data"):
        body, files = _parse_multipart(request)
        if body is None or files is None:
            return _json_error("invalid multipart body")
        image_file = files.get("imageFile")
    else:
        body = _parse_json_body(request)
        image_file = None

    if "title" in body:
        topic.title = str(body["title"]).strip()
    if "description" in body:
        topic.description = str(body["description"]).strip()
    if "descriptionHtml" in body:
        topic.description_html = str(body["descriptionHtml"]).strip()
    if "category" in body:
        topic.category = str(body["category"]).strip()
    if "isPinned" in body:
        topic.is_pinned = _parse_bool(body["isPinned"], topic.is_pinned)
    if "isLocked" in body:
        topic.is_locked = _parse_bool(body["isLocked"], topic.is_locked)
    if "isActive" in body:
        topic.is_active = _parse_bool(body["isActive"], topic.is_active)
    if image_file:
        topic.image_file = image_file
    if str(body.get("removeImage", "")).strip().lower() in ("true", "1"):
        topic.image_file = None

    if not topic.title:
        return _json_error("title is required")
    topic.save()
    return JsonResponse({"ok": True, "data": _forum_topic_to_dict(request, topic)})


@csrf_exempt
@require_http_methods(["POST"])
def forum_topic_replies(request: HttpRequest, topic_id: int) -> JsonResponse:
    try:
        topic = ForumTopic.objects.get(id=topic_id)
    except ForumTopic.DoesNotExist:
        return _json_error("not found", status=404)
    if topic.is_locked:
        return _json_error("this topic is locked")

    body = _parse_json_body(request)
    content = str(body.get("content", "")).strip()
    content_html = str(body.get("contentHtml", "")).strip()
    author_name = str(body.get("authorName", "")).strip()
    if not content:
        return _json_error("content is required")
    if not author_name:
        return _json_error("authorName is required")

    reply = ForumReply.objects.create(
        topic=topic,
        content=content,
        content_html=content_html,
        author_name=author_name,
    )
    topic.save()  # update updated_at
    return JsonResponse({"ok": True, "data": _forum_reply_to_dict(reply)}, status=201)


@csrf_exempt
@require_http_methods(["DELETE"])
def forum_reply_detail(request: HttpRequest, reply_id: int) -> JsonResponse:
    try:
        reply = ForumReply.objects.get(id=reply_id)
    except ForumReply.DoesNotExist:
        return _json_error("not found", status=404)
    reply.delete()
    return JsonResponse({"ok": True})


@csrf_exempt
@require_http_methods(["GET"])
def public_forum_topics(request: HttpRequest) -> JsonResponse:
    items = ForumTopic.objects.filter(is_active=True).annotate(replies_count=Count("replies")).order_by("-is_pinned", "-updated_at")
    return JsonResponse({"ok": True, "data": [_forum_topic_to_dict(request, t) for t in items]})


@csrf_exempt
@require_http_methods(["GET"])
def public_forum_topic_detail(request: HttpRequest, topic_id: int) -> JsonResponse:
    try:
        topic = ForumTopic.objects.filter(is_active=True).annotate(replies_count=Count("replies")).get(id=topic_id)
    except ForumTopic.DoesNotExist:
        return _json_error("not found", status=404)
    replies = ForumReply.objects.filter(topic=topic, is_active=True).order_by("created_at")
    return JsonResponse({
        "ok": True,
        "data": _forum_topic_to_dict(request, topic) | {
            "replies": [_forum_reply_to_dict(r) for r in replies],
        },
    })


@csrf_exempt
@require_http_methods(["POST"])
def public_forum_topic_reply(request: HttpRequest, topic_id: int) -> JsonResponse:
    try:
        topic = ForumTopic.objects.get(id=topic_id, is_active=True)
    except ForumTopic.DoesNotExist:
        return _json_error("not found", status=404)
    if topic.is_locked:
        return _json_error("this topic is locked")

    patient = _get_patient_from_token(request)
    if not patient:
        return _json_error("authentication required", status=401)

    body = _parse_json_body(request)
    content = str(body.get("content", "")).strip()
    content_html = str(body.get("contentHtml", "")).strip()
    if not content:
        return _json_error("content is required")

    author_name = f"{patient.first_name} {patient.last_name}".strip() or patient.username

    reply = ForumReply.objects.create(
        topic=topic,
        content=content,
        content_html=content_html,
        author_name=author_name,
        patient=patient,
    )
    topic.save()
    return JsonResponse({"ok": True, "data": _forum_reply_to_dict(reply)}, status=201)


class DevCorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        if request.method == "OPTIONS" and request.path.startswith("/api/"):
            response = HttpResponse()
        else:
            response = self.get_response(request)

        if request.path.startswith("/api/"):
            response["Access-Control-Allow-Origin"] = "*"
            response["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
            response["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Client-Id"

        return response


# ─── Membership Plans ─────────────────────────────────────────────────────────

def _plan_to_dict(plan: MembershipPlan) -> dict[str, Any]:
    return {
        "id": plan.id,
        "name": plan.name,
        "slug": plan.slug,
        "description": plan.description,
        "priceCOP": plan.price_cop,
        "priceUSD": plan.price_usd,
        "priceEUR": plan.price_eur,
        "annualPriceCOP": plan.annual_price_cop,
        "annualPriceUSD": plan.annual_price_usd,
        "annualPriceEUR": plan.annual_price_eur,
        "monthlyDiscountPercent": plan.monthly_discount_percent,
        "annualDiscountPercent": plan.annual_discount_percent,
        "sessionsPerMonth": plan.sessions_per_month,
        "sessionsBreakdown": plan.sessions_breakdown or [],
        "benefits": plan.benefits or [],
        "isActive": plan.is_active,
        "isFeatured": plan.is_featured,
        "createdAt": _dt_to_iso(plan.created_at),
        "updatedAt": _dt_to_iso(plan.updated_at),
    }


def _subscription_to_dict(sub: MembershipSubscription) -> dict[str, Any]:
    return {
        "id": sub.id,
        "patientId": sub.patient_id,
        "patientName": f"{sub.patient.first_name} {sub.patient.last_name}".strip() if sub.patient_id else None,
        "planId": sub.plan_id,
        "planName": sub.plan.name if sub.plan_id else None,
        "status": sub.status,
        "paymentMethod": sub.payment_method,
        "startsAt": sub.starts_at.isoformat() if sub.starts_at else None,
        "endsAt": sub.ends_at.isoformat() if sub.ends_at else None,
        "sessionsUsed": sub.sessions_used,
        "notes": sub.notes,
        "createdAt": _dt_to_iso(sub.created_at),
        "updatedAt": _dt_to_iso(sub.updated_at),
    }


@csrf_exempt
@require_http_methods(["GET", "POST"])
def membership_plans(request: HttpRequest) -> JsonResponse:
    if request.method == "GET":
        items = MembershipPlan.objects.all().order_by("-is_featured", "-updated_at")
        return JsonResponse({"ok": True, "data": [_plan_to_dict(p) for p in items]})

    body = _parse_json_body(request)
    name = str(body.get("name", "")).strip()
    slug = str(body.get("slug", "")).strip()
    if not name or not slug:
        return _json_error("name and slug are required")

    sessions_breakdown = body.get("sessionsBreakdown")
    if not isinstance(sessions_breakdown, list):
        sessions_breakdown = []
    benefits = body.get("benefits")
    if not isinstance(benefits, list):
        benefits = []

    plan = MembershipPlan.objects.create(
        name=name,
        slug=slug,
        description=str(body.get("description", "")).strip(),
        price_cop=int(body.get("priceCOP", 280000) or 280000),
        price_usd=int(body.get("priceUSD", 70) or 70),
        price_eur=int(body.get("priceEUR", 70) or 70),
        annual_price_cop=int(body.get("annualPriceCOP", 2800000) or 2800000),
        annual_price_usd=int(body.get("annualPriceUSD", 700) or 700),
        annual_price_eur=int(body.get("annualPriceEUR", 700) or 700),
        monthly_discount_percent=int(body.get("monthlyDiscountPercent", 0) or 0),
        annual_discount_percent=int(body.get("annualDiscountPercent", 0) or 0),
        sessions_per_month=int(body.get("sessionsPerMonth", 3) or 3),
        sessions_breakdown=sessions_breakdown,
        benefits=benefits,
        is_active=_parse_bool(body.get("isActive", True), True),
        is_featured=_parse_bool(body.get("isFeatured", False), False),
    )
    return JsonResponse({"ok": True, "data": _plan_to_dict(plan)}, status=201)


@csrf_exempt
@require_http_methods(["GET", "PUT", "PATCH", "DELETE"])
def membership_plan_detail(request: HttpRequest, plan_id: int) -> JsonResponse:
    try:
        plan = MembershipPlan.objects.get(id=plan_id)
    except MembershipPlan.DoesNotExist:
        return _json_error("not found", status=404)

    if request.method == "GET":
        return JsonResponse({"ok": True, "data": _plan_to_dict(plan)})

    if request.method == "DELETE":
        try:
            plan.delete()
            return JsonResponse({"ok": True})
        except ProtectedError:
            return _json_error("No se puede eliminar el plan porque tiene suscripciones activas vinculadas.", status=400)

    body = _parse_json_body(request)
    if "name" in body:
        plan.name = str(body["name"]).strip()
    if "slug" in body:
        plan.slug = str(body["slug"]).strip()
    if "description" in body:
        plan.description = str(body["description"]).strip()
    if "priceCOP" in body:
        plan.price_cop = int(body["priceCOP"] or 0)
    if "priceUSD" in body:
        plan.price_usd = int(body["priceUSD"] or 0)
    if "priceEUR" in body:
        plan.price_eur = int(body["priceEUR"] or 0)
    if "annualPriceCOP" in body:
        plan.annual_price_cop = int(body["annualPriceCOP"] or 0)
    if "annualPriceUSD" in body:
        plan.annual_price_usd = int(body["annualPriceUSD"] or 0)
    if "annualPriceEUR" in body:
        plan.annual_price_eur = int(body["annualPriceEUR"] or 0)
    if "monthlyDiscountPercent" in body:
        plan.monthly_discount_percent = int(body["monthlyDiscountPercent"] or 0)
    if "annualDiscountPercent" in body:
        plan.annual_discount_percent = int(body["annualDiscountPercent"] or 0)
    if "sessionsPerMonth" in body:
        plan.sessions_per_month = int(body["sessionsPerMonth"] or 3)
    if "sessionsBreakdown" in body and isinstance(body["sessionsBreakdown"], list):
        plan.sessions_breakdown = body["sessionsBreakdown"]
    if "benefits" in body and isinstance(body["benefits"], list):
        plan.benefits = body["benefits"]
    if "isActive" in body:
        plan.is_active = _parse_bool(body["isActive"], plan.is_active)
    if "isFeatured" in body:
        plan.is_featured = _parse_bool(body["isFeatured"], plan.is_featured)

    if not plan.name or not plan.slug:
        return _json_error("name and slug are required")
    plan.save()
    return JsonResponse({"ok": True, "data": _plan_to_dict(plan)})


@csrf_exempt
@require_http_methods(["GET", "POST"])
def membership_subscriptions(request: HttpRequest) -> JsonResponse:
    if request.method == "GET":
        qs = MembershipSubscription.objects.select_related("patient", "plan").all().order_by("-updated_at")
        status_filter = request.GET.get("status")
        if status_filter:
            qs = qs.filter(status=status_filter)
        patient_filter = request.GET.get("patientId")
        if patient_filter:
            try:
                qs = qs.filter(patient_id=int(patient_filter))
            except ValueError:
                pass
        return JsonResponse({"ok": True, "data": [_subscription_to_dict(s) for s in qs]})

    body = _parse_json_body(request)
    patient_id = body.get("patientId")
    plan_id = body.get("planId")
    starts_at_raw = str(body.get("startsAt", "")).strip()

    if not patient_id:
        return _json_error("patientId is required")
    if not plan_id:
        return _json_error("planId is required")
    if not starts_at_raw:
        return _json_error("startsAt is required (YYYY-MM-DD)")

    try:
        patient = Patient.objects.get(id=int(patient_id))
    except (ValueError, Patient.DoesNotExist):
        return _json_error("invalid patientId")
    try:
        plan = MembershipPlan.objects.get(id=int(plan_id))
    except (ValueError, MembershipPlan.DoesNotExist):
        return _json_error("invalid planId")

    starts_at = parse_date(starts_at_raw)
    if not starts_at:
        return _json_error("invalid startsAt date")

    ends_at_raw = str(body.get("endsAt", "")).strip()
    ends_at = parse_date(ends_at_raw) if ends_at_raw else None

    sub = MembershipSubscription.objects.create(
        patient=patient,
        plan=plan,
        status=str(body.get("status", MembershipSubscription.Status.ACTIVE)),
        payment_method=str(body.get("paymentMethod", MembershipSubscription.PaymentMethod.TRANSFER)),
        starts_at=starts_at,
        ends_at=ends_at,
        sessions_used=int(body.get("sessionsUsed", 0) or 0),
        notes=str(body.get("notes", "")).strip(),
    )
    return JsonResponse({"ok": True, "data": _subscription_to_dict(sub)}, status=201)


@csrf_exempt
@require_http_methods(["GET", "PUT", "PATCH", "DELETE"])
def membership_subscription_detail(request: HttpRequest, sub_id: int) -> JsonResponse:
    try:
        sub = MembershipSubscription.objects.select_related("patient", "plan").get(id=sub_id)
    except MembershipSubscription.DoesNotExist:
        return _json_error("not found", status=404)

    if request.method == "GET":
        return JsonResponse({"ok": True, "data": _subscription_to_dict(sub)})

    if request.method == "DELETE":
        sub.delete()
        return JsonResponse({"ok": True})

    body = _parse_json_body(request)
    if "status" in body:
        sub.status = str(body["status"])
    if "paymentMethod" in body:
        sub.payment_method = str(body["paymentMethod"])
    if "startsAt" in body:
        d = parse_date(str(body["startsAt"]))
        if d:
            sub.starts_at = d
    if "endsAt" in body:
        raw = str(body["endsAt"]).strip() if body["endsAt"] else ""
        sub.ends_at = parse_date(raw) if raw else None
    if "sessionsUsed" in body:
        sub.sessions_used = int(body["sessionsUsed"] or 0)
    if "notes" in body:
        sub.notes = str(body["notes"]).strip()
    if "planId" in body:
        try:
            sub.plan = MembershipPlan.objects.get(id=int(body["planId"]))
        except (ValueError, MembershipPlan.DoesNotExist):
            return _json_error("invalid planId")

    sub.save()
    return JsonResponse({"ok": True, "data": _subscription_to_dict(sub)})


@csrf_exempt
@require_http_methods(["GET"])
def public_membership_plans(request: HttpRequest) -> JsonResponse:
    """Public endpoint - returns active plans for the website."""
    items = MembershipPlan.objects.filter(is_active=True).order_by("-is_featured", "price_cop")
    return JsonResponse({"ok": True, "data": [_plan_to_dict(p) for p in items]})


def _settings_to_dict(s: SiteSettings) -> dict[str, Any]:
    return {
        "mercadopagoPublicKey": s.mercadopago_public_key,
        "mercadopagoAccessToken": s.mercadopago_access_token,
        "mercadopagoEnabled": s.mercadopago_enabled,
        "siteName": s.site_name,
        "supportEmail": s.support_email,
        "supportWhatsapp": s.support_whatsapp,
        "updatedAt": _dt_to_iso(s.updated_at),
    }


@csrf_exempt
@require_http_methods(["GET"])
def mercadopago_test_connection(request: HttpRequest) -> JsonResponse:
    """Test MercadoPago credentials by calling their users/me endpoint."""
    settings_obj = SiteSettings.get()
    if not settings_obj.mercadopago_access_token:
        return JsonResponse({
            "ok": False,
            "connected": False,
            "error": "No hay Access Token configurado. Ingresa tus credenciales primero.",
        })
    try:
        import urllib.request as ureq
        req = ureq.Request(
            "https://api.mercadopago.com/users/me",
            headers={"Authorization": f"Bearer {settings_obj.mercadopago_access_token}"},
            method="GET",
        )
        with ureq.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        return JsonResponse({
            "ok": True,
            "connected": True,
            "account": {
                "id": data.get("id"),
                "email": data.get("email"),
                "nickname": data.get("nickname"),
                "countryId": data.get("country_id"),
                "siteId": data.get("site_id"),
                "isSandbox": "TEST" in str(settings_obj.mercadopago_access_token).upper(),
            },
        })
    except Exception as e:
        msg = str(e)
        if "401" in msg or "403" in msg:
            friendly = "Credenciales inválidas. Verifica tu Access Token en el panel de MercadoPago."
        elif "timeout" in msg.lower():
            friendly = "Tiempo de espera agotado. Verifica tu conexión a internet."
        else:
            friendly = f"Error de conexión: {msg}"
        return JsonResponse({"ok": False, "connected": False, "error": friendly})


@csrf_exempt
@require_http_methods(["GET", "PUT", "PATCH"])
def site_settings(request: HttpRequest) -> JsonResponse:
    settings = SiteSettings.get()

    if request.method == "GET":
        return JsonResponse({"ok": True, "data": _settings_to_dict(settings)})

    body = _parse_json_body(request)
    if "mercadopagoPublicKey" in body:
        settings.mercadopago_public_key = str(body["mercadopagoPublicKey"]).strip()
    if "mercadopagoAccessToken" in body:
        settings.mercadopago_access_token = str(body["mercadopagoAccessToken"]).strip()
    if "mercadopagoEnabled" in body:
        settings.mercadopago_enabled = _parse_bool(body["mercadopagoEnabled"], settings.mercadopago_enabled)
    if "siteName" in body:
        settings.site_name = str(body["siteName"]).strip()
    if "supportEmail" in body:
        settings.support_email = str(body["supportEmail"]).strip()
    if "supportWhatsapp" in body:
        settings.support_whatsapp = str(body["supportWhatsapp"]).strip()
    settings.save()
    return JsonResponse({"ok": True, "data": _settings_to_dict(settings)})


@csrf_exempt
@require_http_methods(["POST"])
def mercadopago_create_preference(request: HttpRequest) -> JsonResponse:
    """Create a MercadoPago payment preference and return init_point URL."""
    settings = SiteSettings.get()
    if not settings.mercadopago_enabled or not settings.mercadopago_access_token:
        return _json_error("MercadoPago no está configurado en este momento.", status=503)

    body = _parse_json_body(request)
    plan_id = body.get("planId")
    is_annual = bool(body.get("isAnnual", False))
    currency = str(body.get("currency", "COP")).upper()
    payer_email = str(body.get("payerEmail", "")).strip()
    selected_method = str(body.get("method", "card")).lower()

    # Configure specific payment methods based on selection to skip selection screen
    payment_methods_cfg = {}
    if selected_method == "credit_card":
        payment_methods_cfg = {
            "default_payment_type_id": "credit_card",
            "excluded_payment_types": [
                {"id": "debit_card"},
                {"id": "bank_transfer"},
                {"id": "ticket"}
            ]
        }
    elif selected_method == "debit_card":
        payment_methods_cfg = {
            "default_payment_type_id": "debit_card",
            "excluded_payment_types": [
                {"id": "credit_card"},
                {"id": "bank_transfer"},
                {"id": "ticket"}
            ]
        }
    # Default fallback
    else:
        payment_methods_cfg = {}
    try:
        plan = MembershipPlan.objects.get(id=int(plan_id), is_active=True)
    except (TypeError, ValueError, MembershipPlan.DoesNotExist):
        return _json_error("Plan no encontrado", status=404)

    # Determine price based on currency and billing cycle
    if currency == "USD":
        unit_price = float(plan.annual_price_usd if is_annual else plan.price_usd)
        mp_currency = "USD"
    elif currency == "EUR":
        unit_price = float(plan.annual_price_eur if is_annual else plan.price_eur)
        mp_currency = "USD"  # MercadoPago typically processes in USD or local; use USD fallback
    else:
        unit_price = float(plan.annual_price_cop if is_annual else plan.price_cop)
        mp_currency = "COP"

    period_label = "anual" if is_annual else "mensual"
    title = f"{plan.name} – {period_label}"

    try:
        import urllib.request as ureq
        payload_data = {
            "items": [{
                "id": str(plan.id),
                "title": title,
                "quantity": 1,
                "unit_price": unit_price,
                "currency_id": mp_currency,
            }],
            "payer": {"email": payer_email} if payer_email else {},
            "back_urls": {
                "success": "https://conexionluz.com/pago-exitoso",
                "failure": "https://conexionluz.com/pago-fallido",
                "pending": "https://conexionluz.com/pago-pendiente",
            },
            "auto_return": "approved",
            "external_reference": f"plan_{plan.id}_{period_label}",
            "statement_descriptor": "CONEXIONLUZ",
            "binary_mode": True,
        }
        
        if payment_methods_cfg:
            payload_data["payment_methods"] = payment_methods_cfg

        payload = json.dumps(payload_data).encode("utf-8")

        req = ureq.Request(
            "https://api.mercadopago.com/checkout/preferences",
            data=payload,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {settings.mercadopago_access_token}",
            },
            method="POST",
        )
        with ureq.urlopen(req, timeout=10) as resp:
            mp_data = json.loads(resp.read().decode("utf-8"))

        return JsonResponse({
            "ok": True,
            "data": {
                "initPoint": mp_data.get("init_point"),
                "sandboxInitPoint": mp_data.get("sandbox_init_point"),
                "preferenceId": mp_data.get("id"),
            }
        })
    except ureq.HTTPError as e:
        # Capture the body of the error response from MP
        error_body = e.read().decode("utf-8")
        try:
            mp_error = json.loads(error_body)
            msg = mp_error.get("message") or mp_error.get("error") or error_body
        except Exception:
            msg = error_body
        return _json_error(f"Error de MercadoPago (HTTP {e.code}): {msg}", status=400)
    except Exception as e:
        return _json_error(f"Error al crear preferencia de MercadoPago: {str(e)}", status=500)


@csrf_exempt
@require_http_methods(["POST"])
def mercadopago_pay(request: HttpRequest) -> JsonResponse:
    """Process a direct card payment via MercadoPago Payments API (no redirect)."""
    settings = SiteSettings.get()
    if not settings.mercadopago_enabled or not settings.mercadopago_access_token:
        return _json_error("MercadoPago no está configurado en este momento.", status=503)

    body = _parse_json_body(request)
    plan_id = body.get("planId")
    is_annual = bool(body.get("isAnnual", False))
    currency = str(body.get("currency", "COP")).upper()
    payer_email = str(body.get("payerEmail", "")).strip()
    form_data = body.get("formData", {})  # Data from the MP Brick (token + card details)

    if not form_data or not isinstance(form_data, dict):
        return _json_error("Datos de pago inválidos.", status=400)

    try:
        plan = MembershipPlan.objects.get(id=int(plan_id), is_active=True)
    except (TypeError, ValueError, MembershipPlan.DoesNotExist):
        return _json_error("Plan no encontrado.", status=404)

    # Determine price
    if currency == "USD":
        unit_price = float(plan.annual_price_usd if is_annual else plan.price_usd)
        mp_currency = "USD"
    elif currency == "EUR":
        unit_price = float(plan.annual_price_eur if is_annual else plan.price_eur)
        mp_currency = "USD"
    else:
        unit_price = float(plan.annual_price_cop if is_annual else plan.price_cop)
        mp_currency = "COP"

    period_label = "anual" if is_annual else "mensual"

    # Build payment payload using the tokenized data from the Brick
    payment_payload = {
        "transaction_amount": unit_price,
        "token": form_data.get("token"),
        "description": f"{plan.name} – {period_label}",
        "installments": int(form_data.get("installments", 1)),
        "payment_method_id": form_data.get("payment_method_id"),
        "issuer_id": form_data.get("issuer_id"),
        "payer": {
            "email": payer_email or form_data.get("payer", {}).get("email", ""),
            "identification": form_data.get("payer", {}).get("identification", {}),
        },
        "external_reference": f"plan_{plan.id}_{period_label}",
        "statement_descriptor": "CONEXIONLUZ",
        "currency_id": mp_currency,
    }

    # Remove None values to avoid MP API errors
    payment_payload = {k: v for k, v in payment_payload.items() if v is not None}

    try:
        import urllib.request as ureq
        payload = json.dumps(payment_payload).encode("utf-8")
        req = ureq.Request(
            "https://api.mercadopago.com/v1/payments",
            data=payload,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {settings.mercadopago_access_token}",
                "X-Idempotency-Key": f"conexionluz-plan-{plan.id}-{payer_email}-{period_label}",
            },
            method="POST",
        )
        with ureq.urlopen(req, timeout=15) as resp:
            mp_data = json.loads(resp.read().decode("utf-8"))

        status = mp_data.get("status")
        status_detail = mp_data.get("status_detail", "")

        # If payment approved, create the subscription
        if status == "approved":
            patient = _get_patient_from_token(request)
            if patient:
                from datetime import date
                from dateutil.relativedelta import relativedelta
                today = date.today()
                ends_at = today + relativedelta(years=1) if is_annual else today + relativedelta(months=1)
                MembershipSubscription.objects.create(
                    patient=patient,
                    plan=plan,
                    status=MembershipSubscription.Status.ACTIVE,
                    started_at=today,
                    ends_at=ends_at,
                    payment_reference=str(mp_data.get("id", "")),
                )

        return JsonResponse({
            "ok": True,
            "data": {
                "status": status,
                "statusDetail": status_detail,
                "paymentId": mp_data.get("id"),
            }
        })
    except ureq.HTTPError as e:
        error_body = e.read().decode("utf-8")
        try:
            mp_error = json.loads(error_body)
            msg = mp_error.get("message") or mp_error.get("error") or error_body
        except Exception:
            msg = error_body
        return _json_error(f"Error al procesar el pago: {msg}", status=400)
    except Exception as e:
        return _json_error(f"Error interno al procesar el pago: {str(e)}", status=500)


@csrf_exempt
@require_http_methods(["GET"])
def public_site_settings(request: HttpRequest) -> JsonResponse:
    """Public endpoint - returns safe site settings (no secret tokens)."""
    settings = SiteSettings.get()
    return JsonResponse({
        "ok": True,
        "data": {
            "mercadopagoPublicKey": settings.mercadopago_public_key if settings.mercadopago_enabled else "",
            "mercadopagoEnabled": settings.mercadopago_enabled,
            "siteName": settings.site_name,
            "supportWhatsapp": settings.support_whatsapp,
        }
    })
