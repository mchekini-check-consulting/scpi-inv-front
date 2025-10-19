import type { Meta, StoryObj } from '@storybook/angular';
import { InputComponent } from './input.component';

const meta: Meta<InputComponent> = {
  title: 'Atoms/Input',
  component: InputComponent,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'Type de champ'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Taille du champ'
    },
    disabled: {
      control: 'boolean',
      description: 'Champ désactivé'
    },
    error: {
      control: 'boolean',
      description: 'Afficher en erreur'
    }
  }
};

export default meta;
type Story = StoryObj<InputComponent>;


export const Default: Story = {
  args: {
    type: 'text',
    placeholder: 'Entrez votre texte',
    size: 'md',
    disabled: false,
    error: false
  }
};


export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'votre@email.com',
    size: 'md'
  }
};


export const Password: Story = {
  args: {
    type: 'password',
    placeholder: '••••••••',
    size: 'md'
  }
};


export const WithError: Story = {
  args: {
    type: 'email',
    placeholder: 'votre@email.com',
    error: true,
    errorMessage: 'Email invalide'
  }
};


export const Disabled: Story = {
  args: {
    type: 'text',
    placeholder: 'Champ désactivé',
    disabled: true
  }
};


export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <app-input type="text" placeholder="Small (sm)" size="sm"></app-input>
        <app-input type="text" placeholder="Medium (md)" size="md"></app-input>
        <app-input type="text" placeholder="Large (lg)" size="lg"></app-input>
      </div>
    `
  })
};


export const AllTypes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <app-input type="text" placeholder="Texte"></app-input>
        <app-input type="email" placeholder="Email"></app-input>
        <app-input type="password" placeholder="Mot de passe"></app-input>
        <app-input type="number" placeholder="Nombre"></app-input>
        <app-input type="tel" placeholder="Téléphone"></app-input>
        <app-input type="url" placeholder="URL"></app-input>
      </div>
    `
  })
};