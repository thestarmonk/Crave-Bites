# Chapter 2: Objective and Scope

## 2.1 Introduction to the Project Vision
The transition from a conceptual problem statement to a strictly defined software engineering solution requires rigid boundaries. Without explicitly defining what a project aims to achieve—and conversely, what it explicitly will *not* attempt to achieve—software development cycles rapidly succumb to "scope creep." This chapter systematically decomposes the overarching vision of the "CraveBites" platform into tangible, measurable objectives and rigorously binds the development effort within a highly specific functional scope. 

The primary mandate of CraveBites is to architect and deploy a full-stack web application that democratizes digital food ordering for independent restaurants, entirely bypassing the exorbitant commission structures imposed by third-party delivery oligopolies.

## 2.2 Core Project Objectives

The objectives of this project are categorized into Primary (essential for Minimum Viable Product - MVP functionality) and Secondary (enhancements for performance, security, and developer experience) goals.

### 2.2.1 Primary Business Objectives
1. **Commission-Free Ecosystem:** To engineer a direct-to-consumer digital touchpoint that enables small restaurant owners to retain 100% of their gross revenue per order, directly circumventing the 20-30% aggregator fees.
2. **Brand Autonomy:** To provide a white-labeled digital storefront where the restaurant's distinct branding is prioritized over a generic aggregator marketplace UI.
3. **Operational Digitization:** To migrate traditional, error-prone analog workflows (e.g., telephone orders, physical ledger bookkeeping) into a deterministic digital database, drastically reducing order processing latency.

### 2.2.2 Primary Technical Objectives
1. **Full-Stack MERN Implementation:** To successfully design, develop, and deploy a robust web application utilizing the MERN stack (MongoDB, Express.js, React 19, Node.js) demonstrating mastery over modern JavaScript ecosystems.
2. **Stateless Authentication:** To implement a secure, stateless session management architecture utilizing JSON Web Tokens (JWT) coupled with cryptographic password hashing (Bcrypt), explicitly avoiding deprecated cookie-based session stores.
3. **Secure Financial Processing:** To seamlessly integrate a robust third-party financial API (Razorpay SDK) capable of handling live transactional data securely via server-side signature verification.
4. **Responsive UI/UX:** To build a highly responsive single-page application (SPA) using React and Tailwind CSS that maintains layout integrity across mobile, tablet, and ultra-wide desktop viewports.

### 2.2.3 Secondary Quality Attributes (Non-Functional Objectives)
1. **Performance Metrics:** 
   - Achieve a Time-To-Interactive (TTI) of strictly under 2.5 seconds on a simulated 4G mobile network.
   - Maintain a Lighthouse Performance score exceeding 90 for the frontend React bundle.
2. **Scalability Foundations:** 
   - Architect the Node.js backend to be entirely stateless, ensuring read/write operations can seamlessly distribute across horizontal server replicas without session loss.
3. **Code Quality and Maintainability:** 
   - Enforce rigorous ESLint and Prettier configurations to guarantee syntax homogenization across the codebase.
   - Implement clear, modular folder structures (e.g., separating Controllers, Routes, and Models in the backend).

## 2.3 Comprehensive Project Scope

The Scope document acts as a contractual boundary for the engineering phase. It explicitly dictates the functional features that *must* be delivered.

### 2.3.1 In-Scope: The Frontend Presentation Layer (React 19)
The client-facing application is strictly limited to the following View-layer modules:
- **Global State Management:** Utilizing React Context (`AuthContext`, `CartContext`) to propagate user authentication status and cart state globally without deep prop-drilling.
- **Routing:** Implementing `react-router-dom` to handle client-side Single Page Application (SPA) routing, intercepting `<a href>` defaults to provide instant UI transitions without HTTP reloads.
- **Dynamic Menu Matrix:** Fetching API data to render a grid of culinary items, complete with filtering logic (by category) and specific item modalities.
- **Floating Cart Architecture:** A persistent, global UI cart component allowing users to mutate item quantities dynamically and view auto-calculating subtotals.
- **Secure Payment Widget:** Integration of the Razorpay native browser widget triggered securely via a backend Order ID.
- **Admin Dashboard Layout:** A protected route hierarchy displaying raw database metrics, menu CRUD forms, and real-time order lifecycle tables.

### 2.3.2 In-Scope: The Backend API Layer (Node.js & Express.js)
The server architecture is scoped to deliver the following RESTful API capabilities:
- **Middleware Pipeline:** Implementation of `cors` for cross-origin resource sharing, `express.json()` for payload parsing, and custom error-handling middleware to intercept uncaught exceptions globally.
- **Auth Controller Pipeline:** 
  - `POST /register`: Payload validation, Bcrypt hashing (10 salt rounds), Mongoose document creation.
  - `POST /login`: Decryption comparison, JWT generation containing the user `_id` and `role`.
- **Menu Controller Pipeline:**
  - `GET /menu`: Unauthenticated route returning an array of all active menu items.
  - `POST /menu`, `PUT /menu`, `DELETE /menu`: Routes strictly protected by an `isAdmin` JWT verification middleware to manipulate the database.
- **Order Controller Pipeline:**
  - Generation of precise mathematical subtotals server-side (never trusting client-side price submissions).
  - Webhook/Signature verification logic to validate the integrity of successful Razorpay transactions.

