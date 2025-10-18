import type { Meta, StoryObj } from '@storybook/angular';
import { DialogComponent } from './dialog.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { FormFieldComponent } from '../form-field/form-field.component';

const meta: Meta<DialogComponent> = {
  title: 'Molecules/Dialog',
  component: DialogComponent,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Dialog ouvert ou fermé'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Taille du dialog'
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Afficher le bouton de fermeture'
    }
  }
};

export default meta;
type Story = StoryObj<DialogComponent>;

// Story : Dialog simple
export const Simple: Story = {
  args: {
    isOpen: true,
    title: 'Titre du dialog',
    size: 'md',
    showCloseButton: true
  },
  render: (args) => ({
    props: args,
    template: `
      <app-dialog 
        [isOpen]="isOpen" 
        [title]="title" 
        [size]="size"
        [showCloseButton]="showCloseButton">
        <p>Contenu du dialog</p>
      </app-dialog>
    `
  })
};

// Story : Dialog de connexion
export const LoginDialog: Story = {
  args: {
    isOpen: true,
    title: 'Se connecter',
    size: 'md'
  },
  render: (args) => ({
    props: args,
    template: `
      <app-dialog [isOpen]="isOpen" [title]="title" [size]="size">
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <app-form-field 
            label="Email" 
            type="email" 
            placeholder="votre@email.com"
            inputId="login-email"
            [required]="true">
          </app-form-field>
          
          <app-form-field 
            label="Mot de passe" 
            type="password" 
            placeholder="••••••••"
            inputId="login-password"
            [required]="true">
          </app-form-field>
          
          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px;">
            <app-button variant="outline">Annuler</app-button>
            <app-button variant="primary">Se connecter</app-button>
          </div>
        </div>
      </app-dialog>
    `,
    moduleMetadata: {
      imports: [ButtonComponent, FormFieldComponent]
    }
  })
};

// Story : Dialog d'inscription
export const RegisterDialog: Story = {
  args: {
    isOpen: true,
    title: "S'inscrire",
    size: 'md'
  },
  render: (args) => ({
    props: args,
    template: `
      <app-dialog [isOpen]="isOpen" [title]="title" [size]="size">
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <app-form-field 
            label="Nom complet" 
            type="text" 
            placeholder="Jean Dupont"
            inputId="register-name"
            [required]="true">
          </app-form-field>
          
          <app-form-field 
            label="Email" 
            type="email" 
            placeholder="votre@email.com"
            inputId="register-email"
            [required]="true">
          </app-form-field>
          
          <app-form-field 
            label="Mot de passe" 
            type="password" 
            placeholder="••••••••"
            inputId="register-password"
            [required]="true">
          </app-form-field>
          
          <app-form-field 
            label="Confirmer le mot de passe" 
            type="password" 
            placeholder="••••••••"
            inputId="register-confirm"
            [required]="true">
          </app-form-field>
          
          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px;">
            <app-button variant="outline">Annuler</app-button>
            <app-button variant="primary">S'inscrire</app-button>
          </div>
        </div>
      </app-dialog>
    `,
    moduleMetadata: {
      imports: [ButtonComponent, FormFieldComponent]
    }
  })
};

// Story : Différentes tailles
export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <app-dialog [isOpen]="true" title="Small Dialog" size="sm">
          <p>Dialog de petite taille</p>
        </app-dialog>
      </div>
    `
  })
};

// Story : Sans bouton de fermeture
export const NoCloseButton: Story = {
  args: {
    isOpen: true,
    title: 'Action requise',
    size: 'md',
    showCloseButton: false
  },
  render: (args) => ({
    props: args,
    template: `
      <app-dialog 
        [isOpen]="isOpen" 
        [title]="title" 
        [size]="size"
        [showCloseButton]="showCloseButton">
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <p>Vous devez accepter les conditions pour continuer.</p>
          <div style="display: flex; justify-content: flex-end; gap: 12px;">
            <app-button variant="primary">Accepter</app-button>
          </div>
        </div>
      </app-dialog>
    `,
    moduleMetadata: {
      imports: [ButtonComponent]
    }
  })
};