# 🧭 CampusRecall — Lost & Found Portal

> A modern, geo-enabled lost & found web application built with React 19, Node.js, Express, and MongoDB.

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

---

## 🎯 Project Objective

To apply advanced JavaScript (ES6+) and modern React fundamentals to design, architect, and deliver a production-ready web application solving a real-world campus challenge. The project demonstrates the practical integration of advanced React hooks, component-driven modular architecture, client-side routing, full CRUD operations, robust REST API communication, automated geospatial metadata extraction, error resilience, and performance optimization.

---

## 💡 The Real-World Campus Problem

Every semester on campus, students lose personal belongings: student IDs, laptop chargers, library books, lab coats, and sports accessories. 

Currently, recovery relies on fragmented channels:
- Unorganized WhatsApp groups where lost item photos get buried under hundreds of messages within hours.
- Front-desk security boxes where unclaimed items pile up with zero searchability.
- Physical paper posters taped to corridor pillars that get torn down, rained on, or ignored.
- **The verification gap**: No mechanism to confirm whether someone claiming a high-value item (like Charger, laptops, headphones, or a wallet) is the legitimate owner.

**CampusRecall** replaces this broken process with a unified, geo-tagged web portal designed to make reporting, locating, verifying, and recovering items effortless.

---

## 📚 Curriculum & Technical Scope Fulfillment

This project demonstrates the complete requirements of **CampusRecall**: 

| Requirement | Project Implementation & Proof in Codebase |
|:---|:---|
| **🎣 React Hooks** | Extensive utilization of `useState` (filter tokens, active forms, modal states), `useEffect` (API data hydration, dynamic theme changes, Leaflet tile synchronization), and optimized state handlers without memory leaks. |
| **🚦 View Routing & Navigation** | Client-side routing between Home Feed, Lost Item Reporting, Found Item Reporting, "My Reports" view, and the Interactive Campus Map with deep filter state preservation. |
| **📝 Forms & Validation** | Controlled forms with real-time validation, required field guards, category selection, contact verification, and image binary validation with EXIF parsing. |
| **🌐 REST API Integration** | Asynchronous HTTP integration via `itemService.js` communicating with Express backend endpoints using modern `async/await` and error interceptors. |
| **🔄 Full CRUD Operations** | **Create** new lost/found listings; **Read** filtered campus entries; **Update** item lifecycle (`OPEN` ➔ `CLAIMED` ➔ `RESOLVED`) & append proof claims; **Delete** resolved listings. |
| **🔍 Search & Filter Engine** | Real-time multi-criteria filtering: search keyword query, 9 category pills, item type toggle (`LOST`/`FOUND`), status pills, and chronological date sorting. |
| **🛡️ Error Handling & Feedback** | Animated floating toast alerts (`ToastContainer.jsx`), network failure fallbacks with `localStorage`, custom confirmation dialogs (`ConfirmModal.jsx`), and friendly empty states. |

### 📋 Technical Scope & Engineering Highlights
- **Full-Stack Architecture**: Architected and developed a full-stack MERN application to digitize lost-and-found operations across campus, serving students and security desks across 9 item categories.
- **Client-Side EXIF GPS Extraction**: Integrated `exifr` to automatically capture camera coordinates directly from uploaded smartphone photos with an instant fallback to the HTML5 Geolocation API.
- **Geospatial Mapping**: Built an interactive campus map with Leaflet.js featuring real-time lost/found markers, landmark clustering heuristics, and one-tap turn-by-turn routing via Google Maps.
- **Smart Cross-Matching Algorithm**: Developed a keyword-matching engine that cross-references new reports against opposite listings (Lost ↔ Found) to automatically surface potential matches.
- **Ownership Verification Workflow**: Designed a secure proof-of-ownership workflow where claimants submit private verification details (passcodes, unique marks) for poster/admin review before resolution.
- **Automated Noticeboard Flyer Generator**: Created a client-side flyer generator producing physical noticeboard posters with dynamic QR codes and tear-off contact slips.
- **High-Availability Offline Caching**: Implemented a resilient caching layer with `localStorage` fallbacks to guarantee 100% UI uptime during intermittent campus Wi-Fi connectivity.

