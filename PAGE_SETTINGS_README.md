# Page Settings System Documentation

## Overview
The Page Settings system allows superadmins to manage content for different pages of the website through a centralized interface. The system includes four main tabs: Home, About, Services, and Testimonials.

## Features

### 🏠 Home Tab
- **Partner Management**: Add, edit, and remove trusted partner logos with image uploads
- **Features Section**: Manage website features with icon, title, and description
- **Image Upload**: Cloudinary integration for partner images
- **Real-time Preview**: See changes immediately in the interface

### ℹ️ About Tab
- **Main Image**: Upload and manage the primary about page image
- **Small Images**: Manage 3 additional small images for the about section
- **Content Management**: Edit title, about text, and bullet points
- **Image Optimization**: Automatic image processing through Cloudinary

### 🛠️ Services Tab
- **Service Management**: Add, edit, and remove services
- **Icon System**: Text-based icon identifiers
- **Content Fields**: Title and description for each service

### ⭐ Testimonials Tab
- **Testimonial Management**: Add, edit, and remove customer testimonials
- **Profile Images**: Upload and manage customer profile pictures
- **Rating System**: 5-star rating system for each testimonial
- **Date Management**: Publish date for each testimonial

## API Endpoints

### Home Page Settings
```
GET /api/page-settings/home
PUT /api/page-settings/home
```

**Request Body (PUT):**
```json
{
  "partners": [
    {
      "id": "string",
      "name": "string",
      "image": "string (Cloudinary URL)",
      "website": "string (optional)"
    }
  ],
  "features": [
    {
      "id": "string",
      "icon": "string",
      "title": "string",
      "description": "string"
    }
  ]
}
```

### About Page Settings
```
GET /api/page-settings/about
PUT /api/page-settings/about
```

**Request Body (PUT):**
```json
{
  "title": "string",
  "aboutText": "string",
  "items": ["string"],
  "mainImage": "string (Cloudinary URL)",
  "smallImages": ["string", "string", "string"] (3 Cloudinary URLs)
}
```

### Services Page Settings
```
GET /api/page-settings/services
PUT /api/page-settings/services
```

**Request Body (PUT):**
```json
{
  "services": [
    {
      "id": "string",
      "icon": "string",
      "title": "string",
      "description": "string"
    }
  ]
}
```

### Testimonials Page Settings
```
GET /api/page-settings/testimonials
PUT /api/page-settings/testimonials
```

**Request Body (PUT):**
```json
{
  "testimonials": [
    {
      "id": "string",
      "rating": "number (1-5)",
      "description": "string",
      "profileImage": "string (Cloudinary URL)",
      "name": "string",
      "publishDate": "string (ISO date)"
    }
  ]
}
```

## Image Upload APIs

### Home Page Images
```
POST /api/page-settings/upload-home-image
```
- **Folder**: `home-page`
- **Max Size**: 5MB
- **Formats**: JPEG, PNG, WebP
- **Optimization**: Automatic WebP conversion, quality 80%

### About Page Images
```
POST /api/page-settings/upload-about-image
```
- **Folder**: `about-page`
- **Max Size**: 5MB
- **Formats**: JPEG, PNG, WebP
- **Optimization**: Automatic WebP conversion, quality 80%

### Testimonial Images
```
POST /api/page-settings/upload-testimonial-image
```
- **Folder**: `testimonials`
- **Max Size**: 5MB
- **Formats**: JPEG, PNG, WebP
- **Optimization**: Automatic WebP conversion, quality 80%

## Security Features

### Authentication
- JWT token-based authentication required
- Token validation on every request
- Secure cookie handling

### Authorization
- Only superadmin users can access page settings
- Role-based access control
- Permission validation on all endpoints

### Input Validation
- Comprehensive data validation
- File type and size restrictions
- SQL injection prevention
- XSS protection

## Database Schema

### Page Settings Collection
```javascript
{
  type: "home" | "about" | "services" | "testimonials",
  data: {
    // Varies by type
  },
  updatedAt: Date,
  updatedBy: ObjectId (user reference)
}
```

### Data Structures

#### Partners
```javascript
{
  id: "string",
  name: "string",
  image: "string (Cloudinary URL)",
  website: "string (optional)"
}
```

#### Features
```javascript
{
  id: "string",
  icon: "string",
  title: "string",
  description: "string"
}
```

#### About Content
```javascript
{
  title: "string",
  aboutText: "string",
  items: ["string"],
  mainImage: "string (Cloudinary URL)",
  smallImages: ["string", "string", "string"]
}
```

## Usage Examples

### Adding a New Partner
1. Navigate to Home tab in Page Settings
2. Click "Add Partner" button
3. Fill in partner name and website (optional)
4. Click on the image placeholder to upload logo
5. Click "Save All Changes"

### Managing About Images
1. Navigate to About tab in Page Settings
2. Upload main image (recommended: 800x600px+)
3. Upload 3 small images (recommended: 400x300px+)
4. Edit text content as needed
5. Click "Save Changes"

### Creating a New Feature
1. Navigate to Home tab in Page Settings
2. Click "Add Feature" button
3. Enter icon identifier (e.g., "star", "heart", "shield")
4. Fill in title and description
5. Click "Save All Changes"

## Error Handling

### Common Error Responses
```json
{
  "success": false,
  "message": "Error description",
  "details": "Additional error information"
}
```

### HTTP Status Codes
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `500`: Internal Server Error

## Performance Considerations

### Image Optimization
- Automatic WebP conversion
- Quality optimization (80%)
- Responsive image transformations
- CDN delivery through Cloudinary

### Caching Strategy
- Database query optimization
- Efficient data structures
- Minimal API calls

### File Size Limits
- Maximum 5MB per image
- Automatic compression
- Format optimization

## Development Notes

### Frontend Components
- React-based interface
- Real-time state management
- Responsive design
- Loading states and error handling

### Backend Services
- Node.js with Next.js API routes
- MongoDB integration
- Cloudinary image service
- JWT authentication

### Environment Variables
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
NEXT_PUBLIC_CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_MONGODB_URL=your_mongodb_url
NEXT_PUBLIC_JWT_SECRET=your_jwt_secret
```

## Troubleshooting

### Common Issues
1. **Image Upload Fails**: Check Cloudinary credentials and file size
2. **Permission Denied**: Ensure user has superadmin role
3. **Data Not Saving**: Verify MongoDB connection and authentication
4. **Images Not Loading**: Check Cloudinary URLs and folder permissions

### Debug Information
- Comprehensive logging in all API endpoints
- Error details in response messages
- Console logging for development
- Network tab inspection for API calls

## Future Enhancements

### Planned Features
- Bulk image upload
- Image cropping and editing
- Content versioning
- Preview mode
- SEO optimization tools
- Analytics integration

### Scalability Improvements
- Redis caching layer
- Image CDN optimization
- Database indexing
- API rate limiting
- Background job processing
