function obliczRozstawKrokwi() {
    const szerokoscDachu = parseFloat(document.getElementById('szerokosc_dachu').value);
    const gruboscKrokwi = parseFloat(document.getElementById('grubosc_krokwi').value);
    const iloscKrokwi = parseInt(document.getElementById('ilosc_krokwi').value);

    if (isNaN(szerokoscDachu) || isNaN(gruboscKrokwi) || isNaN(iloscKrokwi) || iloscKrokwi < 2) {
        document.getElementById('wynik').innerHTML = "<p style='color: red;'>Wprowadź poprawne wartości.</p>";
        return;
    }

    // Obliczenie poprawnego rozstawu (od środka do środka)
    const przestrzenMiedzy = (szerokoscDachu - gruboscKrokwi) / (iloscKrokwi - 1);
    
    let rozstawPelny = [];
    let aktualnaPozycja = gruboscKrokwi / 2; // Pierwsza krokwia na krawędzi

    for (let i = 0; i < iloscKrokwi; i++) {
        rozstawPelny.push(aktualnaPozycja.toFixed(1) + " cm");
        aktualnaPozycja += przestrzenMiedzy;
    }

    // Wyświetlenie poprawnych wyników
    document.getElementById('wynik').innerHTML = `
        <p><strong>Rozstaw:</strong> ${przestrzenMiedzy.toFixed(1)} cm</p>
        <p><strong>Rozstaw pełny:</strong> ${rozstawPelny.join(" / ")}</p>
    `;
}

// Dodanie event listenera do przycisku
document.getElementById('obliczKrokiew').addEventListener('click', obliczRozstawKrokwi);
