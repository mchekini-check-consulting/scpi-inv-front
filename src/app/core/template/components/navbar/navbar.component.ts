import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterModule} from '@angular/router';
import {CommonModule, NgFor} from '@angular/common';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import { AuthService } from '../../../service/auth.service';

interface Lang {
  name: string;
  code: string;
  flag: string;
}


@Component({
  selector: 'app-navbar',
  imports: [NgFor, TranslateModule, CommonModule, RouterModule, RouterLink],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  lang: Lang[] | undefined;
  isSidebarMini = false;

  selectedLang: String = "Français";
  selectedFlag: string = 'img/Flag_fr.png';

  username: string = '';
  profilePic: string | null = null;
  avatarInitial: string = '';
  avatarColor: string = '#607d8b';


  constructor(private translate: TranslateService, private authService: AuthService) {
    translate.setDefaultLang('fr');

  }

  toggleSidebar() {
    this.isSidebarMini = !this.isSidebarMini;
    const body = document.getElementsByTagName('body')[0];
    if (this.isSidebarMini) {
      body.classList.add('sidebar-mini');
    } else {
      body.classList.remove('sidebar-mini');
    }
  }

  ngOnInit() {
    this.lang = ([
      {name: "Français", code: "fr", flag: 'img/Flag_fr.png'},
      {name: "English", code: "en", flag: 'img/Flag_gb.png'},
    ]);
    this.username = 'Mahdi CHEKINI';

   this.authService.userInfo$.subscribe(claims => {
      if (claims) {
        const prenom = claims.given_name || '';
        const nom = claims.family_name || '';

        this.username = `${prenom} ${nom}`.trim() || claims.preferred_username || 'Utilisateur';

        if (claims.picture) {
          this.profilePic = claims.picture;
          this.avatarInitial = '';
        } else {
          this.profilePic = null;
          const source = nom || prenom || '?';
          this.avatarInitial = source.charAt(0).toUpperCase();
          this.avatarColor = this.getAvatarColor(source);
        }
      }
    });


  }

 private getAvatarColor(seed: string): string {
  const colors = [
    '#F44336',
    '#E91E63',
    '#9C27B0',
    '#3F51B5',
    '#2196F3',
    '#009688',
    '#4CAF50',
    '#FF9800',
    '#795548'
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}


  switchLanguage(language: string) {
    const selectedLanguage = this.lang!.find(lang => lang.code === language);
    if (selectedLanguage) {
      this.selectedLang = selectedLanguage.name;
      this.selectedFlag = selectedLanguage.flag;
    }
    this.translate.use(language);
  }

  logout() {
    this.authService.logout();
  }
}
