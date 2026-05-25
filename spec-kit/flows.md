# User Flows & Features: ViewLine Agent Panel

## 1. Main User Flows

---

## 2. Authentication Flows

### 2.1 Login Flow

```
Start
  ↓
[Enter Credentials Screen]
  ├─ Username
  ├─ Password
  ├─ ReCAPTCHA
  └─ Submit Button
  ↓
[Validate Form]
  ├─ Username: Required, min 3 chars
  ├─ Password: Required
  ├─ Captcha: Must be verified
  ├─ If Invalid → Show error → Return to form
  └─ If Valid → Proceed
  ↓
[API Request: POST /Account/Agent/Login]
  ├─ Send: { userName, password, captchaCode }
  ├─ Response Success:
  │   └─ Receive: { access_token, refresh_token, twoFactorAuth }
  ├─ Response Error:
  │   ├─ Invalid credentials → Show error message
  │   ├─ Account locked → Show lock message
  │   ├─ Invalid captcha → Reload captcha
  │   └─ Server error → Show error
  └─ If Success, check twoFactorAuth flag
  ↓
[2FA Check Decision]
  ├─ If twoFactorAuth = true → Go to 2FA Flow
  │   └─ Store hash for verification
  └─ If twoFactorAuth = false → Save tokens, Go to Dashboard
  ↓
[Save Session]
  ├─ Store access_token in localStorage['AccessToken']
  ├─ Store refresh_token in localStorage['RefreshToken']
  ├─ Set RememberMe flag if checked
  ├─ Schedule token refresh (before expiry)
  └─ Fetch user information
  ↓
[Fetch User Information: GET /Account/UserInformation]
  ├─ Response: { id, displayName, claims[], avatar, gender }
  ├─ Store in localStorage['userInfoAccount']
  ├─ Store claims in localStorage['userInfo']
  └─ Update UserInfoService
  ↓
[Navigate to Dashboard]
  ├─ Redirect to /dashboard
  ├─ Load dashboard data
  └─ Display welcome metrics
  ↓
End (Logged In)
```

**Error Handling**:
- Invalid credentials: "نام کاربری یا رمز عبور اشتباه است" (shown in snackbar)
- Network error: "خطای شبکه - لطفاً دوباره تلاش کنید"
- Server error: Display message from response

**Validation Rules**:
- Username: Required, minimum 3 characters
- Password: Required, no length limit
- ReCAPTCHA: Must be verified by Google

---

### 2.2 Two-Factor Authentication (2FA) Flow

```
Triggered After Login
  ↓
[2FA Indicator]
  ├─ Message: "احراز هویت دو مرحله‌ای فعال است"
  ├─ Phone Preview: "***-***-1234" (last 4 digits shown)
  └─ Send Code Button
  ↓
[Send Verification Code: POST /Account/TwoFactor/SendCode]
  ├─ Request: { value: phoneNumber }
  ├─ Backend sends SMS/Email with 6-digit code
  ├─ Response: { success, message, expiryTime }
  ├─ Show countdown timer (usually 10 minutes)
  └─ Enable resend button after 60 seconds
  ↓
[Enter Verification Code]
  ├─ Input field with 6 digits
  ├─ Auto-submit when all digits entered
  ├─ Manual submit button available
  └─ Show "Resend Code" link
  ↓
[Verify Code: POST /Account/TwoFactor/VerifyCode]
  ├─ Request: { code, hash }
  ├─ If Valid (200 OK):
  │   └─ Response: { access_token, refresh_token }
  ├─ If Invalid:
  │   ├─ "کد وارد شده اشتباه است" (Incorrect code)
  │   ├─ Show remaining attempts (e.g., "3 attempts left")
  │   └─ Clear input field
  └─ If Expired:
      └─ "کد منقضی شده - دوباره ارسال کنید" (Request new code)
  ↓
[Code Verification Success]
  ├─ Save tokens (same as login flow)
  ├─ Fetch user information
  └─ Navigate to Dashboard
  ↓
End (2FA Complete)
```

**Code Resend Flow**:
- User clicks "Resend Code"
- POST /Account/TwoFactor/SendCode (again)
- New code sent, timer resets
- Previous code invalidated