### 🧠 Architectural Decisions & Technical Insights
| Decision | Choice Made | Why This Approach Was Chosen |
|---|---|---|
| **GPS Extraction** | Client-Side (`exifr`) | Parsing EXIF data directly in the browser saves server CPU, avoids uploading large uncompressed binaries just for metadata, and provides immediate coordinate feedback in the form UI. |
| **Mapping Engine** | Leaflet.js | Lightweight and open-source with no costly Google Maps API billing or rate limits, while still offering custom SVG markers and direct links to Google Maps for walking directions. |
| **Claim Verification** | Private Proof Workflow | Solves the security flaw of public "Claim" buttons. The finder or campus security holds onto the item until the claimant verifies private identifiers. |
| **Offline Reliability** | LocalStorage Fallback Layer | Campus networks can be spotty. The service layer caches all reports locally, allowing students to browse and search even if the backend is momentarily unreachable. |

---

## ✨ Key Features & Technical Highlights

### 📊 Feature Overview Matrix

| Feature | The Campus Pain Point | CampusRecall Solution | Tech Under the Hood |
|---|---|---|---|
| **📸 Photo Geo-Tagging** | Finders forget or misname exact classroom/lab numbers | Automatically extracts latitude and longitude from the photo's EXIF data | `exifr` + HTML5 Geolocation API |
| **🗺️ Interactive Map** | Long text lists don't tell you if an item is near your dorm or library | Visual campus map with color-coded pins (Red = Lost, Green = Found) | Leaflet.js + Custom SVG Markers |
| **🔍 Smart Matchmaker** | Lost and found posts live in isolation with no connection | Suggests matching listings between Lost and Found posts within the same category | Word overlap & keyword scoring |
| **🔒 Ownership Proof** | Anyone can claim an expensive item by just clicking "Claim" | Claimants must submit confidential proof (passcode, serial, engravings) | Role-Based Verification Drawer |
| **🖨️ Noticeboard Flyers** | Offline students don't know an item has been reported online | One-click printable A4 poster with auto-generated QR code and tear-off contact tabs | `qrcode.react` + `@media print` CSS |
| **🌓 Dual-Theme System** | Late-night library study sessions cause eye strain | Polished Dark and Light mode transitions across all UI controls, dialogs, and popups | Vanilla CSS design tokens |
| **🛡️ RBAC & Profiles** | Hard to demo different perspectives (Student vs Security) | Built-in test profile switcher simulating Student, Security Desk, and Finder roles | Client-side Session State |

---

### 🔍 Deep-Dive Feature Breakdown

#### 1. 📸 Automated Camera GPS Extraction
- **In Practice**: When a student finds a set of keys on a bench and takes a picture with their phone, the app reads the image's embedded EXIF metadata in real time.
- **Implementation**: Handled entirely on the client using `exifr`. If coordinates are found, the latitude and longitude fields populate instantly. If the photo lacks GPS data, a fallback button captures the device's live coordinates via `navigator.geolocation`.
- **Why it matters**: Eliminates ambiguous descriptions like *"found somewhere near block 2"* by providing pin-point accuracy.

#### 2. 🗺️ Interactive Campus Map with Direct Navigation
- **In Practice**: Users can toggle between the listing feed and an interactive campus map.
- **Implementation**: Built with Leaflet.js. Lost items appear as red beacons, while found items feature pulsing emerald pins. Clicking a marker reveals the item photo, description, and an *"Open in Google Maps"* button that immediately launches turn-by-turn walking directions.
- **Why it matters**: Gives campus security and students an instant spatial overview of active reports across academic buildings, cafeterias, and hostels.

