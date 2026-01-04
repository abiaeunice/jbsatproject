from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from users.models import User
from jobs.models import Job
from applications.models import Application


class Command(BaseCommand):
    help = 'Seed database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')

        # Clear existing data
        Application.objects.all().delete()
        Job.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()

        # Create Employers
        employer1 = User.objects.create_user(
            email='employer1@example.com',
            password='password123',
            full_name='Tech Corp HR',
            role='EMPLOYER'
        )

        employer2 = User.objects.create_user(
            email='employer2@example.com',
            password='password123',
            full_name='StartUp Inc',
            role='EMPLOYER'
        )

        # Create Seekers
        seeker1 = User.objects.create_user(
            email='seeker1@example.com',
            password='password123',
            full_name='John Doe',
            role='SEEKER'
        )

        seeker2 = User.objects.create_user(
            email='seeker2@example.com',
            password='password123',
            full_name='Jane Smith',
            role='SEEKER'
        )

        seeker3 = User.objects.create_user(
            email='seeker3@example.com',
            password='password123',
            full_name='Mike Johnson',
            role='SEEKER'
        )

        # Create Open Jobs
        job1 = Job.objects.create(
            employer=employer1,
            title='Senior Python Developer',
            description='Looking for an experienced Python developer with Django expertise.',
            location='New York, NY',
            employment_type='FULL_TIME',
            application_deadline=timezone.now() + timedelta(days=30)
        )

        job2 = Job.objects.create(
            employer=employer1,
            title='Frontend React Developer',
            description='Join our team to build amazing user interfaces.',
            location='Remote',
            employment_type='FULL_TIME',
            application_deadline=timezone.now() + timedelta(days=45)
        )

        job3 = Job.objects.create(
            employer=employer2,
            title='DevOps Engineer',
            description='Manage cloud infrastructure and CI/CD pipelines.',
            location='San Francisco, CA',
            employment_type='CONTRACT',
            application_deadline=timezone.now() + timedelta(days=20)
        )

        # Create Closed Job
        job4 = Job.objects.create(
            employer=employer2,
            title='Data Analyst Intern',
            description='Summer internship position for data analysis.',
            location='Boston, MA',
            employment_type='INTERNSHIP',
            application_deadline=timezone.now() - timedelta(days=5)
        )

        # Create Applications
        Application.objects.create(
            job=job1,
            seeker=seeker1,
            resume_url='https://example.com/resumes/john-doe.pdf',
            status='NEW'
        )

        Application.objects.create(
            job=job1,
            seeker=seeker2,
            resume_url='https://example.com/resumes/jane-smith.pdf',
            status='REVIEWING'
        )

        Application.objects.create(
            job=job1,
            seeker=seeker3,
            resume_url='https://example.com/resumes/mike-johnson.pdf',
            status='ACCEPTED'
        )

        Application.objects.create(
            job=job2,
            seeker=seeker1,
            resume_url='https://example.com/resumes/john-doe.pdf',
            status='REJECTED'
        )

        Application.objects.create(
            job=job2,
            seeker=seeker2,
            resume_url='https://example.com/resumes/jane-smith.pdf',
            status='NEW'
        )

        Application.objects.create(
            job=job3,
            seeker=seeker3,
            resume_url='https://example.com/resumes/mike-johnson.pdf',
            status='ACCEPTED'
        )

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
        self.stdout.write('\nTest Accounts:')
        self.stdout.write('Employer 1: employer1@example.com / password123')
        self.stdout.write('Employer 2: employer2@example.com / password123')
        self.stdout.write('Seeker 1: seeker1@example.com / password123')
        self.stdout.write('Seeker 2: seeker2@example.com / password123')
        self.stdout.write('Seeker 3: seeker3@example.com / password123')



        ## python manage.py seed_data