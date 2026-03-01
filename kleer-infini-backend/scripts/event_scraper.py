import os
import sys
import django
import requests
from bs4 import BeautifulSoup
from datetime import datetime, date
import logging
import re

# Reconfigure stdout for UTF-8 to handle special characters
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# Setup Django if run as a standalone script
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kleer_backend.settings') # Changed to kleer_backend based on common naming or I should check settings file name

logger = logging.getLogger(__name__)

class EventScraper:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

    def scrape_events_eye(self, category_id=3):
        """
        Scrape events from EventsEye for a specific category.
        Default is ID 3 (Electricity).
        """
        # Ensure Django is setup
        if not apps.ready:
            django.setup()

        from events.models import Event
        from products.models import Category

        # EventsEye URL for Electricity & Electronics
        url = "https://www.eventseye.com/fairs/st1_trade-shows_electricity-electronics.html"
        print(f"\n🚀 Starting Scraper for Category ID {category_id}...")
        print(f"🔗 Target: {url}\n")
        
        try:
            response = requests.get(url, headers=self.headers, timeout=15)
            response.raise_for_status()
            response.encoding = 'utf-8'
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Events list is usually in a table with class 'mt'
            table = soup.find('table', class_='mt')
            if not table:
                print("❌ Erreur : Table des événements non trouvée.")
                return []

            events_processed = 0
            rows = table.find_all('tr')[1:] # On saute l'en-tête
            
            for row in rows:
                cols = row.find_all('td')
                if len(cols) < 5:
                    continue
                
                # Extraction des données
                # Structure: Nom | Dates | Périodicité | Lieu | Pays
                raw_name = cols[0].get_text(strip=True)
                raw_dates = cols[1].get_text(strip=True)
                raw_location = cols[3].get_text(strip=True)
                raw_country = cols[4].get_text(strip=True)
                
                event_link = cols[0].find('a')
                event_url = f"https://www.eventseye.com/{event_link['href']}" if event_link else ""
                
                # Parsing basique de la date pour le test
                # Format souvent: "Jan 15 - 17, 2026" ou "Jan 2026"
                event_date = self._parse_date(raw_dates)
                if not event_date:
                    continue

                # Création/Mise à jour dans la DB
                event, created = Event.objects.update_or_create(
                    name=raw_name,
                    start_date=event_date,
                    defaults={
                        'location': raw_location,
                        'country': raw_country,
                        'url': event_url,
                        'source': 'EventsEye',
                        'event_type': 'international',
                        'is_verified': True,
                    }
                )
                
                # Attribution de la catégorie
                try:
                    category = Category.objects.get(id=category_id)
                    event.categories.add(category)
                except Exception as e:
                    print(f"⚠️ Catégorie {category_id} non trouvée: {e}")

                status_icon = "✅" if created else "🔄"
                print(f"{status_icon} {raw_name} ({event_date})")
                
                events_processed += 1
                if events_processed >= 10: # Limite pour le test
                    break
                    
            print(f"\n✨ Scraping terminé. {events_processed} événements traités.")
            return events_processed

        except Exception as e:
            print(f"❌ Erreur lors du scraping de {url}: {e}")
            return 0

    def _parse_date(self, date_text):
        """
        Parseur de date simplifié pour EventsEye.
        Retourne un objet date ou None.
        """
        try:
            # On cherche l'année
            year_match = re.search(r'202[0-9]', date_text)
            if not year_match:
                return None
            year = int(year_match.group())

            # On cherche le mois (3 premières lettres)
            months = {
                'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
                'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
            }
            
            month_num = 1
            for m_name, m_num in months.items():
                if m_name in date_text:
                    month_num = m_num
                    break
            
            # On cherche le jour
            day_match = re.search(r'\b([1-9]|[12][0-9]|3[01])\b', date_text)
            day = int(day_match.group(1)) if day_match else 1
            
            return date(year, month_num, day)
        except Exception:
            return None

    def scrape_all_sources(self):
        """Utilisé par la tâche Celery"""
        return self.scrape_events_eye(category_id=3)

if __name__ == "__main__":
    from django.apps import apps
    scraper = EventScraper()
    scraper.scrape_events_eye(category_id=3)
