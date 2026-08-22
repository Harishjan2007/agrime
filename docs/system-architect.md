4. Major System Modules
4.1 Home Dashboard

The Home page provides an overview of important agricultural information.

It displays:

Current seasonal crop prices
Paddy price
Groundnut price
AI crop price prediction
Quick access to services
Personalized recommendations
4.2 Crop Price Module

The Crop Price module provides current crop prices from different markets.

Features include:

Current crop price
Market name
Market location
Last updated time
Location-based filtering
Price comparison
Support for multiple crops

The Home page initially highlights seasonal crops such as Paddy and Groundnut.

4.3 Crop Prediction Module

The prediction module uses historical crop price data and machine learning techniques to estimate future crop prices.

Features include:

Current price
Predicted price range
Expected price trend
Prediction period
Crop-specific prediction

Initially, Paddy and Groundnut will be supported.

4.4 E-Commerce Module

The E-Commerce module allows farmers to find and purchase agricultural products.

Products may include:

Seeds
Fertilizers
Pesticides
Agricultural equipment

Product information will include price, seller/dealer information, availability, and product details.

4.5 Dealer Module

The Dealer module helps farmers find agricultural dealers.

Information may include:

Dealer name
Shop name
Contact number
Address
Location
Products/services offered
Business hours
4.6 Machinery Module

The Machinery module allows farmers to find and schedule agricultural machinery.

Initially, the system will focus on:

Tractors
Paddy harvesters

Farmers can view:

Machine details
Provider details
Location
Availability
Rental price
Contact information
4.7 Machinery Booking Module

The booking system allows farmers to request machinery for a selected date and time.

Basic booking flow:

Select Machinery
       |
       v
View Availability
       |
       v
Select Date and Time
       |
       v
Enter Booking Details
       |
       v
Submit Booking
       |
       v
Booking Confirmation
4.8 Government Scheme Module

The Government Schemes module provides agricultural schemes relevant to farmers.

Information may include:

Scheme name
Description
Benefits
Eligibility
Applicable crops/categories
State
Application information
Official application link
Last updated date

The system may later recommend schemes based on farmer and crop information.

5. User Types
Farmer

Farmers are the primary users of AgriME.

They can:

View crop prices
View price predictions
Browse agricultural products
Find dealers
Find machinery
Book machinery
View recommended government schemes
Dealer

Dealers can:

Manage dealer information
List agricultural products
Provide contact information
Manage product availability
Machinery Provider

Machinery providers can:

List machinery
Provide machine details
Set availability
Manage booking requests
Administrator

The administrator manages and monitors platform information.

The administrator may:

Manage users
Manage crop and market information
Manage products
Manage dealers
Manage machinery
Manage government scheme information
Monitor bookings
Maintain platform data
6. Initial Development Strategy

Development will be performed incrementally.

Phase 1 – Planning
Project requirements
User roles
System architecture
Database design
Phase 2 – UI Development
Home dashboard
Crop price interface
Prediction interface
E-Commerce interface
Dealer interface
Machinery interface
Government schemes interface
Phase 3 – Backend
Supabase setup
Database tables
Authentication
Data APIs
Storage
Phase 4 – Feature Integration
Real crop price data
Product management
Dealer information
Machinery availability
Machinery booking
Government scheme data
Phase 5 – AI Integration
Historical crop price collection
Data preprocessing
Model development
Model evaluation
Prediction API
Frontend integration
Phase 6 – Testing and Deployment
Functional testing
UI testing
Database testing
Security testing
Deployment
Monitoring