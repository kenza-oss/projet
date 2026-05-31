from django import forms
from django.utils.html import format_html


class AdminImagePreviewWidget(forms.Widget):
    """Direct-to-Cloudinary image/file upload widget for Django Admin."""
    
    def __init__(self, folder='general', attrs=None):
        self.folder = folder
        super().__init__(attrs)

    def render(self, name, value, attrs=None, renderer=None):
        from products.utils import get_cloudinary_url
        
        attrs = {} if attrs is None else attrs.copy()
        input_id = attrs.get('id', f'id_{name}')
        file_input_id = f'{input_id}_file'
        preview_id = f'{input_id}_preview'
        placeholder_id = f'{input_id}_placeholder'
        progress_container_id = f'{input_id}_progress_container'
        progress_bar_id = f'{input_id}_progress_bar'
        
        # Determine current value and preview URL
        current_value = ""
        preview_url = ""
        if value:
            if isinstance(value, str):
                current_value = value
                preview_url = get_cloudinary_url(value)
            elif hasattr(value, 'name'):
                current_value = value.name
                preview_url = get_cloudinary_url(value.name)
            elif hasattr(value, 'url'):
                current_value = str(value)
                preview_url = value.url
                
        # Main input field (hidden, contains the URL string/path to save)
        hidden_input = format_html(
            '<input type="hidden" name="{}" id="{}" value="{}" />',
            name, input_id, current_value
        )
        
        # File selector input (not named to avoid browser submission of raw file)
        file_input = format_html(
            '<input type="file" id="{}" accept="image/*,.pdf,.doc,.docx,.mp4,.webm" style="margin-bottom: 0.5rem;" />',
            file_input_id
        )
        
        # Progress bar html
        progress_html = format_html(
            '<div id="{}" style="display: none; width: 220px; background-color: #f3f3f3; border: 1px solid #ccc; border-radius: 4px; overflow: hidden; margin-top: 0.5rem; margin-bottom: 0.5rem;">'
            '<div id="{}" style="width: 0%; height: 20px; background-color: #007bff; color: white; text-align: center; font-size: 12px; line-height: 20px; font-weight: bold; transition: width 0.2s;">0%</div>'
            '</div>',
            progress_container_id, progress_bar_id
        )
        
        # Determine preview display styles
        is_pdf = preview_url.lower().endswith('.pdf')
        is_video = preview_url.lower().endswith(('.mp4', '.webm', '.mov'))
        is_image = not is_pdf and not is_video and preview_url != ""
        
        # Image preview and delete/clear control
        preview_html = format_html(
            '<div class="admin-image-preview-container" style="margin-top: 0.75rem;">'
            '<img src="{}" id="{}" style="max-width: 220px; max-height: 220px; border-radius: 6px; box-shadow: 0 1px 4px rgba(0,0,0,0.15);{}" />'
            '<div id="{}_doc_preview" style="font-size: 0.9em; font-weight: bold; color: #007bff; margin-bottom: 0.5rem;{}" class="admin-doc-preview">'
            '<a href="{}" target="_blank">📄 Voir le document / fichier existant</a>'
            '</div>'
            '<div id="{}" style="font-size: 0.85em; color: #777;{}">Aucun aperçu disponible</div>'
            '<div style="margin-top: 0.5rem;">'
            '<button type="button" id="{}_clear_btn" style="background: #dc3545; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer;{}" onclick="('
            'function() {{'
            'document.getElementById(\'{}\').value=\'\';'
            'const previewImg = document.getElementById(\'{}\');'
            'if (previewImg) previewImg.style.display=\'none\';'
            'const docPreview = document.getElementById(\'{}_doc_preview\');'
            'if (docPreview) docPreview.style.display=\'none\';'
            'document.getElementById(\'{}\').style.display=\'block\';'
            'document.getElementById(\'{}_clear_btn\').style.display=\'none\';'
            '}})();">Supprimer</button>'
            '</div>'
            '</div>',
            preview_url,
            preview_id,
            '' if is_image else ' display: none;',
            input_id,
            '' if (is_pdf or is_video) else ' display: none;',
            preview_url,
            placeholder_id,
            '' if not preview_url else ' display: none;',
            input_id,
            '' if preview_url else ' display: none;',
            input_id,
            preview_id,
            input_id,
            placeholder_id,
            input_id
        )
        
        # JS logic for upload
        script_html = format_html(
            '<script>(function() {{'
            'const fileInput = document.getElementById("{0}");'
            'const hiddenInput = document.getElementById("{1}");'
            'const preview = document.getElementById("{2}");'
            'const docPreview = document.getElementById("{1}_doc_preview");'
            'const placeholder = document.getElementById("{3}");'
            'const progressContainer = document.getElementById("{4}");'
            'const progressBar = document.getElementById("{5}");'
            'const clearBtn = document.getElementById("{1}_clear_btn");'
            
            'if(!fileInput) return;'
            
            'fileInput.addEventListener("change", function(e) {{'
            'const file = e.target.files[0];'
            'if(!file) return;'
            
            'progressContainer.style.display = "block";'
            'progressBar.style.width = "0%";'
            'progressBar.innerText = "0%";'
            
            'const formData = new FormData();'
            'formData.append("file", file);'
            'formData.append("upload_preset", "kleerinfini_unsigned");'
            'formData.append("folder", "{6}");'
            
            'const xhr = new XMLHttpRequest();'
            'let resourceType = "image";'
            'if (file.type.startsWith("video/")) {{ resourceType = "video"; }}'
            'else if (file.type === "application/pdf" || !file.type.startsWith("image/")) {{ resourceType = "auto"; }}'
            
            'xhr.open("POST", "https://api.cloudinary.com/v1_1/dptb2m02i/" + resourceType + "/upload", true);'
            
            'xhr.upload.onprogress = function(event) {{'
            'if(event.lengthComputable) {{'
            'const percent = Math.round((event.loaded * 100) / event.total);'
            'progressBar.style.width = percent + "%";'
            'progressBar.innerText = percent + "%";'
            '}}'
            '}};'
            
            'xhr.onload = function() {{'
            'if(xhr.status === 200) {{'
            'const response = JSON.parse(xhr.responseText);'
            'hiddenInput.value = response.secure_url;'
            'const isImg = file.type.startsWith("image/");'
            'if (isImg) {{'
            'preview.src = response.secure_url;'
            'preview.style.display = "block";'
            'if (docPreview) docPreview.style.display = "none";'
            '}} else {{'
            'preview.style.display = "none";'
            'if (docPreview) {{'
            'docPreview.innerHTML = \'<a href="\' + response.secure_url + \'" target="_blank">📄 Voir le document / fichier importé</a>\';'
            'docPreview.style.display = "block";'
            '}}'
            '}}'
            'placeholder.style.display = "none";'
            'clearBtn.style.display = "inline-block";'
            'progressBar.innerText = "Terminé !";'
            'setTimeout(function() {{ progressContainer.style.display = "none"; }}, 1500);'
            '}} else {{'
            'alert("Erreur lors de l\'upload : " + xhr.responseText);'
            'progressContainer.style.display = "none";'
            '}}'
            '}};'
            
            'xhr.onerror = function() {{'
            'alert("Erreur réseau lors de l\'upload.");'
            'progressContainer.style.display = "none";'
            '}};'
            
            'xhr.send(formData);'
            '}});'
            '}})();</script>',
            file_input_id,
            input_id,
            preview_id,
            placeholder_id,
            progress_container_id,
            progress_bar_id,
            self.folder
        )
        
        return format_html('{}{}{}{}{}', hidden_input, file_input, progress_html, preview_html, script_html)