**Timeout Handling**:
- 10-minute expiration (configurable)
- Auto-discard if time expires
- Show prompt to request new code
- Clear any stored attempt data

---

### 2.3 Forgot Password Flow

#### Step 1: Send Recovery Code

```
User Navigates to: /auth/forget-password/send-code
  ↓
[Enter Phone Number]
  ├─ Input: Phone number (required)
  ├─ Format validation: Persian digits to English
  ├─ Length: 11 digits for Iran
  └─ Submit Button
  ↓
[Send Code: POST /ForgotPassword/SendCode]
  ├─ Request: { phoneNumber }
  ├─ Backend sends OTP to phone
  ├─ Response: {
  │   success: true,
  │   result: { expiredMinuteTime: 10 }
  │ }
  ├─ Success: Show "کد ارسال شد" message
  └─ Error: Show error, stay on form
  ↓
[Store Recovery Session]
  ├─ Save phoneNumber in service
  ├─ Save expiryTime
  └─ Enable navigation to verify-code
  ↓
[Auto Navigate or Manual]
  └─ Go to: /auth/forget-password/verify-code
  ↓
End (Code Sent)
```

#### Step 2: Verify Recovery Code

```
User Views: /auth/forget-password/verify-code
  ↓
[Verify Code Screen]
  ├─ Display saved phone number (pre-filled, disabled)
  ├─ Code input field
  ├─ Countdown timer (initial: expiredMinuteTime)
  ├─ Resend button (disabled during countdown)
  └─ Verify button
  ↓
[User Enters Code]
  ├─ 6-digit code from SMS
  ├─ Submit verification
  └─ API: POST /ForgotPassword/VerifyCode
      ├─ Request: { phoneNumber, code }
      ├─ Response success: { hash, message }
      └─ Response error: "کد نادرست است" or "کد منقضی"
  ↓
[Code Verification]
  ├─ If Valid:
  │   ├─ Store hash for next step
  │   ├─ Clear timer
  │   └─ Navigate to /auth/forget-password/change-pass
  ├─ If Invalid:
  │   ├─ Show error message
  │   ├─ Clear input
  │   └─ Decrement attempt counter
  └─ If Too Many Attempts:
      └─ Lock form, show "Try again later"
  ↓
[Resend Code]
  ├─ If clicked and timer = 0:
  │   ├─ POST /ForgotPassword/SendCode (again)
  │   ├─ Reset timer
  │   └─ Enable code input
  └─ If timer > 0: Disable button
  ↓
End (Code Verified)
```

#### Step 3: Change Password

```
User Views: /auth/forget-password/change-pass
  ↓
[Change Password Form]
  ├─ Fields:
  │   ├─ Mobile: { value: phoneNumber, disabled: true }
  │   ├─ Hash: { value: hash from Step 2, hidden }
  │   ├─ Password: { new password, required }
  │   ├─ Confirm Password: { re-enter password, required }
  │   └─ Submit Button
  ├─ Validation:
  │   ├─ Password required
  │   ├─ Confirm password required
  │   ├─ Passwords match check
  │   └─ Min length 6 characters (backend validated)
  └─ Error display: Form shows validation messages
  ↓
[Submit: POST /ForgotPassword/ChangePassword]
  ├─ Request: {
  │   mobile: phoneNumber,
  │   hash: verificationHash,
  │   password: newPassword,
  │   confirmPassword: confirmPassword
  │ }
  ├─ If Success:
  │   ├─ Response: { success: true, message: "رمز عبور تغییر یافت" }
  │   ├─ Clear form
  │   ├─ Show success message
  │   ├─ Auto-navigate to login (after 2 seconds)
  │   └─ Clear all recovery data
  ├─ If Validation Error:
  │   └─ Show field-specific errors
  └─ If Server Error:
      └─ Show error message, allow retry
  ↓
[Back to Login]
  ├─ User navigates to /auth/login
  ├─ Uses new password
  └─ Completes login flow
  ↓
End (Password Changed)
```

---

## 3. Dashboard Flows

### 3.1 Dashboard View & Navigation

