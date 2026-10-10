from rich.console import Console
from rich.table import Table

def display_results(counts, variables, total_shots):
    """
    Formatea y muestra los resultados cuánticos en la terminal usando rich.
    """
    console = Console()
    
    # Calculate the average probability to filter the "True" states
    # In Grover, correct solutions have significantly higher amplitude than average
    num_states = len(counts)
    if num_states == 0:
        console.print("[red]No se obtuvieron resultados.[/red]")
        return
        
    avg_count = total_shots / num_states
    # Consider "True" if the count is significantly above average 
    # (or just above a threshold if it's the only one).
    # If all states have similar counts (e.g., tautology), all will be shown.
    threshold = total_shots / (2 ** len(variables))
    
    table = Table(title="Resultados del Evaluador Lógico Cuántico")
    
    for var in variables:
        table.add_column(f"{var.name}", justify="center", style="cyan")
        
    table.add_column("Probabilidad", justify="right", style="green")
    table.add_column("Conteo", justify="right", style="magenta")
    
    # Sort counts by highest frequency
    sorted_counts = sorted(counts.items(), key=lambda item: item[1], reverse=True)
    
    solutions_found = False
    
    for bitstring, count in sorted_counts:
        # Grover amplifies correct states, so they will appear much more often than random states
        # The exact threshold can depend on the number of iterations and solutions, 
        # but generally it's above the uniform distribution threshold.
        # Let's use a heuristic: if count is > average threshold of uniform distribution * 1.5
        # However, if there are many solutions, Grover might not amplify them cleanly without exact iteration count.
        # We will show the highest ones.
        
        prob = count / total_shots
        
        # We reverse the bitstring because Qiskit measures from right to left (c_n-1 ... c_0)
        # So rightmost bit corresponds to variables[0]
        reversed_bits = bitstring[::-1]
        
        # If prob is above a reasonable threshold or if it's one of the top results
        if count > threshold * 1.2 or prob > 0.1:
            solutions_found = True
            row = [str(bit) for bit in reversed_bits]
            row.append(f"{prob*100:.1f}%")
            row.append(str(count))
            table.add_row(*row)
            
    if not solutions_found:
         # Fallback, just show the top result
         top_bitstring, top_count = sorted_counts[0]
         reversed_bits = top_bitstring[::-1]
         row = [str(bit) for bit in reversed_bits]
         row.append(f"{(top_count/total_shots)*100:.1f}%")
         row.append(str(top_count))
         table.add_row(*row)

    console.print(table)
    console.print("\n[yellow]Nota:[/yellow] Las combinaciones mostradas representan los estados cuánticos amplificados por el algoritmo de Grover, indicando las asignaciones que hacen verdadera la expresión lógica.")
