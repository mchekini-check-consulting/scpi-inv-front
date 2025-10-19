import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  title: 'Atoms/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
      description: 'Style du bouton'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Taille du bouton'
    },
    disabled: {
      control: 'boolean',
      description: 'Bouton désactivé'
    }
  }
};

export default meta;  // ← Cette ligne est OBLIGATOIRE
type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false
  },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size" [disabled]="disabled">S'inscrire</app-button>`
  })
};