#### 3. 🔍 Smart Keyword Matchmaker
- **In Practice**: If Student A reports a lost *"Boat Airdopes 141 Black"* and Student B reports a found *"Black Boat Earbuds near Canteen"*, the system recognizes the overlap.
- **Implementation**: The backend compares opposite report types (`LOST` ↔ `FOUND`) within the same category, filtering stop words and calculating keyword matches across titles and descriptions.
- **Why it matters**: Replaces manual scrolling through dozens of listings with proactive match recommendations.

#### 4. 🔒 Two-Step Proof-of-Ownership Verification
- **In Practice**: Anyone can say *"That's my calculator!"* CampusRecall requires claimants to provide private identifying details.
- **Implementation**: When a claimant clicks *"Claim This Item"*, a modal prompts them for their contact info and a detailed description of unique identifiers (e.g., specific stickers, serial number, cracked corner, or home screen photo). The item poster or security guard reviews these claims in a private verification drawer before approving the handover.
- **Why it matters**: Completely prevents false claims and unauthorized pickups.

#### 5. 🖨️ Physical Bulletin Board Flyer Generator
- **In Practice**: Even in a digital world, physical campus bulletin boards get heavy foot traffic.
- **Implementation**: Clicking *"Print Poster"* opens a print-formatted modal featuring high-contrast typography, the item image, a dynamically generated QR code pointing directly to the listing, and perforated tear-off tabs with the owner's phone number.
- **Why it matters**: Bridges the gap between physical campus spaces and the digital portal.

---

## 🏗️ Project Architecture

```text
CampusRecall/
├── client/                     # React 19 + Vite Frontend
│   ├── src/
│   │   ├── components/         # MapView, ItemCard, ClaimModal, PosterModal, ImageUploader, etc.
│   │   ├── constants/          # Demo profiles & categories
│   │   ├── pages/              # Home feed, ReportLostItem, ReportFoundItem
│   │   ├── services/           # REST API calls + localStorage fallback
│   │   ├── index.css           # CSS design tokens, dark/light themes & animations
│   │   ├── App.jsx             # State orchestration & toast notifications
│   │   └── main.jsx            # React root
│   └── package.json
│
├── server/                     # Node.js + Express Backend
│   ├── config/db.js            # MongoDB Mongoose connection
│   ├── controllers/            # CRUD, claim verification, and matching logic
│   ├── models/Item.js          # Item schema with GPS coordinates & claims array
│   ├── routes/itemRoutes.js    # REST endpoints
│   ├── seed.js                 # Sample campus data generator with geo-tags
│   ├── server.js               # Express application entry point
│   └── package.json
│
└── README.md
```

---

## 📡 REST API Reference

| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `GET` | `/api/items` | Retrieve all items (supports `?search=`, `?category=`, `?type=`, `?status=`) | Public |
| `GET` | `/api/items/:id` | Fetch single item details by ID | Public |
| `POST` | `/api/items` | Submit a new lost or found report (accepts coordinates & photo) | Public |
| `PATCH` | `/api/items/:id/status` | Update status (`OPEN`, `CLAIMED`, `RESOLVED`) and append proof claims | Poster / Admin |
| `DELETE` | `/api/items/:id` | Remove a listing | Poster / Admin |
| `GET` | `/api/items/:id/matches` | Get smart match suggestions for an item | Public |

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (running locally on port `27017` or via MongoDB Atlas URI)

### 1. Backend Setup
```bash
cd server
npm install
npm run seed      # (Optional) Populates realistic campus test listings with GPS coordinates
npm run dev       # Starts Express API at http://localhost:5000
```

### 2. Frontend Setup
In a new terminal:
```bash
cd client
npm install
npm run dev       # Starts Vite dev server at http://localhost:5173
```

### 3. Linting & Production Build
```bash
cd client
npm run lint      # Runs ESLint (0 errors, 0 warnings)
npm run build     # Builds production bundle
```

---

## 👤 Author & Academic Details

**Kaushik Raj**