```
User Logs In Successfully
  ↓
[Route: /dashboard → DashboardComponent]
  ├─ AuthGuard checks:
  │   ├─ isLoggedIn() = true
  │   ├─ AccessToken present
  │   └─ RefreshToken present
  ├─ DashboardResolverService loads data:
  │   └─ GET /Agent/Dashboard
  │       └─ Returns: IDashboardApiDataModel
  └─ Resolver completes before component renders
  ↓
[Dashboard Displays 4 Sections]
  ├─ 1. Metric Cards (CardCountComponent)
  │   ├─ Total Revenue
  │   ├─ Revenue Paid
  │   ├─ Revenue Unpaid
  │   ├─ Student Count
  │   └─ Total Paid
  ├─ 2. Agent Code Section (AgentCodeComponent)
  │   ├─ Current Agent Code
  │   ├─ Registration Count
  │   ├─ Copy to Clipboard Button
  │   └─ View Code History Dialog
  ├─ 3. Student List (StudentListComponent)
  │   ├─ Filterable table
  │   ├─ Pagination
  │   └─ Actions (view details)
  └─ 4. Navigation Menu (Theme Layout)
      └─ Links to other pages
  ↓
End (Dashboard Active)
```

**Data Flow**:
- DashboardResolverService executes before component initialization
- Data passed to component via route snapshot
- Components extract and display data
- Metrics update on filter changes (filtered list updates cards)

---

### 3.2 Student List Interaction Flow

```
Student List Rendered
  ├─ Table shows 10 rows per page
  ├─ Columns displayed:
  │   ├─ Row #, First Name, Last Name
  │   ├─ Registration Date, Student Code
  │   ├─ Payment Type, Courses Count
  │   ├─ Installment Status, Discount %
  │   ├─ Commission shares (3 types)
  │   └─ Row actions
  └─ Data loaded from studentDatasourceService
  ↓
[Initial Load: Page 1, 10 items]
  ├─ studentDatasourceService.load(1, 10, {})
  ├─ API: POST /Agent/Dashboard/StudentList
  ├─ Request body:
  │   ├─ search: true
  │   ├─ filters: {}
  │   ├─ orderBy: 'Id'
  │   ├─ orderType: 'desc'
  │   ├─ page: 1
  │   └─ pageSize: 10
  ├─ Response: { records: IListStudentModel[], totalCount: number }
  ├─ Store in dataSource$ signal
  ├─ Update length$ signal with totalCount
  └─ Table re-renders with data
  ↓
[Show Loading State]
  ├─ loading$ signal = true
  ├─ MatProgressBar displayed
  ├─ Table content dims/grays
  └─ Disable pagination controls
  ↓
[Filter & Search]
  ├─ User clicks filter button
  ├─ FilterStudentDashboardComponent opens
  ├─ Filter form:
  │   ├─ Discount Code (dropdown)
  │   ├─ Order Status (dropdown)
  │   ├─ Student Name/Identifier (text)
  │   ├─ Date Range (from - to)
  │   └─ Apply/Reset buttons
  ├─ User selects filters, clicks "اعمال فیلتر" (Apply)
  └─ Proceed to filter application
  ↓
[Apply Filters]
  ├─ DashboardService.updateFilter(newFilters)
  ├─ Effect detects filter change
  ├─ studentDatasourceService.load(1, 10, newFilters)
  ├─ API called with new filters
  ├─ Show loading state
  ├─ Table data updated
  ├─ Reset to page 1
  ├─ Display filtered count in text: "تعداد کل: X تا"
  └─ Auto-scroll to table top
  ↓
[Pagination]
  ├─ User clicks page number or next/prev
  ├─ PaginationShareComponent emits pageNumber
  ├─ StudentListComponent receives event
  ├─ Update pageNumber variable
  ├─ studentDatasourceService.load(newPageNumber, 10, filters)
  ├─ API called for new page
  ├─ Table scrolls to top
  ├─ New data displayed
  └─ Pagination controls update
  ↓
[View Student Details]
  ├─ User clicks on order/row
  ├─ getOrderDetail(orderId) called
  ├─ API: GET /Agent/Dashboard/Order/Details/{orderId}
  ├─ Dialog opens: DialogPurchasedCoursesComponent
  ├─ Display purchased courses table:
  │   ├─ Row #, Course Name
  │   ├─ Instructor Name, Price
  │   └─ Discount Amount
  ├─ Print button available
  ├─ Close button to dismiss
  └─ Dialog closes on backdrop click
  ↓
[Reset Filters]
  ├─ User clicks "بازنشانی فیلتر" (Reset)
  ├─ Form cleared
  ├─ DashboardService.updateFilter({})
  ├─ Full list reloaded
  ├─ Page reset to 1
  ├─ All students displayed
  └─ Count updated
  ↓
End (List interaction complete)
```

