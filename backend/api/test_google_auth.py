from unittest.mock import patch
from django.test import TestCase, Client
from api.models import SiteSettings, Patient
import json

class GoogleAuthTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.settings = SiteSettings.get()
        self.settings.google_enabled = True
        self.settings.google_client_id = "test-client-id.apps.googleusercontent.com"
        self.settings.save()

    @patch("google.oauth2.id_token.verify_oauth2_token")
    def test_google_login_new_user_success(self, mock_verify):
        # Mock Google token info returned upon verification
        mock_verify.return_value = {
            "email": "nuevo.usuario@gmail.com",
            "email_verified": True,
            "given_name": "Juan",
            "family_name": "Perez",
            "sub": "1234567890"
        }

        response = self.client.post(
            "/api/auth/google/",
            data=json.dumps({"credential": "mock-valid-google-jwt-token"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["ok"])
        self.assertIn("token", data["data"])
        
        # Verify user was created in the database
        patient = Patient.objects.get(email="nuevo.usuario@gmail.com")
        self.assertEqual(patient.first_name, "Juan")
        self.assertEqual(patient.last_name, "Perez")
        self.assertEqual(patient.username, "nuevo.usuario.gmail.com")
        self.assertEqual(patient.password_hash, "")

    @patch("google.oauth2.id_token.verify_oauth2_token")
    def test_google_login_existing_user_success(self, mock_verify):
        # Pre-create user in DB
        Patient.objects.create(
            first_name="Miguel",
            last_name="Gomez",
            email="miguel@gmail.com",
            username="miguel.gomez",
            is_active=True
        )

        mock_verify.return_value = {
            "email": "miguel@gmail.com",
            "email_verified": True,
            "given_name": "Miguel",
            "family_name": "Gomez",
            "sub": "1234567890"
        }

        response = self.client.post(
            "/api/auth/google/",
            data=json.dumps({"credential": "mock-valid-google-jwt-token"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["ok"])
        
        # Verify it found the existing user and didn't create a duplicate
        self.assertEqual(Patient.objects.filter(email="miguel@gmail.com").count(), 1)

    @patch("google.oauth2.id_token.verify_oauth2_token")
    def test_google_login_unverified_email_fails(self, mock_verify):
        mock_verify.return_value = {
            "email": "unverified@gmail.com",
            "email_verified": False,
            "given_name": "Unverified",
            "family_name": "User",
            "sub": "1234567890"
        }

        response = self.client.post(
            "/api/auth/google/",
            data=json.dumps({"credential": "mock-unverified-email-jwt"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 401)
        data = response.json()
        self.assertFalse(data["ok"])
        self.assertEqual(data["error"], "El correo de Google no está verificado")

    @patch("google.oauth2.id_token.verify_oauth2_token")
    def test_google_login_inactive_user_fails(self, mock_verify):
        # Create an inactive user in DB
        Patient.objects.create(
            first_name="Inactive",
            last_name="User",
            email="inactive@gmail.com",
            username="inactive.user",
            is_active=False
        )

        mock_verify.return_value = {
            "email": "inactive@gmail.com",
            "email_verified": True,
            "given_name": "Inactive",
            "family_name": "User",
            "sub": "1234567890"
        }

        response = self.client.post(
            "/api/auth/google/",
            data=json.dumps({"credential": "mock-valid-token"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 403)
        data = response.json()
        self.assertFalse(data["ok"])
        self.assertEqual(data["error"], "Tu cuenta está inactiva")

    def test_google_login_disabled_fails(self):
        self.settings.google_enabled = False
        self.settings.save()

        response = self.client.post(
            "/api/auth/google/",
            data=json.dumps({"credential": "mock-token"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertFalse(data["ok"])
        self.assertEqual(data["error"], "El inicio de sesión con Google no está activo")
