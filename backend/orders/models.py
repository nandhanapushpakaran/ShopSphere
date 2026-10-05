import uuid
from django.db import models
from django.contrib.auth.models import User
from products.models import Product


class Order(models.Model):
    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("CONFIRMED", "Confirmed"),
        ("PROCESSING", "Processing"),
        ("SHIPPED", "Shipped"),
        ("DELIVERED", "Delivered"),
        ("CANCELLED", "Cancelled"),
    )

    order_number = models.CharField(max_length=32, unique=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="CONFIRMED")
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    # Shipping information
    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "-created_at"]),
            models.Index(fields=["order_number"]),
        ]

    def __str__(self):
        return f"Order #{self.order_number} ({self.status})"

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = f"SPH-{uuid.uuid4().hex[:10].upper()}"
        super().save(*args, **kwargs)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="order_items"
    )
    product_name = models.CharField(max_length=200)  # Historical snapshot
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)  # Historical snapshot
    quantity = models.PositiveIntegerField(default=1)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)  # Snapshot

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.quantity}x {self.product_name} in {self.order.order_number}"

    def save(self, *args, **kwargs):
        if not self.subtotal and self.unit_price and self.quantity:
            self.subtotal = self.unit_price * self.quantity
        super().save(*args, **kwargs)

