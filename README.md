# TalentAI

TalentAI is a full-stack, AI-powered Applicant Tracking System (ATS) designed to modernize and automate the hiring process. It replaces manual resume screening with intelligent AI analysis that evaluates candidates, matches them to job requirements, and generates structured recruitment insights.

---

## Overview

Traditional hiring systems rely heavily on manual CV screening and subjective evaluation. TalentAI solves this by introducing an AI-driven workflow that:

- Parses and analyzes CVs automatically  
- Extracts skills, experience, and summaries  
- Matches candidates to job requirements  
- Generates recruiter insights and interview questions  

The goal is to make hiring faster, smarter, and more data-driven.

---

## Features

### Recruiter Features
- AI-generated job postings from simple job titles  
- Candidate ranking system based on skill match scoring  
- Kanban-style recruitment pipeline  
- AI-generated interview questions based on skill gaps  
- Structured candidate evaluation dashboard  

### Candidate Features
- Upload CV (PDF) for automatic AI parsing  
- Skill and experience extraction  
- Job match scoring system  
- Visibility into missing skills and improvement areas  

### AI Features
- Llama 3 (Hugging Face API) for structured CV analysis  
- JSON-based extraction of candidate data  
- Automated match scoring between CV and job roles  
- Intelligent interview question generation  

---

## Tech Stack

### Frontend
- Next.js 16 (App Router + Turbopack)
- React
- Tailwind CSS
- Framer Motion

### Backend
- Next.js API Routes
- Supabase (PostgreSQL, Authentication, Row Level Security)

### AI Integration
- Hugging Face Inference API
- Meta Llama 3 model

---

## Getting Started

First, install dependencies:

```bash
npm install
