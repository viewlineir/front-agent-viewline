# Product Specification: ViewLine Agent Panel

## 1. Product Overview

**Product Name:** ViewLine Agent Panel  
**Type:** Agent Management & Commission Tracking System  
**Platform:** Angular 18+ Web Application  
**Primary Use Case:** Agents to manage students, track commissions, view financial history

---

## 2. Core Business Domain

### 2.1 Key Concepts

- **Agent**: Primary user role - manages students, tracks revenue, receives commissions
- **Students**: End-users registered by agents, purchase courses
- **Commissions/Revenue**: Agents earn from:
  - Student payments (direct share)
  - Debt installments paid by students
  - Discounts applied to orders
- **Discount Codes**: Agents can generate and distribute to encourage student registration
- **Financial Tracking**: Monitor payment history and payout status

### 2.2 System Purpose

The ViewLine Agent Panel enables agents to:
1. View dashboard with key metrics
2. Manage student database with filtering and search
3. Track financial transactions and payouts
4. Generate and manage discount codes
5. Monitor course purchases and installments
6. Manage account settings and base information

---

## 3. Application Structure

### 3.1 High-Level Architecture

```
Frontend (Angular 18)
├── Authentication Layer
├── Core Services (HTTP, Storage, Auth)
├── Pages (Lazy Loaded Routes)
│   ├── Auth Pages
│   ├── Dashboard Pages
│   ├── Finance Pages
│   └── Settings Pages
└── Shared Components & Utilities
```

### 3.2 Technology Stack

- **Framework**: Angular 18.1.4
- **UI Library**: Angular Material 18.1.4
- **State Management**: Angular Signals (computed, signal)
- **HTTP**: HttpClient
- **Date Handling**: jalali-moment (Persian dates), Gregorian date adapters
- **Forms**: Reactive Forms
- **Security**: ReCAPTCHA integration (ngx-captcha)
- **Date Picker**: Material date picker with custom adapters
- **Image Processing**: ngx-image-cropper

### 3.3 Key Libraries

- `@angular/material` - UI components (tables, dialogs, buttons, etc.)
- `@angular/cdk` - Component Dev Kit for overlays, clipboard
- `rxjs` - Reactive programming
- `jalali-moment` - Persian/Gregorian date handling
- `material-design-icons-iconfont` - Material icons
- `ngx-captcha` - ReCAPTCHA verification

---

## 4. Pages & Features

### 4.1 Authentication Module (`/auth`)

**Purpose**: Handle user login and password recovery

#### Pages:
- `/auth/login` - User authentication
- `/auth/forget-password/send-code` - Initial password recovery step
- `/auth/forget-password/verify-code` - Code verification
- `/auth/forget-password/change-pass` - New password entry

**Features**:
- Username/password login
- ReCAPTCHA verification
- Two-factor authentication (2FA) support
- Password recovery workflow
- OTP-based verification

---

### 4.2 Dashboard Module (`/dashboard`)

**Purpose**: Central hub for agent to monitor key metrics and student information

#### Main Component: `DashboardComponent`
- Displays key performance indicators
- Shows student list with pagination
- Displays agent discount codes
- Real-time metric updates

#### Sub-Components:
1. **CardCountComponent** - Displays metrics:
   - Total Revenue
   - Revenue Paid
   - Revenue Unpaid
   - Student Count
   - Total Paid

2. **StudentListComponent** - Comprehensive student management:
   - Tabular data with columns:
     - Row number
     - Student name (first, last)
     - Registration date
     - Agent code used
     - Payment type
     - Purchased courses
     - Installment status
     - Discount percentage
     - Agent share amounts
   - Pagination (10 items per page)
   - Filtering by:
     - Discount code
     - Order status (Pending, Paid, Failed, Installments, Canceled)
     - Identifier/Student name
     - Date range (order creation date)
   - Dialog: View purchased courses details

3. **AgentCodeComponent** - Discount code management:
   - Display current agent code
   - Show registration count using code
   - Copy to clipboard functionality
   - Dialog: View detailed code history with:
     - Code value
     - Creation date
     - Discount percentages (agent & student)
     - Registration count
     - Income tracking

#### Data Resolver:
- `DashboardResolverService` - Pre-loads dashboard data

