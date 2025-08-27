import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BaseTemplate } from './BaseTemplate';

const meta: Meta<typeof BaseTemplate> = {
  title: 'Templates/BaseTemplate',
  component: BaseTemplate,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div>Main content goes here</div>,
  },
};

export const WithCustomNavigation: Story = {
  args: {
    children: <div>Main content goes here</div>,
    leftNav: (
      <>
        <li>Custom Link 1</li>
        <li>Custom Link 2</li>
        <li>Custom Link 3</li>
      </>
    ),
  },
};
