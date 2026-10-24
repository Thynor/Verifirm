# VeriFirm — Corporate Legitimacy & Job Scam Intelligence Platform

VeriFirm is a cyber-threat intelligence and corporate legitimacy verification tool designed to protect job seekers, contractors, and businesses against recruitment fraud, shell companies, and advance-fee scam rings.

---

## 🌟 Key Features

1. **Multi-Modal Universal Input**:
   - **Paste Link**: Analyzes websites, job postings, or LinkedIn company pages.
   - **Upload Screenshot**: Drag & drop or paste offer letters, WhatsApp chats, or recruiter emails (with automatic OCR extraction).
   - **Raw Email / Message Text**: Paste recruiter emails or job offers for instant entity parsing.
   - **1-Click Test Presets**: Instant benchmarks for Legitimate Blue-Chip (TCS), Imposter Scam (WhatsApp ₹8,500 Laptop Deposit), and Unverified Shell Startup.

2. **The 5 Golden Rules of Authorized Hiring**:
   - **Never Ask for Money**: Flags laptop deposits, training fees, and gate pass charges.
   - **Secure Document Handling**: Flags requests for Aadhaar, PAN, or Bank passbooks over WhatsApp/Telegram.
   - **Official Email Domains**: Detects `@gmail.com` or `@yahoo.com` impersonating corporations.
   - **Standard Timeline**: Detects artificial 2-hour high-pressure panic tactics.
   - **Realistic Compensation**: Flags unrealistic salary promises for entry-level tasks.

3. **LinkedIn Headcount & Profile Forensics**:
   - Compares claimed enterprise scale vs actual LinkedIn headcount.
   - Registration date & page age.
   - Interactive Profile Quality Inspector (real photos vs stock/AI avatars, 500+ connections threshold, past work history).
   - Executive Leadership Visibility.
   - Turnover rate & workplace stability scoring.

4. **Stock & Financial Health Graph**:
   - Verified public listing status on NSE, BSE, NASDAQ, NYSE.
   - Interactive multi-timeframe price chart (1D, 1M, 6M, 1Y, 5Y).
   - **Detailed Financial Analysis just below the chart** explaining:
     - Key growth drivers
     - Losses, margin pressures & inflation headwinds
     - Balance sheet solvency & cash reserves
     - Candidate job security outlook

5. **Government & Corporate Portals Verification**:
   - **Ministry of Corporate Affairs (MCA, India)**:
     - CIN (Corporate Identification Number) verification & checksum validation.
     - Active vs Strike-off/Liquidation status.
     - RoC jurisdiction, incorporation date, authorized & paid-up capital.
   - **Tax Identifiers**:
     - GSTIN 15-character structure & state code validation.
     - Corporate PAN verification.
   - **Global Registries**:
     - UK Companies House lookup.
     - US SEC EDGAR filings.

6. **Digital Identity & WHOIS Forensics**:
   - Domain creation age vs claimed company age.
   - Typosquatting & lookalike domain detection (e.g. `tcs-careers-online.online` vs `tcs.com`).
   - EV/DV SSL certificate authority check.
   - Website hygiene (dead `#` footer social links).

7. **Physical Footprint & Address Verification**:
   - Office address geocoded with 1-click Google Maps verification.
   - Commercial Grade-A corporate complex vs residential tenement detection.
   - Fixed PBX telecom trunk line vs burner mobile numbers.

8. **Reddit & Review Authenticity**:
   - Scans discussions on r/scams, r/developersIndia, and r/recruitinghell.
   - Glassdoor / AmbitionBox review distribution analysis.
   - Synthetic review anomaly detector (catches clusters of 5-star reviews posted on the exact same date with identical phrasing).

---

## 🚀 Quick Start Guide

### 1. Extract & Open
Extract the contents of `verifirm.zip` to your desired folder, and open a terminal in that folder:
```bash
cd verifirm
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build & Run
```bash
npm run build
npm start
```

### 4. Access the Application
- **On your PC**: Open [http://localhost:3001](http://localhost:3001) in your browser.
- **On your Mobile Device**: Connect your phone to the same Wi-Fi network, find your computer's local IP address (e.g., run `ipconfig`), and navigate to:
  ```
  http://<YOUR_COMPUTER_IP>:3001
  ```
  *(e.g., `http://192.168.1.15:3001`)*

