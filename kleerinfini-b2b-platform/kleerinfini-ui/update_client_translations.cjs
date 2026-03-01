const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const languages = ['fr', 'en', 'es', 'it', 'ar', 'tr'];

const clientDashboardTranslations = {
    fr: {
        sidebar: {
            dashboard: "Tableau de bord",
            search: "Recherche producteurs",
            requests: "Mes demandes",
            messages: "Messagerie",
            documents: "Documents reçus",
            hub: "Hub Stratégique Export",
            profile: "Mon profil"
        },
        home: {
            sentRequests: "Demandes Envoyées",
            receivedResponses: "Réponses Reçues",
            conversations: "Conversations",
            documents: "Documents",
            contactedProducers: "Producteurs Contactés",
            premiumAccount: "Compte Premium",
            welcome: "Bonjour",
            readyToExplore: "Prêt à explorer les meilleurs producteurs africains ?",
            lastActivity: "Dernière activité: 2m ago",
            newRequest: "+ Nouvelle Demande",
            recentActivities: "Activités Récentes",
            viewAll: "VOIR TOUT",
            noRecentActivity: "Aucune activité récente.",
            specificProduct: "Besoin d'un produit spécifique ?",
            sourcingTeam: "Notre équipe de sourcing dédiée vous accompagne pour trouver les meilleurs producteurs africains certifiés.",
            contactSupport: "Contacter le support",
            details: "Détails"
        }
    },
    en: {
        sidebar: {
            dashboard: "Dashboard",
            search: "Search Producers",
            requests: "My Requests",
            messages: "Messages",
            documents: "Received Documents",
            hub: "Strategic Export Hub",
            profile: "My Profile"
        },
        home: {
            sentRequests: "Sent Requests",
            receivedResponses: "Responses Received",
            conversations: "Conversations",
            documents: "Documents",
            contactedProducers: "Contacted Producers",
            premiumAccount: "Premium Account",
            welcome: "Hello",
            readyToExplore: "Ready to explore the best African producers?",
            lastActivity: "Last activity: 2m ago",
            newRequest: "+ New Request",
            recentActivities: "Recent Activities",
            viewAll: "VIEW ALL",
            noRecentActivity: "No recent activity.",
            specificProduct: "Need a specific product?",
            sourcingTeam: "Our dedicated sourcing team helps you find the best certified African producers.",
            contactSupport: "Contact support",
            details: "Details"
        }
    },
    es: {
        sidebar: {
            dashboard: "Panel",
            search: "Buscar productores",
            requests: "Mis solicitudes",
            messages: "Mensajes",
            documents: "Documentos recibidos",
            hub: "Centro Estratégico",
            profile: "Mi perfil"
        },
        home: {
            sentRequests: "Solicitudes enviadas",
            receivedResponses: "Respuestas recibidas",
            conversations: "Conversaciones",
            documents: "Documentos",
            contactedProducers: "Productores contactados",
            premiumAccount: "Cuenta Premium",
            welcome: "Hola",
            readyToExplore: "¿Listo para explorar los mejores productores africanos?",
            lastActivity: "Última actividad: hace 2m",
            newRequest: "+ Nueva solicitud",
            recentActivities: "Actividades recientes",
            viewAll: "VER TODO",
            noRecentActivity: "Sin actividad reciente.",
            specificProduct: "¿Necesitas un producto específico?",
            sourcingTeam: "Nuestro equipo dedicado te ayuda a encontrar los mejores productores africanos certificados.",
            contactSupport: "Contactar soporte",
            details: "Detalles"
        }
    },
    it: {
        sidebar: {
            dashboard: "Dashboard",
            search: "Cerca produttori",
            requests: "Le mie richieste",
            messages: "Messaggi",
            documents: "Documenti ricevuti",
            hub: "Hub Strategico",
            profile: "Il mio profilo"
        },
        home: {
            sentRequests: "Richieste inviate",
            receivedResponses: "Risposte ricevute",
            conversations: "Conversazioni",
            documents: "Documenti",
            contactedProducers: "Produttori contattati",
            premiumAccount: "Account Premium",
            welcome: "Ciao",
            readyToExplore: "Pronto per esplorare i migliori produttori africani?",
            lastActivity: "Ultima attività: 2m fa",
            newRequest: "+ Nuova Richiesta",
            recentActivities: "Attività Recenti",
            viewAll: "VEDI TUTTO",
            noRecentActivity: "Nessuna attività recente.",
            specificProduct: "Hai bisogno di un prodotto specifico?",
            sourcingTeam: "Il nostro team dedicato ti aiuta a trovare i migliori produttori africani certificati.",
            contactSupport: "Contatta il supporto",
            details: "Dettagli"
        }
    },
    ar: {
        sidebar: {
            dashboard: "لوحة القيادة",
            search: "البحث عن منتجين",
            requests: "طلباتي",
            messages: "الرسائل",
            documents: "المستندات المستلمة",
            hub: "المركز الاستراتيجي",
            profile: "ملفي الشخصي"
        },
        home: {
            sentRequests: "الطلبات المرسلة",
            receivedResponses: "الردود المستلمة",
            conversations: "المحادثات",
            documents: "المستندات",
            contactedProducers: "المنتجون الذين تم الاتصال بهم",
            premiumAccount: "حساب مميز",
            welcome: "مرحباً",
            readyToExplore: "هل أنت مستعد لاستكشاف أفضل المنتجين الأفارقة؟",
            lastActivity: "آخر نشاط: منذ دقيقتين",
            newRequest: "+ طلب جديد",
            recentActivities: "الأنشطة الأخيرة",
            viewAll: "عرض الكل",
            noRecentActivity: "لا يوجد نشاط أخير.",
            specificProduct: "هل تحتاج إلى منتج معين؟",
            sourcingTeam: "يساعدك فريق التوريد المتخصص لدينا في العثور على أفضل المنتجين الأفارقة المعتمدين.",
            contactSupport: "اتصل بالدعم",
            details: "تفاصيل"
        }
    },
    tr: {
        sidebar: {
            dashboard: "Kontrol Paneli",
            search: "Üretici Ara",
            requests: "İsteklerim",
            messages: "Mesajlar",
            documents: "Alınan Belgeler",
            hub: "Stratejik Merkez",
            profile: "Profilim"
        },
        home: {
            sentRequests: "Gönderilen İstekler",
            receivedResponses: "Alınan Yanıtlar",
            conversations: "Görüşmeler",
            documents: "Belgeler",
            contactedProducers: "İletişime Geçilen Üreticiler",
            premiumAccount: "Premium Hesap",
            welcome: "Merhaba",
            readyToExplore: "En iyi Afrikalı üreticileri keşfetmeye hazır mısınız?",
            lastActivity: "Son etkinlik: 2d önce",
            newRequest: "+ Yeni İstek",
            recentActivities: "Son Etkinlikler",
            viewAll: "TÜMÜNÜ GÖR",
            noRecentActivity: "Son etkinlik yok.",
            specificProduct: "Belirli bir ürüne mi ihtiyacınız var?",
            sourcingTeam: "Uzman satın alma ekibimiz, en iyi sertifikalı Afrikalı üreticileri bulmanıza yardımcı olur.",
            contactSupport: "Destek ile iletişime geçin",
            details: "Detaylar"
        }
    }
};

languages.forEach(lang => {
    const filePath = path.join(localesDir, lang, 'translation.json');
    try {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(rawData);

        data.client_dashboard = clientDashboardTranslations[lang];

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`Updated client translations for ${lang}/translation.json successfully.`);
    } catch (err) {
        console.error(`Error processing ${lang}:`, err);
    }
});
