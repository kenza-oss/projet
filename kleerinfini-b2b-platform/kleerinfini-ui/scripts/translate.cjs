const fs = require('fs');
const path = require('path');
const { translate } = require('@vitalets/google-translate-api');

// Chemins vers les fichiers
const localesDir = path.join(__dirname, '../src/locales');
const sourceLang = 'fr';
const targetLangs = ['en', 'ar', 'es', 'tr', 'it'];

const sourcePath = path.join(localesDir, sourceLang, 'translation.json');
const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));

// Fonction pour traduire tout un objet récursivement
async function translateObject(obj, lang) {
  const result = {};

  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      result[key] = await translateObject(obj[key], lang);
    } else {
      const text = obj[key];
      try {
        const res = await translate(text, { to: lang });
        result[key] = res.text;
      } catch (err) {
        console.error(`Erreur lors de la traduction "${text}" → ${lang}:`, err.message);
        result[key] = text; // fallback
      }
    }
  }

  return result;
}

// Traduire et enregistrer dans les fichiers des langues cibles
(async () => {
  for (const lang of targetLangs) {
    const translated = await translateObject(sourceData, lang);
    const langDir = path.join(localesDir, lang);
    if (!fs.existsSync(langDir)) fs.mkdirSync(langDir, { recursive: true });

    const targetPath = path.join(langDir, 'translation.json');
    fs.writeFileSync(targetPath, JSON.stringify(translated, null, 2), 'utf-8');

    console.log(`✅ Fichier de traduction généré : ${targetPath}`);
  }
})();
