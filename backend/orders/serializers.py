from rest_framework import serializers
from products.models import Product
from .models import Order, OrderItem


class OrderItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(required=True)
    quantity = serializers.IntegerField(min_value=1, required=True)


class OrderItemDetailSerializer(serializers.ModelSerializer):
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            'id',
            'product',
            'product_name',
            'product_image',
            'unit_price',
            'quantity',
            'subtotal',
        ]

    def get_product_image(self, obj):
        if obj.product and obj.product.image:
            return obj.product.image
        return None


class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemDetailSerializer(many=True, read_only=True)
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id',
            'order_number',
            'status',
            'total_amount',
            'full_name',
            'email',
            'address',
            'city',
            'postal_code',
            'country',
            'items',
            'item_count',
            'created_at',
            'updated_at',
        ]

    def get_item_count(self, obj):
        return sum(item.quantity for item in obj.items.all())


class OrderCreateSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150, required=True)
    email = serializers.EmailField(required=True)
    address = serializers.CharField(max_length=255, required=True)
    city = serializers.CharField(max_length=100, required=True)
    postal_code = serializers.CharField(max_length=20, required=True)
    country = serializers.CharField(max_length=100, required=True)
    items = OrderItemInputSerializer(many=True, required=True)

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError('Order must contain at least one item.')
        return value
