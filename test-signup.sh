#!/bin/bash
curl -X POST http://localhost:3002/api/auth/tutor/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "fullName": "Test Tutor"
  }' | jq .
