import math
import re
import sympy
from sympy.logic.boolalg import to_dnf, simplify_logic
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister, transpile
from qiskit.circuit.library import BitFlipOracleGate
from config import Config

class QSATSolver:
    def __init__(self):
        self.variables = []
        self.parsed_expr = None
        self.num_vars = 0

    def parse_expression(self, expr: str):
        """
        Translates logical operators to a format parsable for circuit creation.
        """
        words = re.findall(r'[a-zA-Z]+', expr)
        local_dict = {word: sympy.Symbol(word) for word in set(words)}
        
        self.parsed_expr = sympy.sympify(expr, locals=local_dict)
        self.variables = sorted(list(self.parsed_expr.free_symbols), key=lambda s: s.name)
        self.parsed_expr = simplify_logic(self.parsed_expr)
        self.num_vars = len(self.variables)
        return self.num_vars

    def build_oracle(self) -> QuantumCircuit:
        """
        Constructs the quantum circuit for the expression using BitFlipOracleGate.
        """
        dnf_expr = to_dnf(self.parsed_expr)
        expr_str = str(dnf_expr)
        var_names = [v.name for v in self.variables]
        
        oracle_gate = BitFlipOracleGate(expr_str, var_order=var_names)
        
        qr_vars = QuantumRegister(self.num_vars, name='v')
        qr_ancilla = QuantumRegister(1, name='ancilla')
        qc = QuantumCircuit(qr_vars, qr_ancilla, name="Oracle")
        
        qc.append(oracle_gate, list(range(self.num_vars + 1)))
        return qc

    def build_diffuser(self) -> QuantumCircuit:
        qc = QuantumCircuit(self.num_vars, name="Diffuser")
        qc.h(range(self.num_vars))
        qc.x(range(self.num_vars))
        
        if self.num_vars > 1:
            qc.h(self.num_vars - 1)
            qc.mcx(list(range(self.num_vars - 1)), self.num_vars - 1)
            qc.h(self.num_vars - 1)
        else:
            qc.z(0)
            
        qc.x(range(self.num_vars))
        qc.h(range(self.num_vars))
        return qc

    def get_backend(self):
        """
        Reads from config.py to determine the appropriate backend.
        """
        if Config.USE_IONQ:
            try:
                from qiskit_ionq import IonQProvider
                provider = IonQProvider(Config.IONQ_API_KEY)
                return provider.get_backend("ionq_simulator")
            except ImportError:
                print("qiskit_ionq not installed. Falling back to AerSimulator.")
        
        if Config.USE_QOLLAB:
            # Placeholder for Qollab provider logic
            print("Qollab provider requested. Please configure Qollab SDK. Falling back to AerSimulator.")
            
        from qiskit_aer import AerSimulator
        return AerSimulator()

    def run_grover(self, expr: str, shots: int = 1024):
        """
        Parses the expression, builds the Grover circuit, executes it, and returns the results.
        """
        self.parse_expression(expr)
        
        if self.num_vars == 0:
            return {"error": "No variables found in expression"}

        oracle_qc = self.build_oracle()
        diffuser = self.build_diffuser()
        
        qr_vars = QuantumRegister(self.num_vars, name='v')
        qr_ancilla = QuantumRegister(1, name='ancilla')
        cr = ClassicalRegister(self.num_vars, name='c')
        qc = QuantumCircuit(qr_vars, qr_ancilla, cr)
        
        qc.h(qr_vars)
        qc.x(qr_ancilla)
        qc.h(qr_ancilla)
        
        iterations = max(1, int((math.pi / 4) * math.sqrt(2 ** self.num_vars)))
        if self.num_vars <= 2:
            iterations = 1
            
        for _ in range(iterations):
            qc.append(oracle_qc, list(range(self.num_vars + 1)))
            qc.append(diffuser, list(range(self.num_vars)))
            
        qc.measure(qr_vars, cr)
        
        backend = self.get_backend()
        compiled_circuit = transpile(qc, backend)
        
        job = backend.run(compiled_circuit, shots=shots)
        result = job.result()
        counts = result.get_counts()
        
        # Format the results mapping bits to variable assignments
        formatted_counts = {}
        for bitstring, count in counts.items():
            # bitstring is from right to left (c_n-1 ... c_0)
            # reversing to match variables[0] ... variables[n-1]
            reversed_bits = bitstring[::-1]
            formatted_counts[reversed_bits] = count
            
        return {
            "variables": [v.name for v in self.variables],
            "counts": formatted_counts,
            "total_shots": shots
        }
