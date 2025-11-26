import yaml
import os

class ConfigLoader:
    _instance = None
    _config = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ConfigLoader, cls).__new__(cls)
        return cls._instance

    @classmethod
    def load_config(cls, config_path=None):
        """
        Load configuration from a YAML file.
        If config is already loaded, return it unless a new path is provided.
        """
        if cls._config is not None and config_path is None:
            return cls._config

        if config_path is None:
            # Determine default path relative to this file
            # Assuming this file is in sign/config/loader.py
            # and config is in sign/config/config.yaml
            current_dir = os.path.dirname(os.path.abspath(__file__))
            project_root = os.path.dirname(current_dir)
            config_path = os.path.join(project_root, 'config', 'config.yaml')

        if not os.path.exists(config_path):
            raise FileNotFoundError(f"Config file not found at: {config_path}")

        cls._config_path = config_path
        cls._last_mtime = os.path.getmtime(config_path)

        with open(config_path, 'r') as file:
            cls._config = yaml.safe_load(file)
        
        return cls._config

    @classmethod
    def get_config(cls):
        """Get the loaded configuration. Raises error if not loaded."""
        if cls._config is None:
            # Try to load with default path
            return cls.load_config()
        return cls._config

    @classmethod
    def check_for_updates(cls):
        """
        Check if the configuration file has been modified.
        Returns True if modified, False otherwise.
        """
        if cls._config is None or not hasattr(cls, '_config_path'):
            return False
        
        try:
            current_mtime = os.path.getmtime(cls._config_path)
            if current_mtime > cls._last_mtime:
                return True
        except OSError:
            pass
        
        return False

    @classmethod
    def reload_config(cls):
        """
        Force reload the configuration from the file.
        """
        if hasattr(cls, '_config_path'):
            return cls.load_config(cls._config_path)
        return cls.load_config()

