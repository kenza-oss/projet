"""Django management command to run event scraper"""
from django.core.management.base import BaseCommand
from scripts.event_scraper import EventScraper


class Command(BaseCommand):
    help = 'Scrape trade fair events from various sources'
    
    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting event scraper...'))
        
        scraper = EventScraper()
        events = scraper.scrape_all_sources()
        
        self.stdout.write(self.style.SUCCESS(f'✅ Scraping complete! Found {len(events)} events.'))
