import { Component, OnInit } from "@angular/core";
import { NgForOf, NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  key: string;
  feature: string;
}

export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard/scpi",
    title: "Liste des SCPI",
    key: "SIDEBAR.SCPI",
    icon: "pi pi-building-columns",
    class: "",
    feature: "list-scpi",
  },
  {
    path: "/dashboard/portefeuille",
    title: "Portefeuille",
    key: "SIDEBAR.PORTEFEUILLE",
    icon: "pi pi-wallet",
    class: "",
    feature: "portefeuille",
  },
  {
    path: "/dashboard/scheduled-payment",
    title: "Versements programmés",
    key: "SIDEBAR.VERSEMENT",
    icon: "pi pi-calendar-clock",
    class: "",
    feature: "scheduled-payment",
  },
  {
    path: "/dashboard/simulation",
    title: "Mes simulations",
    key: "SIDEBAR.SIMULATION",
    icon: "pi pi-chart-line",
    class: "",
    feature: "simulation",
  },
  {
    path: "/dashboard/profile",
    title: "Documents Réglemenataires",
    key: "SIDEBAR.MY-PROFILE",
    icon: "pi pi-user",
    class: "",
    feature: "profile",
  }

];

@Component({
  selector: "app-sidebar",
  imports: [NgForOf, TranslateModule, RouterLink, NgIf],
  templateUrl: "./sidebar.component.html",
  standalone: true,
  styleUrl: "./sidebar.component.css",
})
export class SidebarComponent implements OnInit {
  version = "1.0.0";
  menuItems: RouteInfo[] = [];

  constructor() {

  }

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }


}
