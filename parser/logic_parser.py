import sympy
from sympy.logic.boolalg import to_dnf, simplify_logic

class LogicParser:
    def __init__(self, expression_str: str):
        """
        Parses a boolean logic string into a sympy logic expression.
        """
        self.expression_str = expression_str
        self.variables = []
        self.parsed_expr = None
        self._parse()

    def _parse(self):
        import re
        # Find all alphabetical words
        words = re.findall(r'[a-zA-Z]+', self.expression_str)
        # Create a dict of Symbols for sympify to override reserved keywords like 'Q'
        local_dict = {word: sympy.Symbol(word) for word in set(words)}
        
        # Convert string to sympy expression
        self.parsed_expr = sympy.sympify(self.expression_str, locals=local_dict)
        
        # Extract variables
        self.variables = sorted(list(self.parsed_expr.free_symbols), key=lambda s: s.name)
        
        # Simplify the logic
        self.parsed_expr = simplify_logic(self.parsed_expr)

    def get_variables(self):
        """
        Returns a sorted list of the boolean variables (Sympy symbols).
        """
        return self.variables

    def get_expression(self):
        """
        Returns the parsed sympy expression.
        """
        return self.parsed_expr
