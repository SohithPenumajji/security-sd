import unittest
from app import app

class TestApp(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_home(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)

    def test_login_page(self):
        response = self.app.get('/login')
        self.assertEqual(response.status_code, 200)

    def test_invalid_login(self):
        response = self.app.post('/login', data={'username': 'wrong', 'password': 'wrong'})
        self.assertIn(b'Invalid credentials', response.data)

    def test_valid_login(self):
        response = self.app.post('/login', data={'username': 'admin', 'password': 'admin123'})
        self.assertEqual(response.status_code, 302)  # Redirect to home after login

if __name__ == '__main__':
    unittest.main()
