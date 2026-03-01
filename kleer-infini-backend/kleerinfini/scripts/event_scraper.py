import os
import sys
import django
import requests
from bs4 import BeautifulSoup
from datetime import datetime, date
import logging
import re
import time

# FORCE UTF-8 ENCODING for Windows/Console consistency
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except AttributeError:
        pass

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

class EventScraper:
    """Main scraper class for discovering trade fairs across categories"""
    
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        # Mapping: Category ID -> EventsEye URL Slug
        self.category_mapping = {
            1: "agriculture-food-processing",      # Agroalimentaire
            3: "electronics-electrotechnics",     # Électricité
            31: "building-construction-architecture", # Construction
            47: "chemistry-energy-materials",      # Solaire / Énergie
            53: "logistics-transport-packaging",   # Emballage
            # More can be added as needed
            35: "electronics-electrotechnics",     # Électroménager & Électronique
            36: "industrial-fairs",                # Machine & Équipement Industriel
            8: "cosmetics-beauty-hygiene",         # Cosmétiques
            32: "fashion-apparel-textiles-leather-fur", # Textile
            29: "agriculture-food-processing",     # Machines Agricoles
            33: "healthcare-pharmaceuticals",      # Pharma
        }

    def scrape_all_sources(self, page_limit=2):
        """Entry point for global scraping"""
        total_created = 0
        
        # Phase 1: Global Priority Categories
        priority_ids = [3, 1, 53, 47, 31]
        
        print("\n" + "="*60)
        print(f"🚀 LANCEMENT GLOBAL DU SCRAPER (Limite: {page_limit} pages/catégorie)")
        print("="*60)

        for cat_id in priority_ids:
            total_created += self.scrape_category(cat_id, page_limit)
            time.sleep(1) 
        
        # Phase 2: Local Focus (Algeria)
        print("\n" + "="*60)
        print("🇩🇿 SCRAPER LOCAL (SAFEX / ALGERIA)")
        print("="*60)
        total_created += self.scrape_algeria()

        print("\n" + "="*60)
        print(f"✨ RAPPORT GLOBAL : {total_created} nouveaux événements ajoutés.")
        print("="*60)
        return total_created

    def scrape_algeria(self):
        """Specialized scraper for all events in Algeria"""
        url = "https://www.eventseye.com/fairs/c1_trade-shows_algeria.html"
        return self._scrape_url(url, category_id=None, force_national=True)

    def scrape_category(self, category_id, page_limit=2):
        """Scrape a specific category across multiple pages"""
        slug = self.category_mapping.get(category_id)
        if not slug:
            print(f"⚠️ Catégorie ID {category_id} non cartographiée. Passage...")
            return 0

        total_cat_created = 0
        for page in range(1, page_limit + 1):
            if page == 1:
                url = f"https://www.eventseye.com/fairs/t1_trade-shows_{slug}.html"
            else:
                url = f"https://www.eventseye.com/fairs/t1_trade-shows_{slug}_page-{page}.html"
            
            created = self._scrape_url(url, category_id)
            total_cat_created += created
            if created == 0 and page > 1: 
                break
        
        return total_cat_created

    def _scrape_url(self, url, category_id=None, force_national=False):
        """Inner method to scrape a single EventsEye page"""
        from events.models import Event
        from products.models import Category
        
        source_label = f"CAT:{category_id}" if category_id else "ALGERIA"
        print(f"\n🔍 [{source_label}] Scraping: {url}")
        
        try:
            response = requests.get(url, headers=self.headers, timeout=20)
            if response.status_code == 404:
                return 0
            response.raise_for_status()
            response.encoding = 'utf-8'
            
            soup = BeautifulSoup(response.text, 'html.parser')
            table = soup.find('table', class_='tradeshows') or soup.find('table', class_='mt')
            
            if not table:
                return 0

            rows = table.find_all('tr')[1:] 
            page_created = 0
            
            for row in rows:
                cols = row.find_all('td')
                if len(cols) < 3: continue
                
                # [Name, Cycle, Venue, Date]
                name_raw = cols[0].get_text(strip=True)
                name = name_raw.split('\n')[0][:200]
                
                venue_raw = cols[2].get_text(strip=True)
                location = venue_raw
                country_match = re.search(r'\((.*?)\)', venue_raw)
                country_text = country_match.group(1) if country_match else "Unknown"
                
                # If scraping Algeria page, ensure country is Algeria
                if force_national:
                    country_text = "Algeria"
                
                dates_text = cols[-1].get_text(strip=True)
                
                link_tag = cols[0].find('a')
                event_url = f"https://www.eventseye.com/fairs/{link_tag['href']}" if link_tag else ""
                
                event_date = self._parse_date(dates_text)
                if not event_date: continue
                
                # Determine event type
                current_event_type = 'national' if (country_text.lower() == 'algeria' or force_national) else 'international'
                
                try:
                    event, created = Event.objects.update_or_create(
                        name=name,
                        start_date=event_date,
                        defaults={
                            'location': location,
                            'country': country_text,
                            'url': event_url,
                            'source': 'EventsEye',
                            'event_type': current_event_type,
                            'is_verified': True,
                        }
                    )
                    
                    if created:
                        if category_id:
                            try:
                                category = Category.objects.get(id=category_id)
                                event.categories.add(category)
                            except: pass
                        page_created += 1
                        print(f"  ✨ {name[:40]}... ({event_date}) [{'LOC' if current_event_type=='national' else 'INT'}]")
                except Exception as db_err:
                    pass
            
            return page_created

        except Exception as e:
            print(f"  ❌ Erreur: {e}")
            return 0

    def _parse_date(self, date_text):
        """Simplified date parser for various EventsEye formats"""
        try:
            year_match = re.search(r'(202[4-9])', date_text)
            if not year_match: return None
            year = int(year_match.group(1))
            
            slash_match = re.search(r'(\d{1,2})/(\d{1,2})', date_text)
            if slash_match:
                day = int(slash_match.group(1))
                month = int(slash_match.group(2))
                if month > 12: day, month = month, day
                return date(year, month, int(str(day)[:2]))
            
            months = {'Jan':1,'Feb':2,'Mar':3,'Apr':4,'May':5,'Jun':6,'Jul':7,'Aug':8,'Sep':9,'Oct':10,'Nov':11,'Dec':12}
            for m_name, m_num in months.items():
                if m_name in date_text:
                    return date(year, m_num, 1)
            
            return date(year, 1, 1)
        except:
            return None

def run_global():
    """Manual trigger for global launch"""
    from django.apps import apps
    if not apps.ready:
        django.setup()
    scraper = EventScraper()
    scraper.scrape_all_sources(page_limit=2)

if __name__ == '__main__':
    run_global()
