# Q-SAT Solver (Quantum Boolean Satisfiability)

## What it does
The Q-SAT Solver is a full-stack quantum computing application that evaluates boolean logic expressions (e.g., `(P | Q) >> R`) using Grover's Algorithm. Instead of manually computing a classical truth table, it leverages quantum parallelism and amplitude amplification to find the boolean assignments that satisfy the expression, visualizing the probability distribution of the possible states.

## The Problem
The Boolean Satisfiability Problem (SAT) is a classic NP-complete problem. 
**Classical Approach:** A classical computer must evaluate truth tables for all $2^N$ combinations, taking $O(2^N)$ operations in the worst case. This becomes computationally intractable as the number of variables $N$ increases.
**Quantum Speedup:** By applying **Grover's Algorithm**, we can evaluate all possible assignments simultaneously in a quantum superposition. The algorithm amplifies the amplitudes of the correct assignments, effectively finding the solutions in $O(\sqrt{2^N})$ operations, offering a quadratic speedup over classical methods.

## How to run it locally

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Start the Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
*Note: To use IonQ or Qollab simulators instead of the local AerSimulator, set `USE_IONQ=true` or `USE_QOLLAB=true` in your environment variables.*

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

Navigate to `http://localhost:5173` to interact with the Q-SAT Solver.
