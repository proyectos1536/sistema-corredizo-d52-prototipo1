// ==============================================
// CARD 1: VISTA PREVIA MUEBLE
// ==============================================

let avActual = 0;
let hvActual = 0;

function actualizarMueble() {
    const anchoMueble = parseInt(document.getElementById("anchoTotalMueble").value) || 1600;
    const altoMueble = parseInt(document.getElementById("altoTotalMueble").value) || 2000;
    const espesor = parseInt(document.getElementById("espesorMueble").value) || 18;
    const zocalo = parseInt(document.getElementById("zocaloMueble").value) || 0;

    avActual = anchoMueble - 2 * espesor;
    hvActual = altoMueble - 2 * espesor - zocalo;

    if (avActual < 0) avActual = 0;
    if (hvActual < 0) hvActual = 0;

    document.getElementById("avResultado").textContent = avActual + " mm";
    document.getElementById("hvResultado").textContent = hvActual + " mm";

    document.getElementById("anchoUtilD52").value = avActual;
    document.getElementById("altoUtilD52").value = hvActual;

    dibujarMueble(anchoMueble, altoMueble, espesor, zocalo, avActual, hvActual);
    calcularPuertasD52();
}

function dibujarMueble(anchoMueble, altoMueble, espesor, zocalo, av, hv) {
    const canvas = document.getElementById("canvasMueble");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = 550;
    canvas.height = 480;

    const w = canvas.width;
    const h = canvas.height;
    const margen = 25;

    const escala = Math.min(
        (w - margen * 2) / anchoMueble,
        (h - margen * 2) / altoMueble,
        0.8,
    );

    const anchoPx = anchoMueble * escala;
    const altoPx = altoMueble * escala;
    const espesorPx = Math.max(3, espesor * escala * 0.8);
    const zocaloPx = zocalo * escala;
    const offsetX = (w - anchoPx) / 2;
    const offsetY = (h - altoPx) / 2;

    const altoUtilPx = hv * escala;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);

    // Fondo estructura
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(offsetX, offsetY, anchoPx, altoPx);

    // Interior útil
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(
        offsetX + espesorPx,
        offsetY + espesorPx,
        anchoPx - espesorPx * 2,
        altoUtilPx,
    );

    // Borde exterior
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(offsetX, offsetY, anchoPx, altoPx);

    // Línea del espesor inferior
    ctx.beginPath();
    ctx.moveTo(offsetX + espesorPx, offsetY + espesorPx + altoUtilPx);
    ctx.lineTo(offsetX + anchoPx - espesorPx, offsetY + espesorPx + altoUtilPx);
    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Zócalo
    if (zocalo > 0) {
        ctx.fillStyle = "#374151";
        ctx.fillRect(
            offsetX + espesorPx,
            offsetY + espesorPx + altoUtilPx,
            anchoPx - espesorPx * 2,
            zocaloPx,
        );
        ctx.strokeStyle = "#1f2937";
        ctx.strokeRect(
            offsetX + espesorPx,
            offsetY + espesorPx + altoUtilPx,
            anchoPx - espesorPx * 2,
            zocaloPx,
        );

        ctx.font = `${Math.max(12, escala * 10)}px monospace`;
        ctx.fillStyle = "#e5e7eb";
        ctx.fillText(
            "Zócalo",
            offsetX + anchoPx - 45,
            offsetY + espesorPx + altoUtilPx + zocaloPx / 2 + 5,
        );
    }

    // Texto medidas útiles - CENTRADO y más grande
    ctx.font = `bold ${Math.max(20, escala * 22)}px "Segoe UI"`;
    ctx.fillStyle = "#0c4a6e";
    const centroX = offsetX + anchoPx / 2;
    const centroYutil = offsetY + espesorPx + altoUtilPx / 2;
    const textoMedidas = `${av} x ${hv} mm`;
    const textoWidth = ctx.measureText(textoMedidas).width;
    ctx.fillText(textoMedidas, centroX - textoWidth / 2, centroYutil);

    // Etiquetas de espesor
    ctx.font = `${Math.max(14, escala * 9)}px monospace`;
    ctx.fillStyle = "#1f2937";
    ctx.fillText(`∎ Espesor: ${espesor} mm`, offsetX + 5, offsetY + altoPx + 18);

    ctx.font = `${Math.max(1, escala * 8)}px monospace`;
    ctx.fillStyle = "#6b7280";
    ctx.fillText("Esp. sup.", offsetX + 5, offsetY + espesorPx - 3);
    ctx.fillText("Esp. inf.", offsetX + 5, offsetY + espesorPx + altoUtilPx + 12);
}

