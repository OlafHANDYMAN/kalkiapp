function obliczZaluzje(wysokosc) {
    const pierwszaWysokosc = 51.5;
    const kolejnaWysokosc = 50;
    const wysokoscDeski = 10;
    const desekNaSystem = 5;

    let systemy = Math.ceil((wysokosc - pierwszaWysokosc) / kolejnaWysokosc) + 1;
    let wysokoscSystemow = pierwszaWysokosc + (systemy - 1) * kolejnaWysokosc;

    if (wysokoscSystemow > wysokosc) {
        let nadmiar = wysokoscSystemow - wysokosc;
        let deskiDoOdjecia = Math.ceil(nadmiar / wysokoscDeski);
        let deski = systemy * desekNaSystem - deskiDoOdjecia;
        return { systemy, deski };
    }

    return { systemy, deski: systemy * desekNaSystem };
}

function oblicz() {
    let wysokoscInput = document.getElementById("wysokosc").value.replace(",", ".");
    let wysokosc = parseFloat(wysokoscInput);

    if (isNaN(wysokosc) || wysokosc < 51.5) {
        document.getElementById("wynik").innerText = "Podaj poprawną wysokość (minimum 51.5 cm)";
        return;
    }

    let wynik = obliczZaluzje(wysokosc);
    document.getElementById("wynik").innerText = `Potrzebujesz ${wynik.systemy} systemów oraz ${wynik.deski} deseczek.`;
}