# Requirements & API Contracts: ViewLine Agent Panel

## 1. API Endpoint Reference

All endpoints follow REST conventions with `/api/v1` prefix (configured in environment).

---

## 2. Authentication Endpoints

### 2.1 Agent Login

**Endpoint**: `POST /Account/Agent/Login`

**Purpose**: Authenticate agent with credentials and optional captcha

**Request**:
```typescript
{
  userName: string;        // Required, min 3 characters
  password: string;        // Required
  captchaCode: string;     // Required, from Google ReCAPTCHA
}
```

**Response (Success 200)**:
```typescript
{
  success: true;
  message: string;
  result: {
    access_token: string;        // JWT token for API auth
    refresh_token: string;       // Long-lived token for refresh
    twoFactorAuth?: boolean;     // True if 2FA required
    twoFactorHash?: string;      // Hash for 2FA verification (if twoFactorAuth=true)
    sendCodeMessage?: string;    // Message sent to user about code
  }
}
```

**Response (Error 401)**:
```typescript
{
  success: false;
  message: string;  // "نام کاربری یا رمز عبور اشتباه است"
  errors?: string[];
}
```

**Error Cases**:
- Invalid credentials: 401
- Account locked: 403
- Invalid captcha: 400
- Captcha expired: 400
- User not agent: 403
- Server error: 500

**Headers**:
- Content-Type: application/json
- No authentication required

---

### 2.2 User Information

**Endpoint**: `GET /Account/UserInformation`

**Purpose**: Fetch authenticated user's profile and permissions

**Request**: No body

**Response (Success 200)**:
```typescript
{
  success: true;
  result: {
    id: number;
    displayName: string;         // User's full name
    avatar: string;              // Avatar URL or base64
    gender: string;              // 'M' or 'F'
    claims: string[];            // Array of permission strings
    hasAvatar: boolean;
    email?: string;
    phone?: string;
  }
}
```

**Error Cases**:
- Unauthorized (no token): 401
- Invalid token: 401
- User not found: 404
- Server error: 500

**Headers**:
- Authorization: `Bearer {access_token}`
- Content-Type: application/json

---

### 2.3 Two-Factor Authentication - Send Code

**Endpoint**: `POST /Account/TwoFactor/SendCode`

**Purpose**: Send verification code to user's phone/email

**Request**:
```typescript
{
  value: string;  // Phone number or email address
}
```

**Response (Success 200)**:
```typescript
{
  success: true;
  message: string;  // "کد ارسال شد"
  result: {
    expiredMinuteTime: number;  // Minutes until code expires (e.g., 10)
  }
}
```

**Error Cases**:
- Invalid phone: 400
- SMS service unavailable: 503
- User not found: 404
- Server error: 500

**Headers**:
- Content-Type: application/json

---

### 2.4 Two-Factor Authentication - Verify Code

**Endpoint**: `POST /Account/TwoFactor/VerifyCode`

**Purpose**: Verify OTP code and complete 2FA

**Request**:
```typescript
{
  code: string;        // 6-digit code from SMS/Email
  hash: string;        // Hash from login response
  phoneNumber: string; // Phone number code was sent to
}
```

**Response (Success 200)**:
```typescript
{
  success: true;
  result: {
    access_token: string;
    refresh_token: string;
  }
}
```

**Error Cases**:
- Invalid code: 400
- Code expired: 400
- Too many attempts: 429
- Invalid hash: 400
- Server error: 500

**Headers**:
- Content-Type: application/json

---

### 2.5 Refresh Token

**Endpoint**: `POST /Account/RefreshToken`

**Purpose**: Obtain new access token using refresh token

**Request**:
```typescript
{
  refreshToken: string;  // Token from storage
}
```

**Response (Success 200)**:
```typescript
{
  success: true;
  result: {
    access_token: string;
    refresh_token: string;  // May return new refresh token
  }
}
```

**Error Cases**:
- Invalid token: 401
- Token expired: 401
- Token revoked: 401
- User not found: 404

**Headers**:
- Content-Type: application/json

---

### 2.6 Logout

**Endpoint**: `POST /Account/Logout`

**Purpose**: Invalidate tokens and end session

