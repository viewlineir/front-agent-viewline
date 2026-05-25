# ViewLine Agent Panel - Specification Kit (Complete)

**Project**: ViewLine Agent Management System  
**Type**: Angular 18 Web Application  
**Version**: 1.0  
**Last Updated**: May 2026  
**Status**: Production

---

## 📋 Specification Kit Contents

This comprehensive specification kit documents every aspect of the ViewLine Agent Panel application. All documentation is exhaustive and non-summarized.

### Core Specification Files

1. **[SPEC_product.md](SPEC_product.md)** - Product & Architecture Overview
   - Product vision and business domain
   - Technology stack and dependencies
   - Complete page-by-page feature breakdown
   - Authentication & authorization system
   - Data models and API structure overview
   - Error handling approach
   - Performance considerations

2. **[SPEC_users.md](SPEC_users.md)** - User Roles & Personas
   - Complete role hierarchy (Agent, Team Lead, Manager, Admin)
   - Permission system (hierarchical with parent-child relationships)
   - Role-based feature access matrix
   - User information models
   - Session & token management
   - Permission scopes and inheritance model

3. **[SPEC_flows.md](SPEC_flows.md)** - User Flows & Features
   - Step-by-step authentication flow (login, 2FA, logout)
   - Password recovery workflow (3-step process)
   - Dashboard interaction flows
   - Student list management and filtering
   - Agent code management
   - Finance page transactions
   - Settings management
   - Token refresh background process
   - Error handling workflows
   - Bulk operations and exports (future)

4. **[SPEC_requirements.md](SPEC_requirements.md)** - API Contracts & Business Rules
   - Complete API endpoint reference (20+ endpoints)
   - Request/response contracts for all endpoints
   - Standard response format
   - HTTP error codes and meanings
   - Authentication headers
   - Pagination and filtering contracts
   - Validation rules for all inputs
   - Rate limiting policies
   - Data format standards
   - Security requirements
   - Business rules (commission, discounts, status workflow)

5. **[SPEC_components.md](SPEC_components.md)** - UI Components & Patterns
   - Complete component architecture
   - All shared UI components (15+ components)
   - Material Design integration
   - Form patterns and validation
   - Layout components
   - Directive library
   - Pipe library
   - Navigation patterns
   - Dialog/modal patterns
   - Loading and feedback states
   - Accessibility features
   - Responsive design system
   - Color palette and theming
   - Typography scale
   - Spacing system

---

## 🎯 Quick Navigation

### For Product Managers
- **Business Overview**: See [SPEC_product.md](SPEC_product.md) → Section 2 (Business Domain)
- **User Roles**: See [SPEC_users.md](SPEC_users.md) → Section 2 (Role Hierarchy)
- **Feature List**: See [SPEC_product.md](SPEC_product.md) → Section 4 (Pages & Features)
- **Business Rules**: See [SPEC_requirements.md](SPEC_requirements.md) → Section 17 (Business Rules)

### For Developers
- **Architecture**: See [SPEC_product.md](SPEC_product.md) → Section 3 (Architecture)
- **Component Structure**: See [SPEC_components.md](SPEC_components.md) → Section 1 (Architecture)
- **API Endpoints**: See [SPEC_requirements.md](SPEC_requirements.md) → Sections 2-6 (API Reference)
- **Data Models**: See [SPEC_product.md](SPEC_product.md) → Section 6 (Data Models)
- **Implementation Patterns**: See [SPEC_flows.md](SPEC_flows.md) → All sections

### For QA/Testers
- **User Flows**: See [SPEC_flows.md](SPEC_flows.md) → All sections
- **Validation Rules**: See [SPEC_requirements.md](SPEC_requirements.md) → Section 13 (Validation)
- **Error Cases**: See [SPEC_requirements.md](SPEC_requirements.md) → All error scenarios
- **Test Matrix**: See [SPEC_users.md](SPEC_users.md) → Section 5 (Feature Access Matrix)

