import {AfterViewInit, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {CountryData, GeographicalItem} from "../../../../models/geo-repartition.model";
import {NgxEchartsDirective, provideEcharts} from "ngx-echarts";
import * as echarts from "echarts";
import {RepartitionItem} from "../../../../models/scpi-repartition.model";
import {CommonModule, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-geo-repartition',
  standalone: true,
  imports: [NgxEchartsDirective, NgForOf, NgIf, CommonModule],
  providers: [provideEcharts()],
  templateUrl: './geo-repartition.component.html',
  styleUrl: './geo-repartition.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class GeoRepartitionComponent implements AfterViewInit {
  @Input() geographicalData: RepartitionItem[] = [];
  geoMapOptions: any;
  countriesLegend: CountryData[] = [];
  mapLoaded = false;

  ngAfterViewInit(): void {
    setTimeout(() => this.loadMap(), 0);
  }

  async loadMap() {
    try {
      const rawMap = await fetch('geojson/europe.json').then(r => r.json());
      echarts.registerMap('europe', rawMap);
      this.mapLoaded = true;
    } catch (error) {
      console.error('Erreur lors du chargement de la carte Europe:', error);
    }
    const waitForMap = () => {
      if (this.mapLoaded) {
        this.prepareGeographicalMap();
      } else {
        setTimeout(waitForMap, 100);
      }
    };
    waitForMap();
  }


  prepareGeographicalMap(): void {
    const countries: CountryData[] = this.geographicalData
      .map((item: GeographicalItem): CountryData => ({
        name: item.label,
        value: item.percentage,
      }));

    this.countriesLegend = countries;

    const values = countries.map(c => c.value);
    let minValue = Math.min(...values);
    let maxValue = Math.max(...values);
    if (minValue === maxValue) {
      minValue = 0;
      maxValue = 100;
    }


    this.geoMapOptions = {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => `${params.name} : ${params.value || 0}%`,
      },
      visualMap: {
        min: minValue,
        max: maxValue,
        show: true,
        calculable: true,
        inRange: {
          color: [
            '#E8F5E9',
            '#81C784',
            '#FFEB3B',
            '#FB8C00',
            '#E53935',
          ],
        },
        orient: 'vertical',
        left: 10,
        bottom: 10,
      },
      series: [
        {
          name: 'Répartition géographique',
          type: 'map',
          map: 'europe',
          roam: true,
          center: [5, 48],
          zoom: 2.5,
          label: {
            show: true,
            formatter: (params: any) =>
              params.value > 0 ? `${params.value}%` : '',
            fontSize: 12,
            color: '#000',
          },
          emphasis: { label: { show: true } },
          data: countries,
        },
      ],
    };
  }

}