---

### 3.3 Agent Code Management Flow

```
User Interacts with Agent Code Section
  ↓
[Display Agent Code Info]
  ├─ Show: lastAgentCode (from dashboard data)
  ├─ Show: totalRegisterWithCode
  ├─ Buttons:
  │   ├─ Copy Code to Clipboard
  │   └─ View Code History
  └─ Layout: Card format with copy icon
  ↓
[Copy Code Action]
  ├─ User clicks copy button
  ├─ Clipboard.copy(lastAgentCode)
  ├─ Toast notification: "کد کپی شد" (Code copied)
  ├─ User can paste code anywhere
  └─ Code ready to share with students
  ↓
[View Code History Dialog]
  ├─ User clicks "مشاهده تاریخچه" (View History)
  ├─ MatDialog opens: DialogDiscontCodeListComponent
  ├─ Dialog initialization:
  │   ├─ Pass totalRegisterWithCode as input
  │   ├─ Initialize AgentCodeListDatasourceService
  │   ├─ Set page size: 10
  │   └─ Load first page of codes
  ├─ API: POST /Agent/Dashboard/DiscountCodeList
  ├─ Request structure:
  │   ├─ search: true
  │   ├─ filters: {}
  │   ├─ orderBy: 'Id'
  │   ├─ orderType: 'desc'
  │   ├─ page: 1
  │   └─ pageSize: 10
  ├─ Response: { records: IListDiscountRecordsModel[], totalCount }
  └─ Populate table
  ↓
[Discount Code Table]
  ├─ Columns:
  │   ├─ Row #
  │   ├─ Code Value
  │   ├─ Creation Date
  │   ├─ Agent Discount %
  │   ├─ Student Discount %
  │   ├─ Registration Count
  │   └─ Income Amount
  ├─ Pagination: 10 per page
  ├─ Show total count
  ├─ Loading indicator while fetching
  └─ Empty state if no codes
  ↓
[Pagination in Dialog]
  ├─ PaginationShareComponent emits page
  ├─ dialogRef component receives event
  ├─ AgentCodeListDatasourceService.load(newPage, 10, {})
  ├─ API called for new page
  ├─ Table updates
  └─ User can browse all codes
  ↓
[Close Dialog]
  ├─ User clicks close button or backdrop
  ├─ dialogRef.close()
  ├─ Dialog dismissed
  └─ Return to dashboard
  ↓
End (Code history viewed)
```

---

## 4. Finance Page Flow

### 4.1 Finance Dashboard Navigation

```
User Navigates to: /finance (via sidebar)
  ├─ Route: /finance (FinancePageComponent)
  ├─ AuthGuard checks login status
  ├─ DashboardResolverService loads data again
  └─ Component initializes
  ↓
[Finance Page Layout]
  ├─ Top: Metric Cards (CardCountComponent)
  │   ├─ Financial summary from dashboard data
  │   └─ Same metrics as main dashboard
  ├─ Bottom: Transaction History (HistoryTransactionsComponent)
  │   ├─ Table of payouts
  │   ├─ Filters for date range
  │   └─ Pagination
  └─ Loading states for each section
  ↓
End (Finance page loaded)
```

### 4.2 Transaction History Flow

