from django.urls import path
from . import views

urlpatterns = [
    path('public/', views.public_jobs, name='public-jobs'),
    path('employer/', views.employer_jobs, name='employer-jobs'),
    path('employer/<int:pk>/', views.employer_job_detail, name='employer-job-detail'),
]