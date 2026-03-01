import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ActionBar from '../../src/components/action-bar';

describe('ActionBar Component', () => {
  beforeEach(() => {
    // Mock window.ipcRenderer
    (window as any).ipcRenderer = {
      send: vi.fn(),
      on: vi.fn(),
      invoke: vi.fn(),
    } as any;
  });

  it('calls minimize when minimize button is clicked', () => {
    render(<ActionBar />);
    const buttons = screen.getAllByRole('button');
    // Minimize is the first button (Minus icon)
    fireEvent.click(buttons[0]);
    expect((window as any).ipcRenderer.send).toHaveBeenCalledWith('win:minimize');
  });

  it('calls maximize when maximize button is clicked', () => {
    render(<ActionBar />);
    const buttons = screen.getAllByRole('button');
    // Maximize is the second button (Square icon)
    fireEvent.click(buttons[1]);
    expect((window as any).ipcRenderer.send).toHaveBeenCalledWith('win:maximize');
  });

  it('calls close when close button is clicked', () => {
    render(<ActionBar />);
    const buttons = screen.getAllByRole('button');
    // Close is the third button (X icon)
    fireEvent.click(buttons[2]);
    expect((window as any).ipcRenderer.send).toHaveBeenCalledWith('win:close');
  });
});