```
HistoryTransactionsComponent Initializes
  ├─ historyTransactionsService initializes filter state
  ├─ Filter defaults: { userPayoutDate_From: null, userPayoutDate_To: null }
  ├─ HistoryTransactionsDatasourceService.load(1, 10, {})
  ├─ API: POST /Agent/UserPayout/GetAll
  ├─ Request:
  │   ├─ search: true
  │   ├─ filters: {}
  │   ├─ page: 1
  │   ├─ pageSize: 10
  │   └─ orderBy: 'Id', orderType: 'desc'
  ├─ Response: { records: IHistoryTransactionsListModel[], totalCount }
  └─ Table displays payouts
  ↓
[Transaction Table]
  ├─ Columns:
  │   ├─ Transaction Date
  │   └─ Amount/Price
  ├─ Pagination: 10 per page
  ├─ Loading indicator
  ├─ Empty state if no transactions
  └─ Total count displayed
  ↓
[Apply Date Filter]
  ├─ FilterHistoryTransactionsComponent shows:
  │   ├─ "From Date" picker
  │   ├─ "To Date" picker
  │   └─ Apply button
  ├─ User selects date range:
  │   ├─ Persian calendar picker
  │   ├─ Date validation
  │   └─ Time adjusted (00:00:00 for from, 23:59:59 for to)
  ├─ User clicks apply
  ├─ Filter submitted to service
  └─ DashboardService.updateFilter(dateFilter)
  ↓
[Filter Applied]
  ├─ Effect detects filter change
  ├─ HistoryTransactionsDatasourceService.load(1, 10, newFilter)
  ├─ API called with date filters
  ├─ Response filtered by date range
  ├─ Table refreshed with results
  ├─ Reset to page 1
  ├─ Total count shows filtered total
  └─ Show: "نتایج برای تاریخ {from} تا {to}: X تراکنش"
  ↓
[Pagination]
  ├─ User selects page
  ├─ Page number emitted
  ├─ HistoryTransactionsDatasourceService.load(page, 10, filters)
  ├─ Load transactions for page
  ├─ Table updated
  └─ Continue viewing transaction history
  ↓
[Reset Filter]
  ├─ User clicks reset button
  ├─ Form cleared
  ├─ Filter reset to {}
  ├─ Full transaction history reloaded
  ├─ All transactions shown (paginated)
  └─ Date pickers cleared
  ↓
End (Transaction history reviewed)
```

---

## 5. Settings Page Flow

### 5.1 Reshte (Field/Department) Management

```
User Navigates to: /settings/reshte
  ↓
[Load Reshte Data]
  ├─ SettingInfoBaseComponent initializes
  ├─ SettingInfoBaseService.getReshteSelect()
  ├─ API: GET /Reshte/Select
  ├─ Response: [{ id, title, ... }]
  ├─ Populate dropdown list
  └─ Show loading state
  ↓
[Display Reshte List]
  ├─ Table shows all Reshte (fields)
  ├─ Filter options available
  ├─ User can select from dropdown
  ├─ Or enter search/filter parameters
  └─ Submit to filter
  ↓
[Apply Reshte Filter]
  ├─ User enters filter criteria
  ├─ Clicks "جستجو" (Search)
  ├─ SettingInfoBaseService.getReshteFilter(searchParams)
  ├─ API: POST /Reshte/Filter
  ├─ Request:
  │   ├─ search: true
  │   ├─ filters: { /* user filters */ }
  │   ├─ page: 1
  │   ├─ pageSize: 10
  │   ├─ orderBy: 'Id'
  │   └─ orderType: 'desc'
  ├─ Response: { records, totalCount }
  ├─ Table displays filtered results
  └─ Pagination enabled if multiple pages
  ↓
[Cascading: Paye by Reshte]
  ├─ If user selects a Reshte
  ├─ SettingInfoBaseService.getReshteSelectWithPaye(payeId)
  ├─ API: GET /Reshte/SelectWithPaye?payeId={id}
  ├─ Returns Reshte entries filtered by that Paye
  ├─ Update dependent dropdown
  └─ Show related items
  ↓
End (Reshte managed)
```

### 5.2 Paye (Level/Tier) Management

```
User Navigates to: /settings/paye
  ↓
[Load Paye Data]
  ├─ SettingInfoBaseService.getPayeSelect()
  ├─ API: GET /Paye/Select
  ├─ Response: [{ id, title, ... }]
  ├─ Dropdown populated
  └─ Loading state shown
  ↓
[Apply Paye Filter]
  ├─ User enters search terms
  ├─ Clicks "جستجو"
  ├─ SettingInfoBaseService.getPayeFilter(searchParams)
  ├─ API: POST /Paye/Filter
  ├─ Request: { search, filters, page, pageSize, orderBy, orderType }
  ├─ Response: { records, totalCount }
  ├─ Display in table
  └─ Pagination enabled
  ↓
[Cascading: Paye by Maghta]
  ├─ User selects a Maghta (district)
  ├─ SettingInfoBaseService.getPayeSelectWithMaghta(maghtaId)
  ├─ API: GET /Paye/SelectWithMaghta?maghtaId={id}
  ├─ Returns Paye entries for that Maghta
  ├─ Update dependent fields
  └─ Show related items
  ↓
End (Paye managed)
```

