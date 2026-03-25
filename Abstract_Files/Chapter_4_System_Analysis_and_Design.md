# Chapter 4: System Analysis and Design

## 4.1 Introduction to System Analysis
System Analysis is a critical phase in the Software Development Life Cycle (SDLC) where the development team evaluates the existing business problems and strictly defines the precise operational requirements necessary for the proposed solution. In the context of "CraveBites," system analysis involves dissecting the intricate workflows of traditional restaurant ordering—from menu presentation to payment processing—and translating these physical operations into abstract digital logic. This chapter systematically documents the feasibility study, requirement engineering phase, and the comprehensive architectural design blueprints required to actively develop a production-ready application.

## 4.2 Comprehensive Feasibility Study
Before writing a single line of code, a rigorously detailed feasibility study was conducted to ascertain whether "CraveBites" constitutes a viable technical and economic endeavor. A feasibility study evaluates the practical limitations of a proposed project, minimizing risk by ensuring that the architectural goals align perfectly with the allocated resources.

### 4.2.1 Technical Feasibility
Technical feasibility determines if the proposed technology stack is capable of fulfilling the project constraints and if the development team possesses the requisite software engineering expertise. The chosen technology stack—MongoDB, Express.js, React 19, and Node.js (MERN)—is highly feasible for several core engineering reasons:
- **Unified Language Environment:** The entire stack inherently utilizes JavaScript (incorporating ES6+ syntax) for both client-side and server-side logic. This isomorphic approach drastically reduces mental context-switching, streamlining full-stack development.
- **Vast Ecosystem:** The Node Package Manager (npm) provides access to millions of open-source libraries, ensuring that complex integrations (such as cryptographic hashing via `bcrypt` or payments via the `razorpay` SDK) do not need to be engineered from scratch.
- **Scalability:** Node.js's non-blocking I/O architecture combined with MongoDB's distributed structural nature ensures the system can dynamically scale horizontally to handle intense concurrent traffic.

### 4.2.2 Economic Feasibility
Economic feasibility analyzes the cost-benefit ratio of the proposed system. "CraveBites" is highly economically feasible because it fundamentally leverages open-source software primitives.
- **Zero Licensing Costs:** React, Node.js, Express, and Tailwind CSS are all distributed under permissive MIT or similar open-source licenses, requiring zero enterprise licensing fees.
- **Cloud Hosting Efficiency:** The platform is designed to be deployed across serverless architectures or PaaS (Platform as a Service) providers like Render or Vercel, which offer aggressive free tiers and highly optimized payload scaling, keeping operational server costs exceptionally low for small restaurant owners.
- **Return on Investment (ROI):** For the restaurant administrator adopting this system, the ROI is massive due to the deliberate zero-commission model, circumventing the aggressive 15-30% fees typically mandated by standard industry aggregators.

### 4.2.3 Operational Feasibility
Operational feasibility assesses whether the final product will be actively utilized and maintained by the target demographic. The intuitive, dark-mode focused React User Interface ensures a frictionless consumer experience, actively promoting user retention. For the administrator, the bespoke admin dashboard abstracts complex database queries into intuitive visual forms. A restaurant manager does not require foundational SQL knowledge; they simply utilize the React dashboard to execute CRUD operations on the menu, ensuring high operational feasibility.

### 4.2.4 Schedule Feasibility
Schedule feasibility evaluates the probability of delivering the finished software product within the academic final year constraints. By adopting rapid prototyping tools (Vite 8), a modular component-based UI framework (React 19), and a flexible NoSQL schema architecture that avoids expensive and fragile SQL migration files during iterative development loops, the project timeline is highly compressed and fully feasible.

## 4.3 Requirement Gathering and Engineering
Requirements engineering is the systematic process of gathering, defining, and strictly documenting the precise functionalities the software must execute.

