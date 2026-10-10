# Proyecto: Quantum Logic Evaluator (Q-SAT Solver)

## Descripción y Enfoque Cuántico
Este proyecto es una herramienta de línea de comandos (CLI) escrita en Python que evalúa expresiones lógicas booleanas (ej. `(P | Q) >> R`) usando algoritmos de computación cuántica, específicamente el algoritmo de Grover.

### El Problema Clásico vs. La Solución Cuántica
El problema de satisfacibilidad booleana (SAT) implica encontrar si existe una asignación de variables lógicas que hace que la expresión evalúe a Verdadero. 
- **Enfoque Clásico:** En el peor caso, evaluar todas las combinaciones posibles de $N$ variables es una operación de complejidad $O(2^N)$, lo cual escala exponencialmente y se vuelve intratable muy rápido.
- **Enfoque Cuántico (Grover):** A través del paralelismo cuántico, el sistema entra en una superposición de todos los $2^N$ estados simultáneamente. El algoritmo de Grover permite amplificar la amplitud (probabilidad) de las soluciones correctas, encontrándolas en $O(\sqrt{2^N})$ operaciones. Esto provee una aceleración cuadrática (quadratic speedup) respecto al enfoque clásico.

## Arquitectura del Sistema
El proyecto se divide en tres módulos principales para mantener un bajo acoplamiento:
1. **Parser (`parser/logic_parser.py`):** Utiliza `sympy` para parsear el string de entrada del usuario, identificar las variables únicas y normalizar la expresión lógica a un formato procesable por el circuito cuántico (por ejemplo, manejando simplificaciones lógicas).
2. **Quantum Core (`quantum_core/`):**
   - `oracle_builder.py`: Traduce el árbol sintáctico del parser a un circuito cuántico usando `qiskit`, aplicando compuertas fundamentales como X, y Toffoli (MCX), con apoyo de un qubit auxiliar para el phase kickback.
   - `grover.py`: Ensambla el flujo general. Inicializa los qubits en superposición total usando compuertas de Hadamard ($H$), añade el oráculo lógico y aplica el operador de difusión de Grover.
   - `executor.py`: Gestiona la simulación del circuito utilizando `AerSimulator` de Qiskit, obteniendo las mediciones de las probabilidades de los estados cuánticos.
3. **Utils (`utils/display.py`):** Recibe las cuentas resultantes de la ejecución cuántica, descifra los estados binarios asociándolos a sus respectivas variables lógicas usando `rich` para mostrar en la terminal aquellas combinaciones que sean verdaderas.

## Instalación

Se requiere Python 3.10 o superior. 

1. Clona el repositorio e ingresa a la carpeta.
2. Es recomendable crear un entorno virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```
3. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```

## Uso
Ejecuta `main.py` pasando la expresión lógica como argumento:
```bash
python main.py "(P | Q) >> R"
```

El solver imprimirá en consola las variables lógicas encontradas y las combinaciones que hacen que la expresión sea verdadera, junto con sus probabilidades cuánticas.