**Request**:
```typescript
{
  refreshToken: string;
}
```

**Response (Success 200)**:
```typescript
{
  success: true;
  message: string;
}
```

**Headers**:
- Authorization: `Bearer {access_token}`
- Content-Type: application/json

---

## 3. Password Recovery Endpoints

### 3.1 Send Recovery Code

**Endpoint**: `POST /ForgotPassword/SendCode`

**Purpose**: Send OTP for password recovery initiation

**Request**:
```typescript
{
  phoneNumber: string;  // User's registered phone
}
```

**Response (Success 200)**:
```typescript
{
  success: true;
  message: string;
  result: {
    expiredMinuteTime: number;  // Code validity duration
  }
}
```

**Error Cases**:
- Phone not registered: 404
- SMS service error: 503
- Rate limit exceeded: 429

---

### 3.2 Verify Recovery Code

**Endpoint**: `POST /ForgotPassword/VerifyCode`

**Purpose**: Verify recovery code before password change

**Request**:
```typescript
{
  phoneNumber: string;
  code: string;  // OTP code
}
```

**Response (Success 200)**:
```typescript
{
  success: true;
  result: {
    hash: string;  // Used in next step
    message: string;
  }
}
```

**Error Cases**:
- Invalid code: 400
- Code expired: 400
- Too many attempts: 429

---

### 3.3 Change Password

**Endpoint**: `POST /ForgotPassword/ChangePassword`

**Purpose**: Complete password recovery with new password

**Request**:
```typescript
{
  mobile: string;              // Phone number
  hash: string;                // Hash from verify step
  password: string;            // New password (min 6 chars)
  confirmPassword: string;     // Password confirmation
}
```

**Response (Success 200)**:
```typescript
{
  success: true;
  message: string;  // "رمز عبور تغییر یافت"
}
```

**Error Cases**:
- Invalid hash: 400
- Password mismatch: 400
- Password policy: 400
- User not found: 404

---

## 4. Dashboard Endpoints

### 4.1 Get Dashboard Data

**Endpoint**: `GET /Agent/Dashboard`

**Purpose**: Fetch dashboard metrics and summary

**Response (Success 200)**:
```typescript
{
  success: true;
  result: {
    totalRevenue: number;           // Total earnings
    totalRevenuePaid: number;       // Paid out amount
    totalRevenueUnPaid: number;     // Pending payouts
    studentCount: number;           // Total registered students
    totalPaid: number;              // Total commission received
    lastAgentCode: string;          // Most recent discount code
  }
}
```

**Headers**:
- Authorization: `Bearer {access_token}`

---

### 4.2 Get Student List

**Endpoint**: `POST /Agent/Dashboard/StudentList`

**Purpose**: Fetch paginated and filtered student list

**Request**:
```typescript
{
  search: true;
  filters: {
    discountId?: number;           // Discount code ID
    orderStatus?: number;          // 0-4 enum value
    identifierName?: string;       // Student name or ID
    orderCreatedDate_From?: string; // ISO datetime or Persian
    orderCreatedDate_To?: string;   // ISO datetime or Persian
  };
  orderBy: string;                 // Field to sort by
  orderType: 'asc' | 'desc';
  page: number;                    // 1-based page number
  pageSize: number;                // Items per page
}
```

**Response (Success 200)**:
```typescript
{
  success: true;
  result: {
    records: Array<{
      studentFirstName: string;
      studentLastName: string;
      createdDateTime: string;
      orderId: number;
      discountCode: string;
      orderStatus: number;  // 0=Pending, 1=Paid, 2=Failed, 3=Installments, 4=Canceled
      orderInstallmentPaidCountAndTotalCount: string; // "2/5"
      agentShareFromDebtInstallments: number;
      agentShareFromPayments: number;
      agentShareTotal: number;
    }>;
    totalCount: number;
  };
}
```

**Filter Order Status Enum**:
```typescript
enum EOrderStatusType {
  Pending = 0,
  Paid = 1,
  Failed = 2,
  InstallmentsWithInitialPayment = 3,
  Canceled = 4
}
```

**Pagination Rules**:
- `page`: 1-based, starts at 1
- `pageSize`: Default 10, max 100
- `totalCount`: Total records matching filter
- Response contains only records for requested page

