const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const languages = ['fr', 'en', 'es', 'ar', 'tr', 'it'];

const getTranslations = (lang) => {
    switch (lang) {
        case 'fr': return {
            cosmetics: { name: "Produits Cosmétiques", desc: "Produits de beauté naturels certifiés." },
            perfumes: { name: "Parfums & Eaux de Parfum", desc: "Essences délicates et aromatiques d'exception." },
            fishery: { name: "Produits de la Pêche", desc: "Poissons, crustacés et aquaculture certifiée." },
            pharma: { name: "Produits Pharmaceutiques", desc: "Médicaments et produits de santé." },
            agri_processed: { name: "Produits Agroalimentaires", desc: "Produits alimentaires transformés et conditionnés." },
            agri_raw: { name: "Produits Agricoles", desc: "Fruits, légumes, céréales du terroir." },
            crafts: { name: "Artisanat d'Art", desc: "Savoir-faire et créations manuelles." },
            wood: { name: "Bois & Dérivés", desc: "Produits du bois de haute qualité." },
            electrical: { name: "Équipements Électriques", desc: "Installations et câblages." },
            mechanical: { name: "Industrie Mécanique", desc: "Pièces et assemblages de précision." },
            textile: { name: "Textile & Cuir", desc: "Mode, tissus et confection." },
            construction: { name: "Construction & BTP", desc: "Matériaux et équipements de bâtisse." },
            mining_metallurgy: { name: "Mines & Métallurgie", desc: "Minerais, aciers et dérivés." },
            hydraulic_systems: { name: "Systèmes Hydrauliques", desc: "Irrigation, plomberie et réseaux." },
            solar_energy: { name: "Solutions Solaires", desc: "Panneaux photovoltaïques et énergie propre." },
            plastic_ppe: { name: "Plastique & EPI", desc: "Solutions de conditionnement et protection." },
            juice_drinks: { name: "Jus & Boissons", desc: "Boissons rafraîchissantes et eaux minérales." },
            industrial: { name: "Équipement Industriel", desc: "Machines de production et lignes d'assemblage." },
            furniture_decoration: { name: "Meubles & Décoration", desc: "Mobilier design et aménagement." },
            jewelry: { name: "Bijouterie", desc: "Joaillerie et parures d'exception." },
            dairy: { name: "Produits Laitiers", desc: "Laits, fromages et dérivés." },
            spices: { name: "Épices & Thés", desc: "Saveurs et aromates d'Orient." },
            appliances: { name: "Électroménager", desc: "Équipements de maison." }
        };
        case 'en': return {
            cosmetics: { name: "Cosmetic Products", desc: "Certified natural beauty products." },
            perfumes: { name: "Perfumes & Fragrances", desc: "Exceptional delicate aromatic essences." },
            fishery: { name: "Fishery Products", desc: "Certified fish, crustaceans and aquaculture." },
            pharma: { name: "Pharmaceuticals", desc: "Medicines and health products." },
            agri_processed: { name: "Processed Food", desc: "Processed and packaged food products." },
            agri_raw: { name: "Agricultural Products", desc: "Local fruits, vegetables, and cereals." },
            crafts: { name: "Craftsmanship & Art", desc: "Handmade creations and know-how." },
            wood: { name: "Wood & Derivatives", desc: "High-quality wood products." },
            electrical: { name: "Electrical Equipment", desc: "Installations and wiring." },
            mechanical: { name: "Mechanical Industry", desc: "Precision parts and assemblies." },
            textile: { name: "Textile & Leather", desc: "Fashion, fabrics, and tailoring." },
            construction: { name: "Construction Materials", desc: "Building materials and equipment." },
            mining_metallurgy: { name: "Mining & Metallurgy", desc: "Ores, steel, and derivatives." },
            hydraulic_systems: { name: "Hydraulic Systems", desc: "Irrigation, plumbing, and networks." },
            solar_energy: { name: "Solar Solutions", desc: "Photovoltaic panels and clean energy." },
            plastic_ppe: { name: "Plastic & PPE", desc: "Packaging solutions and protection." },
            juice_drinks: { name: "Juices & Beverages", desc: "Refreshing drinks and mineral waters." },
            industrial: { name: "Industrial Equipment", desc: "Production machines and assembly lines." },
            furniture_decoration: { name: "Furniture & Decor", desc: "Designer furniture and layout." },
            jewelry: { name: "Jewelry", desc: "Exceptional jewelry and adornments." },
            dairy: { name: "Dairy Products", desc: "Milks, cheeses, and derivatives." },
            spices: { name: "Spices & Teas", desc: "Flavors and aromatics." },
            appliances: { name: "Home Appliances", desc: "Household equipment." }
        };
        case 'es': return {
            cosmetics: { name: "Productos Cosméticos", desc: "Productos de belleza naturales certificados." },
            perfumes: { name: "Perfumes y Fragancias", desc: "Excepcionales esencias aromáticas." },
            fishery: { name: "Productos Pesqueros", desc: "Pescados y acuicultura certificada." },
            pharma: { name: "Productos Farmacéuticos", desc: "Medicamentos y productos de salud." },
            agri_processed: { name: "Alimentos Procesados", desc: "Productos alimenticios envasados." },
            agri_raw: { name: "Productos Agrícolas", desc: "Frutas, verduras y cereales locales." },
            crafts: { name: "Artesanía", desc: "Creaciones hechas a mano." },
            wood: { name: "Madera y Derivados", desc: "Productos de madera de alta calidad." },
            electrical: { name: "Equipos Eléctricos", desc: "Instalaciones y cableado." },
            mechanical: { name: "Industria Mecánica", desc: "Piezas de precisión y ensamblajes." },
            textile: { name: "Textiles y Cuero", desc: "Moda y telas." },
            construction: { name: "Materiales de Construcción", desc: "Equipos de construcción." },
            mining_metallurgy: { name: "Minería y Metalurgia", desc: "Minerales y acero." },
            hydraulic_systems: { name: "Sistemas Hidráulicos", desc: "Riego y fontanería." },
            solar_energy: { name: "Soluciones Solares", desc: "Paneles solares y energía limpia." },
            plastic_ppe: { name: "Plásticos y EPP", desc: "Soluciones de embalaje y protección." },
            juice_drinks: { name: "Jugos y Bebidas", desc: "Bebidas refrescantes." },
            industrial: { name: "Equipamiento Industrial", desc: "Máquinas de producción." },
            furniture_decoration: { name: "Muebles y Decoración", desc: "Mobiliario y diseño interior." },
            jewelry: { name: "Joyería", desc: "Joyas excepcionales." },
            dairy: { name: "Productos Lácteos", desc: "Leche y derivados." },
            spices: { name: "Especias y Tés", desc: "Sabores aromáticos." },
            appliances: { name: "Electrodomésticos", desc: "Equipos para el hogar." }
        };
        case 'ar': return {
            cosmetics: { name: "مستحضرات التجميل", desc: "منتجات تجميل طبيعية معتمدة." },
            perfumes: { name: "العطور", desc: "خلاصات عطرية رائعة." },
            fishery: { name: "المنتجات البحرية", desc: "أسماك ومنتجات بحرية معتمدة." },
            pharma: { name: "الصناعات الصيدلانية", desc: "أدوية ومنتجات صحية." },
            agri_processed: { name: "الأغذية المصنعة", desc: "منتجات غذائية جاهزة ومعبأة." },
            agri_raw: { name: "المنتجات الزراعية", desc: "فواكه وخضروات وحبوب محلية." },
            crafts: { name: "الصناعات الحرفية", desc: "إبداعات يدوية وتراثية." },
            wood: { name: "الخشب ومشتقاته", desc: "منتجات خشبية عالية الجودة." },
            electrical: { name: "المعدات الكهربائية", desc: "تركيبات وأسلاك." },
            mechanical: { name: "الصناعة الميكانيكية", desc: "قطع دقيقة ومركبات." },
            textile: { name: "النسيج والجلود", desc: "أزياء وأقمشة." },
            construction: { name: "مواد البناء", desc: "معدات بناء متطورة." },
            mining_metallurgy: { name: "التعدين والصلب", desc: "معادن وحديد صلب." },
            hydraulic_systems: { name: "الأنظمة الهيدروليكية", desc: "شبكات الري والسباكة." },
            solar_energy: { name: "الطاقة الشمسية", desc: "ألواح شمسية وطاقة نظيفة." },
            plastic_ppe: { name: "البلاستيك ومعدات الوقاية", desc: "حلول تعبئة وحماية." },
            juice_drinks: { name: "العصائر والمشروبات", desc: "مشروبات ومياه معدنية." },
            industrial: { name: "المعدات الصناعية", desc: "آلات الإنتاج والتجميع." },
            furniture_decoration: { name: "الأثاث والديكور", desc: "أثاث عصري." },
            jewelry: { name: "المجوهرات", desc: "حلي ومجوهرات راقية." },
            dairy: { name: "منتجات الألبان", desc: "أجبان ومشتقات الحليب." },
            spices: { name: "التوابل والشاي", desc: "توابل ونكهات شرقية." },
            appliances: { name: "الأجهزة الكهرومنزلية", desc: "معدات منزلية متطورة." }
        };
        case 'tr': return {
            cosmetics: { name: "Kozmetik Ürünleri", desc: "Sertifikalı doğal güzellik ürünleri." },
            perfumes: { name: "Parfümler", desc: "Zarif aromatik esanslar." },
            fishery: { name: "Balıkçılık Ürünleri", desc: "Sertifikalı su ürünleri." },
            pharma: { name: "İlaç ve Tıbbi Ürünler", desc: "İlaç ve sağlık ürünleri." },
            agri_processed: { name: "İşlenmiş Gıda", desc: "Paketlenmiş gıda ürünleri." },
            agri_raw: { name: "Tarım Ürünleri", desc: "Yerel sebze ve meyveler." },
            crafts: { name: "El Sanatları", desc: "El yapımı özel tasarımlar." },
            wood: { name: "Ahşap & Türevleri", desc: "Yüksek kaliteli ahşap ürünleri." },
            electrical: { name: "Elektrik Ekipmanları", desc: "Tesisat ve kablolama." },
            mechanical: { name: "Mekanik Sanayi", desc: "Hassas parçalar." },
            textile: { name: "Tekstil ve Deri", desc: "Moda ve kumaşlar." },
            construction: { name: "Yapı Malzemeleri", desc: "Bina ekipmanları." },
            mining_metallurgy: { name: "Madencilik", desc: "Cevher ve çelik." },
            hydraulic_systems: { name: "Hidrolik Sistemler", desc: "Sulama ve ağlar." },
            solar_energy: { name: "Güneş Enerjisi", desc: "Temiz enerji çözümleri." },
            plastic_ppe: { name: "Plastik ve KKD", desc: "Ambalaj ve koruma." },
            juice_drinks: { name: "İçecekler", desc: "Meyve suları ve sular." },
            industrial: { name: "Endüstriyel Ekipman", desc: "Üretim makineleri." },
            furniture_decoration: { name: "Mobilya ve Dekorasyon", desc: "Tasarım mobilyalar." },
            jewelry: { name: "Mücevherat", desc: "Özel takılar." },
            dairy: { name: "Süt Ürünleri", desc: "Peynir ve süt türevleri." },
            spices: { name: "Baharatlar ve Çay", desc: "Aromatik tatlar." },
            appliances: { name: "Ev Aletleri", desc: "Beyaz Eşya." }
        };
        case 'it': return {
            cosmetics: { name: "Prodotti Cosmetici", desc: "Prodotti di bellezza naturali." },
            perfumes: { name: "Profumi", desc: "Essenze aromatiche eccezionali." },
            fishery: { name: "Prodotti Ittici", desc: "Pesce e acquacoltura certificata." },
            pharma: { name: "Prodotti Farmaceutici", desc: "Medicine e prodotti per la salute." },
            agri_processed: { name: "Agroalimentare", desc: "Cibo lavorato e confezionato." },
            agri_raw: { name: "Prodotti Agricoli", desc: "Frutta, verdura del territorio." },
            crafts: { name: "Artigianato", desc: "Creazioni fatte a mano." },
            wood: { name: "Legno e Derivati", desc: "Prodotti in legno di qualità." },
            electrical: { name: "Materiale Elettrico", desc: "Installazioni." },
            mechanical: { name: "Industria Meccanica", desc: "Pezzi di precisione." },
            textile: { name: "Tessile e Pelle", desc: "Moda e tessuti." },
            construction: { name: "Materiali da Costruzione", desc: "Attrezzature edilizie." },
            mining_metallurgy: { name: "Estrazione Mineraria", desc: "Minerali e acciaio." },
            hydraulic_systems: { name: "Sistemi Idraulici", desc: "Irrigazione." },
            solar_energy: { name: "Soluzioni Solari", desc: "Pannelli solari." },
            plastic_ppe: { name: "Plastica e DPI", desc: "Imballaggi." },
            juice_drinks: { name: "Succhi e Bevande", desc: "Bevande rinfrescanti." },
            industrial: { name: "Attrezzature Industriali", desc: "Macchine di produzione." },
            furniture_decoration: { name: "Mobili e Decorazioni", desc: "Arredamento di design." },
            jewelry: { name: "Gioielleria", desc: "Gioielli eccezionali." },
            dairy: { name: "Prodotti Lattiero-caseari", desc: "Latte e formaggi." },
            spices: { name: "Spezie", desc: "Sapori e aromi." },
            appliances: { name: "Elettrodomestici", desc: "Apparecchiature domestiche." }
        };
    }
};

languages.forEach(lang => {
    const filePath = path.join(localesDir, lang, 'translation.json');
    if (fs.existsSync(filePath)) {
        console.log(`Updating ${lang}...`);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (data.categories) {
            data.categories.sectors_dynamic = getTranslations(lang);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        }
    }
});

console.log('Update complete.');