### 4.3.1 Hardware and Software Constraints
**Development Environment Requirements:**
- CPU: Intel Core i5 / AMD Ryzen 5 or equivalent higher-tier processor.
- RAM: Minimum 8 GB (16 GB natively recommended for concurrently running Vite, Node, and Docker).
- Storage: 256 GB SSD for aggressive read/write compile times.
- OS: Windows 10/11, macOS, or Linux-based distributions.

**Software Dependencies:**
- Node.js (v20.x or higher LTS).
- MongoDB Community Server (v7.x) or MongoDB Atlas Cloud instance.
- Visual Studio Code IDE with explicit ESLint and Prettier formatting integration.
- Postman or Thunder Client for REST API endpoint simulation and validation.

**End-User Requirements:**
- Any modern web browser (Google Chrome, Mozilla Firefox, Safari, Edge) supporting ES2020 JavaScript specifications.
- Stable broadband or 4G/5G mobile internet connectivity.

### 4.4 Functional Requirements Specification
Functional requirements dictate specific, tangible behaviors the software must explicitly execute based on designated inputs. These are broadly categorized by the user role traversing the application.

#### 4.4.1 Consumer Functional Requirements
1. **Secure Authentication:** The system must permit users to register accounts, verify credentials, and log in securely, issuing a JWT.
2. **Dynamic Menu Navigation:** The platform must display culinary items retrieved organically from the database, populated with high-resolution imagery, pricing grids, and dynamic categorical filtering (e.g., 'Vegan', 'Desserts', 'Beverages').
3. **Advanced Cart Operations:** Users must inherently possess the capability to selectively add distinct items to a digital cart, dynamically modify requested quantities, automatically view real-time subtotal calculations, and entirely clear the cart state.
4. **Order Execution and Tracking:** The platform must seamlessly process payments securely via the Razorpay gateway natively, create a verified Order token in the database, and allow the consumer to visibly track the chronological status (e.g., 'Preparing', 'Out for Delivery') on their personalized dashboard.

#### 4.4.2 Administrator Functional Requirements
1. **Role-Based Access Control (RBAC):** The system must categorically deny regular consumer accounts from natively accessing backend dashboard routes.
2. **Menu Management (CRUD):** The administrator must be able to visually Create entirely new menu abstractions, Read existing configurations, systematically Update prices or out-of-stock statuses dynamically, and exclusively Delete deprecated items from the database logic.
3. **Order Queue Management:** The admin dashboard must implement real-time polling or WebSocket connections to instantaneously display newly placed user orders, allowing the kitchen effectively to begin immediate preparation.
4. **Status Mutability:** The application logic must permit the admin to chronologically advance order states (from 'Received' to 'Delivered'), systematically triggering notifications to the end consumer.

### 4.5 Non-Functional Requirements Specification
Non-functional requirements rigidly define application criteria that are not strictly related to a specific behavioral feature but govern the holistic quality, performance, and security of the broader engineering ecosystem.

1. **High Availability and Reliability:** The Node.js API must implement rigorous `try...catch` blocks and specific global error-handling Node middleware loops. Uncaught exceptions must be correctly isolated natively preventing total server instance termination.
2. **Performance Constraints:** The React Native VDOM rendering engine explicitly dictates that any UI state mutation (such as adding a heavy item to the cart) must visually resolve and update strictly within 100 milliseconds, ensuring fluid haptic feedback. Initial page loads should leverage code-splitting via Vite to maintain load times aggressively under 2.5 seconds.
3. **Scalability Constraints:** The backend must be fundamentally engineered as stateless. All identifying session authentication must explicitly securely reside within uniquely signed JSON Web Tokens. This stateless architecture natively allows the infrastructure to scale horizontally strictly by deploying multiple replicated generic Node instances dynamically behind a Load Balancer (e.g., Nginx).
4. **Security Integrity:** The system must aggressively mitigate OWASP top 10 vulnerabilities. Specific configurations natively include avoiding raw un-escaped SQL queries (nullified by utilizing Mongoose NoSQL object modeling), strictly implementing CORS middleware aggressively defining authorized domains, explicitly salting and hashing database passwords heavily via bcrypt, and automatically rejecting predictably malformed REST API payload requests prior to any database engagement.

