# User Guide - Complete Feature Walkthrough

## Getting Started

### For New Users

#### Option 1: Sign Up with Google
1. Click **"Sign Up with Google"** button on signup page
2. Select your Google account
3. Grant permissions
4. Automatically create account and redirected to profile

#### Option 2: Sign Up with GitHub
1. Click **"Sign Up with GitHub"** button on signup page
2. Authorize the application
3. Account created automatically
4. Redirected to profile page

#### Option 3: Sign Up with Email
1. Click **"Or sign up with email"** link
2. Enter Full Name, Email, and Password
3. Click **"Create Account"**
4. Redirected to profile page

### For Returning Users

#### Login with Google
1. Click **"Login with Google"** on login page
2. Select your Google account
3. Granted access, redirected to profile

#### Login with GitHub
1. Click **"Login with GitHub"** on login page
2. Authorize the application
3. Logged in, redirected to profile

#### Login with Email
1. Enter email and password
2. Click **"Sign In"**
3. Redirected to profile page

---

## User Profile Page (`/profile`)

### What You'll See
- Your account information
- Your unique QR code
- Download and copy options
- Logout button

### QR Code Features

**View Your QR Code**
- Automatically generated when you sign up
- Unique to your account
- Used for attendance tracking at events

**Download QR Code**
1. Click **"Download QR Code"** button
2. QR code saves as PNG image
3. Can print or share with event organizers

**Copy QR Code to Clipboard**
1. Click **"Copy to Clipboard"** button
2. QR image copied (ready to paste in email/messages)
3. Shows confirmation message

**Use in Events**
- Share your QR code with event organizers
- Show at event check-in
- Scan during attendance taking
- Helps track your participation

### Edit Profile
- Click **"Edit Profile"** to update:
  - Full name
  - Email (for email-only accounts)
  - Password (for email-only accounts)

### Logout
1. Click **"Logout"** button
2. Session ends
3. Redirected to login page

---

## Admin Dashboard (`/admin`)

### Access
- **URL**: `/admin`
- **Who Can Access**: Users with admin role
- **Features**: Complete club management

### Members Tab

**View All Members**
- See list of all club members
- Shows name, email, and role
- Search members by name or email

**Add New Member**
1. Click **"Add"** button
2. Enter Full Name, Email
3. Select role (Member, Organizer, Admin)
4. Click **"Save"**

**Edit Member**
1. Click **Edit icon** next to member
2. Update information
3. Click **"Save"**

**Delete Member**
1. Click **Delete icon** next to member
2. Confirm deletion
3. Member removed from system

### Events Tab

**View Events**
- See all upcoming and past events
- Shows event details and attendance

**Create Event**
1. Fill in event details:
   - Title
   - Date and time
   - Description
   - Location
2. Click **"Create Event"**

**Manage Event**
- View registered attendees
- Update event information
- Cancel if needed

### Attendance Tab

**View Attendance**
- See who attended each event
- Filter by event
- Search by member name

**Mark Attendance**
- Scan QR code or manually enter user
- Mark as Present, Late, or Absent
- System logs timestamp

**Export Attendance**
1. Click **"Export as CSV"** button
2. CSV file downloads with:
   - Member name and email
   - Event attended
   - Check-in time
   - Attendance status

### Projects Tab

**View Projects**
- See all ongoing and completed projects
- Filter by status (Active, Completed, On Hold)

**Create Project**
1. Enter project details:
   - Name
   - Description
   - Technologies used
   - Start/End dates
   - GitHub URL (optional)
   - Demo URL (optional)
2. Click **"Add Project"**

**Update Project**
1. Click **Edit icon**
2. Modify project details
3. Click **"Save"**

**Delete Project**
1. Click **Delete icon**
2. Confirm deletion

### Messages Tab

**View Contact Messages**
- See all messages from contact form
- Shows sender name, email, subject
- Unread messages highlighted

**Read Message**
1. Click on message to view
2. Full message content displays
3. Sender's email shown
4. Date/time of submission

**Mark as Read**
- Click **"Mark as Read"** button
- Moves from unread to read section

**Delete Message**
1. Click **"Delete"** button
2. Confirm deletion
3. Message removed

**Reply (Manual)**
- Copy sender's email
- Send reply using email client

### Settings Tab

**Club Information**
- **Club Name**: Edit your club's name
- **Club Email**: Email address for club
- **Description**: About the club
- Click **"Save Settings"** to update

**Appearance**
- **Primary Color**: Choose main brand color
- **Secondary Color**: Choose accent color
- Updates club branding throughout app

---

## QR Code Usage in Events

### For Event Organizers (Admin)

**Before Event**
1. Create event in admin dashboard
2. Prepare QR code scanner

**During Event**
1. Open attendance check-in
2. Scan each attendee's QR code
3. System automatically marks attendance
4. Shows member name and time

**After Event**
1. Export attendance report
2. Send attendance summary to members
3. Archive event in system

### For Attendees

**Before Event**
1. Go to your profile page
2. Download your QR code (or note your userId)

**At Event**
1. Show your QR code to organizer
2. Organizer scans your code
3. Attendance marked automatically

**After Event**
1. Check profile for events attended
2. View attendance records in dashboard

---

## Features by User Role

### Member
- View own profile
- See personal QR code
- Attend events
- View event list
- Update own password

### Organizer
- All member features plus:
- Create/manage events
- View event attendance
- Send event notifications
- View analytics

### Admin
- All organizer features plus:
- Manage all users
- Access admin dashboard
- Configure club settings
- Manage all events and projects
- View all messages
- Export reports

---

## Tips & Best Practices

### Security
- Don't share your password with anyone
- Only admins should have admin access
- QR codes contain only your user ID (safe to share)

### Events
- Download your QR code before events
- Arrive early for check-in
- Keep QR code visible during check-in

### Communication
- Check messages regularly
- Respond to contact form inquiries
- Update contact email if it changes

### Profile
- Keep your profile up to date
- Update picture through OAuth profile
- Save your QR code in multiple places

---

## Troubleshooting

### "I can't login"
1. Check if you're using the correct password (if email login)
2. Verify email address is correct
3. Try resetting password
4. Check if account exists

### "QR code won't show"
1. Refresh the page
2. Clear browser cache
3. Try different browser
4. Logout and login again

### "Admin dashboard not loading"
1. Verify you have admin role
2. Check if you're logged in
3. Try refreshing page
4. Clear browser cookies

### "OAuth login not working"
1. Check internet connection
2. Verify app is connected to OAuth provider
3. Try using email login instead
4. Clear browser cache and cookies

---

## Contact & Support

For technical issues:
1. Check browser console for errors (F12)
2. Review error message
3. Try the troubleshooting steps above
4. Contact your administrator

For feature requests:
- Contact club administrators
- Submit through contact form

---

## Quick Links

- **Signup**: `/auth/signup`
- **Login**: `/auth/login`
- **Profile**: `/profile`
- **Admin Dashboard**: `/admin`
- **Events**: `/events`

---

**Last Updated**: 2024
**Version**: 1.0
