from decimal import Decimal
from django.db import transaction
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from products.models import Product
from .models import Order, OrderItem
from .serializers import (
    OrderCreateSerializer,
    OrderDetailSerializer,
)


class OrderListCreateView(APIView):
    """
    List user orders or place a new order with atomic stock validation.
    Requires authentication.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).prefetch_related('items__product')
        serializer = OrderDetailSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data
        items_data = validated_data['items']

        try:
            with transaction.atomic():
                total_amount = Decimal('0.00')
                prepared_items = []

                # Group duplicate items if user added same product multiple times in list
                aggregated_quantities = {}
                for item in items_data:
                    pid = item['product_id']
                    qty = item['quantity']
                    aggregated_quantities[pid] = aggregated_quantities.get(pid, 0) + qty

                # Validate and lock each product
                for product_id, requested_qty in aggregated_quantities.items():
                    try:
                        product = Product.objects.select_for_update().get(id=product_id)
                    except Product.DoesNotExist:
                        return Response(
                            {'detail': f'Product with ID {product_id} does not exist.'},
                            status=status.HTTP_404_NOT_FOUND
                        )

                    if not product.is_active:
                        return Response(
                            {'detail': f'Product "{product.name}" is no longer available.'},
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    if product.stock_quantity < requested_qty:
                        return Response(
                            {
                                'detail': (
                                    f"Insufficient stock for '{product.name}'. "
                                    f"Available: {product.stock_quantity}, requested: {requested_qty}."
                                )
                            },
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    # Compute price securely on backend from database price
                    unit_price = product.price
                    subtotal = unit_price * requested_qty
                    total_amount += subtotal

                    prepared_items.append({
                        'product': product,
                        'product_name': product.name,
                        'unit_price': unit_price,
                        'quantity': requested_qty,
                        'subtotal': subtotal
                    })

                # Create Order
                order = Order.objects.create(
                    user=request.user,
                    status='CONFIRMED',
                    total_amount=total_amount,
                    full_name=validated_data['full_name'],
                    email=validated_data['email'],
                    address=validated_data['address'],
                    city=validated_data['city'],
                    postal_code=validated_data['postal_code'],
                    country=validated_data['country'],
                )

                # Create OrderItems and reduce stock
                for item_info in prepared_items:
                    OrderItem.objects.create(
                        order=order,
                        product=item_info['product'],
                        product_name=item_info['product_name'],
                        unit_price=item_info['unit_price'],
                        quantity=item_info['quantity'],
                        subtotal=item_info['subtotal'],
                    )

                    # Reduce product stock safely
                    item_info['product'].stock_quantity -= item_info['quantity']
                    item_info['product'].save(update_fields=['stock_quantity', 'updated_at'])

                return Response(
                    OrderDetailSerializer(order).data,
                    status=status.HTTP_201_CREATED
                )

        except Exception as e:
            return Response(
                {'detail': 'An unexpected error occurred while processing your order. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class OrderDetailView(APIView):
    """
    Retrieve single order by order number or id. Strictly authenticated and authorized to owner.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, identifier):
        # Query by order_number or id, strictly matching request.user
        queryset = Order.objects.prefetch_related('items__product').filter(user=request.user)
        if identifier.isdigit():
            order = queryset.filter(id=int(identifier)).first()
        else:
            order = queryset.filter(order_number__iexact=identifier).first()

        if not order:
            return Response(
                {'detail': 'Order not found or you do not have permission to view it.'},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(OrderDetailSerializer(order).data)