### 2.3.3 In-Scope: The Database Layer (MongoDB & Mongoose)
The Data Tier is scoped to map exactly three core entities:
1. **Users Collection:** Storing names, emails, encrypted password hashes, and administrative boolean flags.
2. **Menu Collection:** Storing culinary titles, pricing floats, categorization strings, image URLs, and stock boolean flags.
3. **Orders Collection:** Storing transactional history, nested object arrays of purchased items, chronological timestamps, and payment gateway reference strings.

## 2.4 Explicitly Out-of-Scope (Project Exclusions)

To ensure academic delivery timelines are met, certain highly complex enterprise features are explicitly excluded from the CraveBites V1.0 architecture:
1. **Live GPS Logistics Tracking:** The system will *not* integrate WebSocket-based real-time vehicular GPS tracking (e.g., tracking the delivery driver on a live map) due to the prohibitive complexity of native mobile driver applications.
2. **Multi-Tenant Aggregation:** CraveBites is fundamentally a single-restaurant white-label solution. It will *not* serve as a multi-vendor marketplace (like UberEats) where multiple restaurants share a single database namespace.
3. **Machine Learning Recommendation Engines:** The platform will not attempt to cluster user behavior using K-means or generate personalized "Recommended for You" AI algorithms.
4. **Third-Party OAuth:** Registration is strictly handled via native email/password credentials. Google, Facebook, or GitHub OAuth flows are out of scope.
5. **Native Mobile Rendering:** The application is a Responsive Web App. We will not be compiling a React Native `.apk` or `.ipa` for App Store distribution.

## 2.5 Target Demographic and User Personas

The system is explicitly engineered for two distinct archetypes:

- **Persona A: The End-Consumer (Client)**
  - *Demographic:* Primarily millennials and Gen-Z users highly accustomed to digital food aggregator UI patterns.
  - *Technical Literacy:* Expects instantaneous UI feedback, understands digital cart mechanics inherently, and requires low-friction payment gateways.
  - *Goal:* To order food securely, quickly, and cleanly without installing entirely new mobile applications.

- **Persona B: The Restaurant Owner (Administrator)**
  - *Demographic:* Small to medium-sized independent restaurant operators.
  - *Technical Literacy:* Low to Moderate. They likely rely on physical ledgers or basic Excel sheets. They cannot execute raw SQL queries or read complex log files.
  - *Goal:* To update menu prices dynamically, mark items out of stock instantly if inventory drops, and monitor incoming orders in real-time via an intuitive visual GUI.

## 2.6 Key Performance Indicators (KPIs) and Success Metrics

The final evaluation of the CraveBites project will largely depend on achieving the following measurable engineering KPIs:

| KPI Category | Target Metric | Evaluation Method |
| :--- | :--- | :--- |
| **API Response Time** | `< 200ms` for cached / indexed DB reads | Measured via Postman Newman automated testing. |
| **Authentication Integrity** | 100% rejection of malformed tokens | Unit tests attempting to access protected routes with expired JWTs. |
| **Financial Security** | Zero client-side price manipulation | Manual penetration test attempting to rewrite cart total via browser DevTools prior to checkout. |
| **Frontend Layout Shift** | Cumulative Layout Shift (CLS) of `0.0` | Chrome DevTools Lighthouse audit analyzing visual stability during API fetching. |
| **Code Coverage** | N/A (Academic Scope constraint) | Formal TDD unit testing coverage is excluded, but manual integration testing must be functionally flawless. |

## 2.7 Assumptions and System Dependencies

The architecture relies heavily on specific assumptions regarding the operational environment to function correctly:
1. **Always-On Hardware:** We assume the deployment server (e.g., Render/Heroku) guarantees at least 99.5% uptime.
2. **Symmetric Crypto Keys:** We assume the injected environment variables (specifically the `JWT_SECRET` string) remain uncompromised. If exposed, the entire stateless session architecture is invalidated.
3. **External API Stability:** The financial transaction flow relies entirely on the Razorpay REST API returning predictable, schema-compliant JSON structures.
4. **Modern Browser Availability:** The user is assumed to be running an ES6-compliant browser (Chrome V80+, Safari 14+) capable of parsing modern JavaScript modules. The system explicitly drops support for legacy Internet Explorer 11.

## 2.8 Project Deliverables

At the conclusion of the academic cycle, the following digital artifacts and software packages will be delivered to the evaluating committee:
1. **Frontend Source Code:** The complete React 19 codebase, heavily commented, structured hierarchically, and package-ready within a GitHub repository.
2. **Backend Source Code:** The decoupled Node.js/Express.js server architecture, specifically structured to run completely independent of the frontend process.
3. **Database Seed Scripts:** A functional Node script capable of immediately populating an empty MongoDB cluster with valid 'Dummy' menu data to allow instantaneous testing out-of-the-box.
4. **Environment Configuration Blueprint:** A `.env.example` file strictly detailing the required cryptographic keys and connection strings required to boot the application locally.
5. **Project Documentation:** The comprehensive 8-Chapter project thesis (this document), covering all phases of the Software Development Life Cycle.
6. **Live URL Manifest:** A functional demonstration link pointing to the freely hosted production build of the software.

This chapter explicitly bounds the engineering efforts of CraveBites. By rigidly defining the exact technological implementations that are In-Scope, and aggressively eliminating the complex "nice-to-have" features that are Out-of-Scope, the system path is cleared for rapid, focused, and high-quality software engineering execution in subsequent development phases.
