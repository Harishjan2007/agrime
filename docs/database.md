# AgriME – Database Design

## 1. Database Overview

AgriME will use PostgreSQL through Supabase as the primary database.

The database will store information required for:

- Users
- Crops
- Markets
- Crop prices
- Agricultural products
- Dealers
- Machinery
- Machinery bookings
- Government schemes
- Crop price predictions

The database will be designed using relational tables with primary keys and foreign-key relationships.

---

## 2. Database Technology

### Database

PostgreSQL

### Backend Platform

Supabase

### Main Database Features

- Relational data storage
- Primary keys
- Foreign keys
- Constraints
- Row Level Security
- Authentication integration
- Database queries through Supabase APIs

---

# 3. Database Tables

## 3.1 Users

Stores information about registered AgriME users.

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| name | TEXT | User's name |
| email | TEXT | User email |
| phone | TEXT | Contact number |
| role | TEXT | Farmer, Dealer, Machinery Provider, Admin |
| location | TEXT | User location |
| created_at | TIMESTAMP | Account creation time |

---

## 3.2 Crops

Stores information about crops available on the platform.

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| name | TEXT | Crop name |
| category | TEXT | Crop category |
| season | TEXT | Crop season |
| description | TEXT | Crop description |
| created_at | TIMESTAMP | Record creation time |

Example:

```text
Paddy
Groundnut
Wheat
Maize 

3.3 Markets

Stores information about agricultural markets.

Column	Type	Description
id	UUID	Primary key
name	TEXT	Market name
location	TEXT	Market location
district	TEXT	District
state	TEXT	State
latitude	DECIMAL	Latitude
longitude	DECIMAL	Longitude
created_at	TIMESTAMP	Record creation time
3.4 Crop Prices

Stores crop prices collected from agricultural markets.

Column	Type	Description
id	UUID	Primary key
crop_id	UUID	Foreign key → Crops
market_id	UUID	Foreign key → Markets
price	DECIMAL	Current crop price
unit	TEXT	Price unit
recorded_at	TIMESTAMP	Price recording time
source	TEXT	Price data source
created_at	TIMESTAMP	Record creation time

Example:

Crop: Paddy
Market: Vellore
Price: ₹2,350
Unit: Quintal
4. E-Commerce Tables
4.1 Products

Stores agricultural products available for purchase.

Column	Type	Description
id	UUID	Primary key
dealer_id	UUID	Foreign key → Users
name	TEXT	Product name
category	TEXT	Seeds, Fertilizer, Pesticide, Equipment
description	TEXT	Product description
price	DECIMAL	Product price
stock	INTEGER	Available quantity
image_url	TEXT	Product image
created_at	TIMESTAMP	Record creation time
4.2 Dealers

Stores dealer-specific information.

Column	Type	Description
id	UUID	Primary key
user_id	UUID	Foreign key → Users
shop_name	TEXT	Shop/business name
address	TEXT	Business address
phone	TEXT	Contact number
latitude	DECIMAL	Latitude
longitude	DECIMAL	Longitude
opening_hours	TEXT	Business hours
created_at	TIMESTAMP	Record creation time
5. Machinery Tables
5.1 Machinery

Stores agricultural machinery available for rental or booking.

Column	Type	Description
id	UUID	Primary key
provider_id	UUID	Foreign key → Users
name	TEXT	Machine name
type	TEXT	Tractor, Paddy Harvester, etc.
description	TEXT	Machine description
price_per_hour	DECIMAL	Rental price
location	TEXT	Machine location
latitude	DECIMAL	Latitude
longitude	DECIMAL	Longitude
available	BOOLEAN	Availability status
created_at	TIMESTAMP	Record creation time
5.2 Machinery Bookings

Stores machinery booking requests.

Column	Type	Description
id	UUID	Primary key
farmer_id	UUID	Foreign key → Users
machinery_id	UUID	Foreign key → Machinery
booking_date	DATE	Requested date
start_time	TIME	Starting time
end_time	TIME	Ending time
status	TEXT	Pending, Confirmed, Completed, Cancelled
total_amount	DECIMAL	Booking amount
created_at	TIMESTAMP	Booking creation time
6. Government Schemes
6.1 Schemes

Stores government agricultural schemes.

Column	Type	Description
id	UUID	Primary key
name	TEXT	Scheme name
description	TEXT	Scheme description
benefits	TEXT	Benefits provided
eligibility	TEXT	Eligibility requirements
state	TEXT	Applicable state
crop_category	TEXT	Applicable crop/category
application_url	TEXT	Official application link
last_updated	TIMESTAMP	Last update
created_at	TIMESTAMP	Record creation time
7. AI Prediction
7.1 Crop Predictions

Stores AI-generated crop price predictions.

Column	Type	Description
id	UUID	Primary key
crop_id	UUID	Foreign key → Crops
market_id	UUID	Foreign key → Markets
current_price	DECIMAL	Current price
predicted_min	DECIMAL	Minimum predicted price
predicted_max	DECIMAL	Maximum predicted price
trend	TEXT	Increasing, Decreasing, Stable
prediction_date	DATE	Date prediction was generated
prediction_period	INTEGER	Prediction period in days
created_at	TIMESTAMP	Record creation time
8. Relationships

The main relationships are:

Users
 │
 ├────────────── Dealers
 │
 ├────────────── Machinery
 │                    │
 │                    ↓
 │               Bookings
 │
 └────────────── Products


Crops
 │
 ├──────────── Crop Prices ─────────── Markets
 │
 └──────────── Predictions ─────────── Markets

More specifically:

Users 1 ──────── * Products

Users 1 ──────── 1 Dealers

Users 1 ──────── * Machinery

Users 1 ──────── * Machinery Bookings

Machinery 1 ──── * Machinery Bookings

Crops 1 ──────── * Crop Prices

Markets 1 ────── * Crop Prices

Crops 1 ──────── * Crop Predictions

Markets 1 ────── * Crop Predictions
9. Location-Based Crop Price Search

AgriME will support location-based crop price viewing.

The system can use market latitude and longitude to determine the approximate distance between the farmer and markets.

Users will be able to filter markets using options such as:

Within 25 km
Within 50 km
Within 100 km
Outside 100 km

The exact implementation of distance calculation will be decided during backend development.

10. Initial Data

The first version of the application will initially focus on:

Crops
Paddy
Groundnut
Machinery
Tractor
Paddy Harvester
Product Categories
Seeds
Fertilizers
Pesticides

Additional crops, products and machinery can be added later.

11. Database Security

Supabase Row Level Security (RLS) will be used to control access to database records.

Examples:

Farmer

Can:

View crop prices
View predictions
View products
View dealers
View machinery
Create machinery bookings
View relevant schemes
Dealer

Can:

Manage their dealer profile
Manage their products
Machinery Provider

Can:

Manage their machinery
Manage booking requests
Administrator

Can manage platform-wide data.

12. Database Development Strategy

The database will be implemented incrementally.

Phase 1

Create core tables:

Users
Crops
Markets
Crop Prices
Phase 2

Create service tables:

Products
Dealers
Machinery
Machinery Bookings
Schemes
Phase 3

Create:

Crop Predictions
Phase 4

Add:

Relationships
Constraints
Indexes
Row Level Security policies
Authentication integration