from rest_framework import serializers
from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    # Expose flat fields instead of nested objects
    seeker_name = serializers.CharField(source='seeker.full_name', read_only=True)
    seeker_email = serializers.CharField(source='seeker.email', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id',
            'job',
            'job_title',
            'seeker',
            'seeker_name',
            'seeker_email',
            'resume_url',
            'status',
            'applied_at',
        ]
        read_only_fields = ['id', 'seeker', 'applied_at', 'status']


class ApplicationStatusSerializer(serializers.ModelSerializer):
    """Serializer for updating application status"""
    
    class Meta:
        model = Application
        fields = ['id', 'status']
        read_only_fields = ['id']

    def validate_status(self, value):
        if value not in ['NEW', 'REVIEWING', 'ACCEPTED', 'REJECTED']:
            raise serializers.ValidationError("Invalid status")
        return value