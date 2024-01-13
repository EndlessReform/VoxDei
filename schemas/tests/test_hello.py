"""Hello unit test module."""

from src.convo import hello


def test_hello():
    """Test the hello function."""
    assert hello() == "Hello schemas"
