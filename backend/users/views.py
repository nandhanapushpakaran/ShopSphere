from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserDetailSerializer,
    ProfileUpdateSerializer
)


class RegisterView(APIView):
    """
    Register a new user account and return an authentication token.
    Public access.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            user_data = UserDetailSerializer(user).data
            return Response(
                {
                    'token': token.key,
                    'user': user_data,
                    'message': 'Account created successfully.'
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    Authenticate user by email and password, returning an auth token.
    Public access.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email'].strip().lower()
        password = serializer.validated_data['password']

        # Attempt to find user by email
        user_obj = User.objects.filter(email__iexact=email).first()
        if not user_obj:
            user_obj = User.objects.filter(username__iexact=email).first()

        if user_obj:
            user = authenticate(request, username=user_obj.username, password=password)
            if user:
                if not user.is_active:
                    return Response(
                        {'detail': 'This account has been deactivated.'},
                        status=status.HTTP_403_FORBIDDEN
                    )
                token, _ = Token.objects.get_or_create(user=user)
                user_data = UserDetailSerializer(user).data
                return Response({
                    'token': token.key,
                    'user': user_data,
                    'message': 'Logged in successfully.'
                })

        return Response(
            {'detail': 'Invalid email or password.'},
            status=status.HTTP_401_UNAUTHORIZED
        )


class LogoutView(APIView):
    """
    Revoke authentication token for the current user.
    Requires authentication.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            # Delete token associated with the user
            request.user.auth_token.delete()
        except Exception:
            pass
        return Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)


class ProfileView(APIView):
    """
    Retrieve or update profile details for the authenticated user.
    Requires authentication.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = ProfileUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            updated_user = serializer.save()
            return Response(UserDetailSerializer(updated_user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
