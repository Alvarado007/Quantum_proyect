from qiskit_aer import AerSimulator
from qiskit import transpile

class Executor:
    def __init__(self, quantum_circuit, shots=1024):
        self.qc = quantum_circuit
        self.shots = shots
        self.simulator = AerSimulator()

    def run(self):
        """
        Transpila y ejecuta el circuito cuántico en AerSimulator.
        Retorna:
            dict: Resultados de las mediciones (counts).
        """
        # Transpilar el circuito para el simulador
        compiled_circuit = transpile(self.qc, self.simulator)
        
        # Ejecutar en el simulador
        job = self.simulator.run(compiled_circuit, shots=self.shots)
        
        # Obtener resultados
        result = job.result()
        counts = result.get_counts(compiled_circuit)
        
        return counts
