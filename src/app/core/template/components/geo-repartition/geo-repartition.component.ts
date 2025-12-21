import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEcharts } from "ngx-echarts";
import * as echarts from "echarts";
import { RepartitionItem } from "../../../model/scpi-repartition.model";
import { FormatFieldPipe } from '../../../pipe/format-field.pipe';

interface CountryData {
  name: string;
  value: number;
  amount?: number;
}

@Component({
  selector: 'app-geo-repartition',
  standalone: true,
  imports: [NgxEchartsDirective, CommonModule, FormatFieldPipe],
  providers: [provideEcharts()],
  templateUrl: './geo-repartition.component.html',
  styleUrl: './geo-repartition.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class GeoRepartitionComponent implements OnChanges {

  @Input() geographicalData: RepartitionItem[] = [];
  @Input() totalInvested: number = 0;

  geoMapOptions: any;
  countriesLegend: CountryData[] = [];
  mapLoaded = false;
  minValue: number = 0;
  maxValue: number = 100;

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
        .map((item: any): CountryData => ({
          name: item.label,
          value: item.percentage,
          amount: item.amount
        }));

      this.countriesLegend = countries;

      const values = countries.map(c => c.value);
      this.minValue = Math.min(...values);
      this.maxValue = Math.max(...values);
      if (this.minValue === this.maxValue) {
        this.minValue = 0;
        this.maxValue = 100;
      }

      this.geoMapOptions = {
        tooltip: {
          trigger: 'item',

          formatter: (params: any) => {
            const country = this.countriesLegend.find(c => c.name === params.name);
            if (country && country.amount) {
              return `${params.name}<br/>
                      ${params.value || 0}%<br/>
                      ${country.amount.toFixed(2)} €`;
            }
            return `${params.name} : ${params.value || 0}%`;
          },
        },
        visualMap: {
          min: this.minValue,
          max: this.maxValue,
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

  getCountryColor(percentage: number): string {
    if (this.minValue === this.maxValue) {
      return '#81C784';
    }
    
    const colors = ['#E8F5E9', '#81C784', '#FFEB3B', '#FB8C00', '#E53935'];
    const range = this.maxValue - this.minValue;
    const normalizedValue = (percentage - this.minValue) / range;
    const index = Math.min(Math.floor(normalizedValue * colors.length), colors.length - 1);
    
    return colors[index];
  }
}