### 5.3 Sal (Year) Management

```
User Navigates to: /settings/sal
  ↓
[Load Year Data]
  ├─ SalService.getSalSelect()
  ├─ API: GET /Sal/Select
  ├─ Response: [{ id, year, ... }]
  ├─ Dropdown populated with years
  └─ Loading state
  ↓
[Select Year]
  ├─ User picks year from dropdown
  ├─ System stores selection
  ├─ Used as filter context for other settings
  └─ Persist in service state
  ↓
End (Year selected)
```

---

## 6. Logout Flow

```
User Clicks Logout
  ↓
[Logout Action]
  ├─ AuthService.logout() called
  ├─ Show confirmation dialog (optional)
  ├─ User confirms logout
  └─ Proceed
  ↓
[Clear Session]
  ├─ ValidationAuthTokenUser.deleteAuthTokens()
  ├─ Remove from localStorage:
  │   ├─ AccessToken
  │   ├─ RefreshToken
  │   ├─ userInfo
  │   ├─ userInfoAccount
  │   ├─ displayName
  │   ├─ DarkMode
  │   ├─ language
  │   ├─ RefreshTokenStatus
  │   └─ RememberMe
  ├─ Unschedule token refresh
  ├─ Clear service state
  └─ Reset auth status
  ↓
[Optional API Call]
  ├─ POST /Account/Logout (optional)
  ├─ Send: { refreshToken }
  ├─ Backend invalidates refresh token
  └─ Await response (with timeout)
  ↓
[Navigate to Login]
  ├─ Router.navigate(['/auth/login'])
  ├─ Clear navigation history
  ├─ Redirect to login page
  ├─ Show success message (optional)
  └─ Reset form fields
  ↓
End (Logged Out)
```

---

## 7. Token Refresh Flow (Background)

```
On Login
  ├─ scheduleRefreshToken() called
  ├─ Calculate expiration time (24 hours from now)
  ├─ Schedule timer to trigger 5 min before expiry
  └─ Start background interval
  ↓
[Before Token Expiry]
  ├─ Timer fires (5 min before expiry)
  ├─ refreshToken() method executes
  ├─ API: POST /Account/RefreshToken
  ├─ Request: { refreshToken }
  ├─ Response: { access_token, refresh_token }
  ├─ Update stored tokens
  ├─ Call setLoginSession(response)
  ├─ Reschedule next refresh
  └─ Background continues
  ↓
[On Error]
  ├─ Retry failed? Yes: Attempt once more
  ├─ If still fails: User remains logged in
  ├─ Next refresh attempt in 5 minutes
  ├─ If network down: Wait for recovery
  └─ Tokens valid until actual expiration
  ↓
[On Logout or Page Closed]
  ├─ unscheduleRefreshToken() called
  ├─ Clear scheduled timer
  ├─ Stop background process
  └─ No more token refreshes
  ↓
End (Token management complete)
```

---

## 8. Error Handling Flows

### 8.1 HTTP Error Flow

```
API Request Fails
  ↓
[HttpInterceptorService catches response]
  ├─ Check if response.success = false
  ├─ If false:
  │   ├─ Extract error message
  │   ├─ AlertService.snackBarError(message)
  │   ├─ Show error toast for 5 seconds
  │   ├─ Throw ResponseError for component
  │   └─ Handle in component catch block
  ├─ If no success field:
  │   └─ Pass response through (may be error)
  └─ If success = true:
      └─ Pass response to component
  ↓
[Component Catches Error]
  ├─ In subscription .subscribe(success, error)
  ├─ error() block executes
  ├─ Additional logging/handling
  ├─ Hide loading states
  ├─ Re-enable form controls
  └─ Allow user to retry
  ↓
End (Error handled)
```

