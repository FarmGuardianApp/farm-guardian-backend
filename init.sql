-- Create the 'farms' table to store information about each farm.
CREATE TABLE farms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'users' table for authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE, -- Phone numbers must be unique
    otp VARCHAR(100), -- To store the hashed OTP
    otp_expires_at TIMESTAMP WITH TIME ZONE, -- To check if OTP is expired
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --- NEW ---
-- Create the 'alerts' table
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    farm_id INT NOT NULL,
    sensor VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL, -- e.g., 'warning_high', 'critical_low'
    message VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Grant all necessary permissions to our 'newuser'
GRANT ALL ON TABLE farms TO newuser;
GRANT ALL ON TABLE users TO newuser;
GRANT ALL ON TABLE alerts TO newuser;
GRANT ALL ON SEQUENCE farms_id_seq TO newuser;
GRANT ALL ON SEQUENCE users_id_seq TO newuser;
GRANT ALL ON SEQUENCE alerts_id_seq TO newuser;