window.addEventListener("resize", () => {
    const anchoMueble = parseInt(document.getElementById("anchoTotalMueble").value) || 1600;
    const altoMueble = parseInt(document.getElementById("altoTotalMueble").value) || 2000;
    const espesor = parseInt(document.getElementById("espesorMueble").value) || 18;
    const zocalo = parseInt(document.getElementById("zocaloMueble").value) || 0;
    dibujarMueble(anchoMueble, altoMueble, espesor, zocalo, avActual, hvActual);
});

// ==============================================
// CARD 2: CALCULADOR D-52
// ==============================================

let anchoPuertaD52Valor = 0;
let altoPuertaD52Valor = 0;

function calcularPuertasD52() {
    let av = parseFloat(document.getElementById("anchoUtilD52").value);
    let hv = parseFloat(document.getElementById("altoUtilD52").value);

    if (isNaN(av) || av <= 0 || isNaN(hv) || hv <= 0) {
        document.getElementById("anchoPuertaD52").innerHTML = "--- mm";
        document.getElementById("altoPuertaD52").innerHTML = "--- mm";
        document.getElementById("traslapeD52").innerHTML = "--- mm";
        return;
    }

    anchoPuertaD52Valor = av / 2 + 15;
    altoPuertaD52Valor = hv - 15;

    let traslapeTotal = anchoPuertaD52Valor * 2 - av;
    let traslapePorPuerta = traslapeTotal / 2;

    document.getElementById("anchoPuertaD52").innerHTML = Math.round(anchoPuertaD52Valor) + " mm";
    document.getElementById("altoPuertaD52").innerHTML = Math.round(altoPuertaD52Valor) + " mm";
    document.getElementById("traslapeD52").innerHTML =
        Math.round(traslapeTotal) + " mm (" + Math.round(traslapePorPuerta) + " mm por puerta)";

    actualizarSimulacionPuerta();
    actualizarDescuentosSim();
}

function calcularPesoD52() {
    let anchoFinal = parseFloat(document.getElementById("anchoFinalSim").value);
    let altoFinal = parseFloat(document.getElementById("altoFinalSim").value);
    let espesor = parseFloat(document.getElementById("espesorPuerta").value);
    let densidad = parseFloat(document.getElementById("densidadPuerta").value);

    if (isNaN(anchoFinal) || anchoFinal <= 0 || isNaN(altoFinal) || altoFinal <= 0) {
        document.getElementById("pesoPuertaD52").value = "0";
        return;
    }

    if (isNaN(espesor) || espesor <= 0) espesor = 20;
    if (isNaN(densidad) || densidad <= 0) densidad = 650;

    let peso = (anchoFinal * altoFinal * espesor * densidad) / 1000000000;
    document.getElementById("pesoPuertaD52").value = peso.toFixed(2);
}

