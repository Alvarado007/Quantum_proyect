from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from quantum_core import QSATSolver

app = FastAPI(title="Q-SAT Solver API")

# Setup CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SolveRequest(BaseModel):
    expression: str
    shots: int = 1024

@app.post("/api/solve")
def solve_expression(req: SolveRequest):
    solver = QSATSolver()
    try:
        results = solver.run_grover(req.expression, req.shots)
        if "error" in results:
            raise HTTPException(status_code=400, detail=results["error"])
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
