# Accountant Module Refactoring - Component Separation

## Overview
The monolithic `DepositManagement.jsx` has been refactored into 4 individual, reusable components for better code organization and maintainability.

## New File Structure

```
frontend/src/pages/accountant/
├── DepositManagement.jsx          # Main container (updated)
├── DepositSection.jsx             # Deposit management (NEW)
├── StaySection.jsx                # Stay management (NEW)
├── PaymentSection.jsx             # Payment management (NEW)
└── DebtSection.jsx                # Debt management (NEW)
```

## Component Breakdown

### 1. **DepositManagement.jsx** (Main Container)
**Purpose:** Main component that manages section switching and layout
**Responsibilities:**
- Sidebar navigation
- Navbar title display
- Section switching logic
- Imports and renders individual section components

**Import:**
```javascript
import DepositSection from './DepositSection';
import StaySection from './StaySection';
import PaymentSection from './PaymentSection';
import DebtSection from './DebtSection';
```

**Usage in AppRouter:**
```javascript
<Route path="/accountant" element={<ProtectedRoute requiredRole="accountant"><DepositManagement /></ProtectedRoute>} />
```

---

### 2. **DepositSection.jsx**
**Purpose:** Deposit/Booking management
**State:**
- `bookings` - Array of booking data
- `loading` - Loading state
- `error` - Error message

**Functions:**
- `loadBookings()` - Fetch bookings from API
- `handleApproveBooking(bookingId)` - Approve a pending deposit

**Features:**
- Filter button
- Status badges
- Approve action button
- Loading and empty states

**Dependencies:**
- BookingService
- formatCurrency()
- formatDate()

---

### 3. **StaySection.jsx**
**Purpose:** Stay/Contract management
**State:**
- `stays` - Array of stay data (mock)
- `error` - Error message

**Functions:**
- None (View-only, uses mock data)

**Features:**
- Contract list table
- Check-in date display
- Monthly fee tracking
- Status badges
- Detail view button

**Dependencies:**
- formatCurrency()
- formatDate()

**Note:** Uses mock data from `mockStays` constant

---

### 4. **PaymentSection.jsx**
**Purpose:** Payment and refund management
**State:**
- `payments` - Array of payment data
- `loading` - Loading state
- `error` - Error message

**Functions:**
- `loadPayments()` - Fetch payments from API
- `handleProcessPayment(paymentId)` - Process a pending payment

**Features:**
- 3 statistics cards:
  - Completed payments total
  - Pending payments total
  - Refund count
- Payment table with actions
- Loading and empty states

**Dependencies:**
- PaymentService
- formatCurrency()
- formatDate()

---

### 5. **DebtSection.jsx**
**Purpose:** Debt and fine management
**State:**
- `debts` - Array of debt data
- `loading` - Loading state
- `error` - Error message

**Functions:**
- `loadDebts()` - Fetch debts from API
- `handleMarkDebtAsPaid(debtId)` - Mark debt as paid

**Features:**
- 3 statistics cards:
  - Overdue count
  - Pending count
  - Paid count
- Debt table with type badges
- Actions for marking debt as paid
- Loading and empty states

**Dependencies:**
- DebtService
- formatCurrency()
- formatDate()

---

## Benefits of This Refactoring

### ✅ **Modularity**
Each component is self-contained and handles only its specific domain

### ✅ **Reusability**
Components can be imported and used in other parts of the app

### ✅ **Maintainability**
Easier to locate and fix bugs in specific sections
Easier to add new features to individual sections

### ✅ **Testability**
Each component can be tested independently

### ✅ **Performance**
Components load only the data they need
Easier to implement lazy loading later

### ✅ **Code Organization**
Cleaner file structure
Better separation of concerns

---

## Component Independence

Each section component is **fully independent** and can:
- Handle its own state management
- Load its own data from API services
- Render error and loading states
- Execute its own business logic

