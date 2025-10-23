import {
  Component,
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
import { UploadResponse } from '../../core/model/UploadResponse';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
export class UploadFileComponent {
  @ViewChildren('fileUploadRef') fileUpload!: QueryList<FileUpload>;

  private toastr = inject(ToastrService);
  private uploadService = inject(DocumentService);
  private sanitizer = inject(DomSanitizer);

  files: Record<string, File | null> = {
    identity: null,
    address: null,
    tax: null,
  };

  

  readonly maxFileSize = 10 * 1024 * 1024;
  readonly accept = '.pdf,.jpg,.jpeg,.png';

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

  onSelect(event: any, key: string): void {
    const file: File = event.files[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

    if (!allowedTypes.includes(file.type)) {
      this.toastr.error('Format non pris en charge (PDF, JPG, PNG).');
      this.clearFileUpload(key);
      return;
    }

    if (file.size > this.maxFileSize) {
      this.toastr.error('Fichier trop volumineux (max 10 Mo).');
      this.clearFileUpload(key);
      return;
    }

    this.files[key] = file;
    this.toastr.info(`Fichier sélectionné : ${file.name}`);
  }

  onClear(key: string): void {
    this.files[key] = null;
  }

  triggerChoose(event: Event, key: string): void {
    event.preventDefault();
    event.stopPropagation();
    const uploader = this.fileUpload.find((f) => f.name === key);
    if (uploader) {
      uploader.choose();
    }
  }

  clear(key: string): void {
    this.files[key] = null;
    this.clearFileUpload(key);
    this.toastr.info('Fichier retiré.');
  }

  private clearFileUpload(key: string): void {
    const uploader = this.fileUpload.find((f) => f.name === key);
    if (uploader) {
      uploader.clear();
    }
  }

  preview(key: string): void {
    const file = this.files[key];
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
  let pending = 0;
  let successCount = 0;
  let errorCount = 0;

  this.documents.forEach((doc) => {
    const file = this.files[doc.key];
    if (file) {
      pending++;
      this.uploadService
        .uploadFile(file, doc.enumValue)
        .pipe(
          finalize(() => {
            pending--;
            if (pending === 0) {
              if (errorCount === 0) {
                this.toastr.success('Tous les fichiers ont été uploadés avec succès !');
              } else {
                this.toastr.warning(`${successCount} fichier(s) uploadé(s), ${errorCount} échec(s)`);
              }
            }
          })
        )
        .subscribe({
          next: (res: UploadResponse) => {
            successCount++;
            this.toastr.success(`${doc.label} uploadé avec succès !`);
            console.log('Upload success:', res);
          },
          error: (err) => {
            errorCount++;
            console.error('Upload error:', err);
            
            if (err.status === 201) {
              successCount++;
              this.toastr.success(`${doc.label} uploadé avec succès !`);
            } else {
              this.toastr.error(`Erreur lors de l'upload de ${doc.label}.`);
            }
          },
        });
    }
  });

  if (pending === 0) {
    this.toastr.warning('Aucun fichier à uploader.');
  }
}

  canSave(): boolean {
    return Object.values(this.files).every((f) => f !== null);
  }



}