## 4.6 System Design Architecture
The broader system architecture explicitly adheres to a traditional Three-Tier architectural pattern natively modified strictly specifically for the modern JavaScript ecosystem.

### 4.6.1 The Presentation Tier (Frontend Client)
The presentation layer is strictly decoupled organically from the server logic securely natively. Relegated exclusively natively functionally to the browser, the React 19 Single Page Application locally independently manages the complex UI routing asynchronously without specifically structurally initiating traditional HTML HTTP reloads natively securely aggressively dynamically. The component structure cleanly isolates distinct logic neatly perfectly logically natively (e.g., `<Navbar />`, `<MenuGrid />`, `<CheckoutModal />`).

### 4.6.2 The Application/Logic Tier (Backend Server)
The logic tier operates utilizing Express.js. This heavily isolated application layer exclusively receives incoming HTTP requests explicitly routed from the client. It systematically authenticates the request (validating the JWT), perfectly matching the provided headers against the middleware verification rules. If validation passes, the specific business logic is executed—such as checking if a requested menu item is in stock, pushing the order to the database, or rejecting the payload due to insufficient privileges.

### 4.6.3 The Data Tier (MongoDB Database)
The Data Tier is the persistent, stateful foundation of the application. The system leverages an asynchronous, event-driven connection via explicitly mapped Mongoose schemas. MongoDB stores the specific configurations, user data arrays, and encoded order logs optimally within distinct BSON documents categorized logically into heavily defined independent database Collections. 

## 4.7 UML Dynamic Modeling Strategy
To efficiently convey the precise system architectures and behavioral interactions accurately, Unified Modeling Language (UML) logic is implemented systematically.

### 4.7.1 Use Case System Modeling
A Use Case diagram establishes the distinct interactions occurring precisely between external actors and the application components.
- **Consumer Actor Context:** Interact with boundaries: "Browse Menu Matrix", "Mutate Cart Elements", "Initiate User Checkout", "Execute Razorpay Payment", and "Query Order History".
- **Admin Actor Context:** Interact with higher-privileged module boundaries: "Mutate Database Menu Entity (CRUD)", "Analyze Advanced Sales Analytics", "Mutate Remote Order Lifecycle Status".

### 4.7.2 Sequence Architectural Diagram (Payment Flow)
Sequence diagrams deeply evaluate the chronological flow of operations dynamically passing between logical entities.
1. `Client -> React App`: Triggers 'Place Order'.
2. `React App -> Node.js API`: Transmits Cart data array payload and JWT.
3. `Node.js API -> MongoDB`: Verifies specific item existence and stock quantity accurately globally.
4. `Node.js API -> Razorpay Node SDK`: Requests temporary dynamic Order ID.
5. `Node.js API -> React App`: Forwards Order ID.
6. `React App -> Razorpay Cloud`: Opens native widget requesting card input.
7. `Razorpay Cloud -> React App`: Returns payment payload.
8. `React App -> Node.js API`: Submits cryptographic payment payload.
9. `Node.js API -> Backend Verification`: Hashes payload securely natively logically to strictly confirm transaction legitimacy.
10. `Node.js API -> MongoDB`: Inserts Paid Order into the database.
11. `Node.js API -> React App`: Emits 200 HTTP Success.

## 4.8 Core MongoDB Database Schemas and JSON Payloads
To fully understand the data tier, one must analyze the raw mathematical structures enforced by the Mongoose Object Data Modeling logic.

