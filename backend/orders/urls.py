from django.urls import path
from .views import OrderListCreateView, OrderDetailView

urlpatterns = [
    path('', OrderListCreateView.as_view(), name='order-list-create'),
    path('<str:identifier>/', OrderDetailView.as_view(), name='order-detail'),
]