### For Designers
- **UI Components**: See [SPEC_components.md](SPEC_components.md) → Sections 2-5 (Components)
- **Layout Patterns**: See [SPEC_components.md](SPEC_components.md) → Section 5 (Layout)
- **Color System**: See [SPEC_components.md](SPEC_components.md) → Section 13 (Colors)
- **Responsive Design**: See [SPEC_components.md](SPEC_components.md) → Section 12 (Responsive)

### For Security/DevOps
- **Authentication**: See [SPEC_product.md](SPEC_product.md) → Section 5 (Auth & Auth)
- **Security Requirements**: See [SPEC_requirements.md](SPEC_requirements.md) → Section 18 (Security)
- **API Security**: See [SPEC_requirements.md](SPEC_requirements.md) → Section 10 (Headers)
- **Rate Limiting**: See [SPEC_requirements.md](SPEC_requirements.md) → Section 14 (Rate Limits)

---

## 📊 System Overview Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   USER INTERFACE (Angular 18)           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Auth Pages          Dashboard Pages      Settings      │
│  ├─ Login            ├─ Dashboard         ├─ Reshte     │
│  ├─ Forgot Password  ├─ Finance           ├─ Paye       │
│  └─ 2FA              └─ (Theme Layout)    └─ Sal        │
│                                                          │
├─────────────────────────────────────────────────────────┤
│           CORE SERVICES & STATE MANAGEMENT              │
│  ├─ AuthService (Login, 2FA, Logout)                   │
│  ├─ DashboardService (Data & Filtering)                │
│  ├─ FinanceService (Transactions)                      │
│  ├─ SettingService (Org Structure)                     │
│  ├─ HttpInterceptor (Error Handling)                   │
│  └─ Storage Service (LocalStorage Mgmt)                │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                    HTTP CLIENT                          │
│  └─ HttpClient (RxJS, Angular HttpClientModule)        │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                   BACKEND API (REST)                    │
│  ├─ /Account/* (Authentication)                        │
│  ├─ /ForgotPassword/* (Password Recovery)              │
│  ├─ /Agent/* (Dashboard & Finance)                     │
│  ├─ /Reshte/* (Fields/Departments)                     │
│  ├─ /Paye/* (Levels/Tiers)                             │
│  ├─ /Sal/* (Years)                                     │
│  └─ /Profile/* (User Info)                             │
│                                                          │
├─────────────────────────────────────────────────────────┤
│            EXTERNAL SERVICES                            │
│  ├─ Google ReCAPTCHA (Verification)                    │
│  ├─ SMS Service (OTP Delivery)                         │
│  └─ Authentication Provider                            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Features Summary

### Authentication & Security
- ✅ Username/password login
- ✅ Google ReCAPTCHA verification
- ✅ Two-factor authentication (2FA) via SMS
- ✅ Multi-step password recovery
- ✅ Token refresh mechanism
- ✅ Role-based access control
- ✅ Permission-based UI hiding

### Dashboard Management
- ✅ Key metric cards (revenue, students, payments)
- ✅ Comprehensive student list with filters
- ✅ Pagination support
- ✅ Agent discount code generation
- ✅ Code usage analytics
- ✅ Order detail modal dialog
- ✅ Date-based filtering

### Financial Management
- ✅ Transaction history view
- ✅ Payout tracking
- ✅ Date range filtering
- ✅ Commission calculation display
- ✅ Payment status tracking

### Settings & Configuration
- ✅ Reshte (Field/Department) management
- ✅ Paye (Level/Tier) management
- ✅ Sal (Year) selection
- ✅ Cascading hierarchical selectors
- ✅ Advanced filtering

---

## 📈 API Endpoints Overview

**Total Endpoints**: 20+

### Authentication (6)
- `POST /Account/Agent/Login` - Login
- `POST /Account/TwoFactor/SendCode` - Send 2FA code
- `POST /Account/TwoFactor/VerifyCode` - Verify 2FA
- `GET /Account/UserInformation` - Get user info
- `POST /Account/RefreshToken` - Refresh token
- `POST /Account/Logout` - Logout

### Password Recovery (3)
- `POST /ForgotPassword/SendCode` - Send recovery code
- `POST /ForgotPassword/VerifyCode` - Verify code
- `POST /ForgotPassword/ChangePassword` - Change password

### Dashboard (4)
- `GET /Agent/Dashboard` - Dashboard metrics
- `POST /Agent/Dashboard/StudentList` - Student list
- `GET /Agent/Dashboard/Order/Details/{id}` - Order details
- `POST /Agent/Dashboard/DiscountCodeList` - Discount codes

### Finance (1)
- `POST /Agent/UserPayout/GetAll` - Transaction history

### Settings (7)
- `GET /Reshte/Select` - Reshte dropdown
- `GET /Reshte/SelectWithPaye` - Filtered Reshte
- `POST /Reshte/Filter` - Advanced Reshte search
- `GET /Paye/Select` - Paye dropdown
- `GET /Paye/SelectWithMaghta` - Filtered Paye
- `POST /Paye/Filter` - Advanced Paye search
- `GET /Sal/Select` - Year selection

### Profile (1)
- `GET /Profile/ShowAvatar/100` - User avatar

---

## 🛠 Technology Stack

### Frontend Framework
- **Angular**: 18.1.4
- **TypeScript**: 5.4.2
- **RxJS**: 7.8.0

### UI & Material
- **Angular Material**: 18.1.4
- **Angular CDK**: 18.1.4
- **Material Icons**: 6.7.0

### Date Handling
- **jalali-moment**: 3.3.11
- **Custom Adapters**: Persian & Gregorian support

### Security & Verification
- **ngx-captcha**: 13.0.0 (Google ReCAPTCHA)

### Image Processing
- **ngx-image-cropper**: 7.2.1

### Development
- **Angular CLI**: 18.1.4
- **Karma**: 6.4.0
- **Jasmine**: 5.1.0

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| **xs** | < 600px | Mobile phones |
| **sm** | 600-960px | Tablets (portrait) |
| **md** | 960-1264px | Tablets (landscape), small desktops |
| **lg** | 1264-1904px | Desktops |
| **xl** | > 1904px | Large displays |

**RTL Support**: Full Persian/Arabic support with auto-flipped layouts

---

## 🎨 Design System

### Color Palette
- **Primary**: #1976D2 (Blue)
- **Accent**: #FF4081 (Pink)
- **Success**: #4CAF50 (Green)
- **Warning**: #FFC107 (Orange)
- **Error**: #F44336 (Red)
- **Info**: #2196F3 (Blue)

### Spacing Scale
- Base unit: 4px
- Common: 8px, 12px, 16px, 24px, 32px

### Typography
- Font family: System fonts + IranSans (Persian)
- Base size: 14px
- Scale: 12px to 57px

---

## 🚀 Deployment Configuration

### Build Targets
```bash
npm run build              # Default development
npm run build:test        # Test environment
npm run build:master      # Production
```

### Environment Configuration
- **Development**: Proxy via `proxy-config.json`
- **Test**: Separate API endpoint
- **Master**: Production API endpoint

### Docker Support
- Dockerfile provided
- Nginx configuration included
- Multi-stage build setup

---

## 📋 Data Models Reference

### Core Models
- **User**: Profile & authentication data
- **Role**: Permission grouping
- **Permission**: Fine-grained access control
- **Student**: Registered user data
- **Order**: Purchase transaction
- **DiscountCode**: Commission code tracking
- **Transaction**: Financial record

### API Models
- **DashboardData**: Metric summary
- **StudentList**: Paginated student data
- **OrderDetail**: Complete order information
- **DiscountCodeList**: Code analytics
- **TransactionHistory**: Payout records

---

## ✅ Quality Standards

### Code Organization
- Standalone components (no NgModules)
- Lazy-loaded routes
- Shared component library
- Service-based architecture
- Strong TypeScript typing

### Performance
- Signals for reactive updates
- Virtual scrolling capable
- Pagination (10 items default)
- Image optimization
- Bundle size optimized

### Accessibility
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Color contrast compliance
- Focus management

### Security
- JWT authentication
- ReCAPTCHA verification
- XSS protection
- CSRF prevention (HttpClient handles)
- Input validation & sanitization

---

## 🔗 API Response Format

All endpoints return:

```typescript
{
  success: boolean;        // Success indicator
  message: string;         // User message (Persian)
  result?: T;              // Data payload
  errors?: Array<{
    code: string;
    message: string;
    field?: string;
  }>;
  timestamp?: string;      // ISO datetime
}
```

---

## 🧪 Testing Coverage

### Unit Tests
- Service logic
- Utility functions
- Pipe transformations
- Custom validators

### Integration Tests
- Component interactions
- Service integration
- HTTP interceptor
- Authentication flow

### E2E Tests (Recommended)
- Complete user flows
- Form submissions
- Navigation paths
- Error scenarios

---

## 📚 Documentation Index

| Document | Focus | Audience |
|----------|-------|----------|
| SPEC_product.md | Architecture, Features, Technology | Everyone |
| SPEC_users.md | Roles, Permissions, Access Control | PM, QA, Dev Lead |
| SPEC_flows.md | Step-by-step User Journeys | QA, Dev, Designer |
| SPEC_requirements.md | API Contracts, Business Rules | Dev, QA, DevOps |
| SPEC_components.md | UI Components, Patterns, Design | Dev, Designer, QA |

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | May 2026 | Initial comprehensive specification |

---

## 📞 Support & References

### Key Files in Codebase
```
src/app/
├── core/
│   ├── auth/         # Authentication & authorization
│   ├── interceptors/ # HTTP interceptor
│   ├── services/     # Core services
│   ├── models/       # Data models
│   └── config/       # App configuration
├── shared/
│   ├── components/   # Reusable UI components
│   ├── directives/   # Custom directives
│   ├── pipes/        # Custom pipes
│   └── modules/      # Feature modules
└── views/
    ├── theme/        # Main layout
    └── pages/        # Application pages
```

### Configuration Files
- `angular.json` - Angular CLI configuration
- `tsconfig.json` - TypeScript configuration
- `proxy-config.json` - Development proxy
- `src/environments/` - Environment configurations

---

## 💡 Best Practices Used

✅ **Angular Best Practices**
- Standalone components
- Lazy-loaded routes
- OnPush change detection candidate
- Reactive programming with RxJS/Signals

✅ **Security**
- Token-based authentication
- Permission-based UI
- Input validation
- CORS configuration

✅ **Performance**
- Tree-shakeable code
- Code splitting
- Lazy loading
- Signals for efficiency

✅ **Accessibility**
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast

✅ **Code Quality**
- Strong typing with TypeScript
- Service-based architecture
- Dependency injection
- Error handling patterns

---

## 🎓 How to Use This Documentation

1. **Start Here**: Read this overview
2. **Understand Domain**: Review SPEC_product.md for business context
3. **Learn Roles**: Check SPEC_users.md for permission model
4. **Follow Flows**: Study SPEC_flows.md for user journeys
5. **Build Features**: Reference SPEC_requirements.md for APIs
6. **Create UI**: Use SPEC_components.md for component patterns

---

**Documentation Complete** ✅

This specification kit provides exhaustive coverage of the ViewLine Agent Panel system. Every major feature, flow, API endpoint, and component is documented with zero summarization.

*For questions or updates, refer to the specific sections linked above.*

