from qiskit import QuantumCircuit, QuantumRegister
from qiskit.circuit.library import BitFlipOracleGate
from sympy.logic.boolalg import to_dnf
import sympy

class OracleBuilder:
    def __init__(self, parsed_expr, variables):
        self.parsed_expr = parsed_expr
        self.variables = variables

    def build(self):
        """
        Builds the quantum circuit for the oracle.
        The oracle evaluates the logical expression and flips the state of a target ancilla qubit.
        Returns:
            QuantumCircuit: The oracle circuit.
        """
        # Convert to Disjunctive Normal Form (OR of ANDs) for simpler evaluation
        dnf_expr = to_dnf(self.parsed_expr)
        
        # Convert sympy expression to string format supported by Qiskit's Oracle
        # Sympy uses &, |, ~ which are compatible with Qiskit's BitFlipOracleGate
        expr_str = str(dnf_expr)
        
        # Variable names list
        var_names = [v.name for v in self.variables]
        
        # Generate the BitFlipOracleGate
        # This gate automatically maps AND to Toffoli/MCX, NOT to Pauli-X, 
        # and uses appropriate De Morgan's equivalent logic for OR.
        # It allocates var_names.length qubits + 1 target qubit.
        oracle_gate = BitFlipOracleGate(expr_str, var_order=var_names)
        
        # Create a quantum circuit to hold this oracle
        n = len(self.variables)
        qr_vars = QuantumRegister(n, name='v')
        qr_ancilla = QuantumRegister(1, name='ancilla')
        qc = QuantumCircuit(qr_vars, qr_ancilla, name="Oracle")
        
        # Append the oracle gate to the circuit
        qc.append(oracle_gate, list(range(n + 1)))
        
        return qc
