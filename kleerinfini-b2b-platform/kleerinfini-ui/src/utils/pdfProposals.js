import jsPDF from 'jspdf';

/**
 * Generates a professional PDF presenting Kleer Infini's roadmap for a producer.
 */
export const generatePresentationPDF = (producerProfile, documents = []) => {
    const doc = new jsPDF();
    const company = producerProfile?.company_name || "votre entreprise";

    // Determine state
    const docCount = documents.length;
    let phase = "Phase 1 : Accompagnement & Diagnostic";
    let content = [
        "1. Audit de conformité (ISO, Documents légaux)",
        "2. Préparation du dossier administratif",
        "3. Diagnostic de votre potentiel export"
    ];

    if (docCount >= 2) {
        phase = "Phase 2 : Digitalisation & Visibilité";
        content = [
            "1. Création de votre catalogue digital premium",
            "2. Référencement SEO international sur Kleer Infini",
            "3. Promotion ciblée sur les marchés ZLECAF & Européens"
        ];
    }

    if (docCount >= 4) {
        phase = "Phase 3 : Expansion & B2B Matchmaking";
        content = [
            "1. Mise en relation directe avec acheteurs vérifiés",
            "2. Optimisation des flux logistiques et douaniers",
            "3. Participation aux salons virtuels exclusifs"
        ];
    }

    // Header
    doc.setFillColor(11, 18, 33);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("KLEER INFINI EXPORT", 20, 25);

    // Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text(`Roadmap Stratégique 2026 pour ${company}`, 20, 60);

    // Current State
    doc.setFontSize(14);
    doc.setTextColor(59, 130, 246);
    doc.text(`État actuel : ${phase}`, 20, 75);

    // Body text
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    doc.text("En collaboration avec Kleer Infini, votre parcours d'exportation se structure autour de :", 20, 90);

    let y = 105;
    content.forEach(item => {
        doc.text(`• ${item}`, 25, y);
        y += 10;
    });

    doc.text("Notre mission est de transformer votre potentiel local en succès mondial.", 20, y + 20);

    // Contact
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text("Contact Stratégique : contact@kleer-Infini.dz", 20, 270);
    doc.text(`Date : ${new Date().toLocaleDateString()}`, 160, 270);

    doc.save(`Presentation_KleerInfini_${company.replace(/\s+/g, '_')}.pdf`);
};

/**
 * Generates a PDF of a collaboration idea submitted by the producer.
 */
export const generateIdeaPDF = (producerProfile, ideaText) => {
    const doc = new jsPDF();
    const company = producerProfile?.company_name || "Producteur";
    const name = `${producerProfile?.first_name || ""} ${producerProfile?.last_name || ""}`;

    // Header
    doc.setFillColor(11, 18, 33);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("PROPOSITION DE COLLABORATION", 20, 25);

    // Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Entreprise : ${company}`, 20, 60);
    doc.text(`Responsable : ${name}`, 20, 70);
    doc.text(`Date de soumission : ${new Date().toLocaleDateString()}`, 20, 80);

    // Content
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 90, 190, 90);

    doc.setFontSize(14);
    doc.text("Détails du Projet :", 20, 105);

    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    const splitText = doc.splitTextToSize(ideaText, 170);
    doc.text(splitText, 20, 120);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text("Ce document a été généré via le Dashboard Kleer Infini.", 20, 270);
    doc.text("Veuillez envoyer ce PDF à contact@kleer-Infini.dz", 20, 280);

    doc.save(`Proposition_Collaboration_${company.replace(/\s+/g, '_')}.pdf`);
    return true;
};

/**
 * Generates a ready-to-use collaboration template PDF.
 */
export const generateCollaborationTemplatePDF = (producerProfile) => {
    const doc = new jsPDF();
    const company = producerProfile?.company_name || "votre entreprise";

    // Header
    doc.setFillColor(11, 18, 33);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("MODÈLE DE COLLABORATION", 20, 25);

    // Body
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("Guide de soumission de projet", 20, 60);

    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    let y = 75;
    const lines = [
        "Ce document sert de base pour structurer votre proposition.",
        "Points à inclure dans votre description :",
        "",
        "1. Contexte du projet : Pourquoi souhaitez-vous collaborer ?",
        "2. Objectifs : Quels sont les résultats attendus ?",
        "3. Moyens nécessaires : De quoi avez-vous besoin de la part de Kleer Infini ?",
        "4. Calendrier : Quand souhaitez-vous débuter ?",
        "",
        "Une fois prêt, saisissez ces informations dans votre Dashboard",
        "et utilisez le bouton 'Générer & Envoyer'."
    ];

    lines.forEach(line => {
        doc.text(line, 20, y);
        y += 8;
    });

    doc.save(`Modele_Collaboration_KleerInfini.pdf`);
};
