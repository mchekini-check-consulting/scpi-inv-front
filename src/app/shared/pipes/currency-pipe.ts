import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyEuro',
  standalone: true
})
export class CurrencyEuroPipe implements PipeTransform {


  transform(value: number | null | undefined, showDecimals: boolean = false): string {
    if (value == null) {
      return '0 €';
    }

   
    const formatted = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0
    }).format(value);

    return formatted;
  }

}