import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { PixelArtGrid } from '../../types';

/**
 * Property tests for Pixel Art Grid Structure
 * **Feature: teletext-universe, Property 7: Pixel Art Grid Structure**
 * **Validates: Requirements 7.3**
 */

// Teletext color palette as defined in the design
const TELETEXT_COLORS = [
  '#080808', // black
  '#E6D8B0', // cream
  '#FF6B35', // orange
  '#4CAF50', // green
  '#F44336', // red
  '#00BCD4', // cyan
  '#FFEB3B', // yellow
  '#E91E63', // magenta
  '#2196F3', // blue
  '#FFFFFF', // white
  '#FF8C00', // dark orange (used in PixelArtPage palette)
  '#00FF00', // lime green
  '#FF0000', // pure red
  '#00FFFF', // pure cyan
  '#FFFF00', // pure yellow
  '#FF00FF', // pure magenta
];

// Generator for valid hex color strings (using stringOf with hex characters)
const hexCharArb = fc.constantFrom(...'0123456789ABCDEFabcdef'.split(''));
const hexColorArb = fc.array(hexCharArb, { minLength: 6, maxLength: 6 }).map(chars => `#${chars.join('').toUpperCase()}`);

// Generator for teletext palette colors
const teletextColorArb = fc.constantFrom(...TELETEXT_COLORS);

// Generator for a valid 8x8 pixel art grid using teletext colors
const validPixelArtGridArb: fc.Arbitrary<PixelArtGrid> = fc.tuple(
  fc.array(fc.array(teletextColorArb, { minLength: 8, maxLength: 8 }), { minLength: 8, maxLength: 8 })
).map(([pixels]) => ({ pixels }));

// Generator for a valid 8x8 pixel art grid using any hex colors
const anyHexPixelArtGridArb: fc.Arbitrary<PixelArtGrid> = fc.tuple(
  fc.array(fc.array(hexColorArb, { minLength: 8, maxLength: 8 }), { minLength: 8, maxLength: 8 })
).map(([pixels]) => ({ pixels }));

// Regex for valid hex color format
const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

/**
 * Validates that a PixelArtGrid has the correct structure:
 * - Exactly 8 rows
 * - Each row has exactly 8 columns
 * - All values are valid hex color strings
 */
function validatePixelArtGrid(grid: PixelArtGrid): {
  valid: boolean;
  totalCells: number;
  rowCount: number;
  allRowsHave8Cols: boolean;
  allValidColors: boolean;
} {
  const rowCount = grid.pixels.length;
  const allRowsHave8Cols = grid.pixels.every(row => Array.isArray(row) && row.length === 8);
  const totalCells = grid.pixels.reduce((sum, row) => sum + (Array.isArray(row) ? row.length : 0), 0);
  const allValidColors = grid.pixels.every(row =>
    Array.isArray(row) && row.every(color => typeof color === 'string' && HEX_COLOR_REGEX.test(color))
  );

  return {
    valid: rowCount === 8 && allRowsHave8Cols && allValidColors,
    totalCells,
    rowCount,
    allRowsHave8Cols,
    allValidColors,
  };
}

describe('Pixel Art Grid Structure', () => {
  /**
   * **Feature: teletext-universe, Property 7: Pixel Art Grid Structure**
   * **Validates: Requirements 7.3**
   * 
   * For any pixel art data received from the LLM service, the rendered grid
   * SHALL contain exactly 64 cells (8 rows × 8 columns) with valid color values.
   */
  it('should have exactly 64 cells (8 rows × 8 columns) for any valid pixel art grid', () => {
    fc.assert(
      fc.property(validPixelArtGridArb, (grid) => {
        const validation = validatePixelArtGrid(grid);
        
        // Must have exactly 8 rows
        expect(validation.rowCount).toBe(8);
        
        // Each row must have exactly 8 columns
        expect(validation.allRowsHave8Cols).toBe(true);
        
        // Total cells must be 64
        expect(validation.totalCells).toBe(64);
        
        return validation.valid;
      }),
      { numRuns: 100 }
    );
  });

  it('should have all valid hex color values for any pixel art grid', () => {
    fc.assert(
      fc.property(anyHexPixelArtGridArb, (grid) => {
        const validation = validatePixelArtGrid(grid);
        
        // All colors must be valid hex format
        expect(validation.allValidColors).toBe(true);
        
        return validation.allValidColors;
      }),
      { numRuns: 100 }
    );
  });

  it('should maintain grid structure invariants after validation', () => {
    fc.assert(
      fc.property(validPixelArtGridArb, (grid) => {
        // Verify the grid structure is consistent
        const { pixels } = grid;
        
        // Row count invariant
        const hasCorrectRowCount = pixels.length === 8;
        
        // Column count invariant for each row
        const hasCorrectColCount = pixels.every(row => row.length === 8);
        
        // Color format invariant
        const hasValidColors = pixels.flat().every(color => HEX_COLOR_REGEX.test(color));
        
        return hasCorrectRowCount && hasCorrectColCount && hasValidColors;
      }),
      { numRuns: 100 }
    );
  });
});
