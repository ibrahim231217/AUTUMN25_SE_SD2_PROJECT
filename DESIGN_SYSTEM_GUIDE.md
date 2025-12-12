# Healthcare UI/UX Design System - MediCare

## Color Palette

| Role | Color Name | Hex Code | Usage |
|------|-----------|----------|-------|
| Primary | Deep Navy | #003366 | Headers, footers, primary typography, primary buttons |
| Secondary | Healing Teal | #00A896 | Sub-headers, icons, secondary buttons, highlights |
| Accent | Soft Sky | #E0F7FA | Background sections, hover states |
| Action | Vibrant Coral | #FF7043 | "Book Appointment" buttons, high contrast CTAs |
| Neutral | Clean White | #FFFFFF | Main background (plenty of whitespace) |
| Neutral Light | #f8f9fa | Secondary backgrounds, section backgrounds |

## Design Principles Applied

### 1. **Visual Hierarchy**
- Large, bold headings in primary color
- Medium-weight subheadings in primary/secondary
- Regular weight body text in gray-600 to gray-800
- Use spacing to create breathing room

### 2. **Button System**
- **Primary Buttons**: `btn-primary` - Deep Navy background, white text
  - Used for main actions (Submit, Continue, Approve)
  - Hover: Darker shade, shadow-medium
  - Active: scale-95 transform

- **Secondary Buttons**: `btn-secondary` - Teal background, white text
  - Alternative actions
  - Hover: Darker shade, shadow-medium

- **Action Buttons**: `btn-action` - Vibrant Coral
  - High-contrast CTAs
  - "Book Appointment", "Register"
  - Hover: Darker shade

- **Outline Buttons**: `btn-outline` - Navy border with navy text
  - Less prominent actions
  - Hover: Light background

- **Ghost Buttons**: `btn-ghost` - No background
  - Navigation, back buttons
  - Hover: Light background

### 3. **Cards & Containers**
- `.card` - White background, soft shadow, border with hover effects
- `.card-elevated` - Medium shadow for emphasis
- Hover state: Enhanced shadow and border color change
- Rounded corners: rounded-xl (12px) or 2xl (16px)

### 4. **Input Fields**
- `.input-field` - 2px border, rounded-xl
- Focus state: Teal border with ring
- Hover state: Slightly darker border
- Placeholder text: gray-400

### 5. **Badges & Status**
- `.badge-primary` - Navy background, light text
- `.badge-secondary` - Teal background, light text
- `.badge-success` - Green (Accepted appointments)
- `.badge-warning` - Yellow/Orange (Pending appointments)
- `.badge-error` - Red (Rejected appointments)

### 6. **Tables**
- Header: `table-header` - Light primary background
- Rows: `table-row` - Hover to soft accent background
- Cells: `table-cell` - Consistent padding (p-4)
- Borders: Subtle neutral-medium color

### 7. **Shadows**
- `shadow-soft` - Subtle elevation (2px)
- `shadow-medium` - Medium elevation (4px)
- `shadow-lg-soft` - Large elevation (8px)

### 8. **Hover Effects**
- Smooth transitions (200ms duration)
- Scale changes for interactive elements (group-hover:scale-110)
- Color transitions for text
- Shadow enhancements
- Background color changes

### 9. **Spacing**
- Use consistent gaps: gap-4, gap-6, gap-8
- Padding: p-4 (1rem), p-6 (1.5rem), p-8 (2rem)
- Margins: mb-4, mb-6, mb-8

### 10. **Typography**
- Headers: bold (font-bold)
- Subheaders: semibold (font-semibold)
- Body: regular (font-medium)
- Labels: semibold (font-semibold)
- Helper text: text-xs or text-sm with gray-500

## Component Examples

### Button Components
```jsx
// Primary Action Button
<button className="btn-primary">Submit</button>

// Action Button (High Contrast)
<button className="btn-action">Book Appointment</button>

// Outline Button
<button className="btn-outline">Cancel</button>

// Ghost Button
<button className="btn-ghost">← Go Back</button>
```

