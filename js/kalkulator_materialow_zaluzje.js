document.addEventListener("DOMContentLoaded", function() {
  console.log("Kalkulator Zabudowy Żaluzjami: DOM wczytany");

  // Zamienia przecinek na kropkę (np. "4,5x95" -> "4.5x95")
  function parseFrameInput(input) {
    return input.replace(',', '.');
  }

  // Oblicza liczbę systemów dla danej wysokości (dla jednej sekcji).
  // Pierwszy system = 51.5 cm, każdy kolejny +50 cm
  // Zwraca co najmniej 1.
  function calcSystemsForHeight(h) {
    if (h <= 51.5) return 1;
    let val = (h - 51.5) / 50;
    // Zawsze zaokrąglamy w górę i dodajemy 1.
    return Math.ceil(val) + 1;
  }

  // Liczba desek w pionie (dla jednej sekcji), zakładając 1 deska = 10 cm i -1 cm zapasu
  function calcDesksForHeight(h) {
    return Math.floor((h - 1) / 10);
  }

  document.getElementById('obliczZaluzjeBtn').addEventListener('click', function() {
    const szerokosc = parseFloat(document.getElementById('szerokosc').value);
    const wysokosc = parseFloat(document.getElementById('wysokosc').value);

    const ramkaInput = parseFrameInput(document.getElementById('przekroj_ramki').value);
    const ramkaParts = ramkaInput.split('x').map(x => parseFloat(x));
    if (ramkaParts.length < 2 || isNaN(ramkaParts[0])) {
      alert("Podaj poprawny przekrój ramki, np. 4.5x95");
      return;
    }
    const ramkaGrubosc = ramkaParts[0]; // np. 4.5

    // Wysokość "pusta" w ramce (po odjęciu górnej i dolnej kantówki)
    const wysokoscPusta = Math.max(1, (wysokosc - 2 * ramkaGrubosc));
    console.log("wysokoscPusta:", wysokoscPusta);

    // --- KLUCZOWA ZMIANA ---
    // Do obliczeń liczby systemów używamy systemCalcHeight = wyskoscPusta - 4.5
    // (w Twoim przykładzie 215 -> 206 -> 201.5)
    const systemCalcHeight = wysokoscPusta - 4.5;
    // Liczba systemów dla jednej sekcji
    const systemsOneSection = calcSystemsForHeight(systemCalcHeight);
    // ----------------------------------

    // Będziemy testować liczbę sekcji 1..5 oraz deskLen ∈ [80,100,120]
    const deskOptions = [80, 100, 120];
    let bestResult = null;

    for (let s = 1; s <= 5; s++) {
      // netWidthOneSection = (szerokosc - (s+1)*ramkaGrubosc - s*3) / s
      let netWidthOneSection = (szerokosc - ((s+1)*ramkaGrubosc) - (s*3)) / s;
      if (netWidthOneSection <= 0) continue;

      // Łączna liczba systemów = systemsOneSection * s
      const totalSystems = systemsOneSection * s;

      // Liczba desek w pionie (dla jednej sekcji)
      const deskCountOneSection = calcDesksForHeight(wysokoscPusta);
      // Łączna liczba desek (dla pionu)
      // Wybór desek 80/100/120 dotyczy "czy netWidthOneSection <= deskLen"?
      // Jeżeli netWidthOneSection > deskLen -> pomijamy wariant
      for (let dlugDesek of deskOptions) {
        if (netWidthOneSection > dlugDesek) {
          // Deska za krótka (one section needed > deskLen)
          continue;
        }
        const totalDeski = deskCountOneSection * s;

        let current = {
          sections: s,
          deskLen: dlugDesek,
          netWidthOneSection,
          systemsOneSection,
          totalSystems,
          deskCountOneSection,
          totalDeski
        };

        // Porównanie z bestResult
        if (!bestResult) {
          bestResult = current;
        } else {
          if (current.totalSystems < bestResult.totalSystems) {
            bestResult = current;
          } else if (current.totalSystems === bestResult.totalSystems) {
            if (current.totalDeski < bestResult.totalDeski) {
              bestResult = current;
            }
          }
        }
      }
    }

    if (!bestResult) {
      document.getElementById('wynikZaluzje').innerHTML = "<p>Brak możliwego wariantu!</p>";
      return;
    }

    // Obliczenie kantówek
    // - Poziome: 2 szt. o długości = szerokosc
    const kantPoziomeCount = 2;
    const kantPoziomeLength = szerokosc;

    // - Pionowe: bestResult.sections+1 szt., długość = (deskCountOneSection * 10) + 2.5
    const kantPionCount = bestResult.sections + 1;
    const kantPionLength = (bestResult.deskCountOneSection * 10) + 2.5;

    const wynikHTML = `
      <p><strong>Liczba sekcji:</strong> ${bestResult.sections}</p>
      <p><strong>Długość używanych desek:</strong> ${bestResult.deskLen} cm</p>
      <p><strong>Ilość systemów:</strong> ${bestResult.totalSystems} (po ${bestResult.systemsOneSection} / sekcję)</p>
      <p><strong>Deseczki 80cm:</strong> ${bestResult.deskLen === 80 ? bestResult.totalDeski : 0} szt.</p>
      <p><strong>Deseczki 100cm:</strong> ${bestResult.deskLen === 100 ? bestResult.totalDeski : 0} szt.</p>
      <p><strong>Deseczki 120cm:</strong> ${bestResult.deskLen === 120 ? bestResult.totalDeski : 0} szt.</p>
      <p><strong>Kantówki poziome:</strong> 2 szt. o długości ${kantPoziomeLength} cm</p>
      <p><strong>Kantówki pionowe:</strong> ${kantPionCount} szt. o długości ${kantPionLength.toFixed(1)} cm</p>
    `;
    document.getElementById('wynikZaluzje').innerHTML = wynikHTML;

    console.log("Najlepszy wariant:", bestResult);
  });

  // Przycisk "Pobierz rysunek techniczny"
  document.getElementById('pobierzRysunekBtn').addEventListener('click', function() {
    alert("Funkcja pobierania rysunku technicznego zostanie dodana później.");
  });
});
