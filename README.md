# Job Board Application

A full-stack job board platform built with Django REST Framework and React. This application allows employers to post jobs and manage applications, while job seekers can search and apply for positions.

## Project Architecture

```
job-board/
├── backend/                 # Django REST API
│   ├── config/             # Django settings configuration
│   ├── users/              # User authentication & management
│   ├── jobs/               # Job postings management
│   ├── applications/       # Job applications management
│   └── manage.py           # Django management script
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── pages/          # Application pages
│   │   └── services/       # API services
│   └── package.json
└── README.md
```

## Features

### For Employers
- Post new job listings with detailed descriptions
- View and manage all posted jobs
- Review and manage job applications
- Track application status (New, Reviewing, Accepted, Rejected)
- Secure authentication with JWT tokens

### For Job Seekers
- Browse and search available job listings
- View detailed job information
- Submit applications with resume URLs
- Track application status
-  Remote-friendly job filtering

## Tech Stack

### Backend
- **Django 4.2** - Python web framework
- **Django REST Framework** - REST API development
- **PostgreSQL** - Database
- **Django SimpleJWT** - JWT authentication
- **django-cors-headers** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client

## Prerequisites

Before running this project, ensure you have:

- **Python 3.9+**
- **Node.js 18+**
- **PostgreSQL 13+**
- **npm or yarn**

##  Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd job-board
```

### 2. Backend Setup

#### Navigate to the backend directory:
```bash
cd backend
```

#### Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### Install dependencies:
```bash
pip install -r requirements.txt
```

#### Configure Environment Variables:

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_NAME=jobboard
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# Security
SECRET_KEY=your-secret-key-here
DEBUG=True

# Allowed Hosts
ALLOWED_HOSTS=*
```

#### Run Database Migrations:
```bash
python manage.py migrate
```

#### Seed Sample Data (Optional):
```bash
python manage.py seed_data
```

#### Start the Backend Server:
```bash
python manage.py runserver
```

The API will be available at: `http://localhost:8000`

---

### 3. Frontend Setup

#### Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

#### Install dependencies:
```bash
npm install
```

#### Start the Development Server:
```bash
npm run dev
```

The frontend will be available at: `http://localhost:5173`

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register a new user |
| POST | `/api/auth/login/` | Login and get JWT tokens |
| POST | `/api/auth/token/refresh/` | Refresh access token |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs/` | List all jobs |
| POST | `/api/jobs/` | Create a new job (Employer only) |
| GET | `/api/jobs/{id}/` | Get job details |
| PUT | `/api/jobs/{id}/` | Update job (Owner only) |
| DELETE | `/api/jobs/{id}/` | Delete job (Owner only) |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications/` | List applications |
| POST | `/api/applications/` | Submit application (Seeker only) |
| GET | `/api/applications/{id}/` | Get application details |
| PUT | `/api/applications/{id}/` | Update status 
| DELETE | `/applications/${id}/withdraw/`| Delete application (Owner only) |
(Employer only) |

## Test Accounts

After running `python manage.py seed_data`, you can use these test accounts:

| Role | Email | Password |
|------|-------|----------|
| Employer | employer1@example.com | password123 |
| Employer | employer2@example.com | password123 |
| Job Seeker | seeker1@example.com | password123 |
| Job Seeker | seeker2@example.com | password123 |
| Job Seeker | seeker3@example.com | password123 |

## Testing

### Backend Tests:
```bash
cd backend
python manage.py test
```

## Project Structure

```
backend/
├── manage.py                 # Django management script
├── requirements.txt          # Python dependencies
├── config/                   # Project configuration
│   ├── settings.py          # Django settings
│   ├── urls.py              # Root URL configuration
│   ├── asgi.py              # ASGI config
│   └── wsgi.py              # WSGI config
├── users/                    # User management app
│   ├── models.py            # Custom User model
│   ├── views.py             # Authentication views
│   ├── serializers.py       # User serializers
│   ├── urls.py              # User URLs
│   └── management/commands/ # Custom management commands
│       └── seed_data.py     # Database seeding
├── jobs/                     # Jobs app
│   ├── models.py            # Job model
│   ├── views.py             # Job views
│   ├── serializers.py       # Job serializers
│   └── urls.py              # Job URLs
└── applications/             # Applications app
    ├── models.py            # Application model
    ├── views.py             # Application views
    ├── serializers.py       # Application serializers
    └── urls.py              # Application URLs
```

```
frontend/
├── package.json             # Node dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
├── index.html               # HTML entry point
├── src/
│   ├── main.jsx             # React entry point
│   ├── App.jsx              # Main app component
│   ├── index.css            # Global styles
│   ├── components/          # Reusable components
│   │   ├── CandidatesModal.jsx
│   │   ├── ConfirmationModal.jsx
│   │   └── JobForm.jsx
│   ├── contexts/            # React contexts
│   │   └── AuthContext.jsx  # Authentication context
│   ├── pages/               # Page components
│   │   ├── LandingPage.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── EmployerDashboard.jsx
│   │   ├── EmployerAuth.jsx
│   │   ├── SeekerAuth.jsx
│   │   └── JobsList.jsx
│   └── services/            # API services
│       └── api.jsx          # Axios configuration
└── public/                  # Static assets
    └── assets/              # Images and logos
```


## Acknowledgments

- Django Documentation
- React Documentation
- Tailwind CSS
- Vite

