from rest_framework import permissions


class IsSeeker(permissions.BasePermission):
    """
    Permission class to ensure only job seekers can apply for jobs.
    """
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_seeker()


class IsJobEmployer(permissions.BasePermission):
    """
    Permission class to ensure only the job's employer can view/manage its applications.
    Checks both general permission and object-level permission.
    """
    
    def has_permission(self, request, view):
        # User must be authenticated and be an employer
        return request.user.is_authenticated and request.user.is_employer()

    def has_object_permission(self, request, view, obj):
        # For Application objects, check if user owns the job
        return obj.job.employer == request.user