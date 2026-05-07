# Admin & Teacher Management System Expansion

## 1. Data Model Enhancement
- Update `src/lib/types.ts`:
    - Add `Admin` type.
    - Add `role` field to `Teacher` and `Admin`.
    - Update `Teacher` to include `subjectIds: string[]`.
    - Update `AuthContextType` to use a generic `User` type.
- Update `src/lib/data.ts`:
    - Add mock admin user.
    - Update teachers with `role: 'teacher'` and default `subjectIds`.
    - Add initial subjects mapping.

## 2. Authentication Flow
- Update `src/context/AuthContext.tsx`:
    - Support both Teacher and Admin roles.
    - Handle session persistence for `user`.
- Update `src/App.tsx`:
    - Route based on `user.role`:
        - `admin` -> `AdminDashboard`
        - `teacher` -> `Dashboard`

## 3. Admin Dashboard (`src/components/AdminDashboard.tsx`)
- **Navigation**: Sidebar with sections for Teachers, Subjects, and Learners.
- **Teacher Management**:
    - List all teachers with their assigned grades and subjects.
    - Modal to Add Teacher or Edit existing (re-assign grade/subjects).
- **Subject Management**:
    - List all subjects.
    - Modal to Add/Edit subject names.
- **Learner Management**:
    - List students grouped by grade.
    - Action to "Move Student" to a different grade.

## 4. UI/UX Improvements
- Use `framer-motion` for smooth transitions between admin sections.
- Implement `sonner` toasts for all admin actions.
- Ensure responsive design for mobile admin access.

## 5. Technical Implementation Details
- Admin actions will update "global" state (simulated via LocalStorage).
- Dashboard (teacher view) will continue to filter based on the teacher's current assigned grade.
