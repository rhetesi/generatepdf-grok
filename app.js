// Segítő függvények a PDF rajzoláshoz (korábbi types.js-ből)
function createLayout() {
  const pageWidth = 210;
  const pageHeight = 297;
  const marginLeft = 20;
  const marginRight = 20;
  const contentWidth = pageWidth - marginLeft - marginRight;
  const contentRight = pageWidth - marginRight;

  return {
    pageWidth,
    pageHeight,
    marginLeft,
    marginRight,
    contentWidth,
    contentRight,
    lineHeight: 4,
    topSeparatorY: 41,
    bottomSeparatorY: 216,
    cimkeTop: 6,
    cimkeBottom: 35,
    nyilvTop: 47,
    nyilvBottom: 210,
    elismTop: 222,
    elismBottom: 291,
  };
}

function drawDashedLine(doc, layout, yPos) {
  doc.setLineDashPattern([2, 2], 0);
  doc.setLineWidth(0.3);
  doc.line(layout.marginLeft, yPos, layout.contentRight, yPos);
  doc.setLineDashPattern([], 0);
}

function drawSolidLine(doc, x1, yPos, x2) {
  doc.setLineDashPattern([], 0);
  doc.setLineWidth(0.3);
  doc.line(x1, yPos, x2, yPos);
}

function drawGroup(doc, box, drawFn) {
  drawFn(doc, box.startX, box.startY, box.width, box.height);
}

// drawCimke
function drawCimke(doc, data, layout, qrDataUrl) {
  const { targyNev, targyLeiras, helyszin, datum, azonosito } = data;
  const fullDatum = `${helyszin}, ${datum}`;

  const y = layout.cimkeTop + 5;

  doc.setFontSize(18);
  doc.setFont('Roboto', 'bolditalic');
  doc.text(targyNev, layout.marginLeft, y + 6);

  doc.setFontSize(10);
  doc.setFont('Roboto', 'normal');
  doc.text(targyLeiras, layout.marginLeft, y + 11);
  doc.text(fullDatum, layout.marginLeft, y + 15);

  const qrSize = 20;
  const qrX = layout.contentRight - qrSize;
  const qrY = y;
  doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

  doc.setFontSize(10);
  doc.text(azonosito, layout.contentRight, y + 24, { align: 'right' });
}

// drawElismerveny
function drawElismerveny(doc, data, layout) {
  const { targyNev, targyLeiras, datum, talaloNev = 'Név', talaloLakcim = 'lakcím' } = data;

  let y = layout.elismTop;

  doc.setFontSize(18);
  doc.setFont('Roboto', 'bolditalic');
  doc.text('Átvételi elismervény', layout.marginLeft, y + 5);

  y += 12;

  doc.setFontSize(10);
  doc.setFont('Roboto', 'bold');
  doc.text(targyNev, layout.marginLeft, y);
  doc.setFont('Roboto', 'normal');
  doc.text(targyLeiras, layout.marginLeft, y + 4);

  y += 15;

  doc.setFont('Roboto', 'bold');
  doc.text(`\( {talaloNev} ( \){talaloLakcim})`, layout.marginLeft, y);
  doc.setFont('Roboto', 'normal');

  y += 5;

  const receiptText = 'A „cég" képviseletében elismerem, hogy a fent megnevezett tárgyat, megnevezett találótól átvettük. Egyben tájékoztattam a találót, hogy ezen átvételi elismervény NEM jogosít a talált tárgy találó részére történő kiadására.';
  const splitReceipt = doc.splitTextToSize(receiptText, layout.contentWidth);
  doc.text(splitReceipt, layout.marginLeft, y);

  y += splitReceipt.length * layout.lineHeight + 6;

  doc.setFontSize(10);
  doc.setFont('Roboto', 'normal');
  doc.text(datum, layout.marginLeft, y);

  doc.text('ph', layout.contentRight - 50, y);
  drawSolidLine(doc, layout.contentRight - 40, y, layout.contentRight);
  doc.setFontSize(9);
  doc.text('Név', layout.contentRight - 20, y + 4, { align: 'center' });
}

