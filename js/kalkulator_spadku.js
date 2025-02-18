function pokazFormularz(typ) {
    document.getElementById('jednospadowy').classList.add('hidden');
    document.getElementById('dwuspadowy').classList.add('hidden');
    document.getElementById(typ).classList.remove('hidden');
}

function obliczJednospadowy() {
    let H = parseFloat(document.getElementById('h1').value);
    let L = parseFloat(document.getElementById('l1').value);
    let B = parseFloat(document.getElementById('b1').value);

    if (isNaN(H) || isNaN(L) || isNaN(B) || L <= B) {
        document.getElementById('wynik1').innerText = 'Podaj poprawne wartości.';
        return;
    }

    let L_real = L - B; // Szerokość pomniejszona o belkę
    let beta = Math.atan(H / L_real) * (180 / Math.PI);

    document.getElementById('wynik1').innerText = `Kąt nachylenia: ${beta.toFixed(2)}°`;
}

function obliczDwuspadowy() {
    let H = parseFloat(document.getElementById('h2').value);
    let B = parseFloat(document.getElementById('b2').value);
    let Bm = parseFloat(document.getElementById('bm').value);

    if (isNaN(H) || isNaN(B) || isNaN(Bm) || B <= Bm) {
        document.getElementById('wynik2').innerText = 'Podaj poprawne wartości.';
        return;
    }

    let B_real = (B / 2) - (Bm / 2); // Uwzględnienie grubości belki kalenicowej
    let beta = Math.atan(H / B_real) * (180 / Math.PI);

    document.getElementById('wynik2').innerText = `Kąt nachylenia: ${beta.toFixed(2)}°`;
}