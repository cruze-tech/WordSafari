/**
 * SVG Factory
 * Renders trusted animal SVG templates with semantic classes and CSS-variable based color roles.
 */

import { getSvgTemplate } from './svgTemplates.js';

const BLACK_HEXES = new Set(['#000', '#000000', '#111', '#111111', '#222', '#222222', '#333', '#333333']);
const WHITE_HEXES = new Set(['#fff', '#ffffff', '#f5f5f5', '#f7f7f7', '#eeeeee', '#eee']);

function normalizeHex(rawColor) {
  if (!rawColor) return null;
  const lower = rawColor.trim().toLowerCase();
  if (!lower.startsWith('#')) return lower;

  if (lower.length === 4) {
    const r = lower[1];
    const g = lower[2];
    const b = lower[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }

  if (lower.length === 7) {
    return lower;
  }

  return lower;
}

function pickPalette(template) {
  const colorMatches = template.body.match(/#[0-9a-fA-F]{3,6}/g) || [];
  const normalized = colorMatches.map(normalizeHex).filter(Boolean);
  const unique = [...new Set(normalized)];

  const expressive = unique.filter((color) => {
    const compact = color.length === 7
      ? `#${color[1]}${color[3]}${color[5]}`
      : color;
    return !BLACK_HEXES.has(color) && !BLACK_HEXES.has(compact) && !WHITE_HEXES.has(color) && !WHITE_HEXES.has(compact);
  });

  return {
    bg: normalizeHex(template.background) || '#ff8c42',
    base: expressive[0] || normalizeHex(template.background) || '#ff8c42',
    accent: expressive[1] || expressive[0] || normalizeHex(template.background) || '#ff8c42',
    detail: expressive[2] || expressive[1] || expressive[0] || '#c76a2a',
    eye: '#2c3e50',
    highlight: '#ffffff',
    line: '#2c3e50',
  };
}

function colorRoleFor(rawColor, palette) {
  const color = normalizeHex(rawColor);
  if (!color) return 'detail';

  const compact = color.length === 7
    ? `#${color[1]}${color[3]}${color[5]}`
    : color;

  if (BLACK_HEXES.has(color) || BLACK_HEXES.has(compact)) return 'eye';
  if (WHITE_HEXES.has(color) || WHITE_HEXES.has(compact)) return 'highlight';
  if (color === palette.base) return 'base';
  if (color === palette.accent) return 'accent';
  if (color === palette.detail) return 'detail';

  return 'detail';
}

function attachClass(rawAttrs, classToAdd) {
  const classMatch = rawAttrs.match(/\sclass="([^"]*)"/i);
  if (!classMatch) {
    return `${rawAttrs} class="${classToAdd}"`;
  }

  const nextClassValue = `${classMatch[1]} ${classToAdd}`.trim().replace(/\s+/g, ' ');
  return rawAttrs.replace(/\sclass="([^"]*)"/i, ` class="${nextClassValue}"`);
}

function paintSemanticMarkup(body, palette) {
  const fillRegex = /<([a-z]+)([^>]*?)\sfill="([^"]+)"([^>]*)>/gi;
  const strokeRegex = /<([a-z]+)([^>]*?)\sstroke="([^"]+)"([^>]*)>/gi;

  const fillApplied = body.replace(fillRegex, (match, tag, before, fillColor, after) => {
    if (!fillColor.startsWith('#')) return match;
    const role = colorRoleFor(fillColor, palette);
    const attrs = attachClass(`${before}${after}`, `svg-part svg-fill-${role}`);
    return `<${tag}${attrs} fill="var(--animal-${role})">`;
  });

  return fillApplied.replace(strokeRegex, (match, tag, before, strokeColor, after) => {
    if (!strokeColor.startsWith('#')) return match;
    const role = colorRoleFor(strokeColor, palette);
    const attrs = attachClass(`${before}${after}`, `svg-part svg-stroke-${role}`);
    const strokeRole = role === 'highlight' ? 'line' : role;
    return `<${tag}${attrs} stroke="var(--animal-${strokeRole})">`;
  });
}

function createFallbackSvg() {
  return `<svg class="animal-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="50" cy="50" r="44" class="svg-part svg-fill-base" fill="var(--animal-base, #ff8c42)" />
    <circle cx="40" cy="42" r="5" class="svg-part svg-fill-eye" fill="var(--animal-eye, #2c3e50)" />
    <circle cx="60" cy="42" r="5" class="svg-part svg-fill-eye" fill="var(--animal-eye, #2c3e50)" />
    <path d="M34 60 Q50 72 66 60" class="svg-part svg-stroke-eye" fill="none" stroke="var(--animal-eye, #2c3e50)" stroke-width="4" stroke-linecap="round" />
  </svg>`;
}

export function renderAnimalSvg(animalId) {
  const template = getSvgTemplate(animalId);
  if (!template) return createFallbackSvg();

  const palette = pickPalette(template);
  const semanticBody = paintSemanticMarkup(template.body, palette);

  return `<svg
    class="animal-svg"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style="--animal-bg: ${palette.bg}; --animal-base: ${palette.base}; --animal-accent: ${palette.accent}; --animal-detail: ${palette.detail}; --animal-eye: ${palette.eye}; --animal-highlight: ${palette.highlight}; --animal-line: ${palette.line};"
  >
    <circle cx="50" cy="50" r="48" class="svg-part svg-fill-bg" fill="var(--animal-bg)" opacity="0.08"/>
    ${semanticBody}
  </svg>`;
}
