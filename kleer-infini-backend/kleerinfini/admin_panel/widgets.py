from django import forms
from django.utils.html import format_html


class AdminImagePreviewWidget(forms.ClearableFileInput):
    """Image upload widget with client-side preview for Django admin."""

    def render(self, name, value, attrs=None, renderer=None):
        attrs = {} if attrs is None else attrs.copy()
        attrs.setdefault('accept', 'image/*')

        input_html = super().render(name, value, attrs, renderer)

        input_id = attrs.get('id', f'id_{name}')
        preview_id = f'{input_id}_preview'
        placeholder_id = f'{preview_id}_placeholder'
        preview_url = ''
        if value and hasattr(value, 'url'):
            preview_url = value.url

        preview_html = format_html(
            '<div class="admin-image-preview" style="margin-top: 0.75rem;">'
            '<img src="{}" id="{}" style="max-width: 220px; max-height: 220px; border-radius: 6px; box-shadow: 0 1px 4px rgba(0,0,0,0.15);{}" />'
            '<div id="{}" style="font-size: 0.85em; color: #777;{}">Aucun aperçu disponible</div>'
            '</div>',
            preview_url,
            preview_id,
            '' if preview_url else ' display: none;',
            placeholder_id,
            '' if not preview_url else ' display: none;'
        )

        script_html = format_html(
            '<script>(function() {{'
            'const input=document.getElementById("{0}");'
            'if(!input) return;'
            'const preview=document.getElementById("{1}");'
            'const placeholder=document.getElementById("{2}");'
            'const toggle=function(show){{{{'
            'if(show){{{{preview.style.display="block";placeholder.style.display="none";}}}}'
            'else{{{{preview.style.display="none";placeholder.style.display="block";}}}}'
            '}}}};'
            'const clear=document.getElementById("{0}-clear_id");'
            'if(clear){{{{clear.addEventListener("change",function(e){{{{'
            'if(e.target.checked){{{{preview.removeAttribute("src");toggle(false);}}}}'
            '}}}});}}}}'
            'input.addEventListener("change",function(event){{{{'
            'const file=event.target.files && event.target.files[0];'
            'if(!file){{{{preview.removeAttribute("src");toggle(false);return;}}}}'
            'if(!file.type.startsWith("image/")){{{{toggle(false);return;}}}}'
            'const reader=new FileReader();'
            'reader.onload=function(loadEvent){{{{preview.src=loadEvent.target.result;toggle(true);}}}};'
            'reader.readAsDataURL(file);'
            '}}}});'
            '}})();</script>',
            input_id,
            preview_id,
            placeholder_id
        )

        return format_html('{}{}{}', input_html, preview_html, script_html)
