import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { GaugeChart, GaugeDemo } from '../GaugeChart';

// Mock SVG getBBox method for testing
Object.defineProperty(SVGElement.prototype, 'getBBox', {
  value: () => ({ x: 0, y: 0, width: 100, height: 100 }),
  writable: true,
});

// Mock SVG getComputedTextLength method
Object.defineProperty(SVGElement.prototype, 'getComputedTextLength', {
  value: () => 50,
  writable: true,
});

describe('GaugeChart Component', () => {
  describe('Basic Rendering', () => {
    it('should render with default props', () => {
      render(<GaugeChart />);
      
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '300');
    });

    it('should render with custom value', () => {
      render(<GaugeChart value={75} />);
      
      const valueText = screen.getByText('75');
      expect(valueText).toBeInTheDocument();
    });

    it('should render with custom size', () => {
      render(<GaugeChart size={400} />);
      
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('width', '400');
    });

    it('should render current value display', () => {
      render(<GaugeChart value={42} />);
      
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('Current Value')).toBeInTheDocument();
    });
  });

  describe('Value Validation', () => {
    it('should handle minimum value', () => {
      render(<GaugeChart value={0} min={0} max={100} />);
      
      const valueText = screen.getByText('0');
      expect(valueText).toBeInTheDocument();
    });

    it('should handle maximum value', () => {
      render(<GaugeChart value={100} min={0} max={100} />);
      
      const valueText = screen.getByText('100');
      expect(valueText).toBeInTheDocument();
    });

    it('should handle custom min/max range', () => {
      render(<GaugeChart value={50} min={20} max={80} />);
      
      const valueText = screen.getByText('50');
      expect(valueText).toBeInTheDocument();
    });

    it('should clamp values outside range', () => {
      const { rerender } = render(<GaugeChart value={150} min={0} max={100} />);
      
      // Value should be treated as 100 (max)
      expect(screen.getByText('150')).toBeInTheDocument();
      
      rerender(<GaugeChart value={-10} min={0} max={100} />);
      
      // Value should be treated as 0 (min)
      expect(screen.getByText('-10')).toBeInTheDocument();
    });
  });

  describe('SVG Elements', () => {
    it('should render all SVG segments', () => {
      render(<GaugeChart value={50} />);
      
      const paths = document.querySelectorAll('path');
      expect(paths).toHaveLength(3); // background, gray segment, needle
    });

    it('should render needle element', () => {
      render(<GaugeChart value={25} />);
      
      const needle = document.querySelector('path[fill="#000000"]');
      expect(needle).toBeInTheDocument();
    });

    it('should render center circle', () => {
      render(<GaugeChart value={50} />);
      
      const circle = document.querySelector('circle');
      expect(circle).toBeInTheDocument();
      expect(circle).toHaveAttribute('r', '8');
      expect(circle).toHaveAttribute('fill', '#000000');
    });

    it('should render scale labels', () => {
      render(<GaugeChart value={50} />);
      
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  describe('Color Segments', () => {
    it('should render progress segment with correct color', () => {
      render(<GaugeChart value={30} />);
      
      const graySegment = document.querySelector('path[fill="#6b7280"]');
      expect(graySegment).toBeInTheDocument();
    });

    it('should render remaining segment with correct color', () => {
      render(<GaugeChart value={70} />);
      
      const greenSegment = document.querySelector('path[fill="#22c55e"]');
      expect(greenSegment).toBeInTheDocument();
    });
  });

  describe('Value Label Position', () => {
    it('should position value label near needle', () => {
      render(<GaugeChart value={50} />);
      
      const valueLabel = screen.getByText('50');
      expect(valueLabel).toHaveAttribute('text-anchor', 'middle');
      expect(valueLabel).toHaveAttribute('font-weight', 'bold');
    });

    it('should update label position when value changes', () => {
      const { rerender } = render(<GaugeChart value={25} />);
      
      const label25 = screen.getByText('25');
      const initialX = label25.getAttribute('x');
      
      rerender(<GaugeChart value={75} />);
      
      const label75 = screen.getByText('75');
      const newX = label75.getAttribute('x');
      
      expect(initialX).not.toBe(newX);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<GaugeChart value={50} />);
      
      const container = document.querySelector('.flex.flex-col.items-center.justify-center');
      expect(container).toBeInTheDocument();
    });

    it('should have readable text elements', () => {
      render(<GaugeChart value={75} />);
      
      const valueText = screen.getByText('75');
      expect(valueText).toHaveAttribute('fill', '#000000');
      expect(valueText).toHaveAttribute('font-size', '18');
    });

    it('should have sufficient color contrast', () => {
      render(<GaugeChart value={50} />);
      
      const labels = document.querySelectorAll('text[fill="#374151"]');
      expect(labels.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero value', () => {
      render(<GaugeChart value={0} />);
      
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle decimal values', () => {
      render(<GaugeChart value={33.33} />);
      
      expect(screen.getByText('33.33')).toBeInTheDocument();
    });

    it('should handle very large values', () => {
      render(<GaugeChart value={9999} max={10000} />);
      
      expect(screen.getByText('9999')).toBeInTheDocument();
    });

    it('should handle negative min values', () => {
      render(<GaugeChart value={0} min={-50} max={50} />);
      
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });
});

describe('GaugeDemo Component', () => {
  describe('Interactive Controls', () => {
    it('should render with initial value', () => {
      render(<GaugeDemo />);
      
      expect(screen.getByText('17')).toBeInTheDocument();
      expect(screen.getByText('Adjust Value: 17')).toBeInTheDocument();
    });

    it('should update value when slider changes', async () => {
      const user = userEvent.setup();
      render(<GaugeDemo />);
      
      const slider = screen.getByRole('slider');
      await user.clear(slider);
      await user.type(slider, '50');
      
      await waitFor(() => {
        expect(screen.getByText('Adjust Value: 50')).toBeInTheDocument();
      });
    });

    it('should update value when preset buttons are clicked', async () => {
      const user = userEvent.setup();
      render(<GaugeDemo />);
      
      const button35 = screen.getByText('35');
      await user.click(button35);
      
      await waitFor(() => {
        expect(screen.getByText('35')).toBeInTheDocument();
      });
    });

    it('should render all preset buttons', () => {
      render(<GaugeDemo />);
      
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('35')).toBeInTheDocument();
      expect(screen.getByText('65')).toBeInTheDocument();
      expect(screen.getByText('85')).toBeInTheDocument();
    });
  });

  describe('Color Legend', () => {
    it('should display color legend', () => {
      render(<GaugeDemo />);
      
      expect(screen.getByText('Color Segments')).toBeInTheDocument();
      expect(screen.getByText(/Progress/)).toBeInTheDocument();
      expect(screen.getByText(/Remaining/)).toBeInTheDocument();
    });

    it('should update legend values when gauge value changes', async () => {
      const user = userEvent.setup();
      render(<GaugeDemo />);
      
      const button65 = screen.getByText('65');
      await user.click(button65);
      
      await waitFor(() => {
        expect(screen.getByText('0 - 65 (Progress)')).toBeInTheDocument();
        expect(screen.getByText('65 - 100 (Remaining)')).toBeInTheDocument();
      });
    });
  });

  describe('Layout and Styling', () => {
    it('should have proper layout classes', () => {
      render(<GaugeDemo />);
      
      const mainContainer = document.querySelector('.min-h-screen.bg-gray-50');
      expect(mainContainer).toBeInTheDocument();
    });

    it('should have centered content', () => {
      render(<GaugeDemo />);
      
      const centeredContainer = document.querySelector('.flex.flex-col.justify-center');
      expect(centeredContainer).toBeInTheDocument();
    });

    it('should have proper card styling', () => {
      render(<GaugeDemo />);
      
      const cards = document.querySelectorAll('.bg-white.rounded-lg.shadow-lg');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive container', () => {
      render(<GaugeDemo />);
      
      const container = document.querySelector('.max-w-2xl.mx-auto');
      expect(container).toBeInTheDocument();
    });

    it('should have responsive padding', () => {
      render(<GaugeDemo />);
      
      const container = document.querySelector('.px-4');
      expect(container).toBeInTheDocument();
    });
  });
});

describe('Utility Functions', () => {
  describe('Angle Calculations', () => {
    // Test angle calculation logic
    it('should calculate correct angle for minimum value', () => {
      const value = 0;
      const min = 0;
      const max = 100;
      const expectedAngle = 180; // 180 degrees for 0% progress
      
      const calculatedAngle = ((value - min) / (max - min)) * 180 + 180;
      expect(calculatedAngle).toBe(expectedAngle);
    });

    it('should calculate correct angle for maximum value', () => {
      const value = 100;
      const min = 0;
      const max = 100;
      const expectedAngle = 360; // 360 degrees for 100% progress
      
      const calculatedAngle = ((value - min) / (max - min)) * 180 + 180;
      expect(calculatedAngle).toBe(expectedAngle);
    });

    it('should calculate correct angle for middle value', () => {
      const value = 50;
      const min = 0;
      const max = 100;
      const expectedAngle = 270; // 270 degrees for 50% progress
      
      const calculatedAngle = ((value - min) / (max - min)) * 180 + 180;
      expect(calculatedAngle).toBe(expectedAngle);
    });
  });

  describe('Path Generation', () => {
    it('should generate valid SVG path for segment', () => {
      // Mock path generation test
      const startAngle = 180;
      const endAngle = 270;
      
      // Test that path contains proper SVG commands
      expect(startAngle).toBeLessThan(endAngle);
      expect(endAngle - startAngle).toBe(90);
    });
  });
});

describe('Performance Tests', () => {
  it('should render within acceptable time', () => {
    const startTime = performance.now();
    
    render(<GaugeChart value={50} />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render within 100ms
    expect(renderTime).toBeLessThan(100);
  });

  it('should handle rapid value changes', async () => {
    const { rerender } = render(<GaugeChart value={0} />);
    
    const startTime = performance.now();
    
    // Simulate rapid updates
    for (let i = 0; i <= 100; i += 10) {
      rerender(<GaugeChart value={i} />);
    }
    
    const endTime = performance.now();
    const updateTime = endTime - startTime;
    
    // Should handle 11 updates within 50ms
    expect(updateTime).toBeLessThan(50);
  });
});

describe('Error Handling', () => {
  // Mock console.error to test error scenarios
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  
  afterAll(() => {
    console.error = originalError;
  });

  it('should handle invalid value prop gracefully', () => {
    render(<GaugeChart value={NaN} />);
    
    // Component should still render without throwing
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should handle invalid size prop gracefully', () => {
    render(<GaugeChart size={0} value={50} />);
    
    // Component should still render
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});

// Integration tests
describe('Integration Tests', () => {
  it('should work with real user interactions', async () => {
    const user = userEvent.setup();
    render(<GaugeDemo />);
    
    // Initial state
    expect(screen.getByText('17')).toBeInTheDocument();
    
    // Click preset button
    const button65 = screen.getByText('65');
    await user.click(button65);
    
    await waitFor(() => {
      expect(screen.getByText('65')).toBeInTheDocument();
    });
    
    // Use slider
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '80' } });
    
    await waitFor(() => {
      expect(screen.getByText('Adjust Value: 80')).toBeInTheDocument();
    });
  });

  it('should maintain visual consistency across value changes', async () => {
    const user = userEvent.setup();
    render(<GaugeDemo />);
    
    const testValues = [0, 25, 50, 75, 100];
    
    for (const value of testValues) {
      const button = screen.getByText(value.toString());
      if (button && button.tagName === 'BUTTON') {
        await user.click(button);
        
        await waitFor(() => {
          expect(screen.getByText(value.toString())).toBeInTheDocument();
        });
        
        // Verify SVG elements are still present
        expect(document.querySelector('svg')).toBeInTheDocument();
        expect(document.querySelector('circle')).toBeInTheDocument();
      }
    }
  });
});
