# Dairy Management System - Product Requirements Document (PRD)

## 📝 Abstract
The **Dairy Management System** is a centralized platform designed to digitize manual milk collection and provide real-time financial transparency. It features an owner-defined dynamic rate engine and automated SMS alerts in **Marathi, Hindi, and Kannada**, specifically built to replace manual paper ledgers and reduce payment disputes.

## 🎯 Business Objectives
* **Eliminate Manual Math**: Automate the calculation of daily profits based on quality (Fat/SNF) to remove human error.
* **Native Communication**: Build farmer trust by delivering earnings reports via SMS in their primary language.
* **Centralized Data**: Provide a single source of truth for expenses, milk collections, and payments for the dairy owner.

## 📊 KPI

| GOAL | METRIC | QUESTION |
| :--- | :--- | :--- |
| **Bookkeeping Efficiency** | 50% Time Saved | Does the owner finish daily logging 50% faster than manual methods? |
| **Farmer Trust** | 50% Dispute Reduction | Have complaints regarding milk rates or quality decreased by half? |
| **Engagement** | 80% Daily Check-in | Do 80% of farmers view their dashboard or receive SMS daily? |

## 🏆 Success Criteria
* **End-to-End Flow**: Collection logged → Owner rate applied → Localized SMS received within 30 seconds.
* **Zero-Cost Initial Deployment**: Success using Twilio free trial and free-tier hosting.
* **Data Accuracy**: 100% match between calculated profits and owner's expected payouts.

## 🚶‍♀️ User Journeys
* **Owner (Logging)**: Opens the collection form, selects a farmer, and enters volume and fat percentage. The system previews the payout, saves the record, and triggers a localized SMS.
* **Farmer (Receiving)**: A farmer receives  SMS with their morning income in their mother tongue. They can log in later to see their monthly earnings chart.

## 📖 Scenarios
* **Dynamic Market Pricing**: The owner updates the "Fat Rate" in the morning settings; every collection thereafter automatically uses the new value.
* **Multi-lingual Fallback**: A farmer with no language preference set receives the SMS in **Hindi** (default) to ensure communication never fails.

## 🕹️ User Flow
1.  **Admin** → **Settings**: Input today's Rate per Fat/SNF.
2.  **Admin** → **Add Farmer**: Input name, email, phone, and assign language (Marathi/Hindi/Kannada).
3.  **Collection**: Select Farmer → Input Qty/Fat/SNF → **Save**.
4.  **System**: Calculate Profit → Retrieve Farmer Language → **Send SMS**.
5.  **Farmer**: Receives notification in Mother Tongue → Views Dashboard.

## 🧰 Functional Requirements

| SECTION | SUB-SECTION | USER STORY & EXPECTED BEHAVIORS |
| :--- | :--- | :--- |
| **Rates** | Owner Input | As an Admin, I want to manually set the Fat/SNF rates so I can control the payout formula. |
| **Collection** | Entry Form | As an Admin, I want a fast entry form for Qty, Fat, and SNF that auto-calculates profit. |
| **Alerts** | Multi-lingual SMS | As a Farmer, I want to receive SMS alerts in Marathi, Hindi, or Kannada based on my profile. |
| **Profile** | Language Choice | As an Admin, I want to select a preferred mother tongue from a dropdown when adding a farmer. |

## 📐 Model Requirements
* **Language Storage**: User Model Field (Explicit selection is 100% accurate).
* **Fallback Logic**: Hindi Default (Ensures messages are sent if preference is missing).
* **Rate Persistence**: RateCard Table (Stores historical rates so old collections don't change).

## 🧮 Data Requirements
* **Schema Update**: Add `language` (String) to the `User` model.
* **Collection Fields**: Ensure `quantity`, `fatPercentage`, and `snf` are stored as Floats.
* **SMS Templates**: Pre-defined strings for Marathi, Hindi, and Kannada.

## 💬 Prompt Requirements
* **Output Guarantee**: SMS must follow a strict template structure: `Date: {d}, Qty: {q}L, Fat: {f}%, Net: ₹{a}.`

## 🧪 Testing & Measurement
* **Localization Test**: Verify correct SMS delivery for Marathi, Hindi, and Kannada test accounts.
* **Accuracy Check**: Compare 10 manual calculations against system-generated payouts.

## ⚠️ Risks & Mitigations
| RISK | MITIGATION |
| :--- | :--- |
| **SMS Delivery Failure** | Log SMS status in the database; allow "Resend" from the collection report. |
| **Twilio Trial Limits** | Monitor credit usage; implement "Single Segment" SMS lengths to save costs. |

## 💰 Costs
* **Infrastructure**: $0 (Vercel/Neon/Render Free Tiers).
* **SMS**: $0 (Twilio Trial) → Pay-as-you-go (~₹0.50-1.00/msg).

## 🔗 Assumptions & Dependencies
* **Twilio**: System depends on Twilio API for all notifications.
* **Connectivity**: Owner has internet access during the primary collection hours.
* **Language Fallback**: If no mother tongue is selected, system resolves to Hindi.

## 🔒 Compliance/Privacy/Legal
* **Data Privacy**: Farmer income data is private to the farmer and the system admin.
* **Retention**: Keep milk records for at least 3 years for legal audit purposes.
