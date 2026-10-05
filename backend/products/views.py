from django.db.models import Q
from rest_framework import generics, permissions
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class CategoryListView(generics.ListAPIView):
    """
    API view to retrieve list of all product categories.
    Public access.
    """
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None  # Categories list should return full list


class ProductListView(generics.ListAPIView):
    """
    API view to list products with search, category filtering, and sorting.
    Public access.
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True).select_related('category')

        # 1. Search filter (?search=...)
        search = self.request.query_params.get('search', '').strip()
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )

        # 2. Category filter (?category=slug)
        category_slug = self.request.query_params.get('category', '').strip()
        if category_slug and category_slug.lower() != 'all':
            queryset = queryset.filter(category__slug=category_slug)

        # 3. Featured filter (?featured=true)
        featured = self.request.query_params.get('featured', '').strip().lower()
        if featured in ('true', '1'):
            queryset = queryset.filter(stock_quantity__gt=0)[:8]
            return queryset

        # 4. Sorting (?ordering=...)
        ordering = self.request.query_params.get('ordering', '-created_at').strip()
        allowed_ordering = {
            'price': 'price',
            '-price': '-price',
            'name': 'name',
            '-name': '-name',
            'created_at': 'created_at',
            '-created_at': '-created_at',
        }
        order_field = allowed_ordering.get(ordering, '-created_at')
        return queryset.order_by(order_field)


class ProductDetailView(generics.RetrieveAPIView):
    """
    API view to retrieve single product by ID or slug.
    Public access.
    """
    queryset = Product.objects.filter(is_active=True).select_related('category')
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'id'
