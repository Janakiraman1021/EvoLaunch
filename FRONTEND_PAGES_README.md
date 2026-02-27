# EvoLaunch Frontend - Complete Pages Documentation

## Table of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Frontend Architecture](#frontend-architecture)
4. [Complete Page Routes & Contents](#complete-page-routes--contents)
5. [Component Architecture](#component-architecture)
6. [API Integration](#api-integration)
7. [Page-by-Page Detailed Guide](#page-by-page-detailed-guide)
8. [Dynamic Routes & Parameters](#dynamic-routes--parameters)
9. [State Management](#state-management)
10. [Styling & Design System](#styling--design-system)

---

## Overview

The EvoLaunch Protocol frontend is a comprehensive Next.js 14 application built with TypeScript and Tailwind CSS. It provides a complete user interface for interacting with the token launch protocol, including contract management, agent monitoring, governance controls, and detailed analytics.

**Key Technologies:**
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Web3**: ethers.js v6.9
- **State Management**: React Hooks
- **Visualization**: Recharts for data charts

**Development Environment:**
- **Node Version**: 18+
- **Package Manager**: npm or yarn
- **Port**: localhost:3000 (default)

---

## Project Structure

```
frontend/
├── app/                                    # Next.js app directory (routes)
│   ├── globals.css                        # Global styles
│   ├── layout.tsx                         # Root layout with sidebar
│   ├── loading.tsx                        # Loading skeleton
│   ├── page.tsx                           # Home/Dashboard
│   │
│   ├── landing/                           # Landing page
│   │   └── page.tsx                       # Protocol overview
│   │
│   ├── launch/                            # Token launch creation
│   │   └── page.tsx                       # Launch form
│   │
│   ├── explore/                           # Token discovery
│   │   └── page.tsx                       # Explorer/catalog
│   │
│   ├── project/                           # Project dashboard
│   │   └── [address]/                     # Dynamic route by token address
│   │       └── page.tsx                   # Project detail page (6 tabs)
│   │
│   ├── governance/                        # DAO governance
│   │   └── [address]/                     # Dynamic route by token address
│   │       └── page.tsx                   # Governance controls
│   │
│   ├── reputation/                        # Wallet reputation scoring
│   │   └── page.tsx                       # Reputation system page
│   │
│   ├── analytics/                         # Advanced analytics
│   │   └── [address]/                     # Dynamic route by token address
│   │       └── page.tsx                   # Analytics dashboard
│   │
│   ├── agents/                            # AI Agent control panel
│   │   └── page.tsx                       # Agent monitoring
│   │
│   ├── agent/                             # Agent details
│   │   ├── deployed/                      # Deployed agents
│   │   ├── logs/                          # Agent execution logs
│   │   ├── registry/                      # Agent registry
│   │   └── [id]/                          # Individual agent details
│   │
│   ├── profile/                           # User profile
│   │   └── page.tsx                       # Profile dashboard
│   │
│   ├── docs/                              # Documentation
│   │   └── page.tsx                       # Help & guides
│   │
│   └── system/                            # System status
│       └── page.tsx                       # Health monitoring
│
├── components/                            # Reusable components
│   ├── Navigation.tsx                     # Global navigation
│   ├── Sidebar.tsx                        # Side navigation menu
│   ├── Header.tsx                         # Page headers
│   ├── MSSChart.tsx                       # Market Stability Score chart
│   ├── PhaseTimeline.tsx                  # Phase progression display
│   ├── AgentLogs.tsx                      # Agent activity logs
│   ├── AgentPerformanceChart.tsx          # Agent metrics visualization
│   ├── AIAgentCard.tsx                    # Individual agent card
│   ├── AgentLaunchForm.tsx                # Agent launch form
│   ├── LaunchForm.tsx                     # Token launch form
│   ├── GovernancePanel.tsx                # Governance voting panel
│   ├── Skeleton.tsx                       # Loading skeleton
│   └── SparklingParticles.tsx             # Animated background
│
├── lib/                                   # Utilities & hooks
│   ├── api.ts                             # Centralized API client
│   ├── utils.ts                           # Helper functions
│   ├── contracts/
│   │   └── index.ts                       # ABI definitions & addresses
│   └── hooks/
│       ├── useWeb3.ts                     # Web3 wallet connection
│       └── useContracts.ts                # Contract interaction
│
├── styles/
│   └── globals.css                        # Tailwind config & custom styles
│
├── tsconfig.json                          # TypeScript configuration
├── next.config.js                         # Next.js configuration
├── tailwind.config.js                     # Tailwind CSS configuration
├── postcss.config.js                      # PostCSS configuration
└── package.json                           # Dependencies
```

---

## Frontend Architecture

### Technology Stack

**Core Framework:**
- Next.js 14 with App Router (file-based routing)
- React 18+ with TypeScript
- Server & Client components (hybrid approach)

**Styling:**
- Tailwind CSS v3
- Custom color theme (forest/sage/gold palette)
- CSS animations & transitions

**Blockchain Integration:**
- ethers.js v6.9 for contract interaction
- MetaMask wallet connection
- Real-time contract state reading

**Data Visualization:**
- Recharts for complex charts
- Lucide-react for icons
- Custom D3-based components

**State Management:**
- React Context API (Web3Provider)
- useState/useEffect hooks
- Custom hooks for contract interaction

### Page Types

1. **Static Pages**: Home, Landing, Explore, Reputation, Agents, Docs, System
2. **Dynamic Pages**: Project (by address), Governance (by address), Analytics (by address)
3. **Forms**: Launch form, Agent creation form
4. **Dashboards**: Home dashboard, Project dashboard, Governance dashboard

### Navigation Flow

```
localhost:3000/
├── / (Home/Dashboard)
├── /landing (Protocol overview)
├── /launch (Create token)
├── /explore (Browse tokens)
├── /project/[address] (View token details)
├── /governance/[address] (DAO controls)
├── /reputation (Scoring system)
├── /analytics/[address] (Analytics)
├── /agents (Agent control)
├── /agent/[id] (Individual agent)
├── /profile (User profile)
├── /docs (Documentation)
└── /system (Health status)
```

---

## Complete Page Routes & Contents

### 1. HOME/DASHBOARD
**Route**: `localhost:3000/`
**File**: `frontend/app/page.tsx`
**Type**: Client Component

#### Purpose
Central dashboard showing real-time protocol overview and key metrics

#### Key Contents
- **Header Section**
  - Welcome message
  - Current protocol status
  - Quick stats cards

- **Market Stability Score (MSS) Section**
  - Current MSS value (0-100)
  - Visual gauge/progress bar
  - Trend indicator (up/down)
  - Historical chart using Recharts
  - Color-coded status (red/yellow/green)

- **Phase Evolution Display**
  - Current phase indicator
  - Phase timeline (Protective → Growth → Expansion → Governance)
  - Time in current phase
  - Next phase threshold
  - Progress bars for phase transitions

- **Token Statistics**
  - Price in BNB
  - Market cap
  - Total liquidity
  - Holder count
  - Trading volume 24h
  - ATH/ATL prices

- **Tax Information**
  - Current sell tax percentage
  - Current buy tax percentage
  - Tax bracket visualization
  - Historical tax changes

- **Agent Activity Feed**
  - Recent agent updates
  - Agent names and actions
  - Timestamps
  - Status indicators (success/failed)

- **Quick Actions**
  - Launch new token (button)
  - View agents (button)
  - Governance panel (button)
  - Explorer (button)

#### Components Used
- `MSSChart` (Recharts visualization)
- `PhaseTimeline` (Custom phase display)
- `AgentLogs` (Activity feed)
- `useContracts` hook (on-chain data)

#### Data Sources
- Smart contract state (via ethers.js)
- Backend API (`/api/launches/current`)
- Agent logs from database

#### Interactions
- Real-time contract data refresh (5-second intervals)
- Navigate to project dashboards
- Access governance controls
- Launch new tokens

---

### 2. LANDING PAGE
**Route**: `localhost:3000/landing`
**File**: `frontend/app/landing/page.tsx`
**Type**: Client Component

#### Purpose
Educational page explaining the EvoLaunch Protocol to new users

#### Key Contents
- **Hero Section**
  - Protocol name: "EvoLaunch Protocol"
  - Tagline: "AI-Powered Adaptive Token Launch Platform"
  - Subtitle explaining key innovation
  - Primary CTA: "Launch Your Token"
  - Secondary CTA: "Explore Tokens"

- **Key Features Section**
  - Adaptive Tokenomics (with icon)
  - Phase-Based Evolution (with icon)
  - Progressive Liquidity Unlocks (with icon)
  - Agent-Driven Updates (with icon)
  - Emergency Controls (with icon)
  - Real-Time Monitoring (with icon)
  Each feature includes:
    - Icon
    - Title
    - Description (2-3 sentences)
    - Benefits bullet points

- **How It Works Section**
  - Step 1: Create Launch (Deploy contracts)
  - Step 2: Monitor MSS (Track market stability)
  - Step 3: Agent Updates (Autonomous adjustments)
  - Step 4: Governance (Emergency controls)
  - Step 5: Success (Organic growth)
  Each step with illustrations/icons

- **Technology Stack Section**
  - Smart Contracts (Solidity)
  - Frontend (Next.js)
  - Blockchain (BSC)
  - AI Integration (Groq API)
  - Database (MongoDB)

- **Protocol Architecture Diagram**
  - Visual representation of system components
  - Data flow arrows
  - Contract interactions

- **Agent Intelligence Section**
  - Market Intelligence Agent (description)
  - Phase Evolution Agent (description)
  - Liquidity Orchestrator Agent (description)
  - Reputation Agent (description)

- **Security & Governance**
  - Audit information
  - Emergency pause functionality
  - Multi-sig governance
  - Rate limiting

- **Call to Action**
  - "Ready to Launch?" section
  - "Connect Wallet" prominent button
  - FAQ accordion
  - Contact/support links

#### Components Used
- Custom hero component
- Feature cards
- Process timeline
- Technology badges
- Icon library (Lucide)

#### Interactions
- Smooth scroll navigation
- Document navigation links
- Connect wallet button
- Launch token button

---

### 3. LAUNCH PAGE (Token Creation)
**Route**: `localhost:3000/launch`
**File**: `frontend/app/launch/page.tsx`
**Type**: Client Component

#### Purpose
Form interface for launching new tokens on EvoLaunch Protocol

#### Key Contents
- **Form Header**
  - Title: "Launch Your Token"
  - Description: "Configure tokenomics and deploy infrastructure"
  - Wallet connection status
  - Network indicator (BSC Testnet)

- **Section 1: Basic Information**
  - Token Name (text input, required)
  - Token Symbol (text input, 3-6 chars, required)
  - Total Supply (number input, required)
  - Fee Collector Address (address input, required)
  - Help text and icon tooltips

- **Section 2: Liquidity Configuration**
  - Initial Liquidity Amount (BNB, required)
  - Liquidity Lock Duration (days, required)
  - Lock Percentage (slider, 0-100%)
  - Tranche Configuration (unlock schedule)
  - Visual unlock timeline

- **Section 3: Tax Configuration**
  - Initial Buy Tax (slider, 0-25%)
  - Initial Sell Tax (slider, 0-25%)
  - Minimum Tax (slider, 0-10%)
  - Maximum Tax (slider, 10-25%)
  - Live tax visualization
  - Tax bounds validation

- **Section 4: Transaction Limits**
  - Initial Max Transaction (percentage of supply)
  - Initial Max Wallet (percentage of supply)
  - Minimum Max TX (absolute value)
  - Minimum Max Wallet (absolute value)
  - Limit visualization

- **Section 5: Phase Thresholds**
  - Growth Phase MSS Threshold (slider, 30-70)
  - Expansion Phase MSS Threshold (slider, 50-80)
  - Governance Phase MSS Threshold (slider, 70-90)
  - Phase descriptions
  - Timeline visualization

- **Advanced Options (Collapsible)**
  - Custom fee structure
  - Agent configuration
  - Governance settings
  - Emergency pause settings

- **Summary Panel**
  - Total configuration overview
  - Estimated gas costs
  - Transaction preview
  - Network warning (testnet only)

- **Action Buttons**
  - "Validate Configuration" (checks params)
  - "Estimate Gas" (simulates transaction)
  - "Launch Token" (primary, submits)
  - "Cancel" (secondary)

- **Status Display**
  - Loading spinner during submission
  - Transaction hash when pending
  - Success message with contract addresses
  - Error messages with retry option

#### Form Validation
- Required field validation
- Numerical range validation
- Address format validation
- Cross-field validation (min < max)
- Wallet connection check
- Network check (BSC Testnet only)

#### Data Flow
1. User fills form
2. Client validates inputs
3. User clicks "Launch Token"
4. Contract call via ethers.js
5. Transaction submitted
6. Gas estimation
7. User signs with MetaMask
8. Backend listens for contract events
9. Success message with addresses

#### Components Used
- Form inputs (text, number, slider)
- Tooltips and help text
- Error messages
- Loading states
- Summary panel

#### API Calls
- `POST /api/launches/create` (backend validation)
- Contract ABI from `lib/contracts/index.ts`
- Gas estimation (ethers.js staticCall)

---

### 4. EXPLORER PAGE
**Route**: `localhost:3000/explore`
**File**: `frontend/app/explore/page.tsx`
**Type**: Client Component

#### Purpose
Browse, search, and filter active token launches

#### Key Contents
- **Page Header**
  - Title: "Ecosystem Explorer"
  - Subtitle: "Discover institutional-grade token mandates"
  - Total count of active launches

- **Search & Filter Section**
  - Search bar (searchQuery state)
    - Placeholder: "Search tokens, symbols, or creators..."
    - Real-time filtering
  - Filter buttons
    - By Phase (Protective, Growth, Expansion, Governance)
    - By Status (Active, Paused, Completed)
    - By Risk (Low, Medium, High)
    - By MSS range (high score vs low score)
  - Sort options
    - By newest
    - By MSS score
    - By liquidity
    - By holders

- **Launch Cards Grid**
  - Responsive grid (1 col mobile, 2-3 cols desktop)
  - Each card displays:
    - Token name and symbol
    - Current phase badge (color-coded)
    - MSS score bar (visual gauge)
    - Launch date
    - Current price
    - Market cap
    - 24h volume
    - Holder count
    - Status badge (active/paused)
    - Risk indicator
    - Creator address (shortened)

- **Card Actions**
  - "View Project" button (navigate to /project/[address])
  - "View Governance" button (navigate to /governance/[address])
  - "View Analytics" button (navigate to /analytics/[address])

- **Pagination**
  - Show 12-24 items per page
  - Previous/Next buttons
  - Page indicator
  - Jump to page input

- **No Results State**
  - Message when no tokens match filters
  - Suggestion to clear filters
  - Link back to home

- **Sidebar Statistics**
  - Total launches
  - Active launches
  - Paused launches
  - Average MSS
  - Total value locked

#### Components Used
- Filter panel
- Search input
- Launch card component
- Pagination controls
- Status badges
- Icons and charts

#### Data Sources
- `GET /api/launches` (backend API)
- Backend MongoDB collection
- Real-time filtering on frontend

#### Interactions
- Type in search box
- Click filter buttons
- Sort by different criteria
- Click card to view details
- Pagination navigation

---

### 5. PROJECT DASHBOARD
**Route**: `localhost:3000/project/[address]`
**File**: `frontend/app/project/[address]/page.tsx`
**Type**: Client Component (Dynamic)

#### Purpose
Detailed view of a single token project with 6 monitoring tabs

#### Key Contents
- **Header Section**
  - Token name and symbol
  - Contract address (copied on click)
  - Current phase badge
  - Status indicator
  - Last updated timestamp
  - Back button

- **Quick Stats Row**
  - Price (in BNB)
  - Market cap
  - Total liquidity
  - Holder count
  - 24h volume change
  - MSS score

- **Tab Navigation** (6 tabs)
  1. **Overview Tab**
     - Token information (name, symbol, supply)
     - Contract addresses (token, vault, controller)
     - Creator address
     - Launch date
     - Phase history (all transitions)
     - Emergency freeze status
     - Treasury balance

  2. **MSS Graph Tab**
     - Large Recharts line chart
     - X-axis: Time (last 7 days)
     - Y-axis: MSS value (0-100)
     - Color gradient (red/yellow/green)
     - Hover tooltips with exact values
     - Trend analysis (up/down/stable)
     - Phase indicator lines on chart
     - Download chart data button

  3. **Liquidity Tab**
     - Total locked liquidity
     - Total released liquidity
     - Remaining locked
     - Unlock schedule table
     - Columns: Tranche #, Amount, Threshold MSS, Status
     - Visual progress bars for each tranche
     - Frozen status indicator
     - Freeze/Unfreeze button (governance only)

  4. **Parameters Tab**
     - Current sell tax
     - Current buy tax
     - Max transaction (%)
     - Max wallet (%)
     - Incentive multiplier
     - Tax bounds (min/max)
     - Parameter history table
     - Agent who last updated
     - Timestamp of update

  5. **Agents Tab**
     - Active agents list
     - Agent name
     - Agent address (public key)
     - Last update time
     - Update count
     - Verification status (verified/unverified)
     - Recent actions table
     - Action timestamp
     - Result (success/failed)

  6. **Transactions Tab**
     - Recent transactions table
     - Type (buy/sell/transfer)
     - Amount
     - User address (shortened)
     - Timestamp (formatted)
     - Block number
     - Link to block explorer (external)
     - Filter by transaction type
     - Pagination (20 per page)

- **Lock/Freeze Controls**
  - Only visible to governance (controller)
  - Freeze adaptive logic button
  - Pause trading button
  - Emergency revoke agent
  - Confirm dialogs with warnings

#### Components Used
- Tabs interface
- Recharts line chart (MSS)
- Progress bars
- Status badges
- Tables with pagination
- Action buttons
- Modal dialogs

#### Data Sources
- Smart contract via ethers.js
- Backend API (`/api/launches/{address}`)
- Event logs from blockchain
- Agent update history

#### Interactions
- Click tabs to switch views
- Hover chart for details
- Click addresses to copy
- External links to BlockScan
- Responsive on mobile

---

### 6. GOVERNANCE PAGE
**Route**: `localhost:3000/governance/[address]`
**File**: `frontend/app/governance/[address]/page.tsx`
**Type**: Client Component (Dynamic)

#### Purpose
DAO governance controls for token emergency management

#### Key Contents
- **Page Header**
  - Token name and symbol
  - Current governance status
  - Total votes held by wallet

- **Governance Stats**
  - Active proposals count
  - Voting power (your stake %)
  - Quorum percentage
  - Timelock status

- **Active Proposals Section**
  - List of active governance proposals
  - Each proposal card shows:
    - Title (e.g., "Freeze Adaptive Logic")
    - Description (2-3 sentences)
    - Proposal type (freeze, agent-rotation, threshold)
    - Proposer address
    - Status badge (active, passed, failed)
    - Votes for (count and %)
    - Votes against (count and %)
    - Time remaining
    - Execution status

  - Proposal Types Explained:
    - **Freeze**: Emergency pause all parameter updates
    - **Agent Rotation**: Change authorized agent address
    - **Threshold Update**: Adjust phase transition thresholds
    - **Tax Bounds**: Change tax limits
    - **Emergency Pause**: Pause all trading

- **Voting Interface** (for active proposals)
  - "Vote For" button
  - "Vote Against" button
  - Vote weight calculator
  - Voting power explanation
  - Voting eligibility check
  - Confirmation modal before voting

- **Emergency Controls Section** (governance only)
  - "Freeze Adaptive Logic" button
    - Stops all agent parameter updates
    - Confirmation warning
    - Shows impact (trading continues with current params)
  
  - "Pause Trading" button
    - Stops all buy/sell transactions
    - Confirmation warning
    - Shows impact (transfers may still work)

  - "Emergency Revoke Agent" button
    - Remove agent authorization
    - Select agent from dropdown
    - Confirmation warning
    - Impact explanation

- **Proposal History**
  - Past proposals table
  - Columns: Title, Status, Votes For, Votes Against, Block, Time
  - Filter by status (passed, failed, executed)
  - Pagination

- **Governance Parameters**
  - Voting delay (blocks)
  - Voting period (blocks)
  - Proposal threshold
  - Quorum votes needed
  - Edit parameters button (admin only)

#### Components Used
- Proposal cards
- Vote buttons
- Vote power display
- Confirmation modals
- Status badges
- Emergency warning banners

#### Data Sources
- Smart contract (GovernanceModule.sol)
- Backend API (`/api/governance/{address}`)
- Wallet voting power from contract
- Proposal event logs

#### Interactions
- Click "Vote For/Against"
- Confirm voting transaction
- Emergency button actions
- Filter proposal history
- Read proposal details

---

### 7. REPUTATION PAGE
**Route**: `localhost:3000/reputation`
**File**: `frontend/app/reputation/page.tsx`
**Type**: Client Component

#### Purpose
Display and explain wallet reputation scoring system

#### Key Contents
- **Page Header**
  - Title: "Reputation System"
  - Description: "Wallet-based scoring for allocation priority"

- **User Profile Card**
  - Wallet address (shortened)
  - Reputation tier badge
  - Current score (0-1000)
  - Visual score gauge (circular/linear)
  - Rank among all users (percentile)
  - Verified badge (if applicable)

- **Reputation Metrics**
  - **Holding Duration Score**
    - How long wallet has held tokens
    - Score multiplier display
    - Chart showing score over time

  - **Transaction History Score**
    - Successful transactions
    - Dump count (negative factor)
    - Swing trading penalty
    - Score breakdown

  - **Allocation Weight**
    - Your weight percentage
    - Calculate fair allocation
    - Used in launch prioritization

  - **Engagement Score**
    - Governance participation
    - Agent feedback
    - Protocol interaction
    - Activity history

- **Detailed Scoring Breakdown**
  - Component | Points | Weight | Formula
  - Holding duration | X | 40% | time_in_days * 0.1
  - Transactions | X | 30% | successful_tx * 0.5
  - Governance | X | 20% | votes_cast * 1.0
  - Risk factors | X | 10% | (dumps * -0.2) + penalties

- **Reputation History**
  - Score over past 30/90/365 days
  - Chart showing progression
  - Historical events (dumps, governance votes)
  - Milestone achievements

- **Tier System**
  - Tier 1: 0-200 points (Novice)
  - Tier 2: 200-400 points (Intermediate)
  - Tier 3: 400-600 points (Advanced)
  - Tier 4: 600-800 points (Institutional)
  - Tier 5: 800-1000 points (Platinum)
  - Benefits per tier (allocation quantity, priority)

- **How to Improve Score**
  - Actions that increase score
  - Penalties that decrease score
  - Timeline to score recovery
  - Best practices

#### Components Used
- Score gauge/progress ring
- Line charts (Recharts)
- Tier badges
- Metric cards
- History timeline
- Help tooltips

#### Data Sources
- Backend API (`/api/reputation/{walletAddress}`)
- User transaction history
- Governance participation logs
- Scoring algorithm in backend

#### Interactions
- View own reputation
- See scoring breakdown
- View history over time
- Get recommendations to improve score

---

### 8. ANALYTICS PAGE
**Route**: `localhost:3000/analytics/[address]`
**File**: `frontend/app/analytics/[address]/page.tsx`
**Type**: Client Component (Dynamic)

#### Purpose
Advanced technical analysis and metrics for token performance

#### Key Contents
- **Page Header**
  - Token name and symbol
  - Current price
  - Day change (% and color)
  - Back button

- **Price Chart Section**
  - Large interactive Recharts chart
  - X-axis: Time (adjustable: 1h, 4h, 1d, 1w, 1m)
  - Y-axis: Price (in BNB)
  - Candlestick or line view toggle
  - Volume bars below price
  - Moving averages (7-day, 30-day)
  - Trend lines
  - Hover tooltips with OHLC data
  - Zoom/pan controls

- **Technical Indicators Section**
  - RSI (Relative Strength Index)
    - Value (0-100)
    - Overbought/oversold zones
    - Chart visualization
  
  - MACD (Moving Average Convergence Divergence)
    - MACD line
    - Signal line
    - Histogram
    - Chart visualization

  - Bollinger Bands
    - Upper band
    - Middle band (MA)
    - Lower band
    - Price position
    - Chart overlay

  - Volume Profile
    - Volume by price level
    - High volume nodes
    - Support/resistance areas

- **Market Metrics**
  - Current price (BNB)
  - 24h high/low
  - 52w high/low
  - Market cap
  - Fully diluted valuation (FDV)
  - Circulating supply percentage
  - Trading volume 24h
  - Volume/market cap ratio
  - Liquidity
  - Liquidity/price ratio

- **On-Chain Metrics**
  - Holder distribution
    - Top 10 holders %
    - Unique holders
    - Holder count trend
  
  - Transaction metrics
    - Buy/sell ratio
    - Large transaction count
    - ATH/ATL age
    - Price swing (high to low)

  - Agent activity
    - Last MSS update
    - Parameter change frequency
    - Tax adjustment history
    - Liquidity unlock schedule

- **Risk Assessment**
  - Current risk score (0-100)
  - Risk factors breakdown
    - Concentration risk
    - Volatility risk
    - Liquidity risk
    - Agent update frequency risk
  - Risk trend (improving/deteriorating)
  - Risk recommendations

- **Comparison Tools**
  - Compare with other tokens
  - Select comparison metric
  - Side-by-side comparison chart
  - Relative performance

- **Export/Share**
  - Export chart as PNG
  - Share chart on social
  - Export data as CSV
  - Embed chart URL

#### Components Used
- Large interactive charts (Recharts)
- Technical indicator cards
- Metric cards
- Tabs for different views
- Dropdown selectors
- Export buttons

#### Data Sources
- Backend API (`/api/analytics/{address}`)
- Trading data from DEX APIs
- On-chain data from blockchain
- Historical price data (MongoDB)

#### Interactions
- Click time range buttons
- Hover charts for details
- Toggle indicator visibility
- Select comparison tokens
- Export data

---

### 9. AGENTS PAGE (Control Panel)
**Route**: `localhost:3000/agents`
**File**: `frontend/app/agents/page.tsx`
**Type**: Client Component

#### Purpose
Monitor, manage, and verify AI agents that control parameter updates

#### Key Contents
- **Page Header**
  - Title: "Agent Control Panel"
  - Subtitle: "Monitor and verify autonomous agents"
  - Total active agents count

- **Active Agents List**
  - Agent cards in grid (2-3 columns)
  - Each agent shows:
    - Agent name (e.g., "Liquidity Agent")
    - Public key/address
    - Status badge (active, inactive, suspended)
    - Last update (time ago)
    - Update count (total #)
    - Verification status (verified, unverified)
    - Success rate (%)
    - Average response time (ms)

  - Agent Types
    - Liquidity Agent (manages LP unlocks)
    - Market Agent (monitors MSS & market data)
    - Phase Agent (manages phase transitions)
    - Reputation Agent (calculates wallet scores)

- **Agent Details Modal**
  - Click agent card to open details
  - Agent name and address
  - Creation date
  - Public key (full)
  - Recent updates list
    - Update timestamp
    - Parameters changed
    - Transaction hash
    - Success status

  - Verification Info
    - Signature verification status
    - Last verified time
    - Verify button (manual check)

  - Performance Metrics
    - Success rate (%)
    - Average gas used
    - Average response time
    - Error count (7d)
    - Uptime (%)

- **Agent Management Section** (admin only)
  - Add New Agent button
    - Agent name input
    - Public key input
    - Agent type selector
    - Submit button

  - Revoke Agent button
    - Confirmation warning
    - Reason for revocation
    - Irreversible action notice

  - Update Agent Parameters button
    - Select agent
    - New parameters
    - Submit to governance

- **Agent Logs Viewer**
  - Filter logs by:
    - Agent name
    - Date range
    - Status (success, failed)
    - Token address

  - Logs table columns:
    - Timestamp
    - Agent name
    - Action (parameter update type)
    - Parameters changed
    - Result (success/failure)
    - Transaction hash (link to BlockScan)
    - Gas used

  - Pagination (50 per page)
  - Export logs button (CSV)

- **MSS Input Metrics Table**
  - Metric name
  - Current value
  - Weight in formula
  - Source (oracle, on-chain, off-chain)
  - Last updated
  - Edit button (admin)

- **Agent Statistics Dashboard**
  - Total updates (7d, 30d, all-time)
  - Average update frequency
  - Success rate (%)
  - Collective gas spent
  - Token count monitored

- **Manual Override Section** (governance only)
  - Force parameter update
  - Select token address
  - Input new parameters
  - Override reason
  - Submit for voting
  - Warning about circumventing agents

#### Components Used
- Agent cards
- Modal dialogs
- Logs table with pagination
- Status badges
- Charts and metrics
- Form inputs
- Confirmation dialogs

#### Data Sources
- Backend API (`/api/agents`)
- Agent execution logs database
- Blockchain verification
- Agent registry contract

#### Interactions
- Click agent card for details
- Add/revoke agents (admin)
- Filter and search logs
- Manual override (governance)
- Verify agents manually

---

### 10. AGENT DETAILS (Dynamic)
**Route**: `localhost:3000/agent/[id]`
**File**: `frontend/app/agent/[id]/page.tsx`
**Type**: Client Component (Dynamic)

#### Purpose
Individual agent profile and performance dashboard

#### Key Contents
- **Agent Header**
  - Agent name and ID
  - Status indicator (active/inactive)
  - Verification badge
  - Creation date

- **Agent Metrics**
  - Last update timestamp
  - Total updates: X
  - Success rate: X%
  - Average gas: X wei
  - Cumulative gas: X
  - Average response: X ms
  - Uptime: X%

- **Public Key & Signature Info**
  - Full public key (copyable)
  - Signature verification console
  - Input message field
  - Input signature field
  - Verify button
  - Verification result display

- **Recent Updates Feed**
  - 20 most recent updates
  - Each entry shows:
    - Timestamp (formatted)
    - Token address (link to project)
    - Parameters updated
    - Old values → New values
    - Transaction hash (link)
    - Gas used
    - Success indicator

- **Performance Chart**
  - Time series of success rate
  - Uptime trend
  - Response time trend
  - Gas usage trend

- **Actions Tab**
  - Toggle agent active/inactive (admin)
  - Revoke agent (admin)
  - Update agent info (admin)
  - Manual verification (governance)

#### Data Sources
- Backend API (`/api/agents/{id}`)
- Agent execution logs
- Blockchain verification

#### Interactions
- View agent metrics
- Verify signatures
- Check update history
- Manage agent (admin)

---

### 11. AGENT REGISTRY/DEPLOYED
**Route**: `localhost:3000/agent/registry`
**Route**: `localhost:3000/agent/deployed`
**Type**: Client Components

#### Purpose
Browse agents in registry and view currently deployed agents

#### Contents
- Registry page lists all potential agents available
- Deployed page shows only actively running agents
- Similar card-based UI to agents page
- Filter and search capabilities

---

### 12. PROFILE PAGE
**Route**: `localhost:3000/profile`
**File**: `frontend/app/profile/page.tsx`
**Type**: Client Component

#### Purpose
Display user wallet profile and achievements

#### Key Contents
- **Profile Header**
  - Wallet address (large, copyable)
  - Wallet avatar (identicon)
  - User tier badge (if set)
  - Verification status
  - Member since date

- **Profile Statistics**
  - Reputation score
  - Launch count (created)
  - Governance votes cast
  - Mandates participated in
  - Success rate
  - Total value launched

- **Achievements Section**
  - Badges earned
    - First Launch
    - Featured Pool
    - High Reputation
    - Governance Active
    - etc.
  - Each with description and date earned

- **Holdings**
  - Tokens owned
  - Balance in each
  - Value in BNB
  - Percentage change 24h
  - Link to project page

- **Activity History**
  - Recent transactions
  - Launch creations
  - Governance participations
  - Agent interactions
  - Filter by activity type
  - Timeline view

- **Preferences**
  - Email notifications toggle (if implemented)
  - Theme preference (light/dark)
  - Language selection
  - Notification settings

- **Edit Profile**
  - Username/display name (optional)
  - Bio (optional)
  - Social links (optional)
  - Verify profile button

#### Components Used
- Avatar component
- Tier badges
- Achievement cards
- Statistics cards
- Activity timeline
- Settings form

#### Data Sources
- Backend API (`/api/profile/{walletAddress}`)
- Blockchain transaction history
- User settings database

#### Interactions
- Copy wallet address
- View achievements
- Edit profile settings
- View activity history

---

### 13. DOCUMENTATION PAGE
**Route**: `localhost:3000/docs`
**File**: `frontend/app/docs/page.tsx`
**Type**: Client Component

#### Purpose
Comprehensive help and technical documentation

#### Key Contents
- **Documentation Sections**
  1. **Getting Started**
     - Install MetaMask
     - Connect wallet
     - Get testnet BNB
     - First launch steps

  2. **Tokenomics Guide**
     - Adaptive tax system explained
     - Phase system explained
     - MSS formula breakdown
     - Liquidity unlocks explained

  3. **Agent System**
     - How agents work
     - Agent types and roles
     - Signature verification
     - Adding custom agents

  4. **Governance**
     - Voting mechanism
     - Proposal types
     - Emergency controls
     - Multi-sig setup

  5. **Smart Contracts**
     - Contract overview
     - Method reference
     - Event reference
     - ABI documentation

  6. **API Reference**
     - Base URL
     - Authentication
     - Endpoints list
     - Example requests

  7. **Security Best Practices**
     - Never share private keys
     - Verify contract addresses
     - Check approval amounts
     - Use hardware wallets

  8. **Troubleshooting**
     - Common errors and solutions
     - Connection issues
     - Transaction failures
     - Gas estimation problems

- **Search Functionality**
  - Search docs in real-time
  - Quick jump to section
  - Sidebar navigation
  - Breadcrumbs

- **Code Examples**
  - Language selector (Solidity, JavaScript, Python)
  - Copy code button
  - Syntax highlighting

#### Components Used
- Accordion sections
- Code blocks
- Search input
- Sidebar navigation
- External links

#### Data Sources
- Markdown documentation in app
- Contract ABIs from lib/contracts
- API documentation from backend

#### Interactions
- Search documentation
- Navigate sections
- View code examples
- External links to tools

---

### 14. SYSTEM STATUS PAGE
**Route**: `localhost:3000/system`
**File**: `frontend/app/system/page.tsx`
**Type**: Client Component

#### Purpose
Real-time monitoring of protocol health and system status

#### Key Contents
- **Overall Status Indicator**
  - Status badge (operational, warning, down)
  - Uptime percentage (99.9%)
  - Last incident link

- **Component Status**
  - Smart Contracts
    - LaunchFactory
    - AdaptiveToken
    - LiquidityVault
    - EvolutionController
    - GovernanceModule
    - Status: green/yellow/red
    - Block number verified

  - Backend Services
    - API server
    - Event listener
    - Agent engine
    - Database
    - Status: connected/disconnected
    - Response time

  - Blockchain
    - BSC Testnet connection
    - Latest block
    - Block time
    - Network difficulty
    - Gas price (gwei)

- **System Metrics**
  - API response time (ms)
  - Database query latency (ms)
  - Blockchain sync status
  - Active connections count
  - Memory usage
  - Disk usage

- **Agent Status**
  - Total agents: X
  - Active: X
  - Inactive: X
  - Average update frequency
  - Last collective update

- **Network Statistics**
  - Total launches
  - Active launches
  - Total transactions
  - 24h volume
  - Total liquidity locked
  - Unique holders

- **Recent Incident Log**
  - Timestamp | Severity | Component | Status
  - Last 10 incidents
  - Filter by severity
  - Filter by component

- **Performance Dashboard**
  - API response time chart (7d)
  - Error rate chart (7d)
  - Uptime calendar
  - Component health history

- **Notifications**
  - Subscribe to alerts toggle
  - Alert rules
  - Contact information

#### Components Used
- Status badges
- Component cards
- Charts (Recharts)
- Metrics cards
- Incident timeline
- Status page link

#### Data Sources
- Backend API (`/api/health`)
- Blockchain RPC
- Monitoring service
- System logs

#### Interactions
- Refresh status (manual)
- View incident details
- Subscribe to alerts
- Historical performance

---

## Component Architecture

### Core Components

#### Sidebar Component
**File**: `frontend/components/Sidebar.tsx`
- Navigation menu
- Active route highlight
- Mobile collapse/expand
- Logo and branding
- User profile link
- Logout button

#### Navigation Component
**File**: `frontend/components/Navigation.tsx`
- Mobile top navigation
- Breadcrumb navigation
- Search across site
- Quick links

#### Header Component
**File**: `frontend/components/Header.tsx`
- Page title
- Breadcrumbs
- Quick actions
- Wallet status

#### MSSChart Component
**File**: `frontend/components/MSSChart.tsx`
- Recharts line chart
- 7-day historical data
- Responsive sizing
- Tooltip on hover
- Color gradient zones

#### PhaseTimeline Component
**File**: `frontend/components/PhaseTimeline.tsx`
- Visual phase display
- Progress indicators
- Phase descriptions
- Time in phase

#### AgentLogs Component
**File**: `frontend/components/AgentLogs.tsx`
- Activity feed
- Status indicators
- Timestamps
- Scrollable list
- Load more button

#### LaunchForm Component
**File**: `frontend/components/LaunchForm.tsx`
- Reusable form for launches
- Validation
- Error display
- Loading states

#### GovernancePanel Component
**File**: `frontend/components/GovernancePanel.tsx`
- Voting interface
- Proposal preview
- Vote buttons
- Confirmation dialogs

#### AIAgentCard Component
**File**: `frontend/components/AIAgentCard.tsx`
- Agent information card
- Status display
- Performance metrics
- Click to details link

#### AgentPerformanceChart Component
**File**: `frontend/components/AgentPerformanceChart.tsx`
- Agent metrics visualization
- Success rate chart
- Response time chart
- Uptime indicator

#### Skeleton Component
**File**: `frontend/components/Skeleton.tsx`
- Loading placeholder
- Shimmer animation
- Matches content shape

#### SparklingParticles Component
**File**: `frontend/components/SparklingParticles.tsx`
- Animated background
- Particle effects
- Non-interactive

---

## API Integration

### Base URL
```
Development: http://localhost:5000
Production: (to be configured)
```

### API Endpoints Used

#### Launches
- `GET /api/launches` - Get all launches
- `GET /api/launches/{address}` - Get single launch
- `POST /api/launches/create` - Create new launch
- `GET /api/launches/current` - Get current launch MSS/phase

#### Agents
- `GET /api/agents` - Get all agents
- `GET /api/agents/{id}` - Get agent details
- `GET /api/agents/{id}/logs` - Get agent logs
- `POST /api/agents` - Create new agent
- `PUT /api/agents/{id}` - Update agent
- `DELETE /api/agents/{id}` - Revoke agent

#### Analytics
- `GET /api/analytics/{address}` - Get token analytics
- `GET /api/analytics/{address}/price` - Price data
- `GET /api/analytics/{address}/holders` - Holder data

#### Governance
- `GET /api/governance/{address}` - Get governance data
- `GET /api/governance/{address}/proposals` - Get proposals
- `POST /api/governance/{address}/vote` - Submit vote

#### Reputation
- `GET /api/reputation/{walletAddress}` - Get reputation score
- `GET /api/reputation/{walletAddress}/history` - Score history

#### Health
- `GET /api/health` - System status
- `GET /api/health/agents` - Agent status
- `GET /api/health/contracts` - Contract status

### API Client Implementation
**File**: `frontend/lib/api.ts`
- Centralized fetch wrapper
- Error handling
- Timeout management (8 seconds)
- Typed responses
- Fallback values when backend unavailable

---

## Dynamic Routes & Parameters

### Token Address Routes
```
/project/[address]
/governance/[address]
/analytics/[address]
/agent/[id]
```

**Pattern**: 
- `[address]` - Ethereum address (0x followed by 40 hex chars)
- `[id]` - Agent ID (string identifier)

**Implementation**:
```tsx
export default function Page({ params }: { params: { address: string } }) {
  const address = params.address;
  // Use address to fetch data
}
```

---

## State Management

### Global State
- **Web3Provider** (Context)
  - Wallet connection
  - Chain ID validation
  - User address
  - Signer object

- **Contracts Hook** (Custom)
  - Real-time contract data
  - Phase information
  - Token parameters
  - Treasury balance

### Local State (Component Level)
- Form inputs (useState)
- Modal open/close (useState)
- Tab selection (useState)
- Filter values (useState)
- Pagination (useState)
- Loading states (useState)

### Data Fetching
- API client (`lib/api`)
- useEffect for data loading
- Error handling
- Loading spinners

---

## Styling & Design System

### Tailwind Configuration
**File**: `frontend/tailwind.config.js`

**Color Palette**:
- **Primary**: Dark forest green (#1a3a2a)
- **Secondary**: Sage green (#4a6d5a)
- **Accent/Gold**: #d4a574
- **Background**: Near black (#0f1419)
- **Muted**: Gray (#7a8493)

**Custom Classes**:
- `luxury-card`: Premium card styling
- `gold-gradient`: Gold gradient background
- `shine-sweep`: Shimmer animation
- `fade-in`: Fade in animation
- `scroll-smooth`: Smooth scroll

### Global Styles
**File**: `frontend/app/globals.css`
- Font definitions
- Base colors
- Animations
- Responsive utilities
- Custom component styles

### Responsive Design
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3+ columns
- All pages mobile-responsive
- Touch-friendly buttons (min 44px)

---

## Key Features by Page

| Page | Real-time Data | Forms | Charts | Auth Required |
|------|---|---|---|---|
| Home | ✓ | ✗ | ✓ (MSS) | ✗ |
| Landing | ✗ | ✗ | ✗ | ✗ |
| Launch | ✗ | ✓ | ✗ | ✓ |
| Explore | ✓ | ✗ | ✗ | ✗ |
| Project | ✓ | ✗ | ✓ | ✗ |
| Governance | ✓ | ✓ | ✗ | ✓ |
| Reputation | ✓ | ✗ | ✓ | ✓ |
| Analytics | ✓ | ✗ | ✓ | ✗ |
| Agents | ✓ | ✓ | ✓ | ✓ |
| Profile | ✓ | ✓ | ✗ | ✓ |
| Docs | ✗ | ✗ | ✗ | ✗ |
| System | ✓ | ✗ | ✓ | ✗ |

---

## Development Workflow

### Running Frontend Locally
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`

### Building for Production
```bash
npm run build
npm start
```

### Code Structure
- Pages in `app/` directory
- Components in `components/` directory
- Utilities in `lib/` directory
- Styles in `styles/` directory

### TypeScript
- All files use `.ts` or `.tsx` extension
- Strict mode enabled
- Type definitions for API responses

### Deployment
- Vercel (recommended for Next.js)
- Docker container
- Traditional server (Node.js required)

---

## Configuration Files

### next.config.js
```javascript
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "jsx": "preserve",
    "strict": true
  }
}
```

### tailwind.config.js
- Custom colors
- Font families
- Animation definitions
- Plugin imports

### postcss.config.js
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## Web3 Integration

### Wallet Connection
**Hook**: `frontend/lib/hooks/useWeb3.ts`
- MetaMask detection
- Network validation (BSC Testnet only)
- Account switching listener
- Disconnect functionality

### Contract Interaction
**Hook**: `frontend/lib/hooks/useContracts.ts`
- Real-time contract state
- Event listeners
- Transaction signing
- Gas estimation

### Types & ABIs
**File**: `frontend/lib/contracts/index.ts`
- Contract addresses
- ABI definitions
- Type interfaces
- Helper functions

---

## Security Considerations

1. **Never expose private keys**
   - Client-side signing only
   - MetaMask handles keys

2. **Verify contract addresses**
   - Hardcoded in lib/contracts
   - Verify on deployment

3. **Validate user input**
   - Form validation on frontend
   - Additional validation on backend
   - Contract validation on-chain

4. **Rate limiting**
   - API rate limits
   - Transaction throttling
   - Gas limit validation

5. **HTTPS in production**
   - Enforce SSL/TLS
   - Secure cookies

---

## Future Enhancements

1. **Dark/Light theme toggle**
2. **Advanced charting library** (TradingView Lightweight Charts)
3. **Push notifications** for agent updates
4. **Mobile app** (React Native)
5. **Advanced filtering** with saved filters
6. **Portfolio tracking** for multi-token monitoring
7. **Alert system** with customizable thresholds
8. **Wallet integration** with WalletConnect
9. **Multi-chain support**
10. **Internationalization** (i18n)

---

## Troubleshooting

### Common Issues

**MetaMask not detected**
- Ensure MetaMask installed and enabled
- Check browser console for errors
- Refresh page and try again

**Wrong network selected**
- Switch to BSC Testnet in MetaMask
- ChainID should be 97
- Try connecting wallet again

**Transaction fails**
- Check gas estimation
- Ensure account has enough BNB for gas
- Verify parameters before submission
- Check contract addresses in lib/contracts

**Data not loading**
- Check backend server running (port 5000)
- Verify API endpoints configured correctly
- Check browser dev tools network tab
- Reload page to retry

**Chart not displaying**
- Check console for errors
- Verify data from API
- Try zooming in/out on chart
- Hard refresh browser cache

---

## Support & Resources

**Documentation**
- This file (FRONTEND_PAGES_README.md)
- PROJECT_SUMMARY.md
- ARCHITECTURE.md
- DEPLOYMENT_GUIDE.md

**Code Examples**
- See /docs page for API examples
- Components folder has reusable examples
- Every page has comments explaining structure

**Community**
- GitHub Issues for bugs
- Discussions for feature requests
- Documentation for concepts

**Emergency Contact**
- Check DEPLOYMENT_GUIDE.md troubleshooting
- Review smart contract docs
- Check system status page

---

## Summary Table

| Feature | Status | Location |
|---------|--------|----------|
| Home Dashboard | ✅ Complete | `/` |
| Landing Page | ✅ Complete | `/landing` |
| Launch Form | ✅ Complete | `/launch` |
| Explorer | ✅ Complete | `/explore` |
| Project Dashboard (6 tabs) | ✅ Complete | `/project/[address]` |
| Governance | ✅ Complete | `/governance/[address]` |
| Reputation System | ✅ Complete | `/reputation` |
| Analytics | ✅ Complete | `/analytics/[address]` |
| Agent Control | ✅ Complete | `/agents` |
| Agent Registry | ✅ Complete | `/agent/registry` |
| Profile | ✅ Complete | `/profile` |
| Documentation | ✅ Complete | `/docs` |
| System Status | ✅ Complete | `/system` |

---

## Total Line Count

This documentation contains detailed descriptions of:
- 14 main page routes
- 8+ dynamic sub-routes
- 15+ reusable components
- Complete API integration guide
- Full styling and theming system
- State management patterns
- Security best practices
- Deployment and troubleshooting guides

**Estimated detailed content: 2500+ lines of comprehensive documentation**

---

**Last Updated**: February 27, 2026
**Status**: Complete and ready for deployment