// drawMasodlat
function createMasodlatBox() {
  return { startX: 140, startY: 47, width: 50, height: 22 };
}

function drawMasodlat(doc, data, box) {
  const { azonosito, nyomtatasDatum } = data;

  drawGroup(doc, box, (doc, offsetX, offsetY, width, height) => {
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.3);
    doc.setLineDashPattern([1, 1], 0);
    doc.rect(offsetX, offsetY, width, height);
    doc.setLineDashPattern([], 0);
    doc.setDrawColor(0, 0, 0);

    doc.setFont('Roboto', 'bold');
    doc.setFontSize(10);
    const masodlatText = 'MÁSODLAT!';
    const masodlatTextWidth = doc.getTextWidth(masodlatText) + 6;
    const masodlatX = offsetX + width - masodlatTextWidth - 2;
    const masodlatY = offsetY + 4;
    doc.setFillColor(0, 0, 0);
    doc.rect(masodlatX, masodlatY, masodlatTextWidth, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text(masodlatText, masodlatX + 3, masodlatY + 3.5);
    doc.setTextColor(0, 0, 0);
    doc.setFont('Roboto', 'normal');

    doc.setFontSize(9);
    doc.text(`Nyomtatva: ${nyomtatasDatum}`, offsetX + width - 2, offsetY + 14, { align: 'right' });

    doc.setFontSize(9);
    doc.text(azonosito, offsetX + width - 2, offsetY + 19, { align: 'right' });
  });
}

// drawNyilvantartoLap
function drawNyilvantartoLap(doc, data, layout) {
  const { targyNev, targyLeiras, helyszin, datum, azonosito, talaloNev = 'Név', talaloLakcim = 'lakcím' } = data;
  const fullDatum = `${helyszin}, ${datum}`;

  const mainContentRight = 192;
  const sig1Center = 50;
  const sig2Center = 107.5;
  const sig3Center = 160;
  const sigWidth = 35;

  let y = layout.nyilvTop;

  doc.setFontSize(18);
  doc.setFont('Roboto', 'bolditalic');
  doc.text(targyNev, layout.marginLeft, y + 6);

  doc.setFontSize(10);
  doc.setFont('Roboto', 'normal');
  doc.text(targyLeiras, layout.marginLeft, y + 11);
  doc.text(fullDatum, layout.marginLeft, y + 15);

  doc.setFontSize(10);
  doc.text(azonosito, mainContentRight, y + 4, { align: 'right' });

  y += 22;

  y += 30;

  doc.setFontSize(10);
  doc.setFont('Roboto', 'normal');
  doc.text('Átvevő neve:', layout.marginLeft, y);
  drawSolidLine(doc, layout.marginLeft + 25, y, mainContentRight);

  y += 8;
  doc.text('Átvevő lakcíme:', layout.marginLeft, y);
  drawSolidLine(doc, layout.marginLeft + 30, y, mainContentRight);

  y += 7;
  drawSolidLine(doc, layout.marginLeft, y, mainContentRight);

  y += 8;
  doc.text('Személyazonosító okmány típusa és azonosítója:', layout.marginLeft, y);
  drawSolidLine(doc, layout.marginLeft + 85, y, mainContentRight);

  y += 8;

  const declarationText = "Átvevő adatainál megjelölt személyként elismerem, hogy mai napon, a 'CÉG' képviselője, a megjelölt tárgyat, mint személyes tulajdonomat részemre átadta. A tárgyat megvizsgáltam, azzal kapcsolatban mennyiségi, minőségi kifogást nem támasztok a 'CÉG' felé, egyidejűleg elismerem, hogy általam történő elhagyása és megtalálása között a tárgy mennyiségi, minőségi változásaiért a 'CÉG' nem tartozik felelősséggel. Meggyőződtem arról, hogy a 'CÉG' a tárgyat annak megtalálásától az elvárható gondossággal őrizte meg.";

  doc.setFontSize(10);
  doc.setFont('Roboto', 'normal');
  const maxWidth = mainContentRight - layout.marginLeft;
  const splitDeclaration = doc.splitTextToSize(declarationText, maxWidth);
  doc.text(splitDeclaration, layout.marginLeft, y, { align: 'justify', maxWidth });
  y += splitDeclaration.length * layout.lineHeight + 6;

  drawSolidLine(doc, sig1Center - sigWidth / 2, y, sig1Center + sigWidth / 2);
  doc.setFontSize(9);
  doc.text('dátum', sig1Center, y + 4, { align: 'center' });

  drawSolidLine(doc, sig2Center - sigWidth / 2, y, sig2Center + sigWidth / 2);
  doc.text('átadó', sig2Center, y + 4, { align: 'center' });

  drawSolidLine(doc, sig3Center - sigWidth / 2, y, sig3Center + sigWidth / 2);
  doc.text('átvevő', sig3Center, y + 4, { align: 'center' });

  y += 12;

  y += 5;

  doc.setFontSize(10);
  doc.setFont('Roboto', 'bold');
  doc.text(`\( {talaloNev} ( \){talaloLakcim})`, layout.marginLeft, y);
  doc.setFont('Roboto', 'normal');

  y += 5;
  const finderDeclaration = "mint találó kijelentem, hogy az általam talált fent megjelölt tárgy NEM tartozik a személyes és közeli hozzátartozóim tulajdona körébe, így annak tulajdonjogára sem most, sem később nem tartok igényt. Egyben kijelentem, hogy megértettem és tudomásul veszem, hogy az átvételi elismervényen található figyelmeztetés szerint az átvételi elismervény nem jogosít a talált tárgy kiadására.";

  const splitFinderDecl = doc.splitTextToSize(finderDeclaration, maxWidth);
  doc.text(splitFinderDecl, layout.marginLeft, y, { align: 'justify', maxWidth });
  y += splitFinderDecl.length * layout.lineHeight + 6;

  doc.setFontSize(10);
  doc.setFont('Roboto', 'normal');
  doc.text(datum, sig1Center, y, { align: 'center' });

  drawSolidLine(doc, sig2Center - sigWidth / 2, y, sig2Center + sigWidth / 2);
  doc.setFontSize(9);
  doc.text('átadó', sig2Center, y + 4, { align: 'center' });
  doc.text(talaloNev, sig2Center, y + 8, { align: 'center' });

  drawSolidLine(doc, sig3Center - sigWidth / 2, y, sig3Center + sigWidth / 2);
  doc.text('cég képviselője', sig3Center, y + 4, { align: 'center' });
  doc.text('Név', sig3Center, y + 8, { align: 'center' });
}

