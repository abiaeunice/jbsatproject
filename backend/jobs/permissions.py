from rest_framework import permissions


class IsEmployer(permissions.BasePermission):
    """
    Permission class to ensure only employers can create/manage jobs.
    """
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_employer()


class IsJobOwner(permissions.BasePermission):
    """
    Permission class to ensure only the job owner can edit/delete their jobs.
    """
    
    def has_object_permission(self, request, view, obj):
        return obj.employer == request.user