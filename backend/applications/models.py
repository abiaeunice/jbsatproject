from django.db import models
from users.models import User
from jobs.models import Job


class Application(models.Model):
    STATUS_CHOICES = [
        ('NEW', 'New'),
        ('REVIEWING', 'Reviewing'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
    ]

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    seeker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    resume_url = models.CharField(max_length=500)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='NEW')
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'applications'
        ordering = ['-applied_at']
        # Constraint: A seeker can apply only once per job
        unique_together = ['job', 'seeker']

    def __str__(self):
        return f"{self.seeker.email} - {self.job.title}"