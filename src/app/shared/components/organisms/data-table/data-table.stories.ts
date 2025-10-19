import type { Meta, StoryObj } from '@storybook/angular';
import { DataTableComponent } from './data-table.component';

const meta: Meta<DataTableComponent> = {
  title: 'Organisms/DataTable',
  component: DataTableComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<DataTableComponent>;

export const Default: Story = {};