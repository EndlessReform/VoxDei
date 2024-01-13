from dotenv import load_dotenv
import logging


# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SharedState:
    def __init__(self):
        self._state = None

    def set_state(self, state):
        self._state = state

    def get_state(self):
        return self._state


shared_state = SharedState()


def get_shared_state():
    return shared_state