// drawSidebar
function createSidebarBox() {
  return { startX: 194, startY: 47, width: 10, height: 163 };
}

function drawSidebar(doc, data, box) {
  const { targyNev, datum, azonosito } = data;

  drawGroup(doc, box, (doc, offsetX, offsetY, width, height) => {
    doc.setFillColor(0, 0, 0);
    doc.rect(offsetX, offsetY, width, height, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('Roboto', 'bold');

    const sidebarText = `${datum}  –  ${targyNev}  –  ${azonosito}`;

    const textWidth = doc.getTextWidth(sidebarText);
    const centerX = offsetX + width / 2 + 0.5;
    const midY = offsetY + height / 2;
    const textY = midY + textWidth / 2;

    doc.text(sidebarText, centerX, textY, { angle: 90 });

    doc.setTextColor(0, 0, 0);
    doc.setFont('Roboto', 'normal');
  });
}

// Fontok betöltése hibakezeléssel
async function loadFontAsBase64(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Font betöltési hiba: ' + response.status);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error('Font fetch hiba:', e);
    throw e;
  }
}

async function addRobotoFonts(doc) {
  const regularUrl = 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.ttf';
  const boldUrl = 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc4.ttf';
  const boldItalicUrl = 'https://fonts.gstatic.com/s/roboto/v30/KFOjCnqEu92Fr1Mu51TzBic6CsQ.ttf';

  try {
    const [regularBase64, boldBase64, boldItalicBase64] = await Promise.all([
      loadFontAsBase64(regularUrl),
      loadFontAsBase64(boldUrl),
      loadFontAsBase64(boldItalicUrl),
    ]);

    doc.addFileToVFS('Roboto-Regular.ttf', regularBase64);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');

    doc.addFileToVFS('Roboto-Bold.ttf', boldBase64);
    doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');

    doc.addFileToVFS('Roboto-BoldItalic.ttf', boldItalicBase64);
    doc.addFont('Roboto-BoldItalic.ttf', 'Roboto', 'bolditalic');
  } catch (e) {
    console.error('Fontok betöltése sikertelen:', e);
  }
}

