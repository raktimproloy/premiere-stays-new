# Contact System Implementation

This document describes the contact form system that has been implemented for the Premiere Stays application.

## Features

### User Contact Form
- **Location**: `/contact` page
- **Fields**: First Name, Last Name, Email, Property (optional), Message
- **Validation**: Required field validation and email format validation
- **Submission**: Saves contact information to MongoDB database
- **Feedback**: Toast notifications for success/error states
- **Loading States**: Form disabled during submission with loading spinner

### Admin Management Interface
- **Location**: `/admin/contact-messages` page
- **Access**: Admin and Superadmin users only
- **Features**:
  - View all contact messages
  - Filter by status (unread, read, responded)
  - Update message status
  - Delete messages (Superadmin only)
  - View detailed message information
  - Reply via email integration

## Database Schema

### Contact Messages Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  property: String, // Optional
  message: String,
  status: String, // 'unread', 'read', 'responded'
  createdAt: Date,
  updatedAt: Date,
  ipAddress: String,
  userAgent: String
}
```

## API Endpoints

### 1. Submit Contact Form
- **POST** `/api/contact`
- **Public**: Yes
- **Body**: `{ firstName, lastName, email, property?, message }`
- **Response**: Success/error message with status

### 2. Admin: Get All Messages
- **GET** `/api/contact/admin`
- **Public**: No (Admin/Superadmin only)
- **Query Params**: `page`, `limit`, `status`
- **Response**: Paginated list of messages

### 3. Admin: Update Message Status
- **PUT** `/api/contact/admin/[id]`
- **Public**: No (Admin/Superadmin only)
- **Body**: `{ status }`
- **Response**: Success/error message

### 4. Admin: Delete Message
- **DELETE** `/api/contact/admin/[id]`
- **Public**: No (Superadmin only)
- **Response**: Success/error message

## Toast Notifications

The system uses `react-hot-toast` for user feedback:

- **Success**: Green toast with success message
- **Error**: Red toast with error message
- **Position**: Top-right corner
- **Duration**: 5 seconds
- **Global**: Configured in root layout

## Security Features

- **Authentication Required**: Admin endpoints require valid JWT token
- **Role-Based Access**: 
  - Admin: Can view and update messages
  - Superadmin: Can view, update, and delete messages
- **Input Validation**: Server-side validation of all form inputs
- **Rate Limiting**: Built into the contact API

## Usage Examples

### Submitting a Contact Form
```javascript
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    property: 'Beach House',
    message: 'I would like to inquire about availability...'
  })
});
```

### Admin: Fetching Messages
```javascript
const response = await fetch('/api/contact/admin?page=1&limit=20&status=unread');
const data = await response.json();
```

### Admin: Updating Message Status
```javascript
const response = await fetch(`/api/contact/admin/${messageId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'read' })
});
```

## Installation

The contact system requires the following dependencies:

```bash
npm install react-hot-toast
```

## Configuration

No additional configuration is required. The system uses:
- Existing MongoDB connection
- Existing authentication system
- Existing JWT token validation

## Future Enhancements

Potential improvements for the contact system:

1. **Email Notifications**: Send email alerts to admins for new messages
2. **Auto-Response**: Send confirmation emails to users
3. **Message Templates**: Pre-defined response templates for common inquiries
4. **Analytics**: Track message volume, response times, and user satisfaction
5. **Integration**: Connect with CRM systems or help desk software
6. **Spam Protection**: Implement CAPTCHA or other anti-spam measures
7. **File Attachments**: Allow users to upload images or documents
8. **Priority Levels**: Mark messages as high, medium, or low priority

## Troubleshooting

### Common Issues

1. **Toast Notifications Not Showing**
   - Ensure `react-hot-toast` is installed
   - Check that `<Toaster />` is in the root layout
   - Verify toast calls are using the correct import

2. **Form Submission Fails**
   - Check browser console for errors
   - Verify MongoDB connection
   - Check API endpoint is accessible

3. **Admin Access Denied**
   - Verify user has admin/superadmin role
   - Check JWT token is valid
   - Ensure user is logged in

4. **Database Errors**
   - Check MongoDB connection string
   - Verify database permissions
   - Check collection exists

## Support

For technical support or questions about the contact system, please refer to the development team or create an issue in the project repository.
