# 🚀 Q-SAT Solver: Quantum Boolean Satisfiability

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Qiskit](https://img.shields.io/badge/Qiskit-Quantum-blue)
![React](https://img.shields.io/badge/React-Accessible_UI-61DAFB)

**Q-SAT Solver** is a full-stack quantum computing application built for the Qollab Hackathon. It evaluates Boolean logic expressions (e.g., `(P | Q) >> R`) and finds satisfying assignments using **Quantum Parallelism** and **Grover's Algorithm**, offering a significant speedup over classical truth tables.

---

## 👥 The Team
This project was developed collaboratively by:
*   **Samuel Alvarado Acevedo**
*   **Samuel Agudelo Sosa**
*   **Sebastian Saenz Mejia**
*   **Paula Gimena Bohorques**

---

## 📖 What it does
The Q-SAT Solver allows users to input any Boolean logic expression through an accessible, highly-visual web interface. Instead of computing the result classically, the backend translates the expression into a quantum circuit (Quantum Oracle), applies Grover's diffusion operator, and runs the circuit on **Qollab's free simulators (or IonQ)**. 

The results are then decoded and displayed in a user-friendly **Results Dashboard**, highlighting the exact variable combinations that make the expression evaluate to `True`.

---

## ⚠️ The Problem
In classical computing, finding the satisfying assignment of a Boolean formula (the SAT problem) requires evaluating a truth table. For $N$ variables, there are $2^N$ possible combinations. This exponential growth $O(2^N)$ means that as the formula gets larger, classical computers take an impractical amount of time to find a solution.

## ⚛️ The Quantum Solution
By leveraging Quantum Computing, we can prepare a superposition of all $2^N$ possible states at once. We then use a **Quantum Oracle** to flip the phase of the states that satisfy the expression, and apply **Grover's Algorithm** to amplify the probability of measuring these correct states. This provides a quadratic speedup $O(\sqrt{2^N})$ compared to classical brute-force methods.

---

## 🏗️ Architecture & Features

This project is decoupled into a high-performance quantum backend and an accessible frontend:

*   **Backend (Python, FastAPI, Qiskit):** Parses the string expression, dynamically builds the reversible quantum circuit, and executes it. Configured to easily switch between local `AerSimulator` for dev and Qollab/IonQ simulators for production.
*   **Frontend (React, TypeScript, Tailwind CSS):** Strictly adheres to UI/UX accessibility best practices (WCAG contrast, ARIA labels).
*   **Results Dashboard:**
    *   **Highlight Cards:** Instantly displays the top winning variable combinations.
    *   **Smart Histogram:** Color-coded visualization distinguishing probable solutions from quantum noise.
    *   **Assignment Table:** A detailed, sortable data table mapping binary results to variable names.

---

## 🚀 How to Run It

### 1. Backend Setup
Navigate to the backend directory and set up the Python environment:
```bash
cd q-sat-solver/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend Setup
Open a new terminal, navigate to the frontend directory, and start the development server:
```bash
cd q-sat-solver/frontend
npm install
npm run dev
```

Then, open your browser and navigate to the local URL (usually `http://localhost:5173`) to use the Q-SAT Solver.