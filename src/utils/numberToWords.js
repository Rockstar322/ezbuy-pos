/**
 * Conversor oficial de montos numéricos a texto en letras (Soles PEN - SUNAT Perú)
 * Ejemplo: 24.50 -> "SON: VEINTICUATRO CON 50/100 SOLES"
 */

const UNIDADES = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
const DECENAS_10 = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
const DECENAS = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
const CENTENAS = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

function convertGroup(n) {
  let output = '';
  if (n === 100) return 'CIEN ';
  if (n > 99) {
    output += CENTENAS[Math.floor(n / 100)] + ' ';
    n %= 100;
  }
  if (n >= 10 && n <= 19) {
    output += DECENAS_10[n - 10] + ' ';
    return output;
  }
  if (n >= 20 && n <= 29) {
    if (n === 20) output += 'VEINTE ';
    else output += 'VEINTI' + UNIDADES[n - 20] + ' ';
    return output;
  }
  if (n >= 30) {
    output += DECENAS[Math.floor(n / 10)];
    if (n % 10 !== 0) output += ' Y ' + UNIDADES[n % 10];
    output += ' ';
    return output;
  }
  if (n > 0) {
    output += UNIDADES[n] + ' ';
  }
  return output;
}

export function numberToLetters(amount) {
  const num = typeof amount === 'number' ? amount : parseFloat(amount || 0);
  const rounded = Math.round(num * 100) / 100;
  const integerPart = Math.floor(rounded);
  const decimalPart = Math.round((rounded - integerPart) * 100);
  const cents = String(decimalPart).padStart(2, '0');

  if (integerPart === 0) {
    return `SON: CERO CON ${cents}/100 SOLES`;
  }

  let words = '';
  if (integerPart >= 1000000) {
    const millions = Math.floor(integerPart / 1000000);
    words += millions === 1 ? 'UN MILLÓN ' : convertGroup(millions) + 'MILLONES ';
  }

  const thousands = Math.floor((integerPart % 1000000) / 1000);
  if (thousands > 0) {
    words += thousands === 1 ? 'MIL ' : convertGroup(thousands) + 'MIL ';
  }

  const units = integerPart % 1000;
  if (units > 0) {
    words += convertGroup(units);
  }

  return `SON: ${words.trim()} CON ${cents}/100 SOLES`;
}
