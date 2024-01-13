import unittest
from pymongo import MongoClient
from init_db import get_convo_schema, initialize_db


class TestInitDB(unittest.TestCase):
    def test_get_convo_schema(self):
        # Call the get_convo_schema function
        schema = get_convo_schema()

        # Assert that the schema is not empty
        self.assertIsNotNone(schema)

    def test_resolve_schema(self):
        # Call the get_convo_schema function
        schema = get_convo_schema()

        # Assert that the schema is resolved
        self.assertNotIn("$ref", schema)

    """
    def setUp(self):
        # Connect to the MongoDB test database
        self.client = MongoClient()
        self.db = self.client.test_db

    def tearDown(self):
        # Drop the test database after each test
        self.client.drop_database("test_db")
        self.client.close()

    def test_initialize_db(self):
        # Call the initialize_db function
        initialize_db(self.db)

        # Assert that the "chats" collection is created
        self.assertIn("chats", self.db.list_collection_names())
    """


if __name__ == "__main__":
    unittest.main()
