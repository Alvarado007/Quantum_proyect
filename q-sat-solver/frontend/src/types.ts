export interface QuantumStateResult {
  state: string;
  probability: number;
  is_probable_solution: boolean;
}

export interface ResultData {
  expression: string;
  variables: string[];
  results: QuantumStateResult[];
  execution_time_ms: number;
}
