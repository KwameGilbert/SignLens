import logging
import os 
import yaml

def setup_logger(config):
    """
    Setup logger based on the provided configuration dictionary.
    """
    log_config = config.get('logging', {})
    log_file = log_config.get('file', 'logs/app.log')
    log_level = log_config.get('level', 'INFO').upper()

    # Ensure log directory exists
    log_dir = os.path.dirname(log_file)
    if log_dir:
        os.makedirs(log_dir, exist_ok=True)

    logger = logging.getLogger("Sign_Language_Detection")
    logger.setLevel(log_level)

    formatter = logging.Formatter('%(asctime)s | %(name)s | %(levelname)s | %(message)s', datefmt='%Y-%m-%d %H:%M:%S')

    # Avoid adding handlers multiple times
    if not logger.handlers:
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(formatter)
        file_handler.setLevel(log_level)

        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        console_handler.setLevel(log_level)

        logger.addHandler(file_handler)
        logger.addHandler(console_handler)

    return logger