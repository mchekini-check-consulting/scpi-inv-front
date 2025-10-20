export interface Scpi {
  id: string;
  nom: string;
  logo: string;
  noteInvestisseurs: number;
  phraseAccroche: string;
  secteurPrincipal: string;
  paysPrincipal: string;
  badgeSpecial?: string;
  rendementActuel: number;
  minimumInvestissement: number; 
}

export interface ScpiPage {
  data: Scpi[];
  total: number;
  page: number;
  pageSize: number;
}