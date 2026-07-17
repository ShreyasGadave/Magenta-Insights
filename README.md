# Sales Outlet Management Dashboard

A responsive, high-performance React + TypeScript single-page web application built for **Magenta Insights** to manage sales outlets and visualize them geographically on an interactive map.

## 🚀 Live Demo & Repository
- **GitHub Repository**: [ShreyasGadave/Magenta-Insights](https://github.com/ShreyasGadave/Magenta-Insights)

---

## 🛠️ Tech Stack & Libraries
- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://shadcn.dev/) & [Base UI](https://base-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Map Visualization**: [Leaflet v1.9](https://leafletjs.com/) & [React Leaflet v5](https://react-leaflet.js.org/)
- **Charts & Analytics**: [Recharts v3.8](https://recharts.org/)
- **Toasts & Notifications**: [Sonner](https://github.com/emilkowalski/sonner)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)

---

## ✨ Core Features & Implementations

### 1. 🔒 Authentication & Route Guards
- **Secure Paths**: Nested routes within `/dashboard`, `/outlets`, `/map`, and `/settings` are protected by a `ProtectedRoute` component. Unauthenticated attempts redirect directly to `/signin`.
- **Session Persistence**: Authentication states and current user metadata are saved in `localStorage`, maintaining the user session across reloads.
- **Login & Signup forms**: Forms feature mock account validation and direct-entry configurations (e.g. clicking "Demo account" automatically logs the user in).

### 2. 📊 Analytics Dashboard
- **Summary Metrics Cards**: Displays real-time counts for *Total Outlets*, *Active Outlets*, *Prospects*, and *Overdue Visits* (&gt;21 days since last visit).
- **Interactive Charts**:
  - *Status Breakdown*: A responsive Recharts Pie/Donut Chart showing proportion of Active, Inactive, and Prospect outlets.
  - *Visit Recency*: A Recharts Bar Chart categorizing outlets based on time elapsed since their last check-in.
- **Recent Activity Feed**: A dense feed showing the 5 most recently visited outlets, highlighting overdue items with quick deep-links to inspect them.

### 3. 🏪 Outlets Management (CRUD)
- **Layout Toggles**: Seamlessly switch between a card-based **Grid View** and a spreadsheet-like **Table View**.
- **Search & Filters**:
  - Live query search by Outlet Name, Owner, Contact Number, or Address.
  - Filter by Status (Active, Inactive, Prospect) or Visit Recency (All, Overdue, Recent).
- **Sorting**: Multi-option sort by Name (A-Z / Z-A), Last Visit Date (Newest / Oldest), and Status.
- **Full CRUD Operations**:
  - *Create / Update*: Managed via unified modal forms with real-time validation (including coordinates ranges, date validation, and 10-digit telephone checks).
  - *Delete*: Displays a confirmation prompt before executing deletion.
  - *View details*: Displays an outlet profile card with GPS coordinates and a click-through Google Maps navigation link.
- **Deep Linking**: Reviewing specific outlets is possible via query parameters (e.g. `/outlets?id=3`), which automatically opens their profile modal.

### 4. 🗺️ Geographic Map Visualization
- **Theme-Synchronized Tiles**: Map tiles query CartoDB based on the active theme (Minimal Voyager light tiles for Light Mode, Minimal Dark matter tiles for Dark Mode).
- **Custom Marker Pins**: Replaced the default Leaflet pins with responsive SVG nodes that pulsate with status-themed glowing animations (Emerald for Active, Gray for Inactive, Amber for Prospect).
- **Interactive Sidebar Lookup**: Features a scrollable left pane with search and filter controls. Clicking an outlet in this list pans the map center to that location (`map.setView`) and opens the popup automatically.
- **Cross-page Navigation**: Popups contain an "Inspect Full Profile" link that navigates to the Outlets list, opening the detailed drawer overlay.

### 5. ⚙️ Settings & Database Utility
- **Profile Summary**: Displays active administrator credentials and role specifications.
- **Appearance Settings**: Theme selection card (Light, Dark, and System theme synchronization).
- **Database Reset**: Re-seeds `localStorage` back to original mock dataset.

---

## 🛠️ Local Development & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Steps
1. **Clone the Repository**
   ```bash
   git clone https://github.com/ShreyasGadave/Magenta-Insights.git
   cd Magenta-Insights
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173` (or the port specified in the CLI).

4. **Production Build**
   To compile and minify the project for production, run:
   ```bash
   npm run build
   ```

---

## 📝 Assumptions & Limitations

### Assumptions
- **Visit Overdue Limit**: Outlets are classified as "overdue" if the time elapsed since their last visit is strictly greater than 21 days.
- **Local Sandbox Data**: State operations (Create, Read, Update, Delete) are stored in `localStorage` in memory for mock persistence.
- **Coordinates Scope**: Latitude and longitude are validated according to global coordinate system limitations (-90 to 90 for Latitude, -180 to 180 for Longitude).

### Limitations
- **Offline Map Support**: The map tiles require an active internet connection to cartocdn.com. If offline, the map grid lines will show but tiles will fail to load.
- **Browser Geolocation**: Geolocation defaults to the center of Pune, India, as all mock dataset coordinates are concentrated there.
