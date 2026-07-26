# Admin Manual

The CareerSathi Admin Dashboard is restricted to users with the `admin` role. It provides tools for managing the platform, users, and content.

## Accessing the Admin Dashboard

Log in with your admin credentials. Upon successful login, you will be redirected to `/admin/dashboard`.

## 1. Overview Dashboard

The main dashboard displays system-wide analytics:
- Total Registered Users
- Total Assessments Completed
- Total Resources Available
- Active Mentors

## 2. Managing Users

Navigate to the **Users** tab on the sidebar.
- **View Users**: See a paginated table of all registered users (Students, Mentors, Admins).
- **Search & Filter**: Search users by email or name.
- **Change Status**: Click the action menu next to a user to suspend or activate their account.
- **View Details**: Click on a user row to see their assessment history and saved careers.

## 3. Managing Resources (CMS)

Navigate to the **Resources** tab to manage the learning materials and scholarships.
- **Add Resource**: Click "Add New" and fill out the form (Title, URL, Type, Description).
- **Edit/Delete**: Use the action menu on the resource table to modify existing entries.
- **Bulk Upload**: (Planned feature) Upload a CSV to populate resources.

## 4. Managing Career Definitions

Navigate to the **Careers** tab.
- This section allows you to define the dictionary of careers the recommendation engine uses.
- Add new careers, define required skills, and set estimated salary ranges to keep the platform up-to-date with industry trends.

## 5. System Settings

(Restricted to Super Admins)
- Manage global platform settings.
- View Audit Logs for administrative actions.
- Configure Gemini AI Prompt injection templates.
