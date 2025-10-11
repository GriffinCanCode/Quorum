# Frontend Animation System

## Overview

This document describes the minimal yet bespoke animation system implemented across the Quorum frontend, following best UX/UI principles for a clean and unique user experience.

## Design Principles

### 1. **Performance-First**
- All animations use GPU-accelerated properties (`transform`, `opacity`)
- Minimal repaints and reflows
- Animations are 60fps smooth

### 2. **Purposeful Motion**
- Every animation serves a purpose (feedback, guidance, or delight)
- No gratuitous or distracting animations
- Motion enhances usability

### 3. **Accessibility**
- Full support for `prefers-reduced-motion`
- Maintains functionality without animations
- Focus states are clearly visible

### 4. **Consistency**
- Unified timing functions and durations
- Predictable animation patterns
- Cohesive design language

## Animation Categories

### Entrance Animations

#### `animate-fade-in`
- **Duration**: 300ms
- **Easing**: ease-in-out
- **Use**: General component entrance
- **Example**: Main panels, modals

#### `animate-fade-in-up`
- **Duration**: 400ms
- **Easing**: cubic-bezier(0.16, 1, 0.3, 1)
- **Transform**: translateY(12px) → translateY(0)
- **Use**: Cards, list items, content blocks
- **Example**: Message bubbles, agent cards

#### `animate-fade-in-down`
- **Duration**: 400ms
- **Easing**: cubic-bezier(0.16, 1, 0.3, 1)
- **Transform**: translateY(-12px) → translateY(0)
- **Use**: Headers, dropdowns
- **Example**: Notification banners

#### `animate-slide-in-right`
- **Duration**: 350ms
- **Easing**: cubic-bezier(0.16, 1, 0.3, 1)
- **Transform**: translateX(-20px) → translateX(0)
- **Use**: Left panel entrance
- **Example**: Chat history sidebar

#### `animate-slide-in-left`
- **Duration**: 350ms
- **Easing**: cubic-bezier(0.16, 1, 0.3, 1)
- **Transform**: translateX(20px) → translateX(0)
- **Use**: Right panel entrance
- **Example**: Agent panel

#### `animate-scale-in`
- **Duration**: 300ms
- **Easing**: cubic-bezier(0.16, 1, 0.3, 1)
- **Transform**: scale(0.9) → scale(1)
- **Use**: Buttons appearing, icons
- **Example**: Stop generation button, status icons

### Micro-Interactions

#### `hover-lift`
- **Transform**: translateY(-2px)
- **Duration**: 250ms
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Use**: Cards, buttons with elevation
- **Example**: Example queries, settings buttons

#### `hover-scale`
- **Transform**: scale(1.02)
- **Duration**: 200ms
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Use**: Icon buttons, close buttons
- **Example**: Timeline nodes, close button

#### `press-effect`
- **Transform**: scale(0.96)
- **Duration**: 100ms
- **Use**: All clickable elements
- **Example**: All buttons on active state

### Loading States

#### `animate-shimmer`
- **Duration**: 2s infinite
- **Easing**: cubic-bezier(0.4, 0, 0.6, 1)
- **Use**: Loading placeholders
- **Example**: Skeleton screens

#### `animate-pulse-slow`
- **Duration**: 3s infinite
- **Easing**: cubic-bezier(0.4, 0, 0.6, 1)
- **Use**: Subtle breathing effects
- **Example**: Empty state icons

#### `pulse-ring`
- **Duration**: 2s infinite
- **Easing**: cubic-bezier(0.4, 0, 0.6, 1)
- **Effect**: Expanding ring (box-shadow)
- **Use**: Active indicators
- **Example**: Active agent status dots

### Attention-Grabbing

#### `animate-bounce-subtle`
- **Duration**: 600ms
- **Easing**: ease-in-out
- **Transform**: translateY(-4px)
- **Use**: Call attention without being jarring
- **Example**: Scroll-to-bottom button

#### `animate-shake`
- **Duration**: 400ms
- **Easing**: cubic-bezier(0.36, 0.07, 0.19, 0.97)
- **Transform**: translateX(±2px)
- **Use**: Error states
- **Example**: Error banner

### Stagger Effects

#### `animate-stagger-1` through `animate-stagger-5`
- **Delays**: 50ms, 100ms, 150ms, 200ms, 250ms
- **Use**: Sequential entrance of list items
- **Example**: Example queries, logo parts

## Component-Specific Animations

### App Layout
```tsx
// Left panel entrance
<div className="history-panel-permanent animate-slide-in-right">

// Center content entrance
<div className="chat-container-center animate-fade-in">

// Right panel entrance (conditional)
<div className="agent-panel-permanent animate-slide-in-left">

// Error banner (shake for attention)
<div className="error-banner animate-shake">
```

### Chat Window
```tsx
// Empty state example queries (staggered entrance)
<button className="example-query animate-fade-in-up animate-stagger-1">
<button className="example-query animate-fade-in-up animate-stagger-2">
<button className="example-query animate-fade-in-up animate-stagger-3">

// Scroll button (bounces subtly to draw attention)
<button className="animate-bounce-subtle hover-lift press-effect">

// Processing indicator
<div className="processing-indicator animate-fade-in-up">
```