#### Models:
```typescript
IDashboardApiDataModel {
  totalRevenue: number;
  totalRevenuePaid: number;
  totalRevenueUnPaid: number;
  studentCount: number;
  totalPaid: number;
  lastAgentCode: string;
}

IListStudentModel {
  studentFirstName: string;
  studentLastName: string;
  createdDateTime: string;
  orderId: number;
  discountCode: string;
  orderStatus: number;
  orderInstallmentPaidCountAndTotalCount: string;
  agentShareFromDebtInstallments: number;
  agentShareFromPayments: number;
  agentShareTotal: number;
}
```

#### Order Status Types:
```typescript
enum EOrderStatusType {
  Pending = 0,
  Paid = 1,
  Failed = 2,
  InstallmentsWithInitialPayment = 3,
  Canceled = 4
}
```

---

### 4.3 Finance Module (`/finance`)

**Purpose**: Track agent payouts and financial transactions

#### Main Component: `FinancePageComponent`
- Displays transaction history
- Shows financial summary cards
- Supports date-based filtering

#### Sub-Components:
1. **CardCountComponent** (Reused from dashboard)
   - Shows financial metrics

2. **HistoryTransactionsComponent** - Transaction list:
   - Columns:
     - Transaction date
     - Amount/Price
   - Pagination support
   - Filters:
     - Date range (Payout date from/to)
   - Table with progress bar during loading

#### Models:
```typescript
IHistoryTransactionsListModel {
  createDate: string;
  price: number;
}

IFilterHistoryTransactionsListModel {
  userPayoutDate_From: string;
  userPayoutDate_To: string;
}
```

#### API Endpoint:
- `GET /Agent/UserPayout/GetAll` - Fetch transaction history with filters

---

### 4.4 Settings Module (`/settings` - Foundation)

**Purpose**: Manage organizational hierarchies and base settings

#### Pages:
- `SettingInfoBaseComponent` - Base configuration management

#### Data Management:
Manages organizational structures:
- **Reshte** (Field/Department):
  - Select dropdown
  - Filter by Paye
  - Full list filtering

- **Paye** (Level/Tier):
  - Select dropdown
  - Filter by Maghta (district)
  - Cascading relationships

- **Maghta** (District):
  - Hierarchical relationships

- **Sal** (Year):
  - Year selection

#### Models:
```typescript
IReshteFilterModel - Filter model
IPayeFilterModel - Filter model
ISalSelectModel - Year data
```

#### APIs:
- `GET /Reshte/Select` - Reshte dropdown
- `GET /Reshte/SelectWithPaye?payeId={id}` - Filtered Reshte
- `POST /Reshte/Filter` - Advanced Reshte search
- `GET /Paye/Select` - Paye dropdown
- `GET /Paye/SelectWithMaghta?maghtaId={id}` - Filtered Paye
- `POST /Paye/Filter` - Advanced Paye search
- `GET /Sal/Select` - Year selection

---

### 4.5 Sal Module (Placeholder)

**Current Status**: Empty placeholder component  
**Purpose**: Reserved for year/academic period management

---

## 5. Authentication & Authorization

### 5.1 Authentication Flow

1. **Login** → `/auth/login`
   - Username + Password + ReCAPTCHA
   - Endpoint: `POST /Account/Agent/Login`
   - Response includes: access_token, refresh_token, 2FA requirement

2. **Two-Factor Authentication** (if enabled)
   - Server sends verification code
   - User enters code for verification
   - Endpoint: `POST /Account/TwoFactor/SendCode`

3. **Token Management**
   - Access tokens stored in localStorage
   - Refresh tokens scheduled before expiration
   - Automatic refresh: `POST /Account/RefreshToken`
   - Token expiration: 24 hours (hardcoded, can be dynamic)

4. **Logout**
   - Token deletion
   - Local storage cleanup
   - Redirect to login

### 5.2 Authorization

- **Role-Based Access Control (RBAC)**
  - User roles stored in claims (permissions array)
  - Permission checking via `AuthGuard`
  - Routes protected with `canActivate` guard
  - Directive-based visibility: `[uaccess]` directive

- **Permission Levels**
  - Hierarchical permissions (parent-child relationships)
  - Selectable permission structure
  - Permission IDs stored as numbers

