import {Component, Input, OnChanges, SimpleChanges, ViewEncapsulation} from '@angular/core';
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
export class GeoRepartitionComponent implements  OnChanges {

  @Input() geographicalData: RepartitionItem[] = [];
  geoMapOptions: any;
  countriesLegend: CountryData[] = [];
  mapLoaded = false;

   ngOnChanges(changes: SimpleChanges): void {
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
      if (!this.geographicalData || this.geographicalData.length === 0) {
      this.countriesLegend = [];
      
      this.geoMapOptions = {
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            return `${params.name}<br/>0%`;
          },
        },
        visualMap: {
          show: false, 
        },
        series: [
          {
            name: 'Répartition géographique',
            type: 'map',
            map: 'europe',
            roam: true,
            center: [15, 48], 
            zoom: 3.5,
            label: {
              show: false, 
            },
            itemStyle: {
              areaColor: '#f8f9fa', 
              borderColor: '#dee2e6', 
              borderWidth: 0.5,
            },
            emphasis: {
              itemStyle: {
                areaColor: '#e9ecef', 
              },
              label: {
                show: true,
                color: '#495057',
                formatter: '{b} : 0%',
                fontSize: 10
              }
            },
            data: []
          },
        ],
      };
    } else {
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
}
