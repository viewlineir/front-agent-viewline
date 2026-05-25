# User Roles & Personas: ViewLine Agent Panel

## 1. Role Hierarchy

The ViewLine system implements a hierarchical role-based access control (RBAC) system with the following structure:

```
System
├── Admin (System Administrator)
│   ├── Manages all agents
│   ├── Views system-wide analytics
│   └── Manages permissions & roles
├── Agent (Primary Role)
│   ├── Agent Manager
│   ├── Regular Agent
│   └── Team Lead Agent
└── Support Roles
    ├── Finance Manager
    └── Report Viewer
```

---

## 2. Primary Role: Agent

### 2.1 Agent Overview

**Role ID**: System-defined (numeric ID)  
**Type**: Primary actor in the ViewLine ecosystem  
**Permissions-Based**: Dynamic permission system loaded from backend

#### Agent Responsibilities:
- Recruit and register students
- Distribute discount codes to encourage enrollment
- Track student progress and payments
- Monitor personal financial metrics
- Manage commission earnings
- Provide student support

---

### 2.2 Agent Sub-Types (Business Levels)

#### 2.2.1 Regular Agent
**Base Permissions**:
- View own dashboard
- See registered students
- Generate discount codes
- View transaction history
- Access basic filters

**Capabilities**:
- Monitor own commission earnings
- Track student registrations
- Download reports (filtered to own data)
- View limited analytics

**API Access**:
- `/Agent/Dashboard` (own data only)
- `/Agent/Dashboard/StudentList` (own students)
- `/Agent/Dashboard/DiscountCodeList` (own codes)
- `/Agent/UserPayout/GetAll` (own transactions)

---

#### 2.2.2 Team Lead Agent
**Base Permissions** (Inherits from Regular Agent):
- All Regular Agent permissions

**Enhanced Permissions**:
- View team member dashboards
- Monitor team revenue
- Aggregate team metrics
- Manage team code distribution

**Additional Capabilities**:
- Team reporting
- Performance analytics
- Approve discount codes
- Team financial oversight

---

#### 2.2.3 Agent Manager
**Base Permissions** (Inherits from Team Lead):
- All Team Lead permissions

**Regional/Area Permissions**:
- Manage multiple teams
- Regional performance tracking
- Agent training & support
- Commission auditing

---

### 2.3 Agent Permission Model

The permission system is hierarchical with parent-child relationships:

#### Permission Structure
```typescript
Permission {
  id: number;              // Unique permission ID
  title: string;           // Human-readable name
  name: string;            // Code/API reference
  level: number;           // Hierarchy level (1 = root, 2+ = child)
  parentId?: number;       // Parent permission ID
  isSelected: boolean;     // Currently assigned
  _children: Permission[]; // Child permissions
}
```

#### Common Permission Categories

**Dashboard Permissions**:
- `view_dashboard` - Access dashboard page
- `view_own_metrics` - See personal metrics
- `view_team_metrics` - See team metrics (Team Lead+)
- `view_all_metrics` - See system metrics (Admin only)

**Student Management Permissions**:
- `view_students_own` - See own registered students
- `view_students_team` - See team students
- `view_students_all` - See all students
- `manage_student_records` - Edit student information
- `export_student_data` - Download student list
- `bulk_student_operations` - Batch updates

**Finance Permissions**:
- `view_own_earnings` - See personal commission
- `view_team_earnings` - See team earnings
- `view_all_earnings` - System-wide earnings
- `approve_payouts` - Authorize payment disbursements
- `view_transactions` - See transaction history
- `export_financial_reports` - Download finance data
- `adjust_commissions` - Manual commission edits

**Discount Code Permissions**:
- `create_discount_codes` - Generate new codes
- `view_own_codes` - See personal codes
- `view_team_codes` - See team codes
- `manage_code_validity` - Activate/deactivate codes
- `view_code_analytics` - See code performance

**Settings Permissions**:
- `manage_reshte` - Edit departments/fields
- `manage_paye` - Edit levels/tiers
- `manage_sal` - Edit year settings
- `manage_user_info` - Edit profile information
- `manage_team_settings` - Team configuration

