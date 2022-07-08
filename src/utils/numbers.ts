import numeral from 'numeral';
import { BigNumber } from "ethers";

// ----------------------------------------------------------------------

export function fCurrency(number: number) {
  return numeral(number).format(Number.isInteger(number) ? '$0,0' : '$0,0.00');
}

export function fPercent(number: number) {
  return numeral(number / 100).format('0.00%');
}

export function fNumber(number: number) {
  return numeral(number).format();
}

export function fShortenNumber(number: number) {
  return numeral(number).format('0.00a').replace('.00', '');
}

export function fData(number: number) {
  return numeral(number).format('0.0 b');
}

export function str2BigNumber(str: string, decimals: number) {
    const dp = str.indexOf('.')
    const Decimal = BigNumber.from(10).pow(BigNumber.from(decimals))
    if (dp > 0) {
        return BigNumber.from(str.replaceAll('.', '')).mul(Decimal).div(BigNumber.from(10).pow(str.length - dp - 1))
    } else {
        return BigNumber.from(str).mul(Decimal)
    }
}
