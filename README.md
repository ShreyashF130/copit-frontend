# ⚡ CopIt Frontend | High-Speed Mobile Checkout Interface

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind-38B2AC?logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel&logoColor=white)

> **CopIt Frontend** is the specialized checkout interface for the CopIt WhatsApp Commerce Engine. It is a **Next.js** application designed for speed, converting WhatsApp chat intent into confirmed orders with minimal friction.

---

## 📱 Project Overview
While the backend handles the heavy lifting of logistics and state, this frontend handles the **critical "last mile" of the user experience**: collecting accurate delivery data.

It implements a **"Hybrid Handoff" pattern**: Users start in WhatsApp, jump to this secure web view for complex inputs (address/map), and are deep-linked back to WhatsApp for payment.

### 🖼️ Preview
*(Add screenshots of your Mobile Checkout UI here)*
`[Insert Screenshot: /checkout/uuid Page]` | `[Insert Screenshot: Address Confirmation]`

---

## ✨ Key Features

### 🔐 Secure "Masked" Checkout
- **UUID-Based Routing:** Uses dynamic routes (`/checkout/[session_id]`) to mask user phone numbers.
- **Privacy First:** No PII (Personally Identifiable Information) is exposed in the URL.
- **Auto-Fill:** Fetches encrypted user context from the backend to pre-fill known addresses for returning customers.

### 🚀 Real-Time Logistics Validation
- **Instant Serviceability Check:** As the user types their Pincode, the UI debounces input and queries the backend (connected to Shiprocket).
- **Visual Feedback:** Immediately disables checkout if the location is non-serviceable (RTO prevention).

### ⚡ Optimistic UI Updates
- **Zero-Latency Feel:** Uses React state to provide instant feedback on form interactions while background API calls sync with the database.
- **Mobile-First Design:** Touch targets and layout optimized specifically for the in-app browser experience of WhatsApp users.

---

## 🛠 Tech Stack & Decisions

| Technology | Usage | Why? |
| :--- | :--- | :--- |
| **Next.js 14 (App Router)** | Framework | Server Components for fast initial load; Client Components for interactive forms. |
| **TypeScript** | Language | Strict type safety to prevent `undefined` errors in critical checkout flows. |
| **Tailwind CSS** | Styling | Utility-first CSS allows for rapid iteration and small bundle sizes. |
| **Axios / Fetch** | Data Fetching | Handling communication with the FastAPI backend. |
| **Framer Motion** | Animation | (Optional) Smooth transitions between loading states to reduce perceived latency. |

---

## 📂 Folder Structure (App Router)

```bash
├── app/
│   ├── layout.tsx       # Global wrappers (Fonts, Metadata)
│   ├── page.tsx         # Landing page (if applicable)
│   └── checkout/
│       └── [id]/        # Dynamic Route for Secure Sessions
│           └── page.tsx # The main Address Form Logic
├── components/
│   ├── ui/              # Reusable atoms (Buttons, Inputs, Cards)
│   └── AddressForm.tsx  # The complex form logic isolated
├── lib/
│   ├── api.ts           # Centralized API calls (FastAPI connection)
│   └── types.ts         # Shared TypeScript interfaces (User, Order)
└── public/              # Static assets
