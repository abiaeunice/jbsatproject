from django.urls import path
from . import views

urlpatterns = [
    path('apply/', views.apply_for_job, name='apply-for-job'),
    path('job/<int:job_id>/', views.job_applications, name='job-applications'),
    path('<int:pk>/status/', views.update_application_status, name='update-application-status'),
    path('employer/dashboard/', views.employer_dashboard, name='employer-dashboard'),
    path('my-applications/', views.my_applications, name='my-applications'),

]