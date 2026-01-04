from rest_framework import serializers
from .models import Job


class JobSerializer(serializers.ModelSerializer):
    status = serializers.CharField(read_only=True)
    employer_name = serializers.CharField(source='employer.full_name', read_only=True)
    application_count = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id',
            'employer',
            'employer_name',
            'title',
            'description',
            'location',
            'employment_type',
            'created_at',
            'application_deadline',
            'status',
            'application_count',
        ]
        read_only_fields = ['id', 'employer', 'created_at']

    def get_application_count(self, obj):
        return obj.applications.count()

    def validate_application_deadline(self, value):
        from django.utils import timezone
        if value <= timezone.now():
            raise serializers.ValidationError("Deadline must be in the future")
        return value


class JobListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for job listings"""
    status = serializers.CharField(read_only=True)
    employer_name = serializers.CharField(source='employer.full_name', read_only=True)

    class Meta:
        model = Job
        fields = [
            'id',
            'title',
            'location',
            'employment_type',
            'created_at',
            'application_deadline',
            'status',
            'employer_name',
        ]