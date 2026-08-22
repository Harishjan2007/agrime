# AgriME – Crop Price Data Flow

## 1. Purpose

The crop price feature allows farmers to view current crop prices from different markets and compare prices based on location.

The first version will focus on:

- Paddy
- Groundnut

## 2. Price Information

Each crop price record should contain:

- Crop
- Market
- Price
- Unit
- Recorded date and time
- Data source
- Market location

## 3. Data Flow

The planned data flow is:

Price Data Source
        ↓
Price Collection / API
        ↓
AgriME Backend
        ↓
Supabase PostgreSQL
        ↓
Next.js Application
        ↓
Farmer Dashboard

## 4. Home Dashboard

The Home page will initially highlight seasonal crops.

For the current development version:

- Paddy price will be displayed
- Groundnut price will be displayed

Each crop will show its current available price.

## 5. Market Location Filtering

Farmers should be able to compare prices based on distance.

Planned filters:

- Within 25 km
- Within 50 km
- Within 100 km
- Outside 100 km

The system will use the farmer's location and market coordinates to calculate approximate distance.

## 6. Price Comparison

The Crop Price page will allow farmers to:

- Select a crop
- View multiple markets
- Compare prices
- Sort by price
- Sort by distance
- View market location

Example:

Paddy

Market A — ₹2,350/quintal
Market B — ₹2,420/quintal
Market C — ₹2,300/quintal

## 7. Price Updates

The database is designed to store multiple price records over time.

The `recorded_at` field will identify when a price was recorded.

The application can use the latest available record to display the current price.

## 8. Future Real-Time Integration

The first development version may use sample data.

Later, AgriME can connect to a reliable agricultural price data source or API.

The external source will periodically provide updated prices.

The updated prices will then be stored in the `crop_prices` table.

## 9. Important Data Consideration

AgriME should display the source and timestamp of crop prices so that farmers can understand when and where the price information was obtained.

The application should not present old or sample data as real-time market prices.

## 10. Current Status

Database structure for crop prices has been implemented.

The next development step is to insert clearly identified development data and connect the Home dashboard to Supabase.

Real external price-data integration will be implemented after the basic application flow is working.