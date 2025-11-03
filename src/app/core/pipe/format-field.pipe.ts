import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatField',
  standalone: true
})
export class FormatFieldPipe implements PipeTransform {

 transform(value: number | string | undefined, type: 'currency' | 'percent' | 'month' | 'none' = 'none'): string {
  if (value === undefined || value === null) return '-';

  switch(type) {
    case 'currency':
      return `${Number(value).toLocaleString('fr-FR')} €`; 
    case 'percent':
      return typeof value === 'number' ? `${value.toFixed(2)} %` : `${Number(value).toFixed(2)} %`;
    case 'month':
      return `${value} mois`;
    default:
      return String(value);
  }
}

}