function limpiarFormularioD52() {
    document.getElementById("anchoTotalMueble").value = "1600";
    document.getElementById("altoTotalMueble").value = "2000";
    document.getElementById("zocaloMueble").value = "100";
    document.getElementById("espesorMueble").value = "18";
    document.getElementById("espesorPuerta").value = "20";
    document.getElementById("densidadPuerta").value = "650";
    document.getElementById("tapacantoAnchoSim").value = "1";
    document.getElementById("tapacantoAlturaSim").value = "1";

    document.getElementById("l1LabelSim").innerHTML = "L1: -- mm";
    document.getElementById("l2LabelSim").innerHTML = "L2: -- mm";
    document.getElementById("a1TopLabelSim").innerHTML = "A1: -- mm";
    document.getElementById("a2BottomLabelSim").innerHTML = "A2: -- mm";
    document.getElementById("anchoFinalSim").value = "0";
    document.getElementById("altoFinalSim").value = "0";
    document.getElementById("pesoPuertaD52").value = "0";

    const door = document.getElementById("doorSim");
    door.style.width = "200px";
    door.style.height = "280px";

    actualizarMueble();
}

// ==============================================
// CARD 3: SIMULACIÓN DE PUERTA
// ==============================================

function actualizarSimulacionPuerta() {
    if (anchoPuertaD52Valor > 0 && altoPuertaD52Valor > 0) {
        let maxWidth = 240;
        let maxHeight = 340;
        let anchoSimulado = Math.min(anchoPuertaD52Valor / 4, maxWidth);
        let altoSimulado = Math.min(altoPuertaD52Valor / 4, maxHeight);
        anchoSimulado = Math.max(anchoSimulado, 130);
        altoSimulado = Math.max(altoSimulado, 190);

        const door = document.getElementById("doorSim");
        door.style.width = anchoSimulado + "px";
        door.style.height = altoSimulado + "px";

        const doorX2 = document.getElementById("doorX2");
        if (doorX2) {
            let fontSize = Math.max(16, anchoSimulado / 9);
            doorX2.style.fontSize = fontSize + "px";
            doorX2.style.padding = fontSize / 4 + "px " + fontSize / 2 + "px";
        }
    }
}

function actualizarDescuentosSim() {
    if (anchoPuertaD52Valor <= 0 || altoPuertaD52Valor <= 0) {
        document.getElementById("anchoFinalSim").value = "0";
        document.getElementById("altoFinalSim").value = "0";
        return;
    }

    let tapacantoAncho = parseFloat(document.getElementById("tapacantoAnchoSim").value);
    let tapacantoAltura = parseFloat(document.getElementById("tapacantoAlturaSim").value);

    let anchoFinal = anchoPuertaD52Valor - tapacantoAltura * 2;
    let altoFinal = altoPuertaD52Valor - tapacantoAncho * 2;

    document.getElementById("anchoFinalSim").value = Math.round(anchoFinal);
    document.getElementById("altoFinalSim").value = Math.round(altoFinal);

    document.getElementById("l1LabelSim").innerHTML = `L1: ${tapacantoAltura} mm`;
    document.getElementById("l2LabelSim").innerHTML = `L2: ${tapacantoAltura} mm`;
    document.getElementById("a1TopLabelSim").innerHTML = `A1: ${tapacantoAncho} mm`;
    document.getElementById("a2BottomLabelSim").innerHTML = `A2: ${tapacantoAncho} mm`;

    const anchoFinalVal = document.getElementById("anchoFinalSim").value;
    const altoFinalVal = document.getElementById("altoFinalSim").value;
    const doorMedida = document.getElementById("doorMedida");
    if (doorMedida) {
        doorMedida.innerHTML = `${anchoFinalVal} x ${altoFinalVal} mm`;
    }

    calcularPesoD52();
}

// Event listeners
document.getElementById("anchoTotalMueble").addEventListener("input", actualizarMueble);
document.getElementById("altoTotalMueble").addEventListener("input", actualizarMueble);
document.getElementById("zocaloMueble").addEventListener("change", actualizarMueble);
document.getElementById("espesorMueble").addEventListener("change", actualizarMueble);
document.getElementById("tapacantoAnchoSim").addEventListener("change", actualizarDescuentosSim);
document.getElementById("tapacantoAlturaSim").addEventListener("change", actualizarDescuentosSim);

// Inicializar
actualizarMueble();
