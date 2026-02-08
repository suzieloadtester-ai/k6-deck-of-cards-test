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



## **Scope**

This section lists the components and activities in scope for testing.



* **In Scope:** Deck management (creation/shuffling), card operations (drawing), and stateful piles (adding/listing).
* **Out of Scope:** Frontend UI performance and external authentication providers.


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
- Load: 2 concurrent VUs for 30 seconds (5s ramp-up, 20s plateau, 5s ramp-down)

### **2playerParallel-test.ts** 
Similar to 2player-test but with parallel execution:
- Uses k6 scenarios to run Player 1 and Player 2 concurrently
- Each player operates on their own separate deck
- Tests parallel load handling with independent scenarios
- Same load profile as 2player-test but distributed across scenarios

### **draw2shuffle-test.ts**
Tests the advanced deck workflow:
- Creates a shuffled deck with 1 deck shoe
- Draws 1-50 random cards in a single operation
- Adds all drawn cards to a player pile
- Load: 2 concurrent VUs for 30 seconds (5s ramp-up, 20s plateau, 5s ramp-down)
- Simpler workflow for measuring core operations

**Shared Configuration:**
All three tests use performance thresholds and stages defined in `config.ts`:
- **Latency SLA:** p95 < 5 seconds for all operations
- **Operations monitored:** CreateShuffle, DrawCards, AddToPile, ListPile

## **Scenario: Peak Load Test**

This test determines how the system behaves under a sustained concurrent load.


### **Data Creation and Setup**

Virtual Users (VUs) will initialize a 6-deck shoe to ensure a large pool of cards is available, preventing deck exhaustion errors during the test.


### **Workload Model and Distribution**



* **Traffic:** 50 Concurrent Virtual Users.
* **Pattern:** 2-minute ramp-up followed by a 10-minute plateau.
* **Behavior:** Users will draw 2 cards and move them to a player-specific pile every iteration.


## **Scenario: Stress and Breakpoint Test**

This test identifies the maximum capacity of the API before it returns rate-limiting (429) or server errors (5xx).


### **Workload Model and Distribution**



* **Pattern:** Linear ramp from 1 to 200 Virtual Users over 15 minutes.
* **Metrics:** Monitoring for error rate spikes and significant latency degradation at specific VU counts.


## **Deliverables**



* **Scripts:** TypeScript source files located in the /src directory.
* **Results:** k6 summary reports and console logs.
* **Analysis:** Documentation of findings regarding the performance of stateful operations.


## **Tools and Storage**



* **Version Control:** GitHub.
* **Engine:** Node.js / npm.
* **Execution Tool:** k6 CLI.