import math
from qiskit import QuantumCircuit, ClassicalRegister, QuantumRegister

class GroverAlgorithm:
    def __init__(self, oracle_circuit, num_variables):
        self.oracle = oracle_circuit
        self.n = num_variables

    def build_diffuser(self):
        """
        Builds the Grover diffuser operator.
        """
        qc = QuantumCircuit(self.n, name="Diffuser")
        
        # Apply H to all qubits
        qc.h(range(self.n))
        
        # Apply X to all qubits
        qc.x(range(self.n))
        
        # Multi-controlled Z
        # We can construct MCZ using H, MCX, H
        if self.n > 1:
            qc.h(self.n - 1)
            qc.mcx(list(range(self.n - 1)), self.n - 1)
            qc.h(self.n - 1)
        else:
            qc.z(0)
        
        # Apply X to all qubits
        qc.x(range(self.n))
        
        # Apply H to all qubits
        qc.h(range(self.n))
        
        return qc

    def build_circuit(self, iterations=1):
        """
        Assembles the full Grover circuit.
        """
        qr_vars = QuantumRegister(self.n, name='v')
        qr_ancilla = QuantumRegister(1, name='ancilla')
        cr = ClassicalRegister(self.n, name='c')
        
        qc = QuantumCircuit(qr_vars, qr_ancilla, cr)
        
        # 1. Initialize variables in superposition
        qc.h(qr_vars)
        
        # Initialize ancilla in |-> state for phase kickback
        qc.x(qr_ancilla)
        qc.h(qr_ancilla)
        
        # Grover iterations
        # If the number of solutions is unknown, an estimate is used.
        # For simplicity, we can use a standard number of iterations based on N.
        # N=1 -> 1, N=2 -> 1, N=3 -> 2
        diffuser = self.build_diffuser()
        
        for _ in range(iterations):
            # 2. Apply Oracle
            qc.append(self.oracle, list(range(self.n + 1)))
            
            # 3. Apply Diffuser to the variable qubits
            qc.append(diffuser, list(range(self.n)))
            
        # 4. Measure variable qubits
        qc.measure(qr_vars, cr)
        
        return qc
