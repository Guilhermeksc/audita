from django.utils.deprecation import MiddlewareMixin

class AirflowAuthMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        if request.user.is_authenticated:
            # Add Airflow authentication headers
            response['X-Remote-User'] = request.user.nip
            response['X-Remote-User-Email'] = request.user.email or ''
            response['X-Remote-User-Firstname'] = request.user.nome_completo.split()[0]
            response['X-Remote-User-Lastname'] = ' '.join(request.user.nome_completo.split()[1:])
            response['X-Remote-User-Roles'] = ','.join([p.nome for p in request.user.perfis.all()])
        return response 