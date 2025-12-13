export interface UserDocument {
  type: 'PIECE_IDENTITE' | 'JUSTIFICATIF_DOMICILE' | 'AVIS_IMPOSITION';
  status: 'PENDING' | 'UNDER_REVIEW' | 'VALIDATED' | 'REJECTED';
}