### Card Components
```jsx
// Basic Card
<div className="card">
  <h3 className="font-bold text-primary-600">Title</h3>
  <p className="text-gray-600 mt-2">Content</p>
</div>

// Card with Hover Effect
<div className="card group hover:shadow-lg-soft hover:border-secondary-200">
  <div className="text-4xl group-hover:scale-110 transition-transform">🏥</div>
</div>

// Card with Status
<div className="card border-l-4 border-l-green-400">
  <div className="flex items-center justify-between">
    <div><p className="font-bold text-primary-600">Status</p></div>
    <span className="badge-success">Active</span>
  </div>
</div>
```

### Form Components
```jsx
// Form Group
<div className="form-group">
  <label className="form-label">Email</label>
  <input type="email" className="input-field" />
  <p className="form-helper">We'll never share your email</p>
</div>

// Form Error
<div className="form-group">
  <label className="form-label">Username</label>
  <input type="text" className="input-field" />
  <p className="form-error">Username is already taken</p>
</div>
```

### Badge Components
```jsx
<span className="badge-success">Accepted</span>
<span className="badge-warning">Pending</span>
<span className="badge-error">Rejected</span>
```

### Table Components
```jsx
<div className="table-container">
  <table className="w-full">
    <thead className="table-header">
      <tr>
        <th className="table-cell">Name</th>
        <th className="table-cell">Email</th>
        <th className="table-cell">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr className="table-row">
        <td className="table-cell">John Doe</td>
        <td className="table-cell">john@example.com</td>
        <td className="table-cell"><span className="badge-success">Active</span></td>
      </tr>
    </tbody>
  </table>
</div>
```

## Page Layout Pattern

All dashboard pages follow this structure:

```jsx
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

export default function Page({ user, onLogout }) {
  return (
    <div className="bg-neutral-light min-h-screen">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex">
        <Sidebar role="patient" /> {/* or "doctor" or "admin" */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Content */}
          </div>
        </main>
      </div>
    </div>
  );
}
```

## Color Usage Guidelines

### Backgrounds
- Main background: White or neutral-light (#f8f9fa)
- Card backgrounds: White with subtle border
- Section backgrounds: Accent color (#E0F7FA) for emphasis
- Hover backgrounds: Accent or primary-50

### Text Colors
- Primary headings: primary-600 (#003366)
- Secondary headings: secondary-600 (#00A896)
- Body text: gray-600 or gray-700
- Helper/Secondary text: gray-500

### Accent Elements
- Icons: secondary-600 or primary-600
- Borders: neutral-medium or secondary-200
- Active states: primary or secondary
- Focus states: secondary with ring

## Accessibility Considerations

1. Always use proper contrast ratios (WCAG AA minimum)
2. Include focus rings on interactive elements
3. Use `@media (prefers-reduced-motion: reduce)` for animations
4. Provide alt text for icons and images
5. Use semantic HTML (buttons, links, forms)
6. Ensure touch targets are at least 44x44px
7. Use aria labels where needed

## Implementation Checklist

- [ ] Replace all blue-600/blue-700 with primary-600/primary-700
- [ ] Replace gray/slate colors with proper palette colors
- [ ] Replace rounded-lg with rounded-xl for modern look
- [ ] Replace shadow-sm with shadow-soft
- [ ] Add group-hover effects to interactive elements
- [ ] Add Sidebar to all dashboard pages
- [ ] Use CSS classes (btn-action, card, badge-*, etc.)
- [ ] Add smooth transitions (duration-200)
- [ ] Add active states for buttons (active:scale-95)
- [ ] Test hover effects on all interactive elements
- [ ] Verify color contrast ratios
- [ ] Test on mobile devices
- [ ] Test keyboard navigation
- [ ] Verify focus states are visible
