# Chapter 8: Project Plan and Execution Strategy

## 8.1 Introduction to Software Project Management
The successful delivery of the "CraveBites" application within the strictly constrained timelines of an academic final year requires rigorous adherence to professional software project management methodologies. Simply writing code in an ad-hoc manner inevitably results in architectural fragmentation, massive technical debt, and ultimately, project failure.

This chapter explicitly outlines the strategic management framework utilized to execute the MERN stack development. It specifically details the adoption of the Agile Scrum framework, structurally breaking down the entire Software Development Life Cycle (SDLC) into iterative, mathematically measurable two-week Sprints, alongside a comprehensive Risk Management contingency matrix.

## 8.2 The Agile Scrum Methodology
Traditional "Waterfall" project management—where each phase (Design, Code, Test) must completely finish before the next begins—is notoriously brittle when software requirements iteratively change. Consequently, CraveBites was executed utilizing the Agile Scrum methodology.
- **Iterative Delivery:** The project is explicitly divided into discrete time-boxes called "Sprints." At the conclusion of each Sprint, a functional, compilable piece of the software (an increment) must be delivered.
- **Fail-Fast Paradigm:** By testing the React UI components identically alongside the backend Express endpoints during the same Sprint, integration bugs are inherently discovered immediately, preventing cascading architectural failures late in the development cycle.
- **Tracking:** Project velocity is mathematically tracked utilizing a Kanban visual board (e.g., Jira, Trello, or GitHub Projects), shifting task tickets logically from `To-Do` -> `In-Progress` -> `Code Review` -> `Done`.

## 8.3 Comprehensive Sprint Breakdown
The total project duration was explicitly allocated across six distinct Sprints, assuming a standard mathematical velocity.

### 8.3.1 Sprint 1: Requirements Engineering & Environment Initialization
**Duration:** 2 Weeks
**Objective:** Establish the foundational blueprint and physical repository workspace.
- **Deliverable 1.1:** Finalize the official Software Requirement Specification (SRS) document, strictly defining the In-Scope and Out-of-Scope boundaries (as detailed in Chapter 2).
- **Deliverable 1.2:** Initialize the Git version control repository.
- **Deliverable 1.3:** Bootstrap the Node.js backend environment implicitly installing `express`, `mongoose`, and `dotenv`.
- **Deliverable 1.4:** Bootstrap the automated React 19 frontend utilizing explicitly Vite and install Tailwind CSS.
- **Milestone:** Both the Frontend `localhost:5173` and Backend `localhost:5000` boot cleanly without runtime compilation errors.

### 8.3.2 Sprint 2: Database Modeling & Identity Access Management (IAM)
**Duration:** 2 Weeks
**Objective:** Architect the persistent data tier and secure user authentication.
- **Deliverable 2.1:** Code the explicit Mongoose Schemas for `User`, `MenuItem`, and `Order` utilizing specific BSON data types natively.
- **Deliverable 2.2:** Engineer the `POST /api/auth/register` controller explicitly integrating `bcryptjs` to dynamically salt and hash incoming passwords natively.
- **Deliverable 2.3:** Engineer the `POST /api/auth/login` controller precisely executing `jwt.sign()` to issue stateless cryptographic session tokens.
- **Milestone:** A user can successfully register and receive a verified JWT strictly utilizing Postman without the React frontend.

### 8.3.3 Sprint 3: REST API Construction & Middleware Security
**Duration:** 2 Weeks
**Objective:** Build the core CRUD (Create, Read, Update, Delete) transactional pathways.
- **Deliverable 3.1:** Write the highly specific global `verifyToken` and `isAdmin` Express middleware cleanly intercepting unauthorized HTTP requests.
- **Deliverable 3.2:** Construct the `/api/menu` endpoints perfectly allowing the Admin JWT to exclusively mutate database items natively.
- **Deliverable 3.3:** Construct the `/api/orders` ingress pipeline explicitly validating array data payloads gracefully.
- **Milestone:** 100% of the backend business logic is mathematically testable via automated Thunder Client REST collections.

### 8.3.4 Sprint 4: React UI Architecture & Context Matrix
**Duration:** 3 Weeks (Extended Sprint for UI Complexity)
**Objective:** Translate the backend logic explicitly into the visual browser layer cleanly.
- **Deliverable 4.1:** Engineer the React `AuthContext` logically wrapping the DOM to specifically persist the JWT intelligently securely across browser reloads organically.
- **Deliverable 4.2:** Engineer the `CartContext` utilizing the `useReducer` hook, mutating item quantities safely and optimizing the recalculation of the cart subtotal intelligently.
- **Deliverable 4.3:** Build the dynamic UI components logically mapping the MongoDB menu payload into distinct Tailwind CSS visual cards.

### 8.3.5 Sprint 5: Razorpay Gateway & Financial Cryptography
**Duration:** 2 Weeks
**Objective:** Bridge the physical financial transaction into the digital application.
- **Deliverable 5.1:** Integrate the Razorpay Node SDK logically requesting dynamic `order_id` strings perfectly.
- **Deliverable 5.2:** Mount the Razorpay UI JavaScript widget actively into the React Application flawlessly capturing successful card payloads.
- **Deliverable 5.3:** Engineer the server-side `crypto.createHmac()` algorithm specifically explicitly securely calculating signature legitimacy.

### 8.3.6 Sprint 6: Quality Assurance (QA) & Deployment Execution
**Duration:** 2 Weeks
**Objective:** Rigorously test the application and deploy it to live production servers.
- **Deliverable 6.1:** Execute the comprehensive User Acceptance Testing (UAT) matrix exactly verifying all test cases explicitly detailed natively in Chapter 6 safely.
- **Deliverable 6.2:** Configure Environment Variables natively within the production PAAS provider seamlessly.
- **Deliverable 6.3:** Execute Vite build operations creating the minified production dist logically efficiently safely.

## 8.4 Risk Management Strategy
To ensure the project successfully reaches the Sprint 6 Deployment milestone gracefully, rigorous testing pipelines and version control branching strategies are strictly implemented. Continuous Integration (CI) prevents merge conflicts, while automated postman tests defend the main branch from systemic regressions.

*(Final Note)*
The execution of the CraveBites project plan accurately validates the profound efficacy of modern JavaScript frameworks when meticulously managed through professional Agile development protocols.
