with open('api/views.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the marker: the portal_notifications function ends at "return JsonResponse({"ok": True})\n\n\n"
# and then we have orphaned code that should be inside a function

# Replace the broken orphaned block with a proper function definition
broken = '\n\n    q = UserNotification.objects.filter(recipient=patient)\n    if not mark_all and isinstance(ids, list):\n        q = q.filter(id__in=ids)\n\n    q.update(is_read=True)\n    return JsonResponse({"ok": True})\n\n\n# '

fixed = '''


@csrf_exempt
@require_http_methods(["POST"])
def portal_notifications_read(request: HttpRequest) -> JsonResponse:
    patient = _get_patient_from_token(request)
    if not patient:
        return _json_error("authentication required", status=401)

    body = _parse_json_body(request)
    ids = body.get("ids")
    mark_all = body.get("all", False)

    q = UserNotification.objects.filter(recipient=patient)
    if not mark_all and isinstance(ids, list):
        q = q.filter(id__in=ids)

    q.update(is_read=True)
    return JsonResponse({"ok": True})


# '''

if broken in content:
    content = content.replace(broken, fixed, 1)
    with open('api/views.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Fixed successfully!')
else:
    print('Pattern not found - checking nearby content...')
    idx = content.find('q = UserNotification.objects.filter(recipient=patient)\n    if not mark_all')
    print(f'Found at index: {idx}')
    print(repr(content[idx-50:idx+200]))