---

## 6. Data Models & Contracts

### 6.1 Core Models

#### Authentication Models
```typescript
User {
  id: number;
  username: string;
  email: string;
  password: string;
  accessToken: string;
  refreshToken: string;
  roles: number[];
  pic: string;
  fullname: string;
  occupation: string;
  companyName: string;
  phone: string;
  address: Address;
  socialNetworks: SocialNetworks;
}

Credentials {
  userName: string;
  password: string;
  captchaCode: string;
}

Role {
  id: number;
  title: string;
  permissions: number[];
  isCoreRole: boolean;
}

Permission {
  id: number;
  title: string;
  level: number;
  parentId: number;
  isSelected: boolean;
  name: string;
  _children: Permission[];
}
```

### 6.2 API Response Structure

All API responses follow standard format:
```typescript
{
  success: boolean;
  message: string;
  result: <T>;
  errors?: any[];
}
```

### 6.3 Search & Filtering Model

```typescript
DynamicSearch<T> {
  search: boolean;
  filters: T;
  orderBy: string;
  orderType: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

TablePagingIndex<T> {
  records: T[];
  totalCount: number;
}
```

---

## 7. Integration Points

### 7.1 Backend API Base

- **Development**: Proxy configured via `proxy-config.json`
- **Environments**: test, master configurations

### 7.2 Third-Party Services

- **ReCAPTCHA**: Google ReCAPTCHA v3 (Invisible)
  - Site Key: Configured in environment
  - Endpoint integration in login component

### 7.3 Storage

- **LocalStorage**:
  - Access tokens
  - Refresh tokens
  - User information (claims)
  - Display name
  - UI preferences (dark mode, language)
  - Remember me flag

---

## 8. UI/UX Patterns

### 8.1 Layouts

- **Standalone Components**: All components are standalone
- **Lazy Loading**: Routes lazy-load components
- **Hierarchical Routes**: Theme layout wraps authenticated pages

### 8.2 Common Patterns

- **Data Tables**: Material mat-table with pagination
- **Dialogs**: Material mat-dialog for modals
- **Forms**: Reactive forms with validation
- **Progress Indicators**: Material progress bar for loading states
- **Alerts/Toasts**: SnackBar for notifications

### 8.3 Responsive Design

- ViewEncapsulation.None for global styling
- SCSS for styling with color system
- Material breakpoints for responsive behavior
- Mobile-first approach with Persian RTL support

---

## 9. Key Business Rules

### 9.1 Commission Calculation

- Agents earn from multiple sources:
  - **Payment Share**: Direct percentage from paid orders
  - **Installment Share**: Percentage from installment payments
  - **Total Share**: Sum of all earnings

### 9.2 Order Status Workflow

- **Pending**: Awaiting payment
- **Paid**: Payment completed
- **Failed**: Payment failed
- **Installments**: Multi-payment plan with initial payment
- **Canceled**: Order canceled

### 9.3 Discount Code Management

- Each agent gets a unique code
- Tracks number of registrations using code
- Records income generated per code
- Configurable discount percentages (agent & student)

### 9.4 Password Recovery

- Multi-step process requiring OTP verification
- Mobile phone-based code delivery
- Hash-based verification
- Expiring codes with countdown timer

---

## 10. Performance Considerations

### 10.1 Optimization

- Lazy-loaded route modules
- Signal-based reactive updates (no change detection cycles)
- Pagination: 10 items per page default
- Virtual scrolling candidates: Large student lists

### 10.2 State Management

- Angular Signals for local component state
- BehaviorSubjects for service-level state sharing
- No centralized state library (yet)

---

## 11. Error Handling

### 11.1 HTTP Interception

- Global error handler via `HttpInterceptorService`
- Checks `success` flag in response
- Auto-shows error snackbar messages
- Throws `ResponseError` on failures

### 11.2 User Feedback

- SnackBar notifications (success, error)
- Form validation messages
- Table loading indicators
- Disabled states during operations

---

## 12. Future Considerations

- Sal (Year) module implementation
- Additional pages/features under theme routes
- Enhanced analytics and reporting
- Bulk operations for student management
- Export functionality (PDF, Excel)
- Real-time notifications
- Mobile app variant
