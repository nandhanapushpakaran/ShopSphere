from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status


class UserAuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='existing@example.com',
            email='existing@example.com',
            password='TestPassword123!',
            first_name='Existing',
            last_name='User'
        )

    def test_user_registration_success(self):
        payload = {
            'name': 'Sarah Connor',
            'email': 'sarah@example.com',
            'password': 'StrongPassword2026!',
            'password_confirm': 'StrongPassword2026!'
        }
        response = self.client.post('/api/auth/register/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['email'], 'sarah@example.com')
        self.assertEqual(response.data['user']['name'], 'Sarah Connor')

    def test_user_registration_duplicate_email(self):
        payload = {
            'name': 'Another User',
            'email': 'existing@example.com',
            'password': 'StrongPassword2026!',
            'password_confirm': 'StrongPassword2026!'
        }
        response = self.client.post('/api/auth/register/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_user_registration_password_mismatch(self):
        payload = {
            'name': 'Mismatch User',
            'email': 'mismatch@example.com',
            'password': 'PasswordOne123!',
            'password_confirm': 'PasswordTwo123!'
        }
        response = self.client.post('/api/auth/register/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password_confirm', response.data)

    def test_user_login_success(self):
        payload = {
            'email': 'existing@example.com',
            'password': 'TestPassword123!'
        }
        response = self.client.post('/api/auth/login/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['email'], 'existing@example.com')

    def test_user_login_invalid_password(self):
        payload = {
            'email': 'existing@example.com',
            'password': 'WrongPassword!'
        }
        response = self.client.post('/api/auth/login/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_me_endpoint_requires_auth(self):
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_profile_update(self):
        login_resp = self.client.post('/api/auth/login/', {
            'email': 'existing@example.com',
            'password': 'TestPassword123!'
        }, format='json')
        token = login_resp.data['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')

        patch_payload = {
            'name': 'Updated Name',
            'city': 'Seattle',
            'country': 'United States'
        }
        response = self.client.patch('/api/auth/profile/', patch_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Name')
        self.assertEqual(response.data['profile']['city'], 'Seattle')
