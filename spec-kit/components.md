# UI Components & Patterns: ViewLine Agent Panel

## 1. Component Architecture Overview

```
AppComponent (Root)
└── AppRoutes
    ├── /auth (AuthComponent)
    │   ├── /login (LoginComponent)
    │   └── /forget-password (ForgetPassComponent)
    │       ├── /send-code (SendCodeComponent)
    │       ├── /verify-code (VerifyCodeComponent)
    │       └── /change-pass (ChangePasswordComponent)
    └── / (Protected - ThemeComponent)
        ├── /dashboard (DashboardComponent)
        │   ├── CardCountComponent
        │   ├── AgentCodeComponent
        │   │   └── DialogDiscontCodeListComponent
        │   └── StudentListComponent
        │       ├── FilterStudentDashboardComponent
        │       └── DialogPurchasedCoursesComponent
        ├── /finance (FinancePageComponent)
        │   ├── CardCountComponent (reused)
        │   └── HistoryTransactionsComponent
        │       └── FilterHistoryTransactionsComponent
        └── /settings (SettingInfoBaseComponent)
            └── Settings management pages
```

---

## 2. Shared UI Components

### 2.1 Alert Box Component
**File**: `src/app/shared/components/alert-box/`

**Purpose**: Display error, warning, info, success messages

**Variants**:
- Error (red background)
- Warning (orange background)
- Info (blue background)
- Success (green background)

**Usage**:
```html
<app-alert-box 
  [type]="'error'" 
  [message]="errorMessage"
  (onClose)="closeAlert()">
</app-alert-box>
```

**Props**:
- `type: 'error' | 'warning' | 'info' | 'success'`
- `message: string`
- `closeable: boolean = true`
- `duration?: number` (auto-close in ms)

**Events**:
- `onClose` - Emitted when alert dismissed

---

### 2.2 Breadcrumb Component
**File**: `src/app/shared/components/breadcrumb/`

**Purpose**: Navigate hierarchical page structure

**Display**:
```
Home > Dashboard > Students > Details
```

**Usage**:
```html
<app-breadcrumb [items]="breadcrumbItems"></app-breadcrumb>
```

**Data Structure**:
```typescript
interface BreadcrumbItem {
  label: string;
  path: string;
  active?: boolean;
}
```

---

### 2.3 Pagination Component
**File**: `src/app/shared/components/pagination-share/`

**Purpose**: Navigate paginated data lists

**Features**:
- Previous/Next buttons
- Page number selector
- Jump to page input
- "X of Y" display
- Disabled state when at boundaries

**Usage**:
```html
<app-pagination-share 
  [currentPage]="pageNumber"
  [totalPages]="Math.ceil(totalCount/pageSize)"
  [pageSize]="pageSize"
  (pageChange)="onPageChange($event)">
</app-pagination-share>
```

**Props**:
- `currentPage: number`
- `totalPages: number`
- `pageSize: number`
- `maxDisplayButtons: number = 5`

**Events**:
- `pageChange: EventEmitter<number>`

**Behavior**:
- Disabled buttons when at first/last page
- Shows page numbers around current page
- Ellipsis for skipped pages
- Keyboard support (arrow keys)

---

### 2.4 Empty State Component
**File**: `src/app/shared/components/empty-list/`

**Purpose**: Show when no data available

**Variants**:
- No results found
- No data
- No permissions
- Error state

**Usage**:
```html
<app-empty-list 
  *ngIf="!hasData"
  [type]="'no-data'"
  [title]="'هیچ داده‌ای یافت نشد'"
  [description]="'لطفاً فیلتر را تغییر دهید'">
</app-empty-list>
```

**Props**:
- `type: 'no-data' | 'no-results' | 'no-permission' | 'error'`
- `title: string`
- `description?: string`
- `icon?: string`
- `actionLabel?: string`

**Events**:
- `action: EventEmitter<void>`

---

### 2.5 Countdown Component
**File**: `src/app/shared/components/countdown/`

**Purpose**: Display timer for code expiration

**Display Format**: `MM:SS` or `MM:SS:HH`

