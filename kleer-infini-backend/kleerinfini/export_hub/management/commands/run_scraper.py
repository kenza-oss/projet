from django.core.management.base import BaseCommand
from export_hub.services.joradp_scraper import JORADPScraper

class Command(BaseCommand):
    help = 'Runs the JORADP scraper to fetch latest legal updates.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting JORADP Scraper...'))
        scraper = JORADPScraper()
        scraper.run()
        self.stdout.write(self.style.SUCCESS('Scraper execution completed.'))
