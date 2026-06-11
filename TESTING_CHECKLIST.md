# Testing Checklist

## Authentication Pages

### Login Page (`/auth/login`)
- [ ] Page loads with professional gradient design
- [ ] Google OAuth button works
- [ ] GitHub OAuth button works
- [ ] Email field shows validation error when empty
- [ ] Email field shows validation error for invalid format
- [ ] Password field shows validation error when empty
- [ ] Password field shows validation error for < 6 characters
- [ ] Can successfully login with valid credentials
- [ ] Redirects to profile page after login
- [ ] Forgot password link is visible
- [ ] Remember me checkbox is visible
- [ ] Loading spinner shows during login
- [ ] Error message displays for invalid credentials

### Signup Page (`/auth/signup`)
- [ ] Page loads with professional gradient design
- [ ] Google OAuth button works
- [ ] GitHub OAuth button works
- [ ] Full name field shows validation error when empty
- [ ] Full name field shows validation error for < 2 characters
- [ ] Email field shows validation error when empty
- [ ] Email field shows validation error for invalid format
- [ ] Password field shows validation error when empty
- [ ] Password field shows validation error for < 8 characters
- [ ] Password strength meter displays
- [ ] Weak password shows red bars
- [ ] Fair password shows yellow bars
- [ ] Good password shows blue bars
- [ ] Strong password shows green bars
- [ ] Can successfully create account
- [ ] Redirects to profile page after signup
- [ ] Loading spinner shows during signup

## Admin Panel - Events

### Event List
- [ ] Events load and display
- [ ] Events show title, date/time, location, capacity
- [ ] Events show type badge
- [ ] Events show image thumbnail (if provided)
- [ ] Events show description preview
- [ ] Search/filter by title works
- [ ] Search/filter by location works
- [ ] Edit and Delete buttons visible

### Create Event
- [ ] "Add Event" button opens form
- [ ] Form shows all fields (title, description, date, time, location, type, capacity, image URL)
- [ ] Close button (X) dismisses form
- [ ] Title validation (required)
- [ ] Date validation (required)
- [ ] Can select event type from dropdown
- [ ] Can set capacity number
- [ ] Can enter image URL
- [ ] Submit button shows loading spinner
- [ ] Success message displays after creation
- [ ] New event appears in list
- [ ] Form clears after successful creation

### Edit Event
- [ ] Click Edit button opens form with pre-filled data
- [ ] All fields contain existing event data
- [ ] Can modify any field
- [ ] Submit button shows loading spinner
- [ ] Success message displays after update
- [ ] Event in list updates with new data
- [ ] Form closes after successful update

### Delete Event
- [ ] Click Delete button shows confirmation dialog
- [ ] Confirmation dialog prevents accidental deletion
- [ ] Cancel in dialog doesn't delete
- [ ] Confirm in dialog deletes event
- [ ] Delete button shows loading spinner
- [ ] Success message displays after deletion
- [ ] Event is removed from list

### Notifications
- [ ] Success messages appear in green
- [ ] Error messages appear in red
- [ ] Notifications auto-dismiss after 5 seconds
- [ ] Can manually close notification with X button
- [ ] Specific error messages are helpful

## Admin Panel - Members

### Member List
- [ ] Members load and display
- [ ] Members show name, email, role
- [ ] Role displayed as badge
- [ ] Search/filter by name works
- [ ] Search/filter by email works
- [ ] Edit and Delete buttons visible
- [ ] Empty state message shown when no members

### Create Member
- [ ] "Add Member" button opens form
- [ ] Form shows all fields (name, email, role)
- [ ] Close button (X) dismisses form
- [ ] Full name validation (required, min 2 chars)
- [ ] Email validation (required, valid format)
- [ ] Role dropdown works
- [ ] Submit button shows loading spinner
- [ ] Success message displays after creation
- [ ] New member appears in list
- [ ] Form clears after successful creation

### Edit Member
- [ ] Click Edit button opens form with pre-filled data
- [ ] All fields contain existing member data
- [ ] Can modify any field
- [ ] Submit button shows loading spinner
- [ ] Success message displays after update
- [ ] Member in list updates with new data
- [ ] Form closes after successful update

### Delete Member
- [ ] Click Delete button shows confirmation dialog
- [ ] Confirmation dialog prevents accidental deletion
- [ ] Cancel in dialog doesn't delete
- [ ] Confirm in dialog deletes member
- [ ] Delete button shows loading spinner
- [ ] Success message displays after deletion
- [ ] Member is removed from list

### Notifications
- [ ] Success messages appear in green with checkmark
- [ ] Error messages appear in red with alert icon
- [ ] Notifications auto-dismiss after 5 seconds
- [ ] Can manually close notification with X button
- [ ] Specific validation errors are helpful

## Other Admin Sections

### Projects
- [ ] Projects tab loads
- [ ] Can create project
- [ ] Can edit project
- [ ] Can delete project
- [ ] Notifications work properly

### Messages
- [ ] Messages tab loads
- [ ] Can send message
- [ ] Can delete message
- [ ] Notifications work properly

### Attendance
- [ ] Attendance tab loads
- [ ] Can view attendance records
- [ ] Can export to CSV
- [ ] Filter and search work

## General UI/UX

- [ ] All buttons have proper hover states
- [ ] All forms have clear labels
- [ ] Focus states visible on inputs
- [ ] Mobile responsive design works
- [ ] Colors are consistent
- [ ] Font sizes are readable
- [ ] Spacing is consistent
- [ ] Loading spinners appear where expected
- [ ] Error messages are clear and helpful
- [ ] Success feedback is positive and clear

## Notes

- Test all features in your browser
- Check console for any errors
- Test on mobile devices
- Verify all API calls work
- Check that data persists in MongoDB
- Test error scenarios (network failures, etc.)
