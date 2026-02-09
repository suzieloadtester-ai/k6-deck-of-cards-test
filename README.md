# **Performance Test Plan: Deck of Cards API**


## **Introduction**

The goal is to evaluate the stability and responsiveness of the Deck of Cards API during card shuffling, drawing, and stateful pile management under concurrent load.


## **How to Run the Tests**


### **1. Prerequisites**

Ensure you have Node.js (v18+) and the k6 CLI installed on your machine.


### **2. Setup**

Clone the repository and install the developer dependencies:

npm install 



### **3. Build and Execute**

Because this project uses TypeScript, the source code must be bundled into JavaScript before k6 can run it.

**Step 1: Bundle the TypeScript files**

npm run bundle 


**Step 2: Run a specific test**

k6 run dist/get-200-status-test.js 


### **4. Selecting Test Scenarios**

All tests use the `TEST_SCENARIO` configuration variable in `src/config.ts` to determine which load profile to use. Change this variable to switch between test scenarios:

```typescript
// In src/config.ts, line 5
export const TEST_SCENARIO: 'debug' | 'peak' | 'stress' | 'endurance' = 'debug';
```

**Available scenarios:**

* **`debug`** - Fast ramping (2 RPS in 1s, hold 10s, ramp down 1s). Use for writing and debugging tests.
* **`peak`** - Moderate sustained load (5 RPS over 1m, hold 10m, ramp down 1m). Use to measure sustained performance under normal conditions.
* **`stress`** - High load test (10 RPS over 10m, hold 5m). Use to identify breaking points and maximum capacity.
* **`endurance`** - Extended stability test (3 RPS over 1m, hold 55m, ramp down 1m). Use to detect memory leaks and performance degradation over time.

Simply update the `TEST_SCENARIO` value and rebuild:

npm run bundle
k6 run dist/2player-test.js

All tests will automatically use the selected scenario's load profile and VU settings.


## **Scope**

This section lists the components and activities in scope for testing.



* **In Scope:** Deck management (creation/shuffling), card operations (drawing), and stateful piles (adding/listing).
* **Out of Scope:** Frontend UI performance and external authentication providers. Returning cards to the deck. Static assets.


## **Performance Acceptance Criteria or SLAs**

This section describes what constitutes a successful test.



* **Latency:** 95% of requests (p95) must be under 500ms.
* **Success Rate:** 99% of all requests must return HTTP 200.
* **Data Integrity:** 100% accuracy in card counts when moving cards to player piles.


## **Test Environment**

This section describes the test environment.



* **Load Generation:** k6 Open Source.
* **Scripting:** TypeScript (bundled via Webpack).
* **Target URLs:**
    * Local: http://localhost:8080 (or your configured local port)
    * Production: https://deckofcardsapi.com


## **Entry Criteria**

The following criteria must be met to start testing:



* Node.js and k6 environment configured.
* Successful execution of npm run bundle without errors.
* Connectivity to the target API verified via a single-user smoke test.


## **Exit Criteria**

Testing will conclude when:



* All planned Peak and Stress scenarios have been executed.
* Performance metrics (latency, error rate) have been captured and analyzed.
* Any identified defects or bottlenecks have been documented.


## **Test Scripts**

The following test scripts are available in the `/src` directory:

### **2player-test.ts**
Simulates a 2-player card game workflow with sequential operations:
- Creates a shuffled deck with 1 deck shoe
- Player 1 draws 1-50 random cards
- Player 2 draws 1-50 random cards  
- Both players' cards are added to player-specific piles
- Load: RPS-based ramping (0 → 2 RPS over 5s, hold at 2 RPS for 10s, ramp down in 5s)

### **2playerParallel-test.ts** 
Similar to 2player-test but with parallel execution:
- Uses k6 scenarios to run Player 1 and Player 2 concurrently
- Each player operates on their own separate deck
- Tests parallel load handling with independent scenarios
- Load: RPS-based ramping per scenario (0 → 2 RPS over 5s, hold at 2 RPS for 10s, ramp down in 5s)
- Pre-allocates 1 VU per scenario with max 10 VUs

### **draw2shuffle-test.ts**
Tests the advanced deck workflow:
- Creates a shuffled deck with 1 deck shoe
- Draws 1-50 random cards in a single operation
- Adds all drawn cards to a player pile
- Load: RPS-based ramping (0 → 2 RPS over 5s, hold at 2 RPS for 10s, ramp down in 5s)
- Simpler workflow for measuring core operations

**Shared Configuration:**
All three tests use performance thresholds, stages, and metrics defined in `config.ts`:
- **Executor:** RPS-based ramping-arrival-rate with pre-allocated VUs
- **Latency SLA:** p95 < 5 seconds for all operations
- **Operations monitored:** CreateShuffle, DrawCards, AddToPile, ListPile
- **Trend Metrics:** Custom Trend metrics collect request duration data for each operation type (Trend_CreateShuffle, Trend_DrawCards, Trend_AddToPile, Trend_ListPile)

## **Scenario: Peak Load Test**

This test determines how the system behaves under a sustained, predictable request rate using an arrival-rate executor.

**Configuration:** Uses `peakStages` from `config.ts`
- **Ramp-up:** 0 to 5 RPS over 1 minute
- **Plateau:** Sustain 5 RPS for 10 minutes
- **Ramp-down:** 0 RPS over 1 minute

### **Workload Model and Distribution**

* **Executor:** `ramping-arrival-rate` (focuses on throughput rather than VU count)
* **Traffic Pattern:** Ramps to 5 RPS and maintains load to measure sustained performance
* **Behavior:** Users perform sequential or parallel operations including deck creation, drawing 1–50 cards, and pile management


## **Scenario: Stress and Breakpoint Test**

This test identifies the maximum capacity of the API by pushing the request rate beyond the standard load threshold to observe when performance degrades.

**Configuration:** Uses `stressStages` from `config.ts`
- **Ramp-up:** 0 to 10 RPS over 10 minutes
- **Plateau:** Sustain 10 RPS for 5 minutes (no ramp-down)

### **Workload Model and Distribution**

* **Executor:** `ramping-arrival-rate`
* **Traffic Pattern:** Incremental ramp to 10 RPS over 10 minutes to stress test the system
* **Metrics:** Monitoring for `http_req_failed` spikes and `Trend_` metric degradation

## **Scenario: Endurance Test**

This test determines system stability and reliability over an extended period at a moderate, sustainable request rate.

**Configuration:** Uses `enduranceStages` from `config.ts`
- **Ramp-up:** 0 to 3 RPS over 1 minute
- **Plateau:** Sustain 3 RPS for 55 minutes
- **Ramp-down:** 0 RPS over 1 minute

### **Workload Model and Distribution**

* **Executor:** `ramping-arrival-rate`
* **Traffic Pattern:** Moderate sustained load to identify memory leaks, connection issues, or performance degradation over time
* **Metrics:** Monitoring for cumulative errors and gradual latency increases over the extended test duration

## **Deliverables**



* **Scripts:** TypeScript source files located in the /src directory.
* **Results:** k6 summary reports and console logs.
* **Analysis:** Documentation of findings regarding the performance of stateful operations.


## **Tools and Storage**



* **Version Control:** GitHub.
* **Engine:** Node.js / npm.
* **Execution Tool:** k6 CLI.