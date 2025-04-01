from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from django.core.mail import send_mail
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import Perfil
import requests
from rest_framework.decorators import action
from django.conf import settings

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

class AirflowDAGViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    def _get_airflow_api_url(self, endpoint):
        return f"http://airflow:8080/api/v1/{endpoint}"
    
    def _make_airflow_request(self, method, endpoint, data=None):
        headers = {
            'Content-Type': 'application/json',
            'X-Remote-User': self.request.user.nip,
            'X-Remote-User-Email': self.request.user.email or '',
            'X-Remote-User-Firstname': self.request.user.nome_completo.split()[0],
            'X-Remote-User-Lastname': ' '.join(self.request.user.nome_completo.split()[1:]),
            'X-Remote-User-Roles': ','.join([p.nome for p in self.request.user.perfis.all()])
        }
        
        url = self._get_airflow_api_url(endpoint)
        response = requests.request(method, url, json=data, headers=headers)
        return response.json() if response.ok else {'error': response.text}, response.status_code
    
    @action(detail=False, methods=['get'])
    def list_dags(self, request):
        data, status_code = self._make_airflow_request('GET', 'dags')
        return Response(data, status=status_code)
    
    @action(detail=True, methods=['post'])
    def trigger_dag(self, request, pk=None):
        data, status_code = self._make_airflow_request('POST', f'dags/{pk}/dagRuns', request.data)
        return Response(data, status=status_code)
    
    @action(detail=True, methods=['get'])
    def dag_runs(self, request, pk=None):
        data, status_code = self._make_airflow_request('GET', f'dags/{pk}/dagRuns')
        return Response(data, status=status_code)
    
    @action(detail=True, methods=['get'])
    def dag_details(self, request, pk=None):
        data, status_code = self._make_airflow_request('GET', f'dags/{pk}')
        return Response(data, status=status_code)  