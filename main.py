import argparse
import math
from rich.console import Console

from parser.logic_parser import LogicParser
from quantum_core.oracle_builder import OracleBuilder
from quantum_core.grover import GroverAlgorithm
from quantum_core.executor import Executor
from utils.display import display_results

def main():
    console = Console()
    
    arg_parser = argparse.ArgumentParser(description="Quantum Logic Evaluator (Q-SAT Solver)")
    arg_parser.add_argument("expression", type=str, help="Expresión lógica booleana a evaluar (ej: '(P | Q) >> R')")
    arg_parser.add_argument("--shots", type=int, default=1024, help="Número de shots para el simulador cuántico (default: 1024)")
    
    args = arg_parser.parse_args()
    
    console.print(f"[bold cyan]Evaluando expresión:[/bold cyan] {args.expression}")
    
    # 1. Parseo Lógico
    with console.status("[bold green]Parseando la expresión lógica...[/bold green]"):
        parser = LogicParser(args.expression)
        variables = parser.get_variables()
        parsed_expr = parser.get_expression()
        num_vars = len(variables)
        
    console.print(f"[green]Variables detectadas:[/green] {[v.name for v in variables]}")
    console.print(f"[green]Expresión simplificada:[/green] {parsed_expr}")
    
    if num_vars == 0:
        console.print("[red]No se detectaron variables en la expresión.[/red]")
        return

    # 2. Construcción del Oráculo
    with console.status("[bold yellow]Construyendo el oráculo cuántico...[/bold yellow]"):
        oracle_builder = OracleBuilder(parsed_expr, variables)
        oracle_qc = oracle_builder.build()
        
    # 3. Algoritmo de Grover
    with console.status("[bold magenta]Ensamblando el circuito de Grover...[/bold magenta]"):
        grover = GroverAlgorithm(oracle_qc, num_vars)
        
        # Calcular iteraciones óptimas de Grover
        # Grover iteraciones: pi/4 * sqrt(N/M) donde N=2^num_vars y M=número de soluciones
        # Como M es desconocido, usamos una heurística o 1-2 iteraciones para N pequeños.
        iterations = max(1, int((math.pi / 4) * math.sqrt(2 ** num_vars)))
        # Para circuitos pequeños o desconocidos, 1 iteración es generalmente suficiente para ver el sesgo
        if num_vars <= 2:
            iterations = 1
        
        qc = grover.build_circuit(iterations=iterations)
        
    # 4. Ejecución
    with console.status(f"[bold blue]Ejecutando en Qiskit AerSimulator ({args.shots} shots)...[/bold blue]"):
        executor = Executor(qc, shots=args.shots)
        counts = executor.run()
        
    # 5. Visualización
    console.print()
    display_results(counts, variables, args.shots)

if __name__ == "__main__":
    main()
