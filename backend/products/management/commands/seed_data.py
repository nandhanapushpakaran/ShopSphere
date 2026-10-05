from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from products.models import Category, Product
from users.models import UserProfile


class Command(BaseCommand):
    help = 'Seeds database with realistic ShopSphere categories, products, and a demo account.'

    def handle(self, *args, **options):
        self.stdout.write('Seeding ShopSphere database...')

        # 1. Categories
        categories_data = [
            {
                'name': 'Electronics',
                'slug': 'electronics',
                'description': 'Smart devices, audio equipment, and workspace technology essentials.'
            },
            {
                'name': 'Clothing',
                'slug': 'clothing',
                'description': 'Timeless essentials made with organic and premium sustainable textiles.'
            },
            {
                'name': 'Home & Living',
                'slug': 'home-living',
                'description': 'Architectural lighting, minimalist decor, and artisanal homeware.'
            },
            {
                'name': 'Beauty',
                'slug': 'beauty',
                'description': 'Clean botanical skincare and everyday personal care formulations.'
            },
            {
                'name': 'Accessories',
                'slug': 'accessories',
                'description': 'Full-grain leather goods, carry gear, and refined day-to-day accessories.'
            },
        ]

        category_objs = {}
        for cat in categories_data:
            obj, created = Category.objects.get_or_create(
                slug=cat['slug'],
                defaults={'name': cat['name'], 'description': cat['description']}
            )
            category_objs[cat['slug']] = obj
            status = 'Created' if created else 'Existing'
            self.stdout.write(f"  [{status}] Category: {obj.name}")

        # 2. Products
        products_data = [
            {
                'category': category_objs['electronics'],
                'name': 'Aura Wireless Noise-Cancelling Headphones',
                'description': 'Engineered with custom 40mm dynamic drivers and active noise cancellation. Features up to 40 hours of battery life and plush memory foam earcups.',
                'price': Decimal('189.99'),
                'stock_quantity': 24,
                'image': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
                'is_active': True,
            },
            {
                'category': category_objs['electronics'],
                'name': 'Minimalist Mechanical Keyboard',
                'description': 'Compact 75% layout with hot-swappable tactile switches, CNC anodized aluminum frame, and customizable warm white backlighting.',
                'price': Decimal('129.50'),
                'stock_quantity': 15,
                'image': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
                'is_active': True,
            },
            {
                'category': category_objs['home-living'],
                'name': 'Nordic Ceramic Coffee Dripper & Mug Set',
                'description': 'Artisanal speckled stoneware pour-over dripper paired with an ergonomic 350ml hand-thrown mug. Matte glazed finish.',
                'price': Decimal('42.00'),
                'stock_quantity': 35,
                'image': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
                'is_active': True,
            },
            {
                'category': category_objs['clothing'],
                'name': 'Organic Heavyweight Cotton Crewneck',
                'description': 'Crafted from 400 GSM brushed organic French terry cotton. Preshrunk with ribbed hems and relaxed dropped shoulders.',
                'price': Decimal('58.00'),
                'stock_quantity': 18,
                'image': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
                'is_active': True,
            },
            {
                'category': category_objs['home-living'],
                'name': 'Architectural Matte Desk Lamp',
                'description': 'Precision-balanced articulated cantilever arm with touch-sensitive dimmable LED temperature adjustment (2700K - 5000K).',
                'price': Decimal('85.00'),
                'stock_quantity': 12,
                'image': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
                'is_active': True,
            },
            {
                'category': category_objs['accessories'],
                'name': 'Vegetable-Tanned Italian Leather Cardholder',
                'description': 'Hand-stitched full-grain Tuscan leather with 5 card slots and central folded cash compartment. Develops a rich natural patina over time.',
                'price': Decimal('45.00'),
                'stock_quantity': 40,
                'image': 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
                'is_active': True,
            },
            {
                'category': category_objs['beauty'],
                'name': 'Hydrating Botanical Face Serum (50ml)',
                'description': 'Formulated with hyaluronic acid, niacinamide, and cold-pressed squalane. Restores lipid barrier and locks in deep cellular hydration.',
                'price': Decimal('38.50'),
                'stock_quantity': 28,
                'image': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
                'is_active': True,
            },
            {
                'category': category_objs['electronics'],
                'name': 'Ultra-Slim 20000mAh Power Bank',
                'description': '65W Power Delivery fast charging supports laptops, tablets, and smartphones. Aircraft-grade anodized aluminum enclosure.',
                'price': Decimal('49.99'),
                'stock_quantity': 50,
                'image': 'https://images.unsplash.com/photo-1609592807694-dfc1dfa0134b?w=800&q=80',
                'is_active': True,
            },
            {
                'category': category_objs['accessories'],
                'name': 'Waterproof Canvas Everyday Backpack',
                'description': '20L commuter backpack with padded 16-inch laptop compartment, weather-sealed YKK zippers, and breathable mesh back panel.',
                'price': Decimal('110.00'),
                'stock_quantity': 16,
                'image': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
                'is_active': True,
            },
            {
                'category': category_objs['clothing'],
                'name': 'Linen Relaxed Fit Overshirt',
                'description': 'Breathable 100% Normandy flax linen. Features mother-of-pearl buttons, twin chest flap pockets, and a casual straight hem.',
                'price': Decimal('72.00'),
                'stock_quantity': 22,
                'image': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
                'is_active': True,
            },
            {
                'category': category_objs['home-living'],
                'name': 'Sculptural Soy Wax Candle (Cedar & Fig)',
                'description': 'Hand-poured 100% natural soy wax with crackling wood wick. Fragrance notes of wild fig leaf, smoked cedarwood, and amber.',
                'price': Decimal('28.00'),
                'stock_quantity': 30,
                'image': 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80',
                'is_active': True,
            },
            {
                'category': category_objs['electronics'],
                'name': 'Studio Monitor Wireless Earbuds',
                'description': 'Flagship wireless earbuds with custom balanced armature drivers, low-latency gaming mode, and IPX7 water resistance.',
                'price': Decimal('99.00'),
                'stock_quantity': 0,  # Demonstrating out-of-stock UI state
                'image': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
                'is_active': True,
            },
        ]

        for p_data in products_data:
            obj, created = Product.objects.get_or_create(
                name=p_data['name'],
                defaults=p_data
            )
            status = 'Created' if created else 'Existing'
            self.stdout.write(f"  [{status}] Product: {obj.name} (, Stock: {obj.stock_quantity})")

        # 3. Demo User for local development testing
        demo_username = 'demouser'
        demo_email = 'demo@shopsphere.dev'
        demo_password = 'DemoUser2026!'

        user, user_created = User.objects.get_or_create(
            username=demo_username,
            defaults={
                'email': demo_email,
                'first_name': 'Alex',
                'last_name': 'Rivera',
            }
        )
        if user_created:
            user.set_password(demo_password)
            user.save()
            # Update profile shipping defaults
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.address = '742 Evergreen Terrace'
            profile.city = 'San Francisco'
            profile.postal_code = '94102'
            profile.country = 'United States'
            profile.save()
            self.stdout.write(self.style.SUCCESS(
                f"\nLocal Demo User Created:\n  Username: {demo_username}\n  Email: {demo_email}\n  Password: {demo_password}\n  (Note: For local testing only)"
            ))
        else:
            self.stdout.write(f"\nLocal Demo User already exists: {demo_username}")

        self.stdout.write(self.style.SUCCESS('\nShopSphere demo data seeding complete!'))