### Message Bubbles
```tsx
// Messages animate in using Framer Motion
// PDF export button with hover effects
<button className="export-pdf-button hover-lift press-effect transition-colors-smooth animate-fade-in-up">
```

### Agent Panel
```tsx
// Panel entrance
<div className="space-y-4 animate-fade-in">

// Empty state
<div className="agent-panel-empty animate-fade-in">
  <Users className="animate-pulse-slow" />

// Section headers with status indicators
<h2 className="animate-fade-in-up">
  <span className="pulse-ring" /> {/* Active indicator */}
  Active · {count}
</h2>
```

### Agent Cards
Uses Framer Motion for sophisticated entrance/exit animations:
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95, y: 10 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95, y: -10 }}
  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
>
```

### Chat Input
```tsx
// Textarea with smooth transitions
<textarea className="input-field-clean transition-all duration-200">

// Send button with icon transform on input
<Send className="transition-transform duration-200 translate-x-0.5 -translate-y-0.5" />

// Stop button appears with scale-in
<button className="btn-send animate-scale-in press-effect">
  <Square className="animate-pulse" />
```

### Settings Modal
```tsx
// Overlay fade-in
<div className="settings-overlay animate-fade-in">

// Modal slides in (CSS-based)
<div className="settings-modal"> {/* Has keyframe animation */}

// Buttons with hover effects
<button className="settings-save-button hover-lift press-effect">

// Success/error icons
<CheckCircle className="animate-scale-in" /> // Success
<XCircle className="animate-shake" /> // Error
```

### Tool Usage Display
Uses Framer Motion for sophisticated staggered animations:
```tsx
// Container entrance
<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

// Individual tool items
<motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>

// Results with staggered entrance
<motion.a
  initial={{ opacity: 0, x: -10 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.3 + idx * 0.05 }}
  className="result-link hover-lift press-effect"
>
```

### Agent Conversation
```tsx
// Conversation container
<div className="agent-conversation animate-fade-in-up">

// Timeline nodes
<button className="timeline-node hover-scale press-effect transition-colors-smooth">

// Round cards
<div className="round-card hover-lift transition-colors-smooth">
```

### Logo
```tsx
// Staggered entrance for brand identity
<h1 className="logo-text animate-fade-in">
  <span className="logo-no animate-fade-in-up">No</span>
  <span className="logo-oversight animate-fade-in-up animate-stagger-1">Oversight</span>
</h1>
<p className="logo-tagline animate-fade-in-up animate-stagger-2">
```

## Utility Classes

### Smooth Transitions
```css
.transition-colors-smooth {
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### GPU Acceleration
```css
.gpu-accelerate {
  transform: translateZ(0);
  will-change: transform;
}
```

### Skeleton Loading
```css
.skeleton {
  background: linear-gradient(90deg, ...);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

## Timing Functions

### Custom Easing Curves
- **spring**: `cubic-bezier(0.16, 1, 0.3, 1)` - Smooth spring-like motion
- **bounce-in**: `cubic-bezier(0.68, -0.55, 0.265, 1.55)` - Playful bounce

### Standard Easing
- **ease-in-out**: Symmetrical acceleration/deceleration
- **ease-out**: Quick start, gradual finish (entrances)
- **ease-in**: Gradual start, quick finish (exits)

## Best Practices

### Do's ✅
- Use consistent timing (200-400ms for most interactions)
- Combine animations with stagger for lists
- Always provide press effects for buttons
- Test with `prefers-reduced-motion`
- Use Framer Motion for complex orchestration

### Don'ts ❌
- Don't animate layout properties (width, height, top, left)
- Don't use long durations (>500ms feels sluggish)
- Don't stack too many animations
- Don't forget hover states
- Don't animate on every render

## Accessibility

### Reduced Motion Support
All animations automatically disable for users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Focus States
All interactive elements have enhanced focus states with transitions:

```css
*:focus-visible {
  outline: 2px solid oklch(0.58 0.15 250);
  outline-offset: 2px;
  transition: outline-offset 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Performance Considerations

### Optimizations
1. **GPU Acceleration**: All animations use `transform` and `opacity`
2. **Will-Change**: Applied sparingly to animating elements
3. **Animation Fill Mode**: Prevents layout shifts
4. **Framer Motion**: Automatic optimization for React components

### Monitoring
- Animations target 60fps
- Use Chrome DevTools Performance tab to verify
- Test on lower-end devices
- Profile with React DevTools

## Future Enhancements

Potential areas for expansion:
- [ ] Page transition animations (route changes)
- [ ] Advanced scroll-triggered animations (Intersection Observer)
- [ ] Gesture-based interactions (drag, swipe)
- [ ] Custom animation hooks for complex sequences
- [ ] Animation presets system

---

**Last Updated**: 2025-10-11  
**Version**: 1.0.0