**Reporting Permissions**:
- `view_own_reports` - Personal reports
- `view_team_reports` - Team reports
- `view_system_reports` - All reports
- `schedule_reports` - Automated report generation
- `export_reports` - Download reports

**Admin Permissions** (System Admin only):
- `admin_dashboard` - Admin panel access
- `manage_all_agents` - Create/edit/delete agents
- `manage_permissions` - Assign/modify permissions
- `manage_roles` - Create/edit roles
- `system_settings` - Global configuration
- `audit_logs` - View system audit trail
- `manage_payouts` - Control payout system

---

## 3. Authentication & Access Control

### 3.1 Login Process

**Role Determination**:
1. User logs in with credentials
2. Server authenticates and determines role(s)
3. Permissions are loaded into JWT claims
4. Frontend stores claims in localStorage

**Multi-Role Support**:
- Users can have multiple roles
- Each role has separate permission set
- UI adapts based on active role
- Role switching available in account settings

### 3.2 Permission Checking

#### Route-Level Protection
```typescript
canActivate: [AuthGuard],
data: {
  permission: {
    permittedRoles: ['agent', 'agent_manager'],
    deniedRoles: [] // Optional
  }
}
```

#### Directive-Level Hiding
```html
<button [uaccess]="'create_discount_codes'">Generate Code</button>
<!-- Element hidden if user lacks permission -->
```

#### Service-Level Verification
```typescript
isAuthUserInRole(requiredPermission: string): boolean {
  const userPermissions = this.browserStorageService.getUserInformation();
  return userPermissions.includes(requiredPermission);
}
```

### 3.3 Token Management

**Access Token**:
- JWT format
- Contains permission claims
- Expires in 24 hours (hardcoded)
- Auto-refresh before expiration

**Refresh Token**:
- Long-lived token
- Used to obtain new access tokens
- Endpoint: `POST /Account/RefreshToken`
- Stored securely in localStorage

**Two-Factor Authentication**:
- Optional security enhancement
- SMS-based OTP verification
- Required during login if enabled
- Hash-based validation

---

## 4. User Information Model

### 4.1 User Data Structure

```typescript
User {
  id: number;                    // User ID
  username: string;              // Login username
  email: string;                 // Email address
  phone: string;                 // Contact number
  fullname: string;              // Display name
  pic: string;                   // Avatar URL
  gender: string;                // M/F
  occupation: string;            // Job title
  companyName: string;           // Organization
  address: Address;              // Location info
  socialNetworks: SocialNetworks; // Contact details
  roles: number[];               // Role IDs assigned
  claims: string[];              // Permission strings
}

UserInfo {
  id: number;
  hasAvatar: boolean;
  avatar: string;
  gender: string;
  displayName: string;
}

Address {
  street: string;
  city: string;
  province: string;
  postalCode: string;
}

SocialNetworks {
  telegram: string;
  whatsapp: string;
  instagram: string;
  twitter: string;
}
```

---

## 5. Role-Based Feature Access Matrix

| Feature | Regular Agent | Team Lead | Agent Manager | Admin |
|---------|--------------|-----------|---------------|-------|
| **Dashboard** | ✅ Own | ✅ Own + Team | ✅ Regional | ✅ System |
| **Student List** | ✅ Own | ✅ Own + Team | ✅ Regional | ✅ All |
| **Discount Codes** | ✅ Generate | ✅ Own + Approve | ✅ Manage | ✅ Manage |
| **Finance/Payouts** | ✅ View Own | ✅ View Team | ✅ Approve | ✅ Full Control |
| **Reports** | ✅ Own | ✅ Team | ✅ Regional | ✅ System |
| **Settings** | ✅ Profile | ✅ Team | ✅ Area | ✅ Full |
| **User Management** | ❌ | ❌ | ✅ Limited | ✅ Full |
| **Permissions** | ❌ | ❌ | ❌ | ✅ Full |

---

## 6. Default User Flows

### 6.1 New Agent Onboarding

1. **Account Creation**
   - Admin creates agent account
   - Initial password set
   - Role assigned: "Regular Agent"

2. **First Login**
   - Login page presented
   - Username/password entry
   - ReCAPTCHA verification
   - Optional 2FA setup