### 4.8.1 `User` Document Schema Analysis
The User schema is critical for Identity and Access Management (IAM).
```json
{
  "_id": "ObjectId('65a12b...')",
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "$2a$12$eImiTXuWVxfM37uY4JANjQ...",
  "role": "user",
  "createdAt": "2024-01-12T08:30:00.000Z",
  "updatedAt": "2024-01-12T08:30:00.000Z"
}
```
**Constraints:**
- The `email` field enforces a strict regular expression validation to prevent malformed strings.
- The `password` field is intercepted by a `pre('save')` Mongoose middleware hook which applies `bcrypt.hash()` with 10 salt rounds automatically.

### 4.8.2 `Order` Document Schema Analysis
The Order schema integrates deeply with Razorpay responses.
```json
{
  "_id": "ObjectId('99f12b...')",
  "userId": "ObjectId('65a12b...')",
  "items": [
    {
      "menuItemId": "ObjectId('77g12b...')",
      "quantity": 2,
      "priceAtPurchase": 14.99
    }
  ],
  "totalAmount": 29.98,
  "status": "Preparing",
  "paymentDetails": {
    "razorpayOrderId": "order_Fdf8...",
    "razorpayPaymentId": "pay_Dff9...",
    "razorpaySignature": "8f9a7b6c5d..."
  },
  "isPaid": true
}
```
**Data Relations:** The `userId` and `menuItemId` arrays serve as weak relational links (typical of NoSQL implementations) allowing the frontend to quickly populate (via Mongoose `.populate()`) the user's name and the specific images of the menu items without storing redundant image URLs directly inside the order document.

### 4.8.3 Database Table Structure (Data Dictionary)
To align with standard Entity Relationship Diagrams (ERD) and Data Flow Diagrams (DFD), the NoSQL collections are mapped into traditional structural definitions below.

**Database Name:** `CraveBites_DB`

**1. Table Name : Users Structure**
**Description :** Stores authentication credentials, personally identifiable information, and Role-Based Access Control (RBAC) levels for all system actors.

| Sr. No. | Column Name | Data Type | Size/Format | Constraints | Comment |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `_id` | ObjectId | 24 hex characters | Primary Key (PK) | Auto-generated unique identifier by MongoDB |
| 2 | `name` | String | Max 50 characters | NOT NULL | The user's full display name |
| 3 | `email` | String | Max 100 characters | UNIQUE, NOT NULL | Used as the primary login credential |
| 4 | `password` | String | 60 characters | NOT NULL | Stores the Bcrypt 10-round encrypted hash |
| 5 | `role` | Enum(String) | 5 characters | DEFAULT 'user' | Determines 'user' vs 'admin' panel access |
| 6 | `createdAt` | DateTime | ISODate | NOT NULL | Automatic timestamp of registration |

**2. Table Name : MenuItems Structure**
**Description :** Serves as the digital catalog, holding all pricing, metadata, and visual reference strings for the restaurant's offerings.

| Sr. No. | Column Name | Data Type | Size/Format | Constraints | Comment |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `_id` | ObjectId | 24 hex characters | Primary Key (PK) | Auto-generated unique identifier |
| 2 | `title` | String | Max 100 characters | NOT NULL | Name of the food item |
| 3 | `description` | String | Max 500 characters | NOT NULL | Detailed description of ingredients |
| 4 | `price` | Float (Number)| 8 bytes | NOT NULL, MIN > 0 | Decimal pricing value format |
| 5 | `category` | String | Max 50 characters | NOT NULL, INDEX | Used for rapid UI filtering |
| 6 | `imageURL` | String | URL Format | NOT NULL | Cloud hosting link (e.g., Cloudinary) |
| 7 | `isAvailable` | Boolean | 1 bit | DEFAULT TRUE | Allows admin to hide out-of-stock items |

**3. Table Name : Orders Structure**
**Description :** The core transactional table recording financial history, checkout items, and live preparation status.

