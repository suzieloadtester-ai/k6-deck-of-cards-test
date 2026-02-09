# **Performance Test Plan: Deck of Cards API**


## **Introduction**

The goal is to evaluate the stability and responsiveness of the Deck of Cards API during card shuffling, drawing, and stateful pile management under concurrent load.


## **How to Run the Tests**


### **1. Prerequisites**



* k6
* Node.js & npm
* Docker (for local API execution)


### **2. Setup**
Install the developer dependencies:
```bash
npm install
```

Build the TypeScript tests:
```bash
npm run build
```

### **3. Build and Execute**

Because this project uses TypeScript, the source code must be bundled into JavaScript before k6 can run it.


---


## **Running Tests**

The test suite is designed to be portable across environments (Local vs. Production) using k6 environment variables.


### **1. Run against Local Docker Environment**

By default, the tests target the local API running in Docker (usually http://localhost:8000).

**Bundles TypeScript and runs the Draw2Shuffle test locally:**
```bash
npm run k6:local -- dist/draw2shuffle-test.js
```

### **2. Run against Production API**

To target the public API (https://deckofcardsapi.com), pass the ENVIRONMENT variable:

**Bundles TypeScript and runs the Draw2Shuffle test against Production:**
```bash
npm run k6:prod -- dist/draw2shuffle-test.js
```

---


## **Test Scenarios**

The suite supports multiple performance scenarios defined in src/config.ts. You can toggle these by changing the TEST_SCENARIO constant:


<table>
  <tr>
   <td><strong>Scenario</strong>
   </td>
   <td><strong>Description</strong>
   </td>
  </tr>
  <tr>
   <td><strong>debug</strong>
   </td>
   <td>Low volume (2 RPS) for verifying logic.
   </td>
  </tr>
  <tr>
   <td><strong>peak</strong>
   </td>
   <td>Simulates high traffic (5 RPS) for 10 minutes.
   </td>
  </tr>
  <tr>
   <td><strong>stress</strong>
   </td>
   <td>Pushes the system to 10 RPS to find breaking points.
   </td>
  </tr>
  <tr>
   <td><strong>endurance</strong>
   </td>
   <td>1-hour test at 3 RPS to check for memory leaks.
   </td>
  </tr>
</table>



---


## **Scope**



* **In Scope:** Deck management (creation/shuffling), card operations (drawing), and stateful piles (adding/listing).
* **Out of Scope:** Frontend UI performance, external authentication providers, returning cards to the deck, and static assets.


## **Performance Acceptance Criteria (SLAs)**



* **Latency:** 95% of requests (p95) must be under 500ms.
* **Success Rate:** 99% of all requests must return HTTP 200.
* **Data Integrity:** 100% accuracy in card counts when moving cards to player piles.


## **Test Environment**



* **Load Generation:** k6 Open Source.
* **Scripting:** TypeScript (bundled via Webpack).
* **Target URLs:**
    * **Local:** http://localhost:8000
    * **Production:**[ https://deckofcardsapi.com](https://deckofcardsapi.com/)


---


## **Test Scripts**

The following test scripts are available in the /src directory:


### **2player-test.ts**

Simulates a 2-player card game workflow with sequential operations:



* Creates a shuffled deck with 1 deck shoe.
* Player 1 draws 1-50 random cards.
* Player 2 draws 1-50 random cards.
* Both players' cards are added to player-specific piles.


### **2playerParallel-test.ts Similar to 2player-test but with parallel execution:**



* Uses k6 scenarios to run Player 1 and Player 2 concurrently.
* Each player operates on their own separate deck.
* Tests parallel load handling with independent scenarios.


### **draw2shuffle-test.ts**

Tests the advanced deck workflow:



* Creates a shuffled deck with 1 deck shoe.
* Draws 1-50 random cards in a single operation.
* Adds all drawn cards to a player pile.


---


## **Scenario: Peak Load Test**

Determines system behavior under a sustained, predictable request rate.



* **Ramp-up:** 0 to 5 RPS over 1 minute.
* **Plateau:** Sustain 5 RPS for 10 minutes.
* **Ramp-down:** 0 RPS over 1 minute.


## **Scenario: Stress and Breakpoint Test**

Identifies maximum capacity by pushing the request rate beyond the standard load threshold.



* **Ramp-up:** 0 to 10 RPS over 10 minutes.
* **Plateau:** Sustain 10 RPS for 5 minutes (no ramp-down).


## **Scenario: Endurance Test**

Determines system stability and reliability over an extended period.



* **Ramp-up:** 0 to 3 RPS over 1 minute.
* **Plateau:** Sustain 3 RPS for 55 minutes.
* **Ramp-down:** 0 RPS over 1 minute.


---


## **Tools and Storage**



* **Version Control:** GitHub.
* **Engine:** Node.js / npm.
* **Execution Tool:** k6 CLI.