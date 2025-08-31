# Two-Step Pricing Loading System

## Overview
This system implements a two-step loading process for property details and pricing information, providing a better user experience by showing property information immediately while pricing loads in the background.

## Architecture

### 1. API Endpoints

#### Property Details API
- **Endpoint**: `/api/properties/[id]`
- **Purpose**: Fetches property information (name, address, images, amenities, etc.)
- **Response**: Property data without pricing information
- **Loading Time**: Fast (property data is cached/readily available)

#### Pricing API
- **Endpoint**: `/api/properties/[id]/pricing?start=YYYY-MM-DD&end=YYYY-MM-DD`
- **Purpose**: Fetches pricing information for specific date ranges
- **Response**: Pricing data with summary calculations
- **Loading Time**: Slower (requires external API calls to OwnerRez)

### 2. Frontend Flow

#### Step 1: Property Loading
1. Component mounts
2. Fetches property details from `/api/properties/[id]`
3. Shows property information immediately
4. If dates are pre-selected (from search session), shows pricing skeleton

#### Step 2: Pricing Loading
1. User selects check-in/check-out dates OR dates are pre-filled
2. Shows pricing skeleton (animated placeholder)
3. Fetches pricing from `/api/properties/[id]/pricing`
4. Replaces skeleton with actual pricing data

## Components

### PricingSkeleton
- **File**: `src/components/booknow/PricingSkeleton.tsx`
- **Purpose**: Shows animated placeholder while pricing loads
- **Features**: 
  - Animated gray bars for rate, average price, and blocked nights
  - Smooth pulse animation
  - Maintains layout consistency

### LoadingSpinner
- **File**: `src/components/common/LoadingSpinner.tsx`
- **Purpose**: Reusable loading indicator
- **Features**:
  - Multiple sizes (xs, sm, md, lg, xl)
  - Multiple colors (blue, gray, white, yellow)
  - Optional text display
  - Smooth spinning animation

## State Management

### Property State
```typescript
const [property, setProperty] = useState<any>(null);
const [propertyLoading, setPropertyLoading] = useState(true);
const [propertyError, setPropertyError] = useState<string | null>(null);
```

### Pricing State
```typescript
const [pricing, setPricing] = useState<any>(null);
const [pricingLoading, setPricingLoading] = useState(false);
const [pricingError, setPricingError] = useState<string | null>(null);
const [showPricingSkeleton, setShowPricingSkeleton] = useState(false);
```

## User Experience Flow

1. **Page Load**: Property details load quickly, user sees property information
2. **Date Selection**: User selects dates, pricing skeleton appears
3. **Pricing Load**: Pricing data loads in background, skeleton animates
4. **Complete**: Pricing information replaces skeleton, total calculation updates

## Benefits

1. **Faster Perceived Performance**: Property details show immediately
2. **Better UX**: Users can browse property info while pricing loads
3. **Clear Loading States**: Skeleton shows exactly what's loading
4. **Error Handling**: Separate error states for property vs pricing
5. **Responsive**: Works with pre-filled dates from search sessions

## Error Handling

- **Property Errors**: Show error message, prevent page display
- **Pricing Errors**: Show error message, allow property browsing
- **Network Issues**: Graceful fallback with user-friendly messages

## Performance Optimizations

1. **Separate API Calls**: Property and pricing load independently
2. **Caching**: Property data can be cached separately from pricing
3. **Lazy Loading**: Pricing only loads when dates are selected
4. **Background Processing**: Pricing loads without blocking UI

## Usage Examples

### Basic Implementation
```typescript
// Property loads first
useEffect(() => {
  fetchProperty(id);
}, [id]);

// Pricing loads when dates change
useEffect(() => {
  if (checkIn && checkOut) {
    fetchPricing(id, checkIn, checkOut);
  }
}, [checkIn, checkOut]);
```

### Skeleton Display
```typescript
{showPricingSkeleton ? (
  <PricingSkeleton />
) : pricingLoading ? (
  <LoadingSpinner size="sm" text="Loading pricing..." />
) : pricing ? (
  <PricingDisplay data={pricing} />
) : null}
```

## Future Enhancements

1. **Pricing Caching**: Cache pricing results for common date ranges
2. **Progressive Loading**: Load basic pricing first, then detailed breakdown
3. **Offline Support**: Store pricing data locally for offline access
4. **Real-time Updates**: WebSocket updates for dynamic pricing changes