**Usage**:
```html
<app-countdown 
  [minutes]="10"
  [onComplete]="onTimerExpire">
</app-countdown>
```

**Props**:
- `minutes: number`
- `seconds?: number = 0`
- `format: 'short' | 'long' = 'short'`

**Output**:
- Displays remaining time
- Changes color at 25% (yellow), 10% (red)
- Auto-disables button when complete

**Events**:
- `onComplete: EventEmitter<void>`
- `onTick: EventEmitter<{min, sec}>`

---

### 2.6 Skeleton Loader Component
**File**: `src/app/shared/components/skeleton-loader/`

**Purpose**: Placeholder while data loads

**Variants**:
- Line skeleton (text)
- Card skeleton
- Table skeleton
- Avatar skeleton
- Custom shapes

**Usage**:
```html
<app-skeleton-loader 
  *ngIf="loading"
  [type]="'table'"
  [rows]="10">
</app-skeleton-loader>
```

**Props**:
- `type: 'line' | 'card' | 'table' | 'avatar' | 'custom'`
- `rows: number`
- `columns?: number`
- `width?: string`
- `height?: string`

**Animation**: Gradient shimmer effect

---

### 2.7 Date-Time Format Component
**File**: `src/app/shared/components/date-time-format/`

**Purpose**: Display dates in user's preferred format

**Features**:
- Persian/Gregorian auto-detection
- Configurable format
- Timezone handling
- Relative dates (Today, Yesterday, etc.)

**Usage**:
```html
<app-date-time-format 
  [date]="orderDate"
  [format]="'YYYY-MM-DD HH:mm'"
  [showRelative]="true">
</app-date-time-format>
```

---

### 2.8 Sort Count Component
**File**: `src/app/shared/components/sort-count/`

**Purpose**: Display total count and sort option

**Display**: `"تعداد کل: 42 تا"`

**Usage**:
```html
<app-sort-count 
  [total]="totalCount"
  [sortBy]="'date'"
  [sortDirection]="'desc'"
  (sortChange)="onSortChange($event)">
</app-sort-count>
```

---

### 2.9 File Upload Component
**File**: `src/app/shared/components/file-upload-limitaion-details/`

**Purpose**: Upload files with size/type validation

**Features**:
- Drag-and-drop
- Multiple file selection
- Progress bar
- File size/type validation
- Preview thumbnail

**Usage**:
```html
<app-file-upload 
  [accept]="'.pdf,.doc,.docx'"
  [maxSize]="5"
  [maxFiles]="3"
  (filesSelected)="onFilesUpload($event)">
</app-file-upload>
```

---

### 2.10 Tab Menu Component
**File**: `src/app/shared/components/tab-menu-inner-page/`

**Purpose**: Navigate between page sections

**Variants**:
- Top tabs (default)
- Side tabs
- Scrollable tabs

**Usage**:
```html
<app-tab-menu 
  [tabs]="tabItems"
  [activeTab]="currentTab"
  (tabChange)="onTabChange($event)">
</app-tab-menu>
```

**Props**:
```typescript
interface Tab {
  id: string;
  label: string;
  icon?: string;
  badge?: number;
  disabled?: boolean;
}
```

---

## 3. Material UI Components Used

### 3.1 Tables (mat-table)

**Usage**:
```html
<table mat-table [dataSource]="dataSource">
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef>نام</th>
    <td mat-cell *matCellDef="let element">{{element.name}}</td>
  </ng-container>
  
  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>
```

**Student List Table**:
```
Columns: Row# | First Name | Last Name | Reg Date | Code | Payment Type | 
         Courses | Installment | Discount % | Agent Shares (3x) | Actions
Rows: 10 per page
Sorting: By date (desc), by name, by status
Selection: Single row for details
```

**Transaction Table**:
```
Columns: Date | Amount/Price
Rows: 10 per page
Sorting: By date
```

**Discount Code Table** (in dialog):
```
Columns: Row# | Code | Created Date | Agent % | Student % | Register Count | Income
Rows: 10 per page
```

---

### 3.2 Dialogs (mat-dialog)

