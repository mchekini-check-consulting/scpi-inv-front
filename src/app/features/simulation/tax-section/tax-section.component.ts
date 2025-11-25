import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, OnInit } from '@angular/core'; // Ajout de OnInit
import { FormsModule } from '@angular/forms';

@Component({
 selector: 'app-tax-section',
 standalone: true,
 imports: [CommonModule, FormsModule],
 templateUrl: './tax-section.component.html',
 styleUrl: './tax-section.component.scss',
 encapsulation: ViewEncapsulation.None
})
export class TaxSectionComponent implements OnInit {
    defaultTmi: number = 30;
    tmiValue: number = this.defaultTmi; 

    constructor() { }

    ngOnInit(): void {
        
    }
    
    updateTmiDisplay(): void {
        console.log(`TMI changée à : ${this.tmiValue}%`);
    }
}