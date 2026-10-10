import os

class Config:
    USE_IONQ = os.environ.get("USE_IONQ", "false").lower() == "true"
    USE_QOLLAB = os.environ.get("USE_QOLLAB", "false").lower() == "true"
    IONQ_API_KEY = os.environ.get("IONQ_API_KEY", "")
    QOLLAB_API_KEY = os.environ.get("QOLLAB_API_KEY", "")
