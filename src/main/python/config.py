import json

# Load configuration from a file or environment
def load_config():
    with open('resources/config.json', 'r') as config_file:
        config = json.load(config_file)
    return config
