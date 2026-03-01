import os
import sys

# Ensure current directory is in sys.path
sys.path.append(os.getcwd())

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from django.contrib.auth.models import AnonymousUser
from rest_framework.test import APIRequestFactory
from producers.views import ProducerProfileViewSet

factory = APIRequestFactory()
request = factory.get('/api/profiles/')
request.user = AnonymousUser()

view = ProducerProfileViewSet.as_view({'get': 'list'})
try:
    response = view(request)
    print(f"Status Code: {response.status_code}")
    print(f"Data: {response.data}")
except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"Error: {e}")