| Sr. No. | Column Name | Data Type | Size/Format | Constraints | Comment |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `_id` | ObjectId | 24 hex characters | Primary Key (PK) | Auto-generated unique identifier |
| 2 | `userId` | ObjectId | 24 hex characters | Foreign Key (FK) | Maps to the `Users` table |
| 3 | `items` | Array[Object]| Variable | NOT NULL | Nested array holding `menuItemId` & `quantity`|
| 4 | `totalAmount` | Float (Number)| 8 bytes | NOT NULL | Mathematically verified cart total |
| 5 | `status` | Enum(String) | Max 20 characters | DEFAULT 'Preparing'| Options: Received, Preparing, Delivered |
| 6 | `razorpayOrderId`| String | Max 50 characters | UNIQUE | The generated bank gateway ID |
| 7 | `isPaid` | Boolean | 1 bit | DEFAULT FALSE | Mutates to TRUE upon signature validation |
| 8 | `createdAt` | DateTime | ISODate | NOT NULL | Exact chronological timestamp of payment |

## 4.9 REST API Endpoint Dictionary
A core deliverable of the System Design phase is the strict formulation of the API dictionary. The following table highlights the critical routing architecture designed for the CraveBites Node.js server.

| HTTP Method | API Endpoint Route | Authorization | Payload Requirement | System Function |
|-------------|--------------------|---------------|-----------------------|-----------------|
| POST | `/api/v1/auth/register` | Public | `{name, email, password}` | Initiates the bcrypt hashing algorithm and generates a new User Document. |
| POST | `/api/v1/auth/login` | Public | `{email, password}` | Compares candidate password against DB hash. Returns signed JWT payload. |
| GET | `/api/v1/menu/` | Public | None | Queries MongoDB for all active menu items. Supports ?category= query params. |
| POST | `/api/v1/menu/` | Admin JWT | `{title, price, category, imageURL}` | Inserts a new menu item. Rejects if user role is not 'admin'. |
| PUT | `/api/v1/menu/:id` | Admin JWT | `{price, isAvailable}` | Updates an existing menu item dynamically. |
| POST | `/api/v1/orders/create` | User JWT | `[{itemId, qty}]` | Ingress for shopping cart data. Generates Razorpay pending ID. |
| POST | `/api/v1/orders/verify` | User JWT | `{razorpay_signature...}` | Cryptographically validates payment success and updates order to 'Paid'. |
| PATCH | `/api/v1/admin/orders/:id` | Admin JWT | `{status}` | Advances the chronological lifecycle status ('Received' -> 'Delivered'). |

## 4.10 State Management Architecture (React Context)
System analysis at the frontend layer requires mapping the data flow. React Context is explicitly utilized to prevent deep prop-drilling scenarios.

1. **`AuthContext`:** Wraps the entire application. Stores the `{ user, token }` payload returned by the login API. It provides custom hooks `useAuth()` to dynamically render standard navigation links or protected admin links.
2. **`CartContext`:** Wraps the core module. Maintains an array of object literals representing the current cart. It provides memoized functions utilizing `useReducer` to safely `ADD_TO_CART`, `REMOVE_FROM_CART`, and `CALCULATE_TOTAL`.

## 4.11 UI Wireframing and Aesthetic Design System
The visual design system analysis concluded that utilizing an atomic utility framework (Tailwind CSS) significantly improves rendering predictability. The overarching design language mimics premium modern corporate web applications, prioritizing the following parameters:
- **Color Palette:** Dominated by a deep obsidian background (`#0F172A`) to reduce screen glare, accented strictly by a vibrant primary brand color (e.g., Emerald `#10B981`) exactly highlighting critical Call-to-Action (CTA) buttons like "Checkout".
- **Typography:** Implementation of the highly legible sans-serif `Inter` font stack specifically to maintain numerical clarity on pricing components.
- **Glassmorphism:** Navigation bars and floating cart modals utilize CSS `backdrop-filter: blur(12px)` tightly coupled with a translucent `rgba(255, 255, 255, 0.1)` background to provide profound Z-index visual hierarchy natively.

This completes the exhaustive System Analysis and Design chapter.
