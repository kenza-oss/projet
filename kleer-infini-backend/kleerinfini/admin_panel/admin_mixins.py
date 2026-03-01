from urllib.parse import urlsplit, urlunsplit

from django.http import HttpResponseRedirect, QueryDict


class EditToggleAdminMixin:
    """Mixin to expose a toggle that switches a change form between read-only and editable modes."""

    change_form_template = "admin/edit_toggle_change_form.html"
    edit_toggle_param = "edit"

    def _is_editing_enabled(self, request, obj=None):
        if obj is None:
            return True
        if request.method != "GET":
            # POST/DELETE/etc. should keep the edit mode that was previously enabled
            return True
        return request.GET.get(self.edit_toggle_param) == "1"

    def _build_toggle_url(self, request, enable):
        params = QueryDict(mutable=True)
        params.update(request.GET)
        if enable:
            params[self.edit_toggle_param] = "1"
        else:
            params.pop(self.edit_toggle_param, None)
        query_string = params.urlencode()
        return f"{request.path}?{query_string}" if query_string else request.path

    def get_readonly_fields(self, request, obj=None):
        readonly = list(super().get_readonly_fields(request, obj))
        if self._is_editing_enabled(request, obj):
            return readonly

        # Lock every database field + M2M field when edit mode is disabled
        model_fields = [field.name for field in self.model._meta.fields]
        m2m_fields = [field.name for field in self.model._meta.many_to_many]
        locked = readonly + model_fields + m2m_fields

        # Preserve ordering while removing duplicates
        seen = set()
        result = []
        for name in locked:
            if name not in seen:
                seen.add(name)
                result.append(name)
        return result

    def changeform_view(self, request, object_id=None, form_url="", extra_context=None):
        extra_context = {} if extra_context is None else extra_context.copy()
        is_existing_object = object_id is not None
        obj = None
        if is_existing_object:
            obj = self.get_object(request, object_id)
        editing_enabled = not is_existing_object or self._is_editing_enabled(request, obj)

        if is_existing_object:
            toggle_url = self._build_toggle_url(request, enable=not editing_enabled)
            toggle_label = (
                "Désactiver la modification" if editing_enabled else "Activer la modification"
            )
            extra_context.update(
                {
                    "edit_toggle_url": toggle_url,
                    "edit_toggle_label": toggle_label,
                }
            )
        else:
            extra_context.update(
                {
                    "edit_toggle_url": None,
                    "edit_toggle_label": None,
                }
            )

        extra_context["editing_enabled"] = editing_enabled
        return super().changeform_view(request, object_id, form_url, extra_context)

    def response_change(self, request, obj):
        response = super().response_change(request, obj)
        if (
            "_continue" in request.POST
            and self._is_editing_enabled(request, obj)
            and isinstance(response, HttpResponseRedirect)
        ):
            parts = list(urlsplit(response.url))
            query = QueryDict(parts[3], mutable=True)
            query[self.edit_toggle_param] = "1"
            parts[3] = query.urlencode()
            response["Location"] = urlunsplit(parts)
        return response