---

### 4.3 Get Order Details

**Endpoint**: `GET /Agent/Dashboard/Order/Details/{orderId}`

**Purpose**: Fetch detailed information for a specific order

**URL Parameters**:
- `orderId` (number): Order ID to retrieve

**Response (Success 200)**:
```typescript
{
  success: true;
  result: {
    orderId: number;
    studentId: number;
    studentName: string;
    courses: Array<{
      courseId: number;
      courseName: string;
      teacherName: string;
      coursePrice: number;
      discountAmount: number;
      finalPrice: number;
    }>;
    totalPrice: number;
    totalDiscount: number;
    netPrice: number;
    orderStatus: number;
    paymentType: string;
    createdDate: string;
  };
}
```

**Error Cases**:
- Order not found: 404
- Access denied (not agent's order): 403

---

### 4.4 Get Discount Code List

**Endpoint**: `POST /Agent/Dashboard/DiscountCodeList`

**Purpose**: Fetch agent's discount codes with analytics

**Request**:
```typescript
{
  search: true;
  filters: {};
  orderBy: string;
  orderType: 'asc' | 'desc';
  page: number;
  pageSize: number;
}
```

**Response (Success 200)**:
```typescript
{
  success: true;
  result: {
    records: Array<{
      code: string;
      createdOnUtc: string;
      discountMultiPercentAgent: number;  // Commission %
      discountMultiPercentStudent: number; // Student discount %
      registerCount: number;               // Times used
      incomeFromPaidAmount: number;       // Revenue generated
    }>;
    totalCount: number;
  };
}
```

**Business Logic**:
- `registerCount`: Number of students registered with this code
- `incomeFromPaidAmount`: Total commission earned from this code
- `discountMultiPercentAgent`: Agent's commission percentage
- `discountMultiPercentStudent`: Discount given to student

---

## 5. Finance Endpoints

### 5.1 Get Transaction History

**Endpoint**: `POST /Agent/UserPayout/GetAll`

**Purpose**: Fetch agent's payout/transaction history

**Request**:
```typescript
{
  search: true;
  filters: {
    userPayoutDate_From?: string;  // ISO datetime
    userPayoutDate_To?: string;    // ISO datetime
  };
  orderBy: string;
  orderType: 'asc' | 'desc';
  page: number;
  pageSize: number;
}
```

**Response (Success 200)**:
```typescript
{
  success: true;
  result: {
    records: Array<{
      id: number;
      createDate: string;  // Transaction date
      price: number;       // Amount (paid or pending)
      status: string;      // 'Pending', 'Paid', 'Failed'
    }>;
    totalCount: number;
  };
}
```

**Date Format**:
- Both endpoints accept ISO 8601 format
- Persian calendar support via jalali-moment
- Time component for precision: `HH:mm:ss`

---

## 6. Settings/Configuration Endpoints

### 6.1 Get Reshte (Field) Select

**Endpoint**: `GET /Reshte/Select`

**Purpose**: Get dropdown list of fields/departments

**Response (Success 200)**:
```typescript
{
  success: true;
  result: Array<{
    id: number;
    title: string;
    description?: string;
  }>;
}
```

---

### 6.2 Get Reshte Select with Paye Filter

**Endpoint**: `GET /Reshte/SelectWithPaye?payeId={payeId}`

**Purpose**: Get Reshte filtered by Paye (hierarchical)

**Query Parameters**:
- `payeId` (number): Paye ID to filter by

**Response (Success 200)**:
```typescript
{
  success: true;
  result: Array<{
    id: number;
    title: string;
  }>;
}
```

---

### 6.3 Filter Reshte with Advanced Search

**Endpoint**: `POST /Reshte/Filter`

**Purpose**: Search Reshte with multiple criteria

**Request**:
```typescript
DynamicSearch<IReshteFilterModel> {
  search: true;
  filters: {
    title?: string;
    code?: string;
    status?: boolean;
  };
  orderBy: string;
  orderType: 'asc' | 'desc';
  page: number;
  pageSize: number;
}
```

**Response (Success 200)**:
```typescript
{
  success: true;
  result: {
    records: Array<{
      id: number;
      title: string;
      code?: string;
      status?: boolean;
    }>;
    totalCount: number;
  };
}
```

---

### 6.4 Get Paye (Level) Select

**Endpoint**: `GET /Paye/Select`

**Purpose**: Get dropdown of organizational levels

**Response (Success 200)**:
```typescript
{
  success: true;
  result: Array<{
    id: number;
    title: string;
  }>;
}
```

---

### 6.5 Get Paye Select with Maghta Filter

**Endpoint**: `GET /Paye/SelectWithMaghta?maghtaId={maghtaId}`

**Purpose**: Get Paye filtered by Maghta (district)

**Response (Success 200)**:
```typescript
{
  success: true;
  result: Array<{
    id: number;
    title: string;
  }>;
}
```

---

### 6.6 Filter Paye with Advanced Search

**Endpoint**: `POST /Paye/Filter`

**Purpose**: Search Paye with criteria

**Request**:
```typescript
DynamicSearch<IPayeFilterModel> {
  search: true;
  filters: { /* paye-specific filters */ };
  orderBy: string;
  orderType: 'asc' | 'desc';
  page: number;
  pageSize: number;
}
```

**Response (Success 200)**:
```typescript
{
  success: true;
  result: {
    records: any[];
    totalCount: number;
  };
}
```

---

### 6.7 Get Sal (Year) Select

**Endpoint**: `GET /Sal/Select`

**Purpose**: Get list of academic years

**Response (Success 200)**:
```typescript
{
  success: true;
  result: Array<{
    id: number;
    title: string;  // e.g., "1403"
    isActive: boolean;
  }>;
}
```

---

## 7. Profile Endpoints

### 7.1 Get User Avatar

**Endpoint**: `GET /Profile/ShowAvatar/100`

**Purpose**: Fetch user's profile avatar (100x100)

**Response**: Binary image data (image/jpeg or image/png)

**Error Cases**:
- User has no avatar: 404 or default image
- Invalid size: 400

**Query Parameters**:
- Size: 100 (or configurable)

**Usage Example**:
```typescript
getImage(): Observable<any> {
  return this.httpClient.get('/Profile/ShowAvatar/100', { 
    responseType: 'blob' 
  });
}
```

---

## 8. Standard Response Format

All API responses follow this contract:

```typescript
interface ApiResponse<T> {
  success: boolean;        // true if request succeeded
  message: string;         // Human-readable message
  result?: T;              // Data payload (if success=true)
  errors?: Array<{
    code: string;
    message: string;
    field?: string;
  }>;
  timestamp?: string;      // ISO datetime
}
```

---

## 9. HTTP Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | OK | Process response |
| 201 | Created | Redirect to resource |
| 400 | Bad Request | Validate form, show errors |
| 401 | Unauthorized | Redirect to login |
| 403 | Forbidden | Show access denied |
| 404 | Not Found | Show "not found" message |
| 429 | Too Many Requests | Show "too many attempts" (rate limit) |
| 500 | Server Error | Retry or contact support |
| 503 | Service Unavailable | Show "service maintenance" message |

---

## 10. Authentication Headers

All protected endpoints require:

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Token Refresh Logic**:
- Access token expires in 24 hours
- Frontend refreshes 5 minutes before expiry
- Refresh endpoint: `POST /Account/RefreshToken`
- If refresh fails, redirect to login

---

## 11. Pagination Contract

Standard pagination format for list endpoints:

**Request**:
```typescript
{
  page: number;      // 1-based
  pageSize: number;  // Items per page
  orderBy: string;   // Sort field name
  orderType: 'asc' | 'desc';
  search: boolean;   // Whether to search
  filters: Record<string, any>;
}
```

**Response**:
```typescript
{
  records: T[];
  totalCount: number;  // Total matching records
  currentPage?: number;
  pageSize?: number;
}
```

**Defaults**:
- pageSize: 10
- orderBy: 'Id'
- orderType: 'desc'
- page: 1

---

## 12. Filter Contract

Filters are optional key-value pairs:

```typescript
interface DynamicSearch<T> {
  search: boolean;
  filters: T;  // Type-safe filter object
  orderBy: string;
  orderType: 'asc' | 'desc';
  page: number;
  pageSize: number;
}
```

**Filter Behavior**:
- Empty filters `{}` returns all data
- Filters use AND logic (all must match)
- Date filters: use ISO format or Persian dates
- String filters: typically use "contains" matching
- Number filters: exact match unless range specified

---

## 13. Validation Rules

### Username
- Required
- Minimum 3 characters
- Maximum 50 characters
- Alphanumeric + underscore
- Case-insensitive matching

### Password (Login)
- Required
- Minimum 3 characters (frontend)
- Server may require stricter rules

### Password (Recovery)
- Minimum 6 characters
- Must contain uppercase + lowercase + number (recommended)
- Cannot match username
- Cannot reuse last 5 passwords (if enforced)

### Phone Number
- Required format: 11 digits for Iran
- Starts with 0 or 98
- Validated before sending codes
- Unique per user account

### Email
- Valid email format
- Unique per user
- Used for password recovery (optional)

### ReCAPTCHA
- Google ReCAPTCHA v3
- Invisible verification
- Score-based validation (0.0-1.0)
- Configured per environment

---

## 14. Rate Limiting

### Login Attempt Rate Limit
- 5 failed attempts per 15 minutes
- After limit: Show "Too many attempts. Try again later"
- Account temporary lockout (15 minutes)

### OTP Sending Rate Limit
- 3 OTP requests per 30 minutes per phone
- Prevents SMS flooding
- Error: 429 Too Many Requests

### General API Rate Limit
- 100 requests per minute per user
- 1000 requests per day per user
- Error: 429 with Retry-After header

---

## 15. Data Format Standards

### Dates
- Storage: ISO 8601 (UTC)
- Display: Persian calendar (Jalali)
- User Input: Persian or Gregorian (auto-detected)
- API Input: ISO 8601 with time component

### Numbers
- Decimal: Use `.` separator
- No thousand separators in API
- Currency: Shows with Iran Rial (﷼)
- Percentages: 0-100 range

### Strings
- UTF-8 encoding
- RTL text (Persian)
- Support emojis and special characters
- Trim whitespace on input

### Booleans
- `true` / `false` (not 0/1 or yes/no)
- Camel case in JSON
- Optional fields allowed

---

## 16. Error Message Localization

Common error messages with Persian translations:

```
"Invalid credentials" → "نام کاربری یا رمز عبور اشتباه است"
"User not found" → "کاربری یافت نشد"
"Access denied" → "دسترسی رد شد"
"Code expired" → "کد منقضی شده"
"Invalid code" → "کد نادرست است"
"Please try again" → "لطفاً دوباره تلاش کنید"
"Server error" → "خطای سرور - لطفاً بعداً تلاش کنید"
```

---

## 17. Business Rules

### Commission Calculation
- **Agent Share from Payments**: % of paid orders
- **Agent Share from Installments**: % of installment payments received
- **Agent Share Total**: Sum of both shares
- Commission calculated by backend, displayed in frontend

### Discount Code Rules
- One code per agent (or multiple?)
- Code unique system-wide
- Tracked registrations per code
- Income calculated from code usage
- Expiration date configurable

### Student Status Workflow
- **Pending**: Order awaiting payment
- **Paid**: Payment completed, course access granted
- **Failed**: Payment failed, order suspended
- **Installments**: Multi-payment plan in progress
- **Canceled**: Order canceled by student or system

### Financial Payout Rules
- Minimum payout threshold (configurable)
- Payout frequency (daily/weekly/monthly)
- Withholding tax applicable (if configured)
- Pending payouts show separately from paid

---

## 18. Security Requirements

### HTTPS Enforcement
- All production traffic encrypted
- Certificate validation required
- HSTS headers enabled

### CORS Configuration
- Specific origin whitelist
- Credentials allowed (cookies/auth)
- Preflight requests allowed

### Token Security
- JWT format, signed with RS256
- No sensitive data in token claims
- Token revocation on logout
- Refresh token rotation on use (optional)

### Input Validation
- Server-side validation mandatory
- Sanitize all user input
- Prevent SQL injection
- Prevent XSS attacks

### Audit Logging
- Log all authentication attempts
- Log permission changes
- Log financial transactions
- Retention: 12 months minimum

