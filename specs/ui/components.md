# UI Components Specification

## Task List Component
### Purpose
Displays a list of tasks for the authenticated user with filtering and sorting capabilities.

### Props
- `tasks`: Array of task objects with id, title, description, completed, timestamps
- `onTaskToggle`: Function callback when a task's completion status changes
- `onTaskDelete`: Function callback when a task is deleted
- `isLoading`: Boolean indicating if tasks are being loaded
- `filter`: Current filter state (all, completed, pending)

### Functionality
- Renders each task in a card layout
- Shows completion status with checkbox
- Displays task title prominently
- Shows truncated description
- Includes edit and delete buttons
- Supports infinite scrolling or pagination
- Shows loading states when fetching tasks

### Styling
- Responsive grid layout
- Visual distinction between completed and pending tasks
- Hover effects for interactive elements
- Mobile-friendly touch targets

## Task Form Component
### Purpose
Provides form interface for creating and editing tasks.

### Props
- `task`: Task object for editing (optional - if not provided, assumes create mode)
- `onSubmit`: Function callback when form is submitted
- `onCancel`: Function callback when form is cancelled
- `isSubmitting`: Boolean indicating if submission is in progress

### Functionality
- Text input for task title with validation
- Textarea for task description (optional)
- Checkbox for completion status
- Submit and cancel buttons
- Form validation with error messages
- Auto-focus on title field when mounted

### Styling
- Clean, minimal form layout
- Clear error indicators
- Consistent button styling
- Responsive form fields

## Task Item Component
### Purpose
Individual task display component used within the task list.

### Props
- `task`: Task object with id, title, description, completed, timestamps
- `onToggle`: Function callback when completion status changes
- `onDelete`: Function callback when task is deleted
- `onEdit`: Function callback when edit is initiated

### Functionality
- Displays task title with strikethrough when completed
- Shows description in a collapsed/expansible section
- Toggle completion with checkbox
- Edit and delete action buttons
- Shows creation/update timestamps
- Visual feedback during actions

### Styling
- Card-based design with subtle shadows
- Color-coded based on completion status
- Smooth transitions for state changes
- Clear visual hierarchy

## Navigation Component
### Purpose
Provides navigation menu with links to different parts of the application.

### Props
- `user`: User object with authentication details
- `onLogout`: Function callback for logout

### Functionality
- Home link
- My Tasks link
- User profile dropdown
- Logout functionality
- Active state highlighting

### Styling
- Horizontal navigation bar
- Mobile-responsive hamburger menu
- Consistent color scheme
- User avatar display

## Authentication Component
### Purpose
Handles user login/logout functionality.

### Props
- `onLogin`: Function callback when login is successful
- `onLogout`: Function callback when logout is triggered

### Functionality
- Login with Better Auth integration
- Logout functionality
- Loading states during authentication
- Error display for authentication failures

### Styling
- Minimal, clean design
- Consistent with overall application theme
- Clear call-to-action buttons
- Error message styling