**Discount Code List Dialog**:
- Header: "تاریخچه کدهای تخفیف" (Discount Code History)
- Content: Table with codes
- Width: 600px, Max-width: 100vw
- Min-height: 418px, Max-height: 90vh
- Close button: Top-right

**Usage**:
```typescript
const dialogRef = this.dialog.open(DialogDiscontCodeListComponent, {
  disableClose: true,
  width: '600px',
  maxWidth: '100vw',
  minHeight: '418px',
  maxHeight: '90vh',
  panelClass: 'custom-dialog',
  autoFocus: false,
});
```

**Purchased Courses Dialog**:
- Header: Student order details
- Table: Course name, instructor, price, discount
- Actions: Print button, Close button

---

### 3.3 Buttons (mat-button)

**Styles**:
- `mat-raised-button`: Solid with shadow (primary actions)
- `mat-stroked-button`: Outline style (secondary)
- `mat-icon-button`: Icon-only
- `mat-fab`: Floating action button (+ icons)

**Common Buttons**:
```html
<!-- Primary action -->
<button mat-raised-button color="primary">ثبت</button>

<!-- Secondary action -->
<button mat-stroked-button>انصراف</button>

<!-- Icon button -->
<button mat-icon-button [matMenuTriggerFor]="menu">
  <mat-icon>more_vert</mat-icon>
</button>

<!-- Disabled state -->
<button mat-raised-button [disabled]="isLoading">جستجو</button>
```

---

### 3.4 Progress Bar (mat-progress-bar)

**Usage**:
```html
<mat-progress-bar 
  *ngIf="isLoading"
  mode="indeterminate">
</mat-progress-bar>
```

**Modes**:
- `indeterminate`: Continuous animation (unknown duration)
- `determinate`: Progress fill with value 0-100
- `buffer`: Two-track progress

**Placement**: Above table content while loading

---

### 3.5 Select Dropdown (mat-select)

**Usage**:
```html
<mat-select [(value)]="selectedValue" 
            [compareWith]="compareFunction">
  <mat-option *ngFor="let item of items" [value]="item.id">
    {{item.title}}
  </mat-option>
</mat-select>
```

**In Filters**:
- Order Status dropdown
- Discount Code dropdown
- Year/Level selectors

---

### 3.6 Form Inputs (mat-form-field)

**Usage**:
```html
<mat-form-field>
  <mat-label>نام کاربری</mat-label>
  <input matInput formControlName="userName" />
  <mat-error *ngIf="form.get('userName')?.hasError('required')">
    نام کاربری الزامی است
  </mat-error>
</mat-form-field>
```

**Variants**:
- `fill` (solid background)
- `outline` (border only)
- `legacy` (underline only)

---

### 3.7 Date Picker (mat-datepicker)

**Custom Adapters**:
- Gregorian Date Adapter (default)
- Persian (Jalali) Date Adapter
- Moment Date Format Adapter

**Usage**:
```html
<mat-form-field>
  <mat-label>تاریخ</mat-label>
  <input matInput [matDatepicker]="picker" formControlName="date" />
  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
  <mat-datepicker #picker></mat-datepicker>
</mat-form-field>
```

**Calendar Configuration**:
- Persian (Jalali) calendar view
- Gregorian date stored internally
- Conversion via adapters

---

## 4. Forms & Input Patterns

### 4.1 Reactive Forms Pattern

**Login Form**:
```typescript
this.form = this.formBuilder.group({
  userName: ['', [
    Validators.required,
    Validators.minLength(3)
  ]],
  password: ['', Validators.required],
  captchaResponse: ['', Validators.required],
  rememberMe: [false]
});
```

**Validation Display**:
```html
<mat-form-field>
  <input matInput formControlName="userName" />
  <mat-error *ngIf="f['userName']?.hasError('required')">
    الزامی است
  </mat-error>
  <mat-error *ngIf="f['userName']?.hasError('minlength')">
    حداقل 3 کاراکتر
  </mat-error>
</mat-form-field>
```

### 4.2 Custom Validators

**Password Match Validator**:
```typescript
function passwordMatchValidator(group: FormGroup) {
  const password = group.get('password');
  const confirmPassword = group.get('confirmPassword');
  
  if (password?.value !== confirmPassword?.value) {
    confirmPassword?.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
  return null;
}
```

