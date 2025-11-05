import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ToastrService } from 'ngx-toastr';
import { DocumentService } from '../../core/service/document.service';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadModule,
    ButtonModule,
    CardModule,
    DialogModule,
  ],
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent implements OnInit {
  @ViewChildren('fileUploadRef') fileUpload!: QueryList<FileUpload>;

  private toastr = inject(ToastrService);
  private uploadService = inject(DocumentService);
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);

  loadingStatus = true;
  allUploaded = false;

  readonly maxFileSize = 10 * 1024 * 1024;
  readonly accept = '.pdf,.jpg,.jpeg,.png';

  files: Record<string, File[]> = {
    identity: [],
    address: [],
    tax: [],
  };

  previewState = {
    visible: false,
    safeUrl: null as SafeResourceUrl | null,
    type: '' as 'pdf' | 'image' | '',
  };

  documents = [
    { key: 'identity', label: "Pièce d'identité", enumValue: 'PIECE_IDENTITE' },
    {
      key: 'address',
      label: 'Justificatif de domicile',
      enumValue: 'JUSTIFICATIF_DOMICILE',
    },
    { key: 'tax', label: "Avis d'imposition", enumValue: 'AVIS_IMPOSITION' },
  ];

  ngOnInit(): void {
    this.checkIfDocumentsUploaded();
  }

  checkIfDocumentsUploaded(): void {
    this.loadingStatus = true;
    this.uploadService.getUploadStatus().subscribe({
      next: (response) => {
        this.loadingStatus = false;
        this.allUploaded = response.documentsUploaded;
      },
      error: () => {
        this.loadingStatus = false;
        this.toastr.error('Erreur lors de la vérification du statut.');
      },
    });
  }

  onSelect(event: any, key: string): void {
    const selectedFiles: File[] = event.files || [];
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

    const validFiles = selectedFiles.filter(
      (file) =>
        allowedTypes.includes(file.type) && file.size <= this.maxFileSize
    );

    if (validFiles.length < selectedFiles.length) {
      this.toastr.warning(
        'Certains fichiers ont été ignorés (format ou taille).'
      );
    }

    if (validFiles.length > 0) {
      this.files[key].push(...validFiles);
    } else {
      this.clearFileUpload(key);
    }
  }

  onClear(key: string): void {
    this.files[key] = [];
    this.clearFileUpload(key);
  }

  triggerChoose(event: Event, key: string): void {
    event.preventDefault();
    event.stopPropagation();
    const uploader = this.fileUpload.find((f) => f.name === key);
    if (uploader) uploader.choose();
  }

  private clearFileUpload(key: string): void {
    const uploader = this.fileUpload.find((f) => f.name === key);
    if (uploader) uploader.clear();
  }

  previewFile(key: string, file: File): void {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(result);

      this.previewState = {
        visible: true,
        safeUrl,
        type: file.type === 'application/pdf' ? 'pdf' : 'image',
      };
    };
    reader.readAsDataURL(file);
  }

  closePreview(): void {
    this.previewState = { visible: false, safeUrl: null, type: '' };
  }

  save(): void {
    const allFiles = Object.entries(this.files).flatMap(([key, files]) =>
      files.map((file) => ({ key, file }))
    );

    if (allFiles.length === 0) {
      this.toastr.warning('Aucun fichier à uploader.');
      return;
    }

    let pending = allFiles.length;
    let successCount = 0;
    let errorCount = 0;

    allFiles.forEach(({ key, file }) => {
      this.uploadService
        .uploadFile(file, this.documents.find((d) => d.key === key)?.enumValue!)
        .pipe(
          finalize(() => {
            pending--;
            if (pending === 0) {
              if (errorCount === 0) {
                this.allUploaded = true;
                this.toastr.success(
                  'Tous les fichiers ont été uploadés avec succès !'
                );
              } else {
                this.toastr.error(
                  `${successCount} fichier(s) uploadé(s), ${errorCount} échec(s)`
                );
              }
            }
          })
        )
        .subscribe({
          next: () => successCount++,
          error: () => errorCount++,
        });
    });
  }

  canSave(): boolean {
    return Object.values(this.files).every((f) => f && f.length > 0);
  }

  removeFile(key: string, file: File): void {
    if (!this.files[key]) return;
    this.files[key] = this.files[key].filter((f) => f !== file);
    if (this.files[key].length === 0) this.clearFileUpload(key);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard/scpi']);
  }
}
