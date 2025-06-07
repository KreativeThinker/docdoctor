import json
import os
from dataclasses import dataclass
from pathlib import Path

import yaml

BASE_DIR = Path(__file__).resolve().parent.parent.parent
CONFIG_PATH = Path.home() / ".config" / "docdoctor"

# Common env-config, no user prefs here
POSTGRES_DB = os.getenv("POSTGRES_DB", "doc_intel")
POSTGRES_USER = os.getenv("POSTGRES_USER", "doc_user")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "doc_pass")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
POSTGRES_PORT = int(os.getenv("POSTGRES_PORT", 3001))
POSTGRES_URL = os.getenv(
    "POSTGRES_URL",
    f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}",  # noqa: E501
)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", None)
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", None)
LM_STUDIO_BASE_URL = os.getenv("LM_STUDIO_BASE_URL", "http://localhost:1234")
CHROMADB_HOST = os.getenv("CHROMADB_HOST", "127.0.0.1")
CHROMADB_PORT = int(os.getenv("CHROMADB_PORT", 3002))
LLAMA_CPP_PORT = int(os.getenv("LLAMA_CPP_PORT", 3005))
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


@dataclass
class UserConfig:
    # User-specific settings & prefs
    # Example user setting placeholders, add more later
    theme: str = "light"
    notifications_enabled: bool = True

    @classmethod
    def load_from_file(cls):
        config_file_yaml = CONFIG_PATH.with_suffix(".yaml")
        config_file_json = CONFIG_PATH.with_suffix(".json")

        data = {}

        if config_file_yaml.exists():
            with open(config_file_yaml, "r") as f:
                data = yaml.safe_load(f)
        elif config_file_json.exists():
            with open(config_file_json, "r") as f:
                data = json.load(f)

        return cls(**data)


# Load user config on import
user_config = UserConfig.load_from_file()


def get_db_url():
    return os.getenv(
        "POSTGRES_URL",
        f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}",  # noqa: E501
    )