### 4.3 Form Status States

- **Pristine**: User hasn't interacted
- **Touched**: User has focused/blurred field
- **Dirty**: User has changed value
- **Valid**: All validators pass
- **Invalid**: At least one validator fails

**Styling**:
```css
.error-field {
  border-color: red;
}

.mat-form-field.ng-invalid.ng-touched {
  /* Show red outline on validation error */
}
```

---

## 5. Layout Components

### 5.1 Theme Component
**File**: `src/app/views/theme/theme.component`

**Structure**:
```
┌─────────────────────┐
│  Header (AppBar)    │
├───────┬─────────────┤
│       │             │
│ Sidenav│ Content    │
│(Menu) │ (Router)    │
│       │             │
├───────┴─────────────┤
│  Footer (Optional)  │
└─────────────────────┘
```

**Features**:
- Sticky header with user info
- Collapsible sidebar
- Main content area (RouterOutlet)
- Responsive layout (drawer on mobile)

---

### 5.2 Card Pattern

**Metric Cards** (Dashboard):
```
┌──────────────────┐
│ Revenue          │
│ 1,234,567 ﷼    │
│ ↑ 12% vs last mo │
└──────────────────┘
```

**Features**:
- Icon/color coding
- Large metric display
- Trend indicator (↑/↓)
- Hover effects

---

### 5.3 Filter Panel Pattern

**Collapsible Filter Section**:
```
[▼ Filters] (collapse button)
├─ [Discount Code Dropdown]
├─ [Order Status Dropdown]
├─ [Student Name Input]
├─ [Date Range Picker]
└─ [Apply] [Reset] buttons
```

**Behavior**:
- Collapsed by default (mobile)
- Expanded by default (desktop)
- Smooth animation on expand/collapse
- Filter state persists in service

---

## 6. Directive Library

### 6.1 Permission Directive (uaccess)
**File**: `src/app/core/auth/directives/permission.directive.ts`

**Purpose**: Hide elements user lacks permission for

**Usage**:
```html
<button [uaccess]="'create_discount_codes'">
  Generate Code
</button>
```

**Behavior**:
- Adds `hide` class to element (display: none)
- Checked async on ngOnInit
- Element removed from DOM (not just hidden)

---

### 6.2 Mouse Press Directive
**File**: `src/app/shared/directives/mouse-press.directive.ts`

**Purpose**: Detect and respond to mouse events

**Usage**:
```html
<button (appMousePress)="onPress($event)">Press Me</button>
```

---

### 6.3 Button Promise Directive
**File**: `src/app/shared/directives/button-promise.directive.ts`

**Purpose**: Auto-disable button during async operation

**Usage**:
```html
<button 
  (click)="submitForm()"
  [appButtonPromise]="isSubmitting">
  Submit
</button>
```

**Features**:
- Disables button while request pending
- Shows loading spinner
- Shows success/error states
- Auto-re-enables on completion

---

## 7. Pipe Library

### 7.1 Persian Date Pipe
**File**: `src/app/shared/pipes/date-to-persian.pipe.ts`

**Purpose**: Convert Gregorian to Persian dates

**Usage**:
```html
<td>{{ row.createdDate | dateToPersian }}</td>
<!-- Output: 1403/05/06 -->
```

**Format Options**:
- `'YYYY-MM-DD'` (default)
- `'DD MMMM YYYY'` (long)
- `'YYYY-MM-DD HH:mm:ss'` (with time)

---

### 7.2 Ellipsis Pipe
**File**: `src/app/shared/pipes/ellipsis.pipe.ts`

**Purpose**: Truncate long text with ellipsis

**Usage**:
```html
<td>{{ row.studentName | ellipsis:30 }}</td>
<!-- Truncates to 30 chars + "..." -->
```

---

## 8. Navigation Patterns

### 8.1 Main Navigation Menu

