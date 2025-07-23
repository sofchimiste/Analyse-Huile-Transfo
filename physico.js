function analyserPhysico() {
    const seuilsParType = {
        "moins_72": { claquage: 40, dissipation: 0.10, acidite: 0.15, eau: 30, viscosite: 10, aspect: "Limpide" },
        "72_170": { claquage: 50, dissipation: 0.10, acidite: 0.10, eau: 20, viscosite: 10, aspect: "Limpide" },
        "170_400": { claquage: 60, dissipation: 0.10, acidite: 0.10, eau: 15, viscosite: 10, aspect: "Limpide" },
        "plus_400": { claquage: 60, dissipation: 0.10, acidite: 0.10, eau: 15, viscosite: 10, aspect: "Limpide" }
    };

    const typeTransfo = document.getElementById("typeTransfo").value;
    const seuils = seuilsParType[typeTransfo];

    const nom = document.getElementById("nomTransfo").value;
    const dateEch = document.getElementById("dateEchantillon").value;
    const dateAna = document.getElementById("dateAnalyse").value;

    const couleur = document.getElementById("couleur").value;
    const aspect = document.getElementById("aspect").value;
    const claquage = parseFloat(document.getElementById("claquage").value);
    const dissipation = parseFloat(document.getElementById("dissipation").value);
    const acidite = parseFloat(document.getElementById("acidite").value);
    const eau = parseFloat(document.getElementById("eau").value);
    const viscosite = parseFloat(document.getElementById("viscosite").value);

    let resultats = `<p><strong>🛠️ Analyse du transformateur :</strong> ${nom} | Type : ${document.getElementById("typeTransfo").selectedOptions[0].text} | Échantillon : ${dateEch} | Analyse : ${dateAna}</p>`;
    resultats += "<table class='resultats-table'><tr><th>Paramètre</th><th>Valeur</th><th>Limite</th><th>Interprétation</th></tr>";

    let nonConforme = false;

    function ligne(param, valeur, limite, interpretation) {
        resultats += `<tr><td>${param}</td><td>${valeur}</td><td>${limite}</td><td>${interpretation}</td></tr>`;
    }

    ligne("Couleur", couleur, "-", "Observation visuelle");
    if (aspect !== seuils.aspect) { ligne("Aspect", aspect, seuils.aspect, "⚠️ Non conforme (huile trouble)"); nonConforme = true; } else { ligne("Aspect", aspect, seuils.aspect, "✅ Conforme"); }
    if (claquage < seuils.claquage) { ligne("Tension de Claquage", claquage, seuils.claquage, "⛔ Faible → filtration ou remplacement conseillé"); nonConforme = true; } else { ligne("Tension de Claquage", claquage, seuils.claquage, "✅ Conforme"); }
    if (dissipation > seuils.dissipation) { ligne("Facteur de Dissipation", dissipation, seuils.dissipation, "⛔ Élevé → vérifier isolation"); nonConforme = true; } else { ligne("Facteur de Dissipation", dissipation, seuils.dissipation, "✅ Conforme"); }
    if (acidite > seuils.acidite) { ligne("Indice d’Acidité", acidite, seuils.acidite, "⛔ Élevé → régénération nécessaire"); nonConforme = true; } else { ligne("Indice d’Acidité", acidite, seuils.acidite, "✅ Conforme"); }
    if (eau > seuils.eau) { ligne("Teneur en Eau", eau, seuils.eau, "⛔ Élevée → séchage requis"); nonConforme = true; } else { ligne("Teneur en Eau", eau, seuils.eau, "✅ Conforme"); }
    if (viscosite > seuils.viscosite) { ligne("Viscosité à 40°C", viscosite, seuils.viscosite, "⛔ Élevée → fluide à contrôler"); nonConforme = true; } else { ligne("Viscosité à 40°C", viscosite, seuils.viscosite, "✅ Conforme"); }

    resultats += "</table>";
    document.getElementById("resultatsPhysico").innerHTML = resultats;
    document.getElementById("analyseResultats").style.display = "block";

    const conclusion = nonConforme
        ? `<p style='color:red; font-weight:bold;'>⚠️ L'huile présente des non-conformités pour un transformateur de type : <u>${document.getElementById("typeTransfo").selectedOptions[0].text}</u>. Des actions sont nécessaires (filtration, séchage, remplacement...)</p>`
        : `<p style='color:green; font-weight:bold;'>✅ L'huile est conforme aux spécifications recommandées pour le type de transformateur sélectionné.</p>`;

    document.getElementById("conclusionPhysico").innerHTML = conclusion;
}

function exportPDF(divId, filename) {
    const element = document.getElementById(divId);
    if (!element || element.innerText.trim() === '' || getComputedStyle(element).display === 'none') {
        alert("⚠️ Aucun résultat à exporter. Veuillez effectuer l’analyse d'abord.");
        return;
    }

    element.style.display = 'block';

    const opt = {
        margin: 10,
        filename: filename,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    setTimeout(() => {
        html2pdf().set(opt).from(element).save();
    }, 300);
}

function exportTXT(divId, filename) {
    const text = document.getElementById(divId).innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