### 8.2 Form Validation Error Flow

```
User Submits Invalid Form
  ↓
[Form Validation Check]
  ├─ if (form.invalid) {
  │   ├─ Mark all fields as touched
  │   ├─ Display validation errors:
  │   │   ├─ Field required
  │   │   ├─ Pattern mismatch
  │   │   ├─ Min/max length
  │   │   └─ Custom validators
  │   ├─ Focus first invalid field
  │   └─ Prevent API call
  └─ }
  ↓
[User Fixes Errors]
  ├─ Update field values
  ├─ Errors clear in real-time
  ├─ Form validity updates
  └─ Form ready to submit
  ↓
[Resubmit Form]
  ├─ Form valid now
  ├─ API call proceeds
  ├─ Loading state shown
  └─ See HTTP error flow if API fails
  ↓
End (Form error handled)
```

---

## 9. Account Management Flows

### 9.1 Update User Profile

```
User Navigates to: Profile Settings
  ↓
[Load Current Data]
  ├─ GET /Account/UserInformation
  ├─ Display current profile:
  │   ├─ Name
  │   ├─ Avatar
  │   ├─ Email
  │   ├─ Phone
  │   ├─ Gender
  │   └─ Contact info
  └─ Populate form
  ↓
[Edit Profile]
  ├─ User modifies fields
  ├─ Real-time validation
  ├─ Optional avatar upload
  ├─ Form tracks changes
  └─ Submit button enabled if changed
  ↓
[Save Changes]
  ├─ API: POST /Account/UpdateProfile (assumed endpoint)
  ├─ Request: { updatedUserData }
  ├─ Show loading state
  ├─ If success:
  │   ├─ Update localStorage userInfoAccount
  │   ├─ Update UserInfoService
  │   ├─ Show success toast
  │   └─ Mark form pristine
  └─ If error:
      ├─ Show error message
      ├─ Keep form values
      └─ Allow retry
  ↓
End (Profile updated)
```

### 9.2 Change Password

```
User Navigates to: Change Password
  ↓
[Change Password Form]
  ├─ Fields:
  │   ├─ Current Password
  │   ├─ New Password
  │   ├─ Confirm New Password
  │   └─ Submit button
  ├─ Validation:
  │   ├─ All fields required
  │   ├─ New password ≠ current
  │   ├─ Passwords match
  │   └─ Min length 6
  └─ Form displayed
  ↓
[User Enters Data]
  ├─ Fill all fields
  ├─ Form validates in real-time
  ├─ Errors shown as entered
  └─ Submit when valid
  ↓
[Submit: POST /Account/ChangePassword]
  ├─ Request: {
  │   currentPassword,
  │   newPassword,
  │   confirmPassword
  │ }
  ├─ Show loading state
  ├─ Disable form controls
  └─ Await response
  ↓
[Success Path]
  ├─ Response: { success: true }
  ├─ Show: "رمز عبور تغییر یافت" toast
  ├─ Clear form
  ├─ Auto-navigate to profile
  └─ Or close dialog
  ↓
[Error Path]
  ├─ Possible errors:
  │   ├─ Current password incorrect
  │   ├─ Password policy violation
  │   ├─ Server error
  │   └─ Network error
  ├─ Show error message
  ├─ Clear password fields
  ├─ Keep other data
  └─ Allow retry
  ↓
End (Password changed or retried)
```

---

## 10. Data Export Flows (Future)

```
User Clicks Export
  ├─ Choose format: PDF, Excel, CSV
  ├─ Select data: All or current view
  ├─ Filter options: Date range, etc.
  ├─ Show loading: "در حال آماده‌سازی فایل"
  ├─ API generates file
  ├─ File downloads to device
  └─ Show success notification
```

---

## 11. Bulk Operations Flows (Future)

```
User Selects Multiple Students
  ├─ Checkboxes enable in table
  ├─ Select individual or all rows
  ├─ Bulk action menu appears
  ├─ Actions:
  │   ├─ Resend course info
  │   ├─ Apply discount
  │   ├─ Send message
  │   └─ Export list
  ├─ Confirm action
  ├─ Process with loading
  └─ Show results/errors
```