**Routes**:
```
Dashboard (/dashboard)
├─ Overview (default)
├─ Student Management
└─ Commission Tracking

Finance (/finance)
├─ Transactions
└─ Payouts

Settings (/settings)
├─ Reshte
├─ Paye
└─ Year Selection

Profile (user menu)
├─ View Profile
├─ Edit Profile
├─ Change Password
└─ Logout
```

### 8.2 Breadcrumb Navigation

**Format**:
```
Home > Dashboard > Students > Order #123
```

**Auto-Generated**: From route path

---

## 9. Modal/Dialog Patterns

### 9.1 Confirmation Dialog

**Usage**:
```typescript
this.dialog.open(ConfirmDialogComponent, {
  data: {
    title: 'تأیید حذف',
    message: 'آیا از حذف مطمئن هستید؟'
  }
}).afterClosed().subscribe(result => {
  if (result) {
    // Perform action
  }
});
```

### 9.2 Error Dialog

**Shows**:
- Error icon
- Error message
- Stack trace (dev only)
- Retry button
- Close button

---

## 10. Loading & Feedback States

### 10.1 Page Loading
- Skeleton loaders for table
- Spinner in header
- Grayed-out content

### 10.2 Form Submission Loading
- Button disabled
- Loading spinner in button
- Form fields disabled

### 10.3 List Loading
- Progress bar above table
- Rows faded out
- Pagination disabled
- Loading text overlay

### 10.4 Toast Notifications

**Success**:
```typescript
this.alertService.snackBarSuccess('کد کپی شد');
```

**Error**:
```typescript
this.alertService.snackBarError('خطا در ارسال درخواست');
```

**Duration**: 5 seconds (auto-close)

---

## 11. Accessibility Features

### 11.1 ARIA Labels
- Images have alt text
- Icons have aria-labels
- Buttons have descriptive text

### 11.2 Keyboard Navigation
- Tab key navigation
- Enter to submit forms
- Arrow keys for dropdowns
- Escape to close dialogs

### 11.3 Screen Reader Support
- Semantic HTML
- ARIA roles
- Label associations
- Live regions for alerts

---

## 12. Responsive Design

### 12.1 Breakpoints (Material)

| Screen | Width | Device |
|--------|-------|--------|
| xs | <600px | Mobile |
| sm | 600-960px | Tablet |
| md | 960-1264px | Desktop |
| lg | 1264-1904px | Wide |
| xl | >1904px | Ultra-wide |

### 12.2 Responsive Behavior

**Mobile** (xs):
- Single column layout
- Collapsible sidebar
- Full-width modals
- Stacked form fields
- Smaller font sizes

**Desktop** (md+):
- Multi-column layout
- Always-visible sidebar
- Centered modals (60% width)
- Side-by-side form fields
- Normal font sizes

### 12.3 RTL Support (Persian)

- All components RTL-aware
- Direction: RTL in HTML
- Flexbox/Grid auto-flip
- Icon positions mirrored
- Text alignment reversed

---

## 13. Color & Theming

### 13.1 Color Palette

**Primary Colors**:
- Primary: `#1976D2` (Blue)
- Accent: `#FF4081` (Pink)
- Warn: `#F44336` (Red)

**Semantic Colors**:
- Success: `#4CAF50` (Green)
- Error: `#F44336` (Red)
- Warning: `#FFC107` (Orange)
- Info: `#2196F3` (Blue)

### 13.2 Dark Mode

**Toggle**: Available in settings
**Storage**: localStorage['DarkMode']
**Default**: Light mode

**Theme Switching**:
```typescript
this.themeService.toggleDarkMode();
```

---

## 14. Typography

**Font Stack**: System fonts + Persian fonts
```
'Segoe UI', 'Roboto', 'IranSans', sans-serif
```

**Scale**:
- Display: 57px (h1)
- Headline: 32px (h2)
- Title: 22px (h3)
- Subtitle: 16px (subtitle)
- Body: 14px (default)
- Caption: 12px (helper text)

---

## 15. Spacing & Layout System

**Base Unit**: 4px

**Scale**: 4, 8, 12, 16, 24, 32, 48, 64px

**Common Spacing**:
- Component padding: 16px
- Section margin: 24px
- Card gap: 16px
- Input height: 40px
- Button height: 36px

