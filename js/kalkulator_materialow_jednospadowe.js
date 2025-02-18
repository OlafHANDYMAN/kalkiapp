document.addEventListener("DOMContentLoaded", function() {

  /***** FUNKCJE OPTIMALIZACJI CIĘCIA BELEK *****/
  function bestSubset(pieces, beamLength, margin) {
    let best = { combination: [], total: 0 };
    function rec(index, currentCombination, currentSum) {
      if (currentSum > beamLength) return;
      if (currentSum > best.total) {
        best = { combination: currentCombination.slice(), total: currentSum };
      }
      for (let i = index; i < pieces.length; i++) {
        currentCombination.push(pieces[i]);
        rec(i + 1, currentCombination, currentSum + pieces[i] + margin);
        currentCombination.pop();
      }
    }
    rec(0, [], 0);
    return best;
  }

  function optimizeCutting(pieces, beamLength, margin) {
    let beams = [];
    let remainingPieces = pieces.slice();
    while (remainingPieces.length > 0) {
      let best = bestSubset(remainingPieces, beamLength, margin);
      if (best.combination.length === 0) break;
      beams.push(best);
      for (let i = 0; i < best.combination.length; i++) {
        let piece = best.combination[i];
        let idx = remainingPieces.indexOf(piece);
        if (idx !== -1) {
          remainingPieces.splice(idx, 1);
        }
      }
    }
    return beams;
  }

  /***** FUNKCJA OBLICZEŃ "WYNIK" *****/
  function obliczMaterialy() {
    const szerokosc = parseFloat(document.getElementById('szerokosc').value);
    const glebokosc = parseFloat(document.getElementById('glebokosc').value);
    
    const wymiar_slupy_front = parseFloat(document.getElementById('wymiar_slupy_front').value);
    const ilosc_slupy_front = parseInt(document.getElementById('ilosc_slupy_front').value);
    
    const wymiar_slupy_boczne = parseFloat(document.getElementById('wymiar_slupy_boczne').value);
    const ilosc_slupy_boczne = parseInt(document.getElementById('ilosc_slupy_boczne').value);
    
    const wypust_boczny = parseFloat(document.getElementById('wypust_boczny').value);
    const wypust_okapowy = parseFloat(document.getElementById('wypust_okapowy').value);
    const wypust_gorny = parseFloat(document.getElementById('wypust_gorny').value);
    
    const typ = document.querySelector('input[name="typ_konstrukcji"]:checked').value;
    
    const przekroj_slupy_str = document.getElementById('input_przekroj_slupy').value;
    const przekroj_slupy = przekroj_slupy_str.split("x").map(x => parseFloat(x));
    
    const przekroj_platwie_str = document.getElementById('input_przekroj_platwie').value;
    const przekroj_platwie = przekroj_platwie_str.split("x").map(x => parseFloat(x));
    
    const przekroj_k = document.getElementById('przekroj_k').value.split("x").map(x => parseFloat(x));
    
    const platwieDlugosc = szerokosc + (wypust_boczny * 2);
    const platwieBoczneDlugosc = glebokosc;
    
    const effectiveGlebokosc = glebokosc + wypust_okapowy + wypust_gorny;
    const dlugoscKrokwi = Math.sqrt(Math.pow(effectiveGlebokosc, 2) + Math.pow(wymiar_slupy_boczne - wymiar_slupy_front, 2));
    
    const rozstawKrokwi = Math.min(70, szerokosc / Math.ceil(szerokosc / 70));
    const iloscKrokwi = Math.ceil(szerokosc / rozstawKrokwi) + 1;
    
    // Przeliczamy przekrój krokwi z cm² na m² (dzielimy przez 10 000)
    const objKrokwi = iloscKrokwi * ((przekroj_k[0] * przekroj_k[1]) / 10000) * (dlugoscKrokwi / 100);
    const cenaKrokwi = objKrokwi * 1970;
    
    let segmentLength, multiplierBelki;
    if (typ === "KVH") {
      segmentLength = 1300;
      multiplierBelki = 2530;
    } else {
      segmentLength = 1200;
      multiplierBelki = 3900;
    }
    
    const belkiArray = [
      ...Array(ilosc_slupy_front).fill(wymiar_slupy_front),
      ...Array(ilosc_slupy_boczne).fill(wymiar_slupy_boczne),
      platwieDlugosc, platwieDlugosc,
      platwieBoczneDlugosc, platwieBoczneDlugosc
    ];
    
    const margin = 10;
    const beams = optimizeCutting(belkiArray, segmentLength, margin);
    
    const purchasedLength = beams.length * segmentLength;
    const objBelkiFull = (purchasedLength / 100) * ((przekroj_platwie[0] / 100) * (przekroj_platwie[1] / 100));
    const cenaBelki = objBelkiFull * multiplierBelki;
    
    let podzialHTML = beams.map((beam, index) => {
      let used = beam.combination.map(piece => piece + margin);
      let leftover = segmentLength - beam.total;
      return `<p><strong>Belka ${index + 1}:</strong> ${used.join(' cm / ')} cm / <span style="color:red;">Odpad: ${leftover} cm</span></p>`;
    }).join("\n");
    
    document.getElementById('wynik').innerHTML = `
      <p><strong>Ilość słupów frontowych:</strong> <span style="color: white;">${ilosc_slupy_front} szt. o dlugosci ${wymiar_slupy_front} cm</span></p>
      <p><strong>Ilość słupów bocznych:</strong> <span style="color: white;">${ilosc_slupy_boczne} szt. o dlugosci ${wymiar_slupy_boczne} cm</span></p>
      <p><strong>Płatwie:</strong> <span style="color: white;">2 szt. o dlugosci ${platwieDlugosc} cm</span></p>
      <p><strong>Płatwie boczne:</strong> <span style="color: white;">2 szt. o dlugosci ${platwieBoczneDlugosc} cm</span></p>
      <p><strong>Ilość krokwi:</strong> <span style="color: white;">${iloscKrokwi} szt. o dlugosci ${dlugoscKrokwi.toFixed(2)} cm</span></p>
      <p><strong>Objetosc krokwi:</strong> <span style="color: white;">${objKrokwi.toFixed(3)} m³</span></p>
      <p><strong>Koszt krokwi:</strong> <span style="color: white;">${cenaKrokwi.toFixed(2)} zl</span></p>
      <p><strong>Objetosc belek (slupy + platwie) – zakupione w pelnych dlugosciach:</strong> <span style="color: white;">${objBelkiFull.toFixed(3)} m³</span></p>
      <p><strong>Koszt belek:</strong> <span style="color: white;">${cenaBelki.toFixed(2)} zl</span></p>
      <p><strong>Koszt calkowity:</strong> <span style="color: white;">${(cenaKrokwi + cenaBelki).toFixed(2)} zl</span></p>
      <h3>Podzial belek (${typ} - ${segmentLength/100} m odcinki):</h3>
      ${podzialHTML}
      <button id="generate-pdf-wynik">Wygeneruj PDF (Wynik)</button>
    `;
    
    window.calculatorResults = {
      slupyFront: `${ilosc_slupy_front} szt. o dlugosci ${wymiar_slupy_front} cm`,
      slupyBoczne: `${ilosc_slupy_boczne} szt. o dlugosci ${wymiar_slupy_boczne} cm`,
      platwie: `2 szt. o dlugosci ${platwieDlugosc} cm`,
      platwieBoczne: `2 szt. o dlugosci ${platwieBoczneDlugosc} cm`,
      krokwi: `${iloscKrokwi} szt. o dlugosci ${dlugoscKrokwi.toFixed(2)} cm`,
      objKrokwi: `${objKrokwi.toFixed(3)} m³`,
      kosztKrokwi: `${cenaKrokwi.toFixed(2)} zl`,
      objBelki: `${objBelkiFull.toFixed(3)} m³`,
      kosztBelki: `${cenaBelki.toFixed(2)} zl`,
      kosztCalkowity: `${(cenaKrokwi + cenaBelki).toFixed(2)} zl`,
      podzial: podzialHTML,
      typ: typ,
      segmentLength: segmentLength
    };
    
    document.getElementById('generate-pdf-wynik').addEventListener('click', generatePDF);
  }

  /***** FUNKCJA GENERUJĄCA PDF (Wynik) *****/
  function generatePDF() {
    console.log("Generating PDF triggered");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "cm", format: "a4" });
    const pageWidth = 21;
    
    function removeDiacritics(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    
    doc.setFont("helvetica", "normal");
    
    if (window.logoData) {
      let img = new Image();
      img.onload = function() {
        let ratio = img.naturalWidth / img.naturalHeight;
        let logoWidth = pageWidth * 0.2;
        let logoHeight = logoWidth / ratio;
        doc.addImage(window.logoData, 'PNG', (pageWidth - logoWidth) / 2, 0.3, logoWidth, logoHeight);
        finishPdfGeneration();
      };
      img.onerror = function() {
        finishPdfGeneration();
      };
      img.src = window.logoData;
    } else {
      finishPdfGeneration();
    }
    
    function finishPdfGeneration() {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      let headerText = removeDiacritics("Wynik obliczen - Kalkulator Materialow");
      doc.setTextColor(210, 180, 140);
      doc.text(headerText, pageWidth/2, 5, { align: "center" });
      
      let currentY = 6.5;
      const lineSpacing = 0.8;
      
      function printResult(label, value) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 165, 0);
        let cleanLabel = removeDiacritics(label);
        doc.text(cleanLabel, 1, currentY);
        let labelWidth = doc.getTextWidth(cleanLabel);
        doc.setTextColor(0, 0, 0);
        let cleanValue = removeDiacritics(value);
        doc.text(cleanValue, 1 + labelWidth + 0.3, currentY);
        currentY += lineSpacing;
      }
      
      if (!window.calculatorResults) {
        alert("Brak wynikow kalkulatora. Najpierw oblicz wyniki.");
        return;
      }
      const res = window.calculatorResults;
      
      printResult("Ilosc slupow frontowych:", res.slupyFront);
      printResult("Ilosc slupow bocznych:", res.slupyBoczne);
      printResult("Platwie:", res.platwie);
      printResult("Platwie boczne:", res.platwieBoczne);
      printResult("Ilosc krokwi:", res.krokwi);
      printResult("Objetosc krokwi:", res.objKrokwi);
      printResult("Koszt krokwi:", res.kosztKrokwi);
      printResult("Objetosc belek (slupy + platwie):", res.objBelki);
      printResult("Koszt belek:", res.kosztBelki);
      printResult("Koszt calkowity:", res.kosztCalkowity);
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(210, 180, 140);
      let sectionHeader = removeDiacritics(`Podzial belek (${res.typ} - ${res.segmentLength/100} m odcinki):`);
      doc.text(sectionHeader, 1, currentY);
      currentY += lineSpacing;
      doc.setTextColor(0, 0, 0);
      
      let podzialClean = res.podzial.replace(/<[^>]+>/g, "");
      let podzialLines = podzialClean.split("\n");
      podzialLines.forEach(line => {
        if (line.trim() === "") return;
        let colonIndex = line.indexOf(":");
        if (colonIndex !== -1) {
          let label = line.substring(0, colonIndex + 1);
          let dims = line.substring(colonIndex + 1).trim();
          doc.setFont("helvetica", "bold");
          doc.setTextColor(210, 180, 140);
          doc.text(removeDiacritics(label), 1, currentY);
          let labelWidth = doc.getTextWidth(removeDiacritics(label));
          doc.setTextColor(0, 0, 0);
          doc.text(removeDiacritics(dims), 1 + labelWidth + 0.3, currentY);
        } else {
          doc.text(removeDiacritics(line), 1, currentY);
        }
        currentY += 1.0; // zwiększony odstęp między belkami
        if (currentY > 27) {
          doc.addPage();
          currentY = 2;
        }
      });
      
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        const footerText = `Strona ${i} z ${pageCount}`;
        doc.text(footerText, pageWidth - 1 - doc.getTextWidth(footerText), 29);
      }
      
      doc.save("Kalkulator_Materialow.pdf");
    }
  }
  
  window.obliczMaterialy = obliczMaterialy;
  
  /***** OBSŁUGA INTERFEJSU – DROPDOWNY I TRYB WPISANIA WLASNEGO PRZEKROJU *****/
  document.querySelectorAll('.option').forEach(function(button) {
    button.addEventListener('click', function() {
      var targetId = this.getAttribute('data-target');
      var value = this.getAttribute('data-value');
      var detailsElem = document.getElementById(targetId);
      detailsElem.querySelector('summary').textContent = value;
      if (targetId === 'dropdown_slupy') {
        document.getElementById('input_przekroj_slupy').value = value;
      } else if (targetId === 'dropdown_platwie') {
        document.getElementById('input_przekroj_platwie').value = value;
      }
      detailsElem.open = false;
    });
  });
  
  var toggleSlupy = document.getElementById('toggle_custom_slupy');
  if (toggleSlupy) {
    toggleSlupy.addEventListener('click', function() {
      var dropdownWrapper = document.getElementById('dropdown_wrapper_slupy');
      var customInputWrapper = document.getElementById('custom_input_slupy');
      if (customInputWrapper.classList.contains('hidden')) {
        dropdownWrapper.classList.add('hidden');
        customInputWrapper.classList.remove('hidden');
        toggleSlupy.textContent = '×';
        toggleSlupy.title = 'Przełącz na wybór przekroju';
      } else {
        customInputWrapper.classList.add('hidden');
        dropdownWrapper.classList.remove('hidden');
        toggleSlupy.textContent = '•';
        toggleSlupy.title = 'Przełącz na wpisanie własnego przekroju';
        var customValue = document.getElementById('custom_slupy').value;
        if (customValue) {
          document.getElementById('input_przekroj_slupy').value = customValue;
          document.getElementById('dropdown_slupy').querySelector('summary').textContent = customValue;
        }
      }
    });
  }
  
  var togglePlatwie = document.getElementById('toggle_custom_platwie');
  if (togglePlatwie) {
    togglePlatwie.addEventListener('click', function() {
      var dropdownWrapper = document.getElementById('dropdown_wrapper_platwie');
      var customInputWrapper = document.getElementById('custom_input_platwie');
      if (customInputWrapper.classList.contains('hidden')) {
        dropdownWrapper.classList.add('hidden');
        customInputWrapper.classList.remove('hidden');
        togglePlatwie.textContent = '×';
        togglePlatwie.title = 'Przełącz na wybór przekroju';
      } else {
        customInputWrapper.classList.add('hidden');
        dropdownWrapper.classList.remove('hidden');
        togglePlatwie.textContent = '•';
        togglePlatwie.title = 'Przełącz na wpisanie własnego przekroju';
        var customValue = document.getElementById('custom_platwie').value;
        if (customValue) {
          document.getElementById('input_przekroj_platwie').value = customValue;
          document.getElementById('dropdown_platwie').querySelector('summary').textContent = customValue;
        }
      }
    });
  }
  
  document.getElementById('custom_slupy').addEventListener('blur', function() {
    document.getElementById('input_przekroj_slupy').value = this.value;
  });
  document.getElementById('custom_platwie').addEventListener('blur', function() {
    document.getElementById('input_przekroj_platwie').value = this.value;
  });
});
