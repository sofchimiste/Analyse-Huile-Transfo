function analyserGaz() {
    const requiredIds = [
        "nomTransfo", "typeTransfo", "dateEchantillon", "dateAnalyse",
        "h2", "co", "ch4", "c2h6", "c2h4", "c2h2"
    ];

    for (let id of requiredIds) {
        const el = document.getElementById(id);
        if (!el || !el.value) {
            alert("⚠️ Veuillez remplir tous les champs avant d'analyser.");
            return;
        }
    }

    const seuilsParType = {
        "moins_72": { h2: 100, co: 350, ch4: 120, c2h6: 65, c2h4: 50, c2h2: 35 },
        "72_170": { h2: 100, co: 350, ch4: 120, c2h6: 65, c2h4: 50, c2h2: 35 },
        "170_400": { h2: 100, co: 350, ch4: 120, c2h6: 65, c2h4: 50, c2h2: 35 },
        "plus_400": { h2: 100, co: 350, ch4: 120, c2h6: 65, c2h4: 50, c2h2: 35 }
    };

    const typeTransfo = document.getElementById("typeTransfo").value;
    const seuils = seuilsParType[typeTransfo];

    const nom = document.getElementById("nomTransfo").value;
    const dateEch = document.getElementById("dateEchantillon").value;
    const dateAna = document.getElementById("dateAnalyse").value;

    const h2 = parseFloat(document.getElementById("h2").value);
    const co = parseFloat(document.getElementById("co").value);
    const ch4 = parseFloat(document.getElementById("ch4").value);
    const c2h6 = parseFloat(document.getElementById("c2h6").value);
    const c2h4 = parseFloat(document.getElementById("c2h4").value);
    const c2h2 = parseFloat(document.getElementById("c2h2").value);

    let resultats = `<p><strong>🛠️ Analyse du transformateur :</strong> ${nom} | Type : ${document.getElementById("typeTransfo").selectedOptions[0].text} | Échantillon : ${dateEch} | Analyse : ${dateAna}</p>`;
    resultats += "<table class='resultats-table'><tr><th>Gaz</th><th>Valeur</th><th>Limite</th><th>Interprétation</th></tr>";

    let nonConforme = false;

    function ligne(gaz, valeur, limite, interpretation) {
        resultats += `<tr><td>${gaz}</td><td>${valeur}</td><td>${limite}</td><td>${interpretation}</td></tr>`;
    }

    if (h2 > seuils.h2) { ligne("Hydrogène (H₂)", h2, seuils.h2, "⛔ Décharge partielle"); nonConforme = true; } else { ligne("Hydrogène (H₂)", h2, seuils.h2, "✅ Conforme"); }
    if (co > seuils.co) { ligne("Monoxyde de Carbone (CO)", co, seuils.co, "⛔ Décomposition papier isolant"); nonConforme = true; } else { ligne("Monoxyde de Carbone (CO)", co, seuils.co, "✅ Conforme"); }
    if (ch4 > seuils.ch4) { ligne("Méthane (CH₄)", ch4, seuils.ch4, "⛔ Décharges partielles"); nonConforme = true; } else { ligne("Méthane (CH₄)", ch4, seuils.ch4, "✅ Conforme"); }
    if (c2h6 > seuils.c2h6) { ligne("Éthane (C₂H₆)", c2h6, seuils.c2h6, "⛔ Défaut thermique faible énergie"); nonConforme = true; } else { ligne("Éthane (C₂H₆)", c2h6, seuils.c2h6, "✅ Conforme"); }
    if (c2h4 > seuils.c2h4) { ligne("Éthylène (C₂H₄)", c2h4, seuils.c2h4, "⛔ Surchauffe locale"); nonConforme = true; } else { ligne("Éthylène (C₂H₄)", c2h4, seuils.c2h4, "✅ Conforme"); }
    if (c2h2 > seuils.c2h2) { ligne("Acétylène (C₂H₂)", c2h2, seuils.c2h2, "⛔ Arc électrique (défaut grave)"); nonConforme = true; } else { ligne("Acétylène (C₂H₂)", c2h2, seuils.c2h2, "✅ Conforme"); }

    resultats += "</table>";
    document.getElementById("resultatsGaz").innerHTML = resultats;
    document.getElementById("analyseResultatsGaz").style.display = "block";

    const conclusion = nonConforme
        ? `<p style='color:red; font-weight:bold;'>⚠️ Des concentrations de gaz anormales ont été détectées pour un transformateur de type : <u>${document.getElementById("typeTransfo").selectedOptions[0].text}</u>. Analyse approfondie et actions correctives recommandées.</p>`
        : `<p style='color:green; font-weight:bold;'>✅ Les concentrations en gaz sont conformes pour le type de transformateur sélectionné. Aucun défaut significatif détecté.</p>`;

    document.getElementById("conclusionGaz").innerHTML = conclusion;
}

function exportPDF(divId, filename) {
    const element = document.getElementById(divId);
    if (!element || element.innerHTML.trim() === '' || element.style.display === 'none') {
        alert("⚠️ Aucun résultat à exporter. Veuillez effectuer l’analyse d'abord.");
        return;
    }
    element.style.display = 'block';
    const opt = {
        margin: 10,
        filename: filename,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}

function exportTXT(divId, filename) {
    const text = document.getElementById(divId).innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
