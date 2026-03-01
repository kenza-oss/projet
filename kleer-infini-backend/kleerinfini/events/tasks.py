from celery import shared_task
from scripts.event_scraper import EventScraper
from django.db.models import Q
from datetime import date
from events.models import Event
import logging

logger = logging.getLogger(__name__)


@shared_task
def scrape_events_weekly():
    """
    Weekly task to scrape and update trade fair events
    Scheduled to run every Sunday at 3:00 AM
    """
    logger.info("🚀 Starting weekly event scraping task...")
    
    try:
        scraper = EventScraper()
        count = scraper.scrape_all_sources()
        
        logger.info(f"✅ Weekly scraping complete! Processed {count} events.")
        return {
            'status': 'success',
            'events_processed': count,
            'message': 'Event scraping completed successfully'
        }
    
    except Exception as e:
        logger.error(f"❌ Error during event scraping: {str(e)}")
        return {
            'status': 'error',
            'message': str(e)
        }

@shared_task
def delete_expired_events():
    """
    Delete events that have already ended.
    """
    logger.info("🗑️ Starting expired events cleanup...")
    try:
        today = date.today()
        # Filter events where end_date < today OR (end_date is null AND start_date < today)
        expired = Event.objects.filter(
            Q(end_date__lt=today) | 
            Q(end_date__isnull=True, start_date__lt=today)
        )
        
        count = expired.count()
        expired.delete()
        
        logger.info(f"✅ Cleanup complete! Deleted {count} expired events.")
        return {
            'status': 'success',
            'deleted_count': count
        }
    except Exception as e:
        logger.error(f"❌ Error during event cleanup: {str(e)}")
        return {
            'status': 'error',
            'message': str(e)
        }
