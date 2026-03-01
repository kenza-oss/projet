
import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()



def inspect_product_images():
    with connection.cursor() as cursor:
        cursor.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'products_productimage';")
        columns = cursor.fetchall()
        print(f"Columns in products_productimage table:")
        for col in columns:
            print(f"- {col[0]} ({col[1]})")

if __name__ == '__main__':
    inspect_product_images()


