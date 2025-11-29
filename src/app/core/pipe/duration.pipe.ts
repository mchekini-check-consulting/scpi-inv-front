import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true
})
export class DurationPipe implements PipeTransform {

  transform(months: number | null | undefined): string {
    if (months === null || months === undefined || months < 0) {
      return '-';
    }

    if (months === 0) {
      return 'Moins d\'un mois';
    }

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) {
      return `${remainingMonths} mois`;
    }

    if (remainingMonths === 0) {
      return years === 1 ? '1 an' : `${years} ans`;
    }

    const yearLabel = years === 1 ? 'an' : 'ans';
    return `${years} ${yearLabel} ${remainingMonths} mois`;
  }
}