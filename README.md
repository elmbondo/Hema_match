# HemaMatch — Blood Donation and Emergency Matching System

HemaMatch is a web-based blood donation and emergency matching platform built for Kenyan hospitals. It centralises donor records and blood inventory in real time, replacing the manual phone calls and paper registers that currently delay emergency response across facilities.

---

## The Problem

Kenya faces a chronic national blood shortage. When a patient needs blood urgently, hospital staff have no centralised way to find compatible donors — they call around manually, check physical registers, and hope for the best. HemaMatch replaces that process with a single integrated system.

---

## What It Does

- Matches emergency patients to compatible nearby donors in under 50ms
- Sends SMS alerts to eligible donors and tracks their responses
- Manages blood inventory across multiple hospital facilities in real time
- Connects hospitals through a Sister Hospital Network for inter-facility blood transfers
- Enforces donor safety rules — age eligibility, health screening, donation cooldown periods
- Logs all emergency actions for audit and reporting

---

## System Architecture

```
React.js Frontend
      |
Node.js Backend (API + Matching Engine)
      |
PostgreSQL Database (Centralised Donor and Inventory Records)
      |
SMS Gateway (Emergency Donor Alerts)
      |
Sister Hospitals Network
```

The matching engine filters donors by blood type compatibility and ranks results by proximity, returning a verified donor list in under 50ms. Human confirmation is required before any blood is dispatched — no automatic donation without explicit acceptance.

---

## Features

**Donor Management**
- Donor registration with health screening
- Blood type recording and eligibility validation
- Donation cooldown tracking to prevent unsafe repeat donations

**Blood Inventory**
- Real-time stock levels per facility
- Low inventory alerts
- Withdrawal and restocking history

**Emergency Matching**
- Blood type compatibility filtering
- Proximity-based donor ranking
- SMS outreach with response tracking

**Sister Hospital Network**
- Inter-facility blood transfer requests
- Cross-hospital inventory visibility

**Reports**
- Withdrawal history
- Emergency outreach logs
- Donor response rates

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js |
| Backend | Node.js |
| Database | PostgreSQL |
| SMS | Africa's Talking (SMS Gateway) |

---

## Testing

Functional testing on 10 mock patient cases showed 100% accuracy in blood type compatibility matching and filtering, with end-to-end response under one second.

---

## ML Extension

This project has a companion machine learning module — [hemamatch-ml](https://github.com/elmbondo/hemamatch-ml) — that adds ARIMA-based blood inventory forecasting. It predicts when specific blood types will hit critical levels up to 30 days in advance, shifting the system from reactive to predictive.

---

## Project Background

HemaMatch was developed as a final year capstone project at Jomo Kenyatta University of Agriculture and Technology (JKUAT) by a team of five students under the supervision of Dr. Geoffrey Barini. The system was designed around real gaps in Kenya's blood supply chain, informed by fieldwork and hospital attachment experience at Machakos Level 5 Hospital.

---

## Team

| Name | Role |
|------|------|
| Fidelmah Nthambi Mbondo | Literature Review, Data Layer, ML Integration |
| [Team Member 2] | |
| [Team Member 3] | |
| [Team Member 4] | |
| [Team Member 5] | |

---

## Repository Structure

```
Hema_match/
├── components/
├── services/
├── utils/
├── hemamatch-ml/        # ML forecasting module
├── App.tsx
├── index.html
└── package.json
```

---

## Author

**Fidelmah Nthambi Mbondo**  
BSc Mathematics and Computer Science, JKUAT  
[GitHub](https://github.com/elmbondo)