```javascript
// DepositSection is completely self-contained
// It doesn't depend on parent component state

<DepositSection /> // Can work standalone
```

---

## Shared Utilities

All components use centralized utility functions:
```javascript
import { formatCurrency, formatDate } from '../../utils/formatters';
```

This ensures consistent formatting across all sections.

---

## Data Flow

```
AppRouter
    ↓
DepositManagement (Container)
    ├─→ DepositSection
    ├─→ StaySection
    ├─→ PaymentSection
    └─→ DebtSection

Each section component:
  ├─→ API Service (PaymentService, BookingService, etc.)
  ├─→ Utility Functions (formatters.js)
  └─→ UI Components (Tables, Cards, Buttons)
```

---

## Adding New Features

### To add a new function to DepositSection:
1. Open `DepositSection.jsx`
2. Add your function
3. No need to touch other files

### To add a new section:
1. Create `NewSection.jsx` in the same directory
2. Import it in `DepositManagement.jsx`
3. Add case in navigation
4. Add render condition

Example:
```javascript
// Create CheckoutSection.jsx
const CheckoutSection = () => { /* ... */ };

// Update DepositManagement.jsx
import CheckoutSection from './CheckoutSection';

// Add to navItems
{ id: 'checkout', label: 'Check-out', icon: 'fas fa-door-open' },

// Add to render
{activeSection === 'checkout' && <CheckoutSection />}
```

---

## File Size Comparison

### Before Refactoring
- `DepositManagement.jsx`: ~600 lines (monolithic)

### After Refactoring
- `DepositManagement.jsx`: ~25 lines (container only)
- `DepositSection.jsx`: ~90 lines
- `StaySection.jsx`: ~110 lines
- `PaymentSection.jsx`: ~150 lines
- `DebtSection.jsx`: ~160 lines
- **Total**: Still ~600 lines, but now organized

---

## Migration Guide

### If you have old code referencing DepositManagement:
The component still works exactly the same way!
```javascript
// Still works
import DepositManagement from './pages/accountant/DepositManagement';
<DepositManagement />
```

### If you want to use a specific section standalone:
```javascript
import DepositSection from './pages/accountant/DepositSection';
<DepositSection />
```

---

## Future Enhancements

### 1. **Lazy Loading**
```javascript
const DepositSection = lazy(() => import('./DepositSection'));
const StaySection = lazy(() => import('./StaySection'));
const PaymentSection = lazy(() => import('./PaymentSection'));
const DebtSection = lazy(() => import('./DebtSection'));

// Use with Suspense in DepositManagement
<Suspense fallback={<LoadingSpinner />}>
  {activeSection === 'deposit' && <DepositSection />}
</Suspense>
```

### 2. **Custom Hooks**
Extract section logic into custom hooks:
```javascript
const useDepositData = () => { /* ... */ };
const usePaymentData = () => { /* ... */ };
```

### 3. **Context API**
Share section state across components if needed:
```javascript
<DepositContext.Provider value={{ deposits, loading }}>
  <DepositSection />
</DepositContext.Provider>
```

### 4. **Testing**
```bash
# Test individual sections
npm test DepositSection.test.jsx
npm test PaymentSection.test.jsx
```

---

## Troubleshooting

### Component not displaying?
1. Check if it's imported in `DepositManagement.jsx`
2. Check if condition exists: `{activeSection === 'section-id' && <SectionComponent />}`
3. Check if navigation item has correct `id`

### State not updating?
1. Ensure each component has its own state
2. Check if async functions are awaited
3. Look for console errors

### Styling issues?
1. All sections use Tailwind CSS
2. Ensure Font Awesome icons are loaded
3. Check for CSS class conflicts

---

## Notes

- Each component handles its own loading state
- Error boundaries can be added per component if needed
- Mock data is used in StaySection for demo purposes
- Payment and Debt sections fetch from API
- All sections share the same formatting standards
