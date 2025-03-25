from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from django.core.mail import send_mail
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import Perfil

User = get_user_model()

class UsuarioView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "nome": user.nome_completo,
            "nip": user.nip,
            "email": user.email,
            "perfis": [p.nome for p in user.perfis.all()],  
            "perfil_ativo": user.perfil_ativo.nome if user.perfil_ativo else None 
        })
        
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get(self, request):
        return Response(UserSerializer(request.user).data)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old = request.data.get('old_password')
        new = request.data.get('new_password')
        if not user.check_password(old):
            return Response({"error": "Senha atual incorreta"}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new)
        user.save()
        return Response({"message": "Senha alterada com sucesso"})
    
class TrocarPerfilView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        perfil_nome = request.data.get('perfil')
        try:
            perfil = Perfil.objects.get(nome=perfil_nome)
            user = request.user
            if perfil in user.perfis.all():
                user.perfil_ativo = perfil
                user.save()
                return Response({'detail': 'Perfil ativo atualizado com sucesso.'})
            return Response({'error': 'Perfil não permitido.'}, status=403)
        except Perfil.DoesNotExist:
            return Response({'error': 'Perfil não encontrado.'}, status=404)  