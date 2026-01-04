from django.db import models
from django.utils import timezone
from users.models import User


class Job(models.Model):
    EMPLOYMENT_TYPE_CHOICES = [
        ('FULL_TIME', 'Full Time'),
        ('PART_TIME', 'Part Time'),
        ('CONTRACT', 'Contract'),
        ('INTERNSHIP', 'Internship'),
    ]

    employer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    application_deadline = models.DateTimeField()

    class Meta:
        db_table = 'jobs'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def is_open(self):
        """Derive job status based on deadline"""
        return self.application_deadline >= timezone.now()

    @property
    def status(self):
        """Property for serializer access"""
        return 'Open' if self.is_open() else 'Closed'