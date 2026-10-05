from decimal import Decimal
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from products.models import Category, Product
from orders.models import Order, OrderItem


class OrderSystemSecurityTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.user_a = User.objects.create_user(
            username='user_a@example.com',
            email='user_a@example.com',
            password='Password123!'
        )
        self.user_b = User.objects.create_user(
            username='user_b@example.com',
            email='user_b@example.com',
            password='Password123!'
        )

        category = Category.objects.create(name='Gadgets', slug='gadgets')
        self.product = Product.objects.create(
            category=category,
            name='Precision Wireless Mouse',
            description='Ergonomic wireless mouse',
            price=Decimal('60.00'),
            stock_quantity=10,
            is_active=True
        )

    def test_order_creation_requires_auth(self):
        payload = {
            'full_name': 'Anonymous',
            'email': 'anon@example.com',
            'address': '123 Ghost St',
            'city': 'Nowhere',
            'postal_code': '00000',
            'country': 'US',
            'items': [{'product_id': self.product.id, 'quantity': 1}]
        }
        response = self.client.post('/api/orders/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_order_total_calculated_on_backend_and_stock_reduced(self):
        self.client.force_authenticate(user=self.user_a)

        # Frontend attempts to send fake price (.00) or total
        payload = {
            'full_name': 'Alice User',
            'email': 'alice@example.com',
            'address': '100 Main St',
            'city': 'San Francisco',
            'postal_code': '94105',
            'country': 'United States',
            'price': '1.00',  # FAKE: must be ignored
            'total_amount': '1.00',  # FAKE: must be ignored
            'items': [
                {'product_id': self.product.id, 'quantity': 3, 'price': '1.00'}
            ]
        }
        response = self.client.post('/api/orders/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verification 1: Total must be 3 * 60.00 = 180.00
        self.assertEqual(Decimal(str(response.data['total_amount'])), Decimal('180.00'))

        # Verification 2: Stock must be reduced from 10 to 7
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 7)

        # Verification 3: Snapshots are preserved in OrderItem
        order = Order.objects.get(id=response.data['id'])
        item = order.items.first()
        self.assertEqual(item.product_name, 'Precision Wireless Mouse')
        self.assertEqual(item.unit_price, Decimal('60.00'))
        self.assertEqual(item.subtotal, Decimal('180.00'))

    def test_order_creation_fails_when_exceeding_stock(self):
        self.client.force_authenticate(user=self.user_a)

        payload = {
            'full_name': 'Alice User',
            'email': 'alice@example.com',
            'address': '100 Main St',
            'city': 'San Francisco',
            'postal_code': '94105',
            'country': 'United States',
            'items': [
                {'product_id': self.product.id, 'quantity': 15}  # Only 10 in stock
            ]
        }
        response = self.client.post('/api/orders/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Insufficient stock', response.data['detail'])

        # Stock remains untouched
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 10)

    def test_user_cannot_access_another_users_order(self):
        # Create order belonging to user_a
        order_a = Order.objects.create(
            user=self.user_a,
            total_amount=Decimal('60.00'),
            full_name='Alice User',
            email='alice@example.com',
            address='100 Main St',
            city='San Francisco',
            postal_code='94105',
            country='United States'
        )

        # User B attempts to access User A's order
        self.client.force_authenticate(user=self.user_b)
        response = self.client.get(f'/api/orders/{order_a.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # User B's order list must be empty
        list_response = self.client.get('/api/orders/')
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_response.data), 0)

        # User A CAN access their own order
        self.client.force_authenticate(user=self.user_a)
        owner_response = self.client.get(f'/api/orders/{order_a.id}/')
        self.assertEqual(owner_response.status_code, status.HTTP_200_OK)
        self.assertEqual(owner_response.data['id'], order_a.id)
