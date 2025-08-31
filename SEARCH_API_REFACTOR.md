# Search API Refactor Documentation

## Overview
The search API has been refactored into multiple service files for better organization, maintainability, and separation of concerns.

## New File Structure

### 1. Types (`src/lib/types/property.ts`)
Contains all TypeScript interfaces and types:
- `Property` - Basic property interface
- `SearchFilters` - Search filter parameters
- `OwnerRezSearchResponse` - API response structure
- `PricingData` - Pricing information from OwnerRez
- `PropertyWithPricing` - Property with calculated pricing

### 2. OwnerRez Service (`src/lib/services/ownerRezService.ts`)
Handles all OwnerRez API communications:
- `searchProperties()` - Search properties using OwnerRez API
- `getPropertyPricing()` - Get pricing for a single property
- `getPropertiesPricing()` - Get pricing for multiple properties in parallel

### 3. Pricing Service (`src/lib/services/pricingService.ts`)
Manages pricing calculations and operations:
- `calculateTotalPrice()` - Calculate total price from pricing data
- `getPropertiesWithPricing()` - Get properties with pricing information
- `filterByPriceRange()` - Filter properties by price range
- `sortByPrice()` - Sort properties by price

### 4. Search Service (`src/lib/services/searchService.ts`)
Main orchestrator service that combines all functionality:
- `parseSearchFilters()` - Parse URL parameters into filters
- `validatePagination()` - Validate pagination parameters
- `applyCustomFilters()` - Apply filters not supported by OwnerRez
- `applyPagination()` - Handle pagination logic
- `searchProperties()` - Main search method that orchestrates everything

### 5. Main Route (`src/app/api/properties/search/route.ts`)
Simplified route handler that uses the SearchService:
- Parses request parameters
- Validates input
- Delegates to SearchService
- Returns results

## Key Features

### Pricing Integration
- Automatically fetches pricing for properties when `availabilityFrom` and `availabilityTo` are provided
- Calculates total price for each property based on the date range
- Handles pricing errors gracefully

### Parallel Processing
- Pricing requests are made in parallel for better performance
- Uses Promise.all() for concurrent API calls

### Error Handling
- Comprehensive error handling at each service level
- Graceful fallbacks when pricing data is unavailable
- Detailed error messages for debugging

### Caching Integration
- Works with existing property cache system
- Maintains backward compatibility

## Usage Example

```typescript
// The API now automatically handles pricing when dates are provided
GET /api/properties/search?availabilityFrom=2025-08-13&availabilityTo=2025-08-20

// Response includes pricing information
{
  "success": true,
  "data": {
    "properties": [
      {
        "id": 123,
        "name": "Beach House",
        "totalPrice": 1400.00,
        "pricingData": [...],
        // ... other property fields
      }
    ]
  }
}
```

## Benefits of Refactor

1. **Separation of Concerns** - Each service has a single responsibility
2. **Testability** - Services can be unit tested independently
3. **Maintainability** - Easier to modify specific functionality
4. **Reusability** - Services can be used by other parts of the application
5. **Error Handling** - Better error handling and logging
6. **Performance** - Parallel processing for pricing requests
7. **Type Safety** - Strong TypeScript interfaces throughout

## Migration Notes

- The API endpoint remains the same
- All existing functionality is preserved
- New pricing features are automatically available when dates are provided
- Backward compatible with existing clients
