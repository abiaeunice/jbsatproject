from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Job
from .serializers import JobSerializer, JobListSerializer
from .permissions import IsEmployer, IsJobOwner


@api_view(['GET'])
@permission_classes([AllowAny])
def public_jobs(request):
    """Public job listings - accessible to everyone"""
    jobs = Job.objects.select_related('employer').all()
    serializer = JobListSerializer(jobs, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
@permission_classes([IsEmployer])
def employer_jobs(request):
    """Employer job management"""
    
    if request.method == 'GET':
        # Get all jobs for this employer
        jobs = Job.objects.filter(employer=request.user).select_related('employer')
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Create new job
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(employer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsEmployer, IsJobOwner])
def employer_job_detail(request, pk):
    """Manage individual job"""
    
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response(
            {'error': 'Job not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Check object-level permission
    if job.employer != request.user:
        return Response(
            {'error': 'You do not have permission to modify this job'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if request.method == 'GET':
        serializer = JobSerializer(job)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = JobSerializer(job, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        job.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)