// Fő PDF generáló függvény
async function generateTalaltTargyPdf(data) {
  if (!window.jspdf || !QRCode) {
    console.error('jsPDF vagy QRCode nem elérhető. Ellenőrizd a CDN-eket.');
    return;
  }

  const layout = createLayout();

  let qrDataUrl;
  try {
    qrDataUrl = await new Promise((resolve, reject) => {
      QRCode.toDataURL(data.azonosito, {
        width: 200,
        margin: 0,
        color: { dark: '#000000', light: '#ffffff' },
      }, (err, url) => (err ? reject(err) : resolve(url)));
    });
  } catch (e) {
    console.error('QR kód generálási hiba:', e);
    return;
  }

  const doc = new window.jspdf.jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  try {
    await addRobotoFonts(doc);
  } catch (e) {
    return;
  }

  drawCimke(doc, data, layout, qrDataUrl);
  drawDashedLine(doc, layout, layout.topSeparatorY);
  drawNyilvantartoLap(doc, data, layout);

  const sidebarBox = createSidebarBox();
  drawSidebar(doc, data, sidebarBox);

  const masodlatBox = createMasodlatBox();
  drawMasodlat(doc, data, masodlatBox);

  drawDashedLine(doc, layout, layout.bottomSeparatorY);
  drawElismerveny(doc, data, layout);

  doc.save(`talalt_targy_${data.azonosito}.pdf`);
}

