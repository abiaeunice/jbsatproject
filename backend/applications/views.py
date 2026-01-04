from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db import IntegrityError
from jobs.models import Job
from .models import Application
from .serializers import ApplicationSerializer, ApplicationStatusSerializer
from .permissions import IsSeeker, IsJobEmployer


@api_view(['POST'])
@permission_classes([IsSeeker])
def apply_for_job(request):
    """Seeker applies for a job"""
    
    job_id = request.data.get('job')
    resume_url = request.data.get('resume_url')
    
    if not job_id or not resume_url:
        return Response(
            {'error': 'job and resume_url are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        job = Job.objects.get(pk=job_id)
    except Job.DoesNotExist:
        return Response(
            {'error': 'Job not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Check if job is still open
    if not job.is_open():
        return Response(
            {'error': 'This job is no longer accepting applications'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Create application
        application = Application.objects.create(
            job=job,
            seeker=request.user,
            resume_url=resume_url
        )
        serializer = ApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    except IntegrityError:
        # Duplicate application (unique constraint violation)
        return Response(
            {'error': 'You have already applied for this job'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
@api_view(['GET'])
@permission_classes([IsSeeker])
def my_applications(request):
    """Get all applications for the current seeker"""
    applications = Application.objects.filter(seeker=request.user).select_related('job')
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsJobEmployer])
def job_applications(request, job_id):
    """Get all applications for a specific job (employer only)"""
    
    try:
        job = Job.objects.get(pk=job_id)
    except Job.DoesNotExist:
        return Response(
            {'error': 'Job not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Verify employer owns this job
    if job.employer != request.user:
        return Response(
            {'error': 'You do not have permission to view these applications'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    applications = Application.objects.filter(job=job).select_related('seeker', 'job')
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsJobEmployer])
def update_application_status(request, pk):
    """Update application status (Accept/Reject)"""
    
    try:
        application = Application.objects.select_related('job').get(pk=pk)
    except Application.DoesNotExist:
        return Response(
            {'error': 'Application not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Verify employer owns the job
    if application.job.employer != request.user:
        return Response(
            {'error': 'You do not have permission to modify this application'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = ApplicationStatusSerializer(application, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsJobEmployer])
def employer_dashboard(request):
    """Dashboard stats for employer"""
    
    jobs = Job.objects.filter(employer=request.user)
    applications = Application.objects.filter(job__employer=request.user)
    
    stats = {
        'jobs': jobs.count(),
        'applications': applications.count(),
        'accepted': applications.filter(status='ACCEPTED').count(),
        'rejected': applications.filter(status='REJECTED').count(),
    }
    
    return Response(stats)