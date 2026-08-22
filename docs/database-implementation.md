# AgriME – Database Implementation

## 1. Database Platform

AgriME uses Supabase with PostgreSQL as its database platform.

## 2. Initial Database Implementation

The initial database schema has been successfully created in Supabase.

## 3. Implemented Tables

### Core Tables

- profiles
- crops
- markets
- crop_prices

### Service Tables

- dealers
- products
- machinery
- machinery_bookings
- schemes

### AI Tables

- crop_predictions

## 4. Database Migrations

The database was created using three SQL migrations in Supabase SQL Editor.

### Migration 001 – Core Tables

Created:

- profiles
- crops
- markets
- crop_prices

### Migration 002 – Service Tables

Created:

- dealers
- products
- machinery
- machinery_bookings
- schemes

### Migration 003 – Crop Predictions

Created:

- crop_predictions

## 5. Current Status

All three migrations were executed successfully.

The initial database schema is ready for:

- Sample data insertion
- Authentication integration
- Row Level Security configuration
- Next.js integration

## 6. Next Steps

1. Configure Row Level Security (RLS)
2. Add initial development/sample data
3. Connect Supabase to the Next.js application
4. Replace static Home page crop-price data with database data
5. Test database operations