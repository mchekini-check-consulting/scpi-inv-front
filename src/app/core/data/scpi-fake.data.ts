

import { Scpi } from '../../shared/models/scpi.model';

export const FAKE_SCPI_DATA: Scpi[] = [
  {
    id: '1',
    nom: 'SCPI Pierre Capitale',
    logo: 'https://ui-avatars.com/api/?name=PC&background=4A90E2&color=fff&size=150',
    noteInvestisseurs: 4.5,
    phraseAccroche: 'Investissement diversifié dans l\'immobilier tertiaire premium en Île-de-France',
    secteurPrincipal: 'Bureaux',
    paysPrincipal: 'France',
    badgeSpecial: 'Coup de ❤️ des clients',
    rendementActuel: 5.2,
    minimumInvestissement: 1000
  },
  {
    id: '2',
    nom: 'Europimmo Diversité',
    logo: 'https://ui-avatars.com/api/?name=ED&background=E24A90&color=fff&size=150',
    noteInvestisseurs: 4.8,
    phraseAccroche: 'Forte exposition européenne sur des actifs résidentiels et commerciaux de qualité',
    secteurPrincipal: 'Commerce',
    paysPrincipal: 'Europe',
    rendementActuel: 4.8,
    minimumInvestissement: 500
  },
  {
    id: '3',
    nom: 'Santé & Résidences',
    logo: 'https://ui-avatars.com/api/?name=SR&background=4AE290&color=fff&size=150',
    noteInvestisseurs: 4.3,
    phraseAccroche: 'Spécialisée dans les résidences seniors et établissements de santé',
    secteurPrincipal: 'Santé',
    paysPrincipal: 'France',
    badgeSpecial: 'Top Performance 2024',
    rendementActuel: 4.5,
    minimumInvestissement: 2000
  },
  {
    id: '4',
    nom: 'Logistics Prime',
    logo: 'https://ui-avatars.com/api/?name=LP&background=E2904A&color=fff&size=150',
    noteInvestisseurs: 4.7,
    phraseAccroche: 'Plateformes logistiques stratégiques en Europe et zone de croissance',
    secteurPrincipal: 'Logistique',
    paysPrincipal: 'Europe',
    rendementActuel: 5.5,
    minimumInvestissement: 1500
  },
  {
    id: '5',
    nom: 'Urban Retail France',
    logo: 'https://ui-avatars.com/api/?name=URF&background=904AE2&color=fff&size=150',
    noteInvestisseurs: 4.0,
    phraseAccroche: 'Commerces de proximité en centre-ville dans les grandes métropoles françaises',
    secteurPrincipal: 'Commerce',
    paysPrincipal: 'France',
    rendementActuel: 3.9,
    minimumInvestissement: 800
  },
  {
    id: '6',
    nom: 'Heritage Patrimoine',
    logo: 'https://ui-avatars.com/api/?name=HP&background=E2D44A&color=333&size=150',
    noteInvestisseurs: 4.6,
    phraseAccroche: 'Immobilier résidentiel haut de gamme dans les quartiers historiques parisiens',
    secteurPrincipal: 'Résidentiel',
    paysPrincipal: 'France',
    badgeSpecial: 'Nouveau',
    rendementActuel: 4.2,
    minimumInvestissement: 5000
  },
  {
    id: '7',
    nom: 'TechnoParc Invest',
    logo: 'https://ui-avatars.com/api/?name=TPI&background=4AD4E2&color=fff&size=150',
    noteInvestisseurs: 4.4,
    phraseAccroche: 'Parcs technologiques et bureaux connectés pour entreprises innovantes',
    secteurPrincipal: 'Bureaux',
    paysPrincipal: 'France',
    rendementActuel: 4.9,
    minimumInvestissement: 1200
  },
  {
    id: '8',
    nom: 'EduCampus Europe',
    logo: 'https://ui-avatars.com/api/?name=ECE&background=D44AE2&color=fff&size=150',
    noteInvestisseurs: 4.2,
    phraseAccroche: 'Résidences étudiantes premium près des grandes universités européennes',
    secteurPrincipal: 'Education',
    paysPrincipal: 'Europe',
    rendementActuel: 4.3,
    minimumInvestissement: 1000
  },
  {
    id: '9',
    nom: 'Green Building Fund',
    logo: 'https://ui-avatars.com/api/?name=GBF&background=7AE24A&color=fff&size=150',
    noteInvestisseurs: 4.9,
    phraseAccroche: 'Bâtiments certifiés HQE et BREEAM, engagement environnemental fort',
    secteurPrincipal: 'Bureaux',
    paysPrincipal: 'Europe',
    badgeSpecial: 'Coup de ❤️ des clients',
    rendementActuel: 5.1,
    minimumInvestissement: 2500
  },
  {
    id: '10',
    nom: 'Hospitality Select',
    logo: 'https://ui-avatars.com/api/?name=HS&background=E2694A&color=fff&size=150',
    noteInvestisseurs: 3.8,
    phraseAccroche: 'Hôtels et résidences de tourisme dans les destinations prisées',
    secteurPrincipal: 'Hôtellerie',
    paysPrincipal: 'France',
    rendementActuel: 3.7,
    minimumInvestissement: 3000
  },
  {
    id: '11',
    nom: 'Retail Park Expansion',
    logo: 'https://ui-avatars.com/api/?name=RPE&background=4A69E2&color=fff&size=150',
    noteInvestisseurs: 4.1,
    phraseAccroche: 'Centres commerciaux régionaux et parcs d\'activités en développement',
    secteurPrincipal: 'Commerce',
    paysPrincipal: 'France',
    rendementActuel: 4.4,
    minimumInvestissement: 1500
  },
  {
    id: '12',
    nom: 'Medical Office Buildings',
    logo: 'https://ui-avatars.com/api/?name=MOB&background=E24A69&color=fff&size=150',
    noteInvestisseurs: 4.5,
    phraseAccroche: 'Cabinets médicaux et cliniques privées, secteur résilient',
    secteurPrincipal: 'Santé',
    paysPrincipal: 'France',
    rendementActuel: 4.6,
    minimumInvestissement: 2000
  },
  {
    id: '13',
    nom: 'Nordic Property Fund',
    logo: 'https://ui-avatars.com/api/?name=NPF&background=4AE2D4&color=fff&size=150',
    noteInvestisseurs: 4.7,
    phraseAccroche: 'Diversification nordique avec immobilier scandinave de qualité',
    secteurPrincipal: 'Mixte',
    paysPrincipal: 'Europe',
    badgeSpecial: 'Top Performance 2024',
    rendementActuel: 5.3,
    minimumInvestissement: 1800
  },
  {
    id: '14',
    nom: 'Workspace Future',
    logo: 'https://ui-avatars.com/api/?name=WF&background=E2B44A&color=333&size=150',
    noteInvestisseurs: 4.3,
    phraseAccroche: 'Espaces de coworking et bureaux flexibles nouvelle génération',
    secteurPrincipal: 'Bureaux',
    paysPrincipal: 'France',
    rendementActuel: 4.7,
    minimumInvestissement: 1000
  },
  {
    id: '15',
    nom: 'Residential Plus',
    logo: 'https://ui-avatars.com/api/?name=RP&background=9E4AE2&color=fff&size=150',
    noteInvestisseurs: 4.4,
    phraseAccroche: 'Appartements familiaux dans les villes moyennes à fort potentiel',
    secteurPrincipal: 'Résidentiel',
    paysPrincipal: 'France',
    rendementActuel: 4.0,
    minimumInvestissement: 600
  },
  {
    id: '16',
    nom: 'Industrial Hub Europe',
    logo: 'https://ui-avatars.com/api/?name=IHE&background=4AE269&color=fff&size=150',
    noteInvestisseurs: 4.6,
    phraseAccroche: 'Zones industrielles et entrepôts dans les corridors logistiques majeurs',
    secteurPrincipal: 'Logistique',
    paysPrincipal: 'Europe',
    rendementActuel: 5.4,
    minimumInvestissement: 2000
  },
  {
    id: '17',
    nom: 'Cultural Heritage',
    logo: 'https://ui-avatars.com/api/?name=CH&background=E2944A&color=fff&size=150',
    noteInvestisseurs: 3.9,
    phraseAccroche: 'Réhabilitation de bâtiments historiques en espaces culturels et commerciaux',
    secteurPrincipal: 'Mixte',
    paysPrincipal: 'France',
    badgeSpecial: 'Nouveau',
    rendementActuel: 3.6,
    minimumInvestissement: 4000
  },
  {
    id: '18',
    nom: 'SmartCity Invest',
    logo: 'https://ui-avatars.com/api/?name=SCI&background=694AE2&color=fff&size=150',
    noteInvestisseurs: 4.8,
    phraseAccroche: 'Immobilier connecté et durable dans les écoquartiers innovants',
    secteurPrincipal: 'Résidentiel',
    paysPrincipal: 'Europe',
    badgeSpecial: 'Coup de ❤️ des clients',
    rendementActuel: 5.0,
    minimumInvestissement: 1500
  },
  {
    id: '19',
    nom: 'Sport & Leisure',
    logo: 'https://ui-avatars.com/api/?name=SL&background=E24AD4&color=fff&size=150',
    noteInvestisseurs: 4.0,
    phraseAccroche: 'Centres sportifs et complexes de loisirs en zone urbaine dense',
    secteurPrincipal: 'Loisirs',
    paysPrincipal: 'France',
    rendementActuel: 3.8,
    minimumInvestissement: 2500
  },
  {
    id: '20',
    nom: 'Premium Office Paris',
    logo: 'https://ui-avatars.com/api/?name=POP&background=4ABCE2&color=fff&size=150',
    noteInvestisseurs: 4.9,
    phraseAccroche: 'Bureaux haut de gamme dans les quartiers d\'affaires parisiens stratégiques',
    secteurPrincipal: 'Bureaux',
    paysPrincipal: 'France',
    badgeSpecial: 'Top Performance 2024',
    rendementActuel: 5.6,
    minimumInvestissement: 10000
  },
  {
    id: '21',
    nom: 'Coast & Resort',
    logo: 'https://ui-avatars.com/api/?name=CR&background=E2C44A&color=333&size=150',
    noteInvestisseurs: 4.2,
    phraseAccroche: 'Résidences de vacances sur les côtes méditerranéennes et atlantiques',
    secteurPrincipal: 'Tourisme',
    paysPrincipal: 'France',
    rendementActuel: 4.1,
    minimumInvestissement: 3500
  },
  {
    id: '22',
    nom: 'Data Center REIT',
    logo: 'https://ui-avatars.com/api/?name=DCR&background=B44AE2&color=fff&size=150',
    noteInvestisseurs: 4.7,
    phraseAccroche: 'Centres de données sécurisés pour l\'économie numérique en croissance',
    secteurPrincipal: 'Technologie',
    paysPrincipal: 'Europe',
    badgeSpecial: 'Nouveau',
    rendementActuel: 5.8,
    minimumInvestissement: 5000
  }
];