3. **Dashboard Orientation**
   - Welcome metrics displayed
   - Student list (empty initially)
   - Discount code generation guide
   - Profile completion prompt

4. **Profile Completion**
   - Edit personal information
   - Upload avatar
   - Add social contacts
   - Set preferences (language, theme)

### 6.2 Permission Escalation

1. **Regular Agent → Team Lead**
   - Manager approves promotion
   - Role updated on backend
   - Permissions refreshed on next login
   - Dashboard updated with team metrics

2. **Team Lead → Agent Manager**
   - Regional manager approval
   - Additional settings access
   - Team management features unlocked
   - Higher commission tier

3. **Any Role → Admin** (Rare)
   - System administrator assignment
   - Full system access granted
   - Admin dashboard unlocked
   - Audit trail logging enabled

---

## 7. Permission Inheritance Model

```
Root Permissions
├── dashboard_view
│   ├── view_own_metrics
│   ├── view_team_metrics
│   └── view_system_metrics
├── student_management
│   ├── view_students_own
│   ├── view_students_team
│   ├── manage_students
│   └── export_students
├── finance
│   ├── view_earnings_own
│   ├── view_earnings_team
│   ├── approve_payouts
│   └── manage_commissions
├── discount_codes
│   ├── create_codes
│   ├── manage_codes
│   └── view_analytics
└── administration
    ├── manage_users
    ├── manage_roles
    ├── manage_permissions
    └── system_config
```

---

## 8. Permission Scope Levels

### Level 1: Personal (Own Data)
- User can only access their own data
- Example: `view_earnings_own`
- Enforced at API level with user ID filtering

### Level 2: Team/Department (Group Data)
- User can access their team's data
- Example: `view_team_metrics`
- Enforced with organizational hierarchy check

### Level 3: Regional (Area Data)
- User can access their region's data
- Example: Agent Manager viewing area metrics
- Enforced with geographic/organizational zone

### Level 4: System (All Data)
- Full system access
- Example: Admin system reports
- No data filtering applied

---

## 9. Session & Security

### 9.1 Session Management

**Login Session**:
- Token pair stored (access + refresh)
- Expiration: 24 hours (access token)
- Refresh: Automatic 5 minutes before expiration
- Logout: All tokens cleared from localStorage

**Remember Me**:
- Optional "stay logged in" feature
- Extends session persistence
- Controlled by flag in localStorage

### 9.2 Security Practices

- **Passwords**: Minimum 3 characters (server-validated)
- **Captcha**: Google ReCAPTCHA on login
- **2FA**: OTP via SMS (optional)
- **HTTPS**: Enforced in production
- **Token Storage**: LocalStorage (no HttpOnly due to Angular architecture)
- **CORS**: Backend handles origin validation

---

## 10. Account Management Endpoints

### 10.1 Authentication Endpoints

```
POST /Account/Agent/Login
  Request: { userName, password, captchaCode }
  Response: { access_token, refresh_token, twoFactorAuth? }

POST /Account/TwoFactor/SendCode
  Request: { value: phoneNumber }
  Response: { success, message }

POST /Account/TwoFactor/VerifyCode
  Request: { code, hash }
  Response: { access_token, refresh_token }

GET /Account/UserInformation
  Response: { id, displayName, claims[], avatar, gender }

POST /Account/Logout
  Request: { refreshToken }
  Response: { success }

POST /Account/RefreshToken
  Request: { refreshToken }
  Response: { access_token, refresh_token }
```

---

## 11. Future Role Enhancements

- **Student Role**: Self-service dashboard for registered students
- **Finance Manager**: Dedicated payout processing role
- **Content Manager**: Manage courses and materials
- **Support Agent**: Help desk for student issues
- **Reporting Analyst**: BI and advanced analytics
- **Custom Roles**: Admin-defined role creation

---

## 12. Accessibility & Compliance

### 12.1 Role-Based Accessibility

- All UI elements respect permission directives
- Hidden elements via CSS (display: none)
- Routes protected via guard (redirect if unauthorized)
- Consistent messaging for denied access

### 12.2 Audit & Compliance

- All permission changes logged
- Login attempts tracked
- Critical actions audited
- Data access logs maintained (future feature)

