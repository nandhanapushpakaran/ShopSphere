from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from products.models import Category, Product


class ProductCatalogTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.cat_electronics = Category.objects.create(name='Electronics', slug='electronics')
        self.cat_home = Category.objects.create(name='Home & Living', slug='home-living')

        self.p1 = Product.objects.create(
            category=self.cat_electronics,
            name='Noise Cancelling Headphones',
            description='Immersive wireless sound',
            price=Decimal('150.00'),
            stock_quantity=10,
            is_active=True
        )
        self.p2 = Product.objects.create(
            category=self.cat_electronics,
            name='Mechanical Gaming Keyboard',
            description='Custom switches and lighting',
            price=Decimal('100.00'),
            stock_quantity=5,
            is_active=True
        )
        self.p3 = Product.objects.create(
            category=self.cat_home,
            name='Ceramic Coffee Mug',
            description='Stoneware artisan cup',
            price=Decimal('25.00'),
            stock_quantity=20,
            is_active=True
        )
        self.inactive_product = Product.objects.create(
            category=self.cat_electronics,
            name='Discontinued Gadget',
            description='Not for sale',
            price=Decimal('50.00'),
            stock_quantity=0,
            is_active=False
        )

    def test_list_categories(self):
        response = self.client.get('/api/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_list_products_excludes_inactive(self):
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Inactive product must not appear
        self.assertEqual(response.data['count'], 3)

    def test_search_products(self):
        response = self.client.get('/api/products/?search=Keyboard')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['name'], 'Mechanical Gaming Keyboard')

    def test_filter_by_category(self):
        response = self.client.get('/api/products/?category=home-living')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['name'], 'Ceramic Coffee Mug')

    def test_sort_products_by_price_ascending(self):
        response = self.client.get('/api/products/?ordering=price')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        prices = [float(p['price']) for p in response.data['results']]
        self.assertEqual(prices, [25.00, 100.00, 150.00])

    def test_product_detail(self):
        response = self.client.get(f'/api/products/{self.p1.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Noise Cancelling Headphones')
        self.assertTrue(response.data['is_in_stock'])
