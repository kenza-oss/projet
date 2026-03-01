const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const languages = ['fr', 'en', 'es', 'it', 'ar', 'tr'];

const producerDashboardTranslations = {
    fr: {
        sidebar: {
            dashboard: "Tableau de bord",
            profile: "Profil Entreprise",
            products: "Gestion Produits",
            hub: "Hub Export",
            demands: "Demandes de Devis",
            messages: "Messagerie",
            statistics: "Statistiques",
            documents: "Documents",
            payments: "Paiements"
        },
        topbar: {
            welcome: "Bienvenue",
            search: "Rechercher...",
            notifications: "Notifications",
            settings: "Paramètres"
        },
        home: {
            title: "Vue Globale",
            completeProfile: "Compléter votre profil",
            manageCatalog: "Gérez votre catalogue export",
            hubDesc: "Accédez aux indicateurs clés, réglementations ZLECAF et opportunités.",
            hubAccess: "Accéder au Hub",
            markets: "Marchés Cibles",
            compliance: "Conformité",
            actionRequired: "Action requise : Ajoutez votre premier produit pour activer votre visibilité.",
            noProducts: "Aucun produit au catalogue",
            noProductsDesc: "Commencez par ajouter votre premier produit pour devenir visible à l'international."
        },
        products: {
            title: "Inventaire International",
            subtitle: "Gérez votre catalogue d'exportation",
            addProduct: "Ajouter un produit",
            approvalRequired: "Votre compte doit être validé par un administrateur avant de pouvoir ajouter des produits."
        },
        profile: {
            title: "Profil Entreprise",
            companyName: "Nom de l'entreprise",
            updateInfo: "Mettre à jour les informations"
        }
    },
    en: {
        sidebar: {
            dashboard: "Dashboard",
            profile: "Company Profile",
            products: "Products Management",
            hub: "Export Hub",
            demands: "Quote Requests",
            messages: "Messages",
            statistics: "Statistics",
            documents: "Documents",
            payments: "Payments"
        },
        topbar: {
            welcome: "Welcome",
            search: "Search...",
            notifications: "Notifications",
            settings: "Settings"
        },
        home: {
            title: "Global View",
            completeProfile: "Complete your profile",
            manageCatalog: "Manage your export catalog",
            hubDesc: "Access key indicators, AfCFTA regulations, and opportunities.",
            hubAccess: "Access Hub",
            markets: "Target Markets",
            compliance: "Compliance",
            actionRequired: "Action required: Add your first product to activate your visibility.",
            noProducts: "No products in catalog",
            noProductsDesc: "Start by adding your first product to become internationally visible."
        },
        products: {
            title: "International Inventory",
            subtitle: "Manage your export catalog",
            addProduct: "Add a product",
            approvalRequired: "Your account must be approved by an administrator before adding products."
        },
        profile: {
            title: "Company Profile",
            companyName: "Company Name",
            updateInfo: "Update information"
        }
    },
    es: {
        sidebar: {
            dashboard: "Panel de control",
            profile: "Perfil de la empresa",
            products: "Gestión de productos",
            hub: "Centro de Exportación",
            demands: "Solicitudes de cotización",
            messages: "Mensajería",
            statistics: "Estadísticas",
            documents: "Documentos",
            payments: "Pagos"
        },
        topbar: {
            welcome: "Bienvenido",
            search: "Buscar...",
            notifications: "Notificaciones",
            settings: "Ajustes"
        },
        home: {
            title: "Vista global",
            completeProfile: "Completa tu perfil",
            manageCatalog: "Gestiona tu catálogo de exportación",
            hubDesc: "Accede a indicadores clave, normativas ZLECAF y oportunidades.",
            hubAccess: "Acceder al centro",
            markets: "Mercados objetivo",
            compliance: "Cumplimiento",
            actionRequired: "Acción requerida: Agrega tu primer producto para activar tu visibilidad.",
            noProducts: "No hay productos en el catálogo",
            noProductsDesc: "Comienza agregando tu primer producto para hacerte visible a nivel internacional."
        },
        products: {
            title: "Inventario Internacional",
            subtitle: "Gestiona tu catálogo de exportación",
            addProduct: "Añadir un producto",
            approvalRequired: "Tu cuenta debe ser aprobada por un administrador antes de agregar productos."
        },
        profile: {
            title: "Perfil de la empresa",
            companyName: "Nombre de la empresa",
            updateInfo: "Actualizar información"
        }
    },
    it: {
        sidebar: {
            dashboard: "Pannello di controllo",
            profile: "Profilo aziendale",
            products: "Gestione prodotti",
            hub: "Hub di Esportazione",
            demands: "Richieste di preventivo",
            messages: "Messaggi",
            statistics: "Statistiche",
            documents: "Documenti",
            payments: "Pagamenti"
        },
        topbar: {
            welcome: "Benvenuto",
            search: "Cerca...",
            notifications: "Notifiche",
            settings: "Impostazioni"
        },
        home: {
            title: "Vista globale",
            completeProfile: "Completa il tuo profilo",
            manageCatalog: "Gestisci il tuo catalogo di esportazione",
            hubDesc: "Accedi agli indicatori chiave, alle normative AfCFTA e alle opportunità.",
            hubAccess: "Accedi all'Hub",
            markets: "Mercati di destinazione",
            compliance: "Conformità",
            actionRequired: "Azione richiesta: Aggiungi il tuo primo prodotto per attivare la tua visibilità.",
            noProducts: "Nessun prodotto in catalogo",
            noProductsDesc: "Inizia aggiungendo il tuo primo prodotto per diventare visibile a livello internazionale."
        },
        products: {
            title: "Inventario Internazionale",
            subtitle: "Gestisci il tuo catalogo di esportazione",
            addProduct: "Aggiungi un prodotto",
            approvalRequired: "Il tuo account deve essere approvato da un amministratore prima di poter aggiungere prodotti."
        },
        profile: {
            title: "Profilo aziendale",
            companyName: "Nome dell'azienda",
            updateInfo: "Aggiorna le informazioni"
        }
    },
    ar: {
        sidebar: {
            dashboard: "لوحة القيادة",
            profile: "ملف الشركة",
            products: "إدارة المنتجات",
            hub: "مركز التصدير",
            demands: "طلبات عروض الأسعار",
            messages: "الرسائل",
            statistics: "إحصائيات",
            documents: "مستندات",
            payments: "المدفوعات"
        },
        topbar: {
            welcome: "مرحباً",
            search: "بحث...",
            notifications: "إشعارات",
            settings: "إعدادات"
        },
        home: {
            title: "نظرة عالمية",
            completeProfile: "أكمل ملفك الشخصي",
            manageCatalog: "إدارة كتالوج التصدير الخاص بك",
            hubDesc: "قم بالوصول إلى المؤشرات الرئيسية ولوائح منطقة التجارة الحرة القارية الأفريقية وفرص العمل.",
            hubAccess: "الوصول إلى المركز",
            markets: "الأسواق المستهدفة",
            compliance: "الامتثال",
            actionRequired: "إجراء مطلوب: أضف منتجك الأول لتفعيل ظهورك.",
            noProducts: "لا توجد منتجات في الكتالوج",
            noProductsDesc: "ابدأ بإضافة منتجك الأول لتصبح مرئيًا على المستوى الدولي."
        },
        products: {
            title: "المخزون الدولي",
            subtitle: "إدارة كتالوج التصدير الخاص بك",
            addProduct: "إضافة منتج",
            approvalRequired: "يجب الموافقة على حسابك من قبل المسؤول قبل إضافة المنتجات."
        },
        profile: {
            title: "ملف الشركة",
            companyName: "اسم الشركة",
            updateInfo: "تحديث المعلومات"
        }
    },
    tr: {
        sidebar: {
            dashboard: "Kontrol Paneli",
            profile: "Şirket Profili",
            products: "Ürün Yönetimi",
            hub: "İhracat Merkezi",
            demands: "Teklif İstekleri",
            messages: "Mesajlar",
            statistics: "İstatistikler",
            documents: "Belgeler",
            payments: "Ödemeler"
        },
        topbar: {
            welcome: "Hoş geldiniz",
            search: "Ara...",
            notifications: "Bildirimler",
            settings: "Ayarlar"
        },
        home: {
            title: "Küresel Görünüm",
            completeProfile: "Profilinizi tamamlayın",
            manageCatalog: "İhracat kataloğunuzu yönetin",
            hubDesc: "Temel göstergelere, AfCFTA düzenlemelerine ve fırsatlarına erişin.",
            hubAccess: "Merkeze Erişin",
            markets: "Hedef Pazarlar",
            compliance: "Uyumluluk",
            actionRequired: "Eylem gerekli: Görünürlüğünüzü etkinleştirmek için ilk ürününüzü ekleyin.",
            noProducts: "Katalogda ürün yok",
            noProductsDesc: "Uluslararası alanda görünür olmak için ilk ürününüzü ekleyerek başlayın."
        },
        products: {
            title: "Uluslararası Envanter",
            subtitle: "İhracat kataloğunuzu yönetin",
            addProduct: "Bir ürün ekle",
            approvalRequired: "Ürün ekleyebilmeniz için hesabınızın bir yönetici tarafından onaylanması gerekir."
        },
        profile: {
            title: "Şirket Profili",
            companyName: "Şirket Adı",
            updateInfo: "Bilgileri güncelle"
        }
    }
};

languages.forEach(lang => {
    const filePath = path.join(localesDir, lang, 'translation.json');
    try {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(rawData);

        data.producer_dashboard = producerDashboardTranslations[lang];

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`Updated ${lang}/translation.json successfully.`);
    } catch (err) {
        console.error(`Error processing ${lang}:`, err);
    }
});
