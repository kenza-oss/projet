import requests
from bs4 import BeautifulSoup
import logging
from .ai_service import AIService
from ..models import LegalVariable, ScraperLog

logger = logging.getLogger(__name__)

class JORADPScraper:
    BASE_URL = "https://www.joradp.dz/HFR/Index.htm" # Main portal
    SUMMARY_URL = "https://www.joradp.dz/HFR/Sommaire.htm" # Usually where summaries are
    
    KEYWORDS = ["Exportation", "Devises", "Douanes", "Commerce", "Taxes", "ZLECAF"]

    def __init__(self):
        self.ai_service = AIService()

    def fetch_latest_summaries(self):
        """Fetches the latest summaries from JORADP."""
        try:
            response = requests.get(self.SUMMARY_URL, timeout=10)
            response.raise_for_status()
            return self.parse_summaries(response.text)
        except Exception as e:
            logger.error(f"Error fetching JORADP summaries: {e}")
            ScraperLog.objects.create(source="JORADP", status="ERROR", message=str(e))
            return []

    def parse_summaries(self, html_content):
        """Parses the HTML and extracts relevant entries based on keywords."""
        soup = BeautifulSoup(html_content, 'html.parser')
        relevant_entries = []
        
        # JORADP structure is often nested tables. 
        # This is a placeholder for the actual extraction logic which needs to be refined
        # based on the live site structure.
        for item in soup.find_all(['p', 'td', 'a']):
            text = item.get_text()
            if any(keyword.lower() in text.lower() for keyword in self.KEYWORDS):
                relevant_entries.append({
                    'text': text,
                    'url': item.get('href') if item.name == 'a' else None
                })
        
        return relevant_entries

    def process_entries(self, entries):
        """Sends relevant entries to AI for variable extraction."""
        for entry in entries:
            try:
                # In a real scenario, we might need to fetch the full text or PDF
                # and use OCR if necessary. For now, we use the summary text.
                parsed_data = self.ai_service.extract_variables(entry['text'])
                
                if parsed_data:
                    for var in parsed_data:
                        LegalVariable.objects.get_or_create(
                            key_code=var['key_code'],
                            defaults={
                                'display_name': var['display_name'],
                                'current_value': var['value'],
                                'unit': var['unit'],
                                'source_url': entry.get('url'),
                                'is_validated': False
                            }
                        )
                
                ScraperLog.objects.create(source="JORADP", status="SUCCESS", message=f"Processed: {entry['text'][:100]}")
            except Exception as e:
                logger.error(f"Error processing entry: {e}")
                ScraperLog.objects.create(source="JORADP", status="ERROR", message=str(e))

    def run(self):
        """Main entry point for the scraper."""
        logger.info("Starting JORADP Scraper...")
        entries = self.fetch_latest_summaries()
        if entries:
            self.process_entries(entries)
        else:
            logger.info("No relevant entries found today.")