// Main logika
window.addEventListener('load', () => {
  if (!QRCode) {
    console.error('QRCode CDN nem töltődött be.');
    return;
  }

  const adatok = {
    targyNev: "Férfi karóra",
    targyLeiras: "Casio (fém, ezüst, kerek)",
    helyszin: "Főbejárat aula",
    datum: "2026. 01. 29.",
    azonosito: "697B781F52740ECF",
    nyomtatasDatum: "2026. 01. 31.",
    talaloNev: "Név",
    talaloLakcim: "lakcím",
  };

  const fullDatum = `${adatok.helyszin}, ${adatok.datum}`;

  const qrCanvas = document.createElement('canvas');
  QRCode.toCanvas(qrCanvas, adatok.azonosito, {
    width: 72,
    margin: 0,
    color: { dark: '#000000', light: '#ffffff' },
    errorCorrectionLevel: 'M'
  }, (err) => {
    if (err) console.error('QR canvas hiba:', err);
  });

  const preview = document.getElementById('document-preview');
  if (preview) {
    preview.innerHTML = `
      <div class="section-label">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="section-title">${adatok.targyNev}</h1>
            <p class="text-body">${adatok.targyLeiras}</p>
            <p class="text-body">${fullDatum}</p>
          </div>
          <div id="qr-placeholder"></div>
        </div>
        <p class="text-right text-body mt-2">${adatok.azonosito}</p>
      </div>
      <div class="dashed-separator"></div>
      <div class="section-main relative">
        <div class="sidebar-black">
          <div class="sidebar-text">
            ${adatok.datum}  –  ${adatok.targyNev}  –  ${adatok.azonosito}
          </div>
        </div>
        <div>
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="section-title">${adatok.targyNev}</h2>
              <p class="text-body">${adatok.targyLeiras}</p>
              <p class="text-body">${fullDatum}</p>
            </div>
            <div class="text-right">
              <p class="text-body mb-1">${adatok.azonosito}</p>
              <div class="masodlat-box">MÁSODLAT!</div>
              <p class="text-small text-muted-foreground mt-1">Nyomtatva: ${adatok.nyomtatasDatum}</p>
            </div>
          </div>
          <div class="form-fields">
            <div class="form-row">
              <span class="form-label">Átvevő neve:</span>
              <span class="form-underline"></span>
            </div>
            <div class="form-row">
              <span class="form-label">Átvevő lakcíme:</span>
              <span class="form-underline"></span>
            </div>
            <div class="form-underline-full"></div>
            <div class="form-row">
              <span class="form-label">Személyazonosító okmány típusa és azonosítója:</span>
              <span class="form-underline"></span>
            </div>
          </div>
          <p class="text-justify text-body leading-relaxed mb-6">
            Átvevő adatainál megjelölt személyként elismerem, hogy mai napon, a 'CÉG' képviselője, a megjelölt tárgyat, mint személyes tulajdonomat részemre átadta. A tárgyat megvizsgáltam, azzal kapcsolatban mennyiségi, minőségi kifogást nem támasztok a 'CÉG' felé, egyidejűleg elismerem, hogy általam történő elhagyása és megtalálása között a tárgy mennyiségi, minőségi változásaiért a 'CÉG' nem tartozik felelősséggel. Meggyőződtem arról, hogy a 'CÉG' a tárgyat annak megtalálásától az elvárható gondossággal őrizte meg.
          </p>
          <div class="signature-row-three mb-6">
            <div class="signature-block">
              <div class="signature-line"></div>
              <p class="signature-label">dátum</p>
            </div>
            <div class="signature-block">
              <div class="signature-line"></div>
              <p class="signature-label">átadó</p>
            </div>
            <div class="signature-block">
              <div class="signature-line"></div>
              <p class="signature-label">átvevő</p>
            </div>
          </div>
          <div class="mb-4">
            <p class="text-bold mb-2">\( {adatok.talaloNev} ( \){adatok.talaloLakcim})</p>
            <p class="text-justify text-body leading-relaxed">
              mint találó kijelentem, hogy az általam talált fent megjelölt tárgy NEM tartozik a személyes és közeli hozzátartozóim tulajdona körébe, így annak tulajdonjogára sem most, sem később nem tartok igényt. Egyben kijelentem, hogy megértettem és tudomásul veszem, hogy az átvételi elismervényen található figyelmeztetés szerint az átvételi elismervény nem jogosít a talált tárgy kiadására.
            </p>
          </div>
          <div class="signature-row-three">
            <div class="signature-block">
              <p class="text-body">${adatok.datum}</p>
            </div>
            <div class="signature-block">
              <div class="signature-line"></div>
              <p class="signature-label">átadó</p>
              <p class="signature-name">${adatok.talaloNev}</p>
            </div>
            <div class="signature-block">
              <div class="signature-line"></div>
              <p class="signature-label">cég képviselője</p>
              <p class="signature-name">Név</p>
            </div>
          </div>
        </div>
      </div>
      <div class="dashed-separator"></div>
      <div class="section-receipt">
        <h2 class="section-title mb-4">Átvételi elismervény</h2>
        <div class="mb-2">
          <p class="text-bold">${adatok.targyNev}</p>
          <p class="text-body">${adatok.targyLeiras}</p>
        </div>
        <p class="text-bold mb-2">\( {adatok.talaloNev} ( \){adatok.talaloLakcim})</p>
        <p class="text-justify text-body leading-relaxed mb-4">
          A „cég" képviseletében elismerem, hogy a fent megnevezett tárgyat, megnevezett találótól átvettük. Egyben tájékoztattam a találót, hogy ezen átvételi elismervény NEM jogosít a talált tárgy találó részére történő kiadására.
        </p>
        <div class="flex items-end justify-between">
          <p class="text-body">${adatok.datum}</p>
          <div class="flex items-end gap-6">
            <span class="text-body">ph</span>
            <div class="signature-block">
              <div class="signature-line"></div>
              <p class="signature-name">Név</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const qrPlaceholder = document.getElementById('qr-placeholder');
    if (qrPlaceholder) qrPlaceholder.appendChild(qrCanvas);
  } else {
    console.error('Preview elem nem található.');
  }

  const downloadBtn = document.getElementById('download-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', async () => {
      try {
        await generateTalaltTargyPdf(adatok);
      } catch (e) {
        console.error('PDF generálási hiba:', e);
      }
    });
  } else {
    console.error('Download gomb nem található.');
  }
});
