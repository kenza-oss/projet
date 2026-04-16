# ⚙️ Kleer Infini Backend (API)

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.x-092E20?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/DRF-3.15+-A30000?logo=django&logoColor=white)](https://www.django-rest-framework.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.x-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

This is the robust backend engine powering the **Kleer Infini** ecosystem. It is a high-performance REST API designed to manage complex B2B workflows, secure authentication, and internationalized data architecture.

---

## 🏗️ Backend Ecosystem

### 🛠️ Core Technology Stack
- **Framework**: Django 5.x + Django REST Framework.
- **Database**: PostgreSQL hosted on **Supabase**.
- **Authentication**: Stateless JWT via `djangorestframework-simplejwt`.
- **Media Management**: **Cloudinary** for scalable image and file storage.
- **Async Tasks**: **Celery** with **Redis** for background processing (notifications, reports).
- **Documentation**: Automatic API documentation with **Swagger (drf-yasg)**.

### 🍱 Domain-Driven App Structure
- **Users & Auth**: Custom user model with role-based access control (RBAC).
- **Producers & Dashboard**: Advanced management for Algerian exporters.
- **Products & Analytics**: Complex data modeling for exports and market trends.
- **Messaging & Notifications**: Real-time communication system for B2B inquiries.
- **Subscriptions & Billing**: Management of premium platform features.

---

## 🌟 Senior-Level Implementations

- **OCR & Data Processing**: Advanced scripts for extracting and validating invoice data.
- **Data Migration & Integrity**: Robust audit and fix scripts for handling complex dataset transitions and character encoding.
- **Internationalization (i18n)**: Fully localized database fields and error messages.
- **Performance Optimization**: Efficient database queries and optimized storage via Cloudinary.
- **Production-Ready Deployment**: Configured for **Render** with dynamic environment variables and secure SSL headers.

---

## 🛠️ Development

### Setup
1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run migrations:
   ```bash
   python manage.py migrate
   ```

### Run Server
```bash
python manage.py runserver
```

---

<p align="center">
  Engineered for reliability, security, and scale.
</p>