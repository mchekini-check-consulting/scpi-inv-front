import { Component, OnInit } from "@angular/core";
import { NgForOf, NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { PermissionService } from "../../../../services/permission.service";
import { PERMISSION_MAPPING } from "../../../config/permission.config";


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
    title: "Documents Réglementaires",
    key: "SIDEBAR.MY-PROFILE",
    icon: "pi pi-user",
    class: "",
    feature: "profile",
  },
  {
    path: "/dashboard/history",
    title: "Historique des demandes",
    key: "SIDEBAR.HISTORY",
    icon: "pi pi-list",
    class: "",
    feature: "history",
  },
    {
    path: "/dashboard/comparator",
    title: "Comparateur Scpi",
    key: "SIDEBAR.COMPARATOR",
    icon: "pi pi-sliders-h",
    class: "",
    feature: "comparator",
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
  userRole: string | null = null;

  constructor(private permissionService: PermissionService) {}

  ngOnInit() {
    
    this.permissionService.userPermissions$.subscribe(userPermissions => {
      if (userPermissions) {
        this.userRole = userPermissions.role;
        this.filterMenuItems();
      }
    });
  }

  private filterMenuItems(): void {
    this.menuItems = ROUTES.filter(menuItem => {
   
      const requiredPermission = PERMISSION_MAPPING[menuItem.feature];
      
     
      if (!requiredPermission) {
        return true;
      }
      
      const hasPermission = this.permissionService.hasPermission(requiredPermission);
      
      return hasPermission;
    });